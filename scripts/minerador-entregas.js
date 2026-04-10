const axios = require('axios');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Caminho do DB Local
const DB_PATH = path.join(__dirname, '../src/data/entregas.json');

// Definição dos Mandatos
const MANDATOS = {
  1: { nome: '2019-2022', inicio: new Date('2019-01-01'), fim: new Date('2022-12-31') },
  2: { nome: '2023-2026', inicio: new Date('2023-01-01'), fim: new Date('2026-03-28') }
};

// Ler banco existente para não duplicar
let bancoDados = [];
if (fs.existsSync(DB_PATH)) {
  bancoDados = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

/**
 * Função para chamar a IA e extrair dados estruturados
 */
async function classificarComIA(titulo, resumo) {
  const prompt = `
Você é um classificador do Governo do Distrito Federal.
Sua tarefa é analisar a notícia abaixo e classificar se ela é uma "Entrega" válida (obras, inaugurações, programas lançados, investimentos efetivados, novos equipamentos).
Se NÃO for uma entrega concreta (ex: apenas agenda, comemoração, opiniões, planejamento distante), retorne a chave "valido": false.

Se FOR válido, identifique a "área" e a "região" principal.
Áreas limitadas a: Saúde, Educação, Infraestrutura, Segurança, Social, Meio Ambiente, Transporte, Economia, Habitação, Outros.
Região: Extraia o nome da Região Administrativa (ex: Ceilândia, Taguatinga, Sol Nascente, Plano Piloto, etc) ou use "Todo o DF".

Notícia:
Título: "${titulo}"
Resumo: "${resumo}"

Retorne estritamente um JSON no formato:
{
  "valido": true/false,
  "area": "Nome da Área",
  "regiao": "Nome da Região"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo rápido e barato
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error(`[IA ERRO] Falha ao processar "${titulo}":`, error.message);
    return { valido: false };
  }
}

/**
 * Motor principal do Crawler
 */
async function minerar(mandatoNum, palavrasChave = ['obras', 'inaugura', 'entrega', 'investe']) {
  const mandato = MANDATOS[mandatoNum];
  if (!mandato) throw new Error("Mandato deve ser 1 ou 2.");

  console.log(`\n================================`);
  console.log(`🚀 Iniciando Mineração para o Mandato ${mandatoNum} (${mandato.nome})`);
  console.log(`================================`);

  // O crawler varre várias páginas da busca
  for (const termo of palavrasChave) {
    console.log(`\n🔎 Buscando por: "${termo}"`);
    let pagina = 1;
    let keepGoing = true;

    while (keepGoing && pagina <= 5) { // Limitado a 5 páginas por termo por demo, aumentar para sweep completo
      try {
        console.log(`Página ${pagina}...`);
        const url = `https://www.agenciabrasilia.df.gov.br/page/${pagina}/?s=${termo}`;
        const { data } = await axios.get(url, { timeout: 10000 });
        const $ = cheerio.load(data);
        
        const articles = $('article'); // Ajuste conforme estrutura HTML real da Agência
        if (articles.length === 0) break; // Sem mais resultados

        for (const el of articles) {
           // A extração a seguir é genérica. Como a estrutura exata exigiria um scraper focado,
           // os seletores aqui são ilustrativos para padrão WordPress/Liferay
           const link = $(el).find('a').attr('href');
           const titulo = $(el).find('h2, h3, .title').text().trim();
           const resumo = $(el).find('.excerpt, p').text().trim() || titulo;
           const imgStr = $(el).find('img').attr('src');
           let dataStr = $(el).find('time, .date').text().trim();

           if (!link || !titulo) continue; // Ignora cards quebrados
           if (bancoDados.some(e => e.link === link)) continue; // Já existe no DB

           let dataPub = new Date();
           // Tenta parsear data se a string existir (ex: 15/02/2021)
           if (dataStr) {
               const parts = dataStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
               if (parts) dataPub = new Date(`${parts[3]}-${parts[2]}-${parts[1]}`);
           }

           // Filtrar estritamente pelo intervalo do Mandato
           if (dataPub < mandato.inicio || dataPub > mandato.fim) {
               continue;
           }

           console.log(`⏳ Processando: ${titulo.substring(0, 40)}...`);
           
           // Valida e classifica com a IA
           const classificacao = await classificarComIA(titulo, resumo);

           if (classificacao.valido) {
               const entrega = {
                   link: link,
                   img: imgStr || 'https://www.agenciabrasilia.df.gov.br/wp-content/themes/agencia-brasilia/assets/images/placeholder.jpg',
                   text: titulo,
                   date: dataPub.toLocaleDateString('pt-BR'),
                   area: classificacao.area || 'Outros',
                   regiao: classificacao.regiao || 'Todo o DF',
                   periodo: mandato.nome // Salvando no banco o período oficial
               };
               
               bancoDados.push(entrega);
               console.log(`   ✅ ADICIONADO: [${entrega.area} - ${entrega.regiao}]`);
               
               // Persistir em disco imediatamente
               fs.writeFileSync(DB_PATH, JSON.stringify(bancoDados, null, 2));
           } else {
               console.log(`   ❌ IGNORED (Não é uma entrega válida)`);
           }
        }
        pagina++;
      } catch(err) {
        if(err.response && err.response.status === 404) {
           console.log("   Fim dos resultados.");
           keepGoing = false;
        } else {
           console.log("Erro na página:", err.message);
           keepGoing = false;
        }
      }
    }
  }
  console.log(`\n🎉 Mineração concluída! Base atualizada. Total de registros: ${bancoDados.length}`);
}

// ==============================
// CLi RUNNER
// ==============================
const args = process.argv.slice(2);
const mandatoArg = parseInt(args[0]);

if (!mandatoArg || (mandatoArg !== 1 && mandatoArg !== 2)) {
    console.error("ERRO: Você deve fornecer o número do mandato para processamento.");
    console.log("Uso: node scripts/minerador-entregas.js 1  (Para 2019-2022)");
    console.log("Uso: node scripts/minerador-entregas.js 2  (Para 2023-2026)");
    process.exit(1);
}

minerar(mandatoArg);
