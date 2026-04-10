const axios = require('axios');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DB_PATH = path.join(__dirname, '../src/data/entregas.json');

// Definição dos mandatos para filtragem e classificação de data
const MANDATO1_INICIO = new Date('2019-01-01T00:00:00');
const MANDATO1_FIM = new Date('2022-12-31T23:59:59');
const MANDATO2_INICIO = new Date('2023-01-01T00:00:00');
const MANDATO2_FIM = new Date('2026-03-28T23:59:59');

async function processarIA(titulo, link, texto) {
    const prompt = `Como analista do GDF, verifique se esta notícia é uma "Entrega" governamental (obras concluídas, equipamentos entregues, programas lançados definitivamente).
Título: ${titulo}
Texto Base: ${texto.substring(0, 1000)}

Responda ESTRITAMENTE em JSON:
{
  "valido": true_ou_false,
  "area": "Saúde|Educação|Infraestrutura|Segurança|Economia|Social|Meio Ambiente|Habitação|Outros",
  "regiao": "Ex: Ceilândia, Plano Piloto, Todo o DF"
}`;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0
        });
        return JSON.parse(response.choices[0].message.content);
    } catch (e) {
        return { valido: false };
    }
}

async function varrerSitemapCompleto() {
    console.log("🚀 Iniciando Varredura Completa: Agência Brasília (Sitemap)");
    let bancoExistente = [];
    if (fs.existsSync(DB_PATH)) {
        try { bancoExistente = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); } catch (e) {}
    }
    const processados = new Set(bancoExistente.map(e => e.link));

    try {
        // 1. Pegar todos os sitemaps
        const { data: indexXml } = await axios.get('https://www.agenciabrasilia.df.gov.br/sitemap.xml');
        const $index = cheerio.load(indexXml, { xmlMode: true });
        let sitemapUrls = [];
        $index('loc').each((_, el) => sitemapUrls.push($index(el).text()));
        
        console.log(`Encontrados ${sitemapUrls.length} recortes de sitemap. Mapeando URLs de matérias...`);
        let todasMaterias = [];

        for (const url of sitemapUrls) {
            try {
                const { data: xml } = await axios.get(url);
                const $xml = cheerio.load(xml, { xmlMode: true });
                $xml('loc').each((_, el) => {
                    const l = $xml(el).text();
                    // Filtra apenas matérias isoladas (em Liferay costumam começar com /w/)
                    if (l.includes('/w/')) {
                        todasMaterias.push(l);
                    }
                });
            } catch(e) {
                console.log(`Aviso ao ler ${url}:`, e.message);
            }
        }
        
        console.log(`Mapeamento concluído! O portal possui ${todasMaterias.length} matérias totais.`);
        console.log("Iniciando fila de extração e classificação com a OpenAI... (Pode demorar algumas horas)\n");

        let adicionados = 0;
        
        // Puxar as matérias uma a uma
        for (let i = 0; i < todasMaterias.length; i++) {
            const urlMateria = todasMaterias[i];
            
            // Pular se já existe no banco local de entregas
            if (processados.has(urlMateria)) continue;

            console.log(`[${i+1}/${todasMaterias.length}] Analisando: ${urlMateria}`);
            try {
                const { data: html } = await axios.get(urlMateria, { timeout: 8000 });
                const $ = cheerio.load(html);
                
                const titulo = $('h1, h2, .journal-entry-title, .title').first().text().trim() || "Sem Título";
                const texto = $('article, .journal-content-article').text().replace(/\s+/g, ' ').trim() || titulo;
                const imgSrc = $('img').first().attr('src') || 'https://www.agenciabrasilia.df.gov.br/wp-content/themes/agencia-brasilia/assets/images/placeholder.jpg';
                const timeText = $('time, .date, .publish-date').text().trim();
                
                let dataOficial = new Date(); // Fallback
                // Parser de datas brasileiros (ex: "15 de março de 2021" ou "15/03/2021")
                const dataMatch = html.match(/(\d{2})[\/\s]([A-Za-z]+|\d{2})[\/\s](\d{4})/);
                if (dataMatch) {
                    // Tentativa rudimentar de parse baseada em regex encontrado no html - melhore conforme estrutura
                    // Se não conseguir parsear, IA descartará por período ou adotaremos a extração literal
                }

                // Filtragem grossa: é uma matéria sobre obras/entregas? (Economiza OpenAI)
                if (!texto.toLowerCase().match(/(obras|reforma|inaugura|entrega|conclui|investimento|viaduto|hospital|escola)/)) {
                    continue;
                }

                // 2. Passar pela aprovação rigorosa da IA
                const analise = await processarIA(titulo, urlMateria, texto);

                if (analise.valido) {
                    let periodo = "Outros";
                    if (dataOficial >= MANDATO1_INICIO && dataOficial <= MANDATO1_FIM) periodo = "2019-2022";
                    else if (dataOficial >= MANDATO2_INICIO && dataOficial <= MANDATO2_FIM) periodo = "2023-2026";

                    const registro = {
                        link: urlMateria,
                        img: imgSrc.startsWith('/') ? `https://www.agenciabrasilia.df.gov.br${imgSrc}` : imgSrc,
                        text: titulo,
                        date: dataOficial.toLocaleDateString('pt-BR'),
                        area: analise.area,
                        regiao: analise.regiao,
                        periodo: periodo
                    };

                    bancoExistente.push(registro);
                    processados.add(urlMateria);
                    adicionados++;
                    
                    console.log(`✅ Adicionado: [${analise.area}] ${analise.regiao} -> ${titulo}`);
                    fs.writeFileSync(DB_PATH, JSON.stringify(bancoExistente, null, 2));
                }
            } catch (postErro) {
                console.log(`   Erroz ao acessar página: ${postErro.message}`);
            }
            
            // Delay anti-ban
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log(`\n🎉 Varredura 100% finalizada. Entregas totais no banco: ${bancoExistente.length}`);
    } catch (e) {
        console.error("Erro na leitura estrutural do Sitemap:", e.message);
    }
}

varrerSitemapCompleto();
