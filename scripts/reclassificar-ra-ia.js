const fs = require('fs');
const path = require('path');

// 1. Carregar a chave da OpenAI manualmente do .env.local
let OPENAI_API_KEY = process.env.OPENAI_API_KEY;
try {
  const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const match = envFile.match(/OPENAI_API_KEY=(.*)/);
  if (match) OPENAI_API_KEY = match[1].trim();
} catch (e) {
  console.log('Aviso: .env.local não encontrado ou sem OPENAI_API_KEY, tentando variavéis do sistema.');
}

if (!OPENAI_API_KEY) {
  console.error("ERRO FATAL: Nenhuma chave da OpenAI encontrada.");
  process.exit(1);
}

const entregasPath = path.join(__dirname, '../src/data/entregas.json');
const cachePath = path.join(__dirname, 'ra_cache.json');

const RAs = [
  "Água Quente", "Águas Claras", "Arapoanga", "Arniqueira", "Brazlândia", 
  "Candangolândia", "Ceilândia", "Cruzeiro", "Fercal", "Gama", "Guará", 
  "Itapoã", "Jardim Botânico", "Lago Norte", "Lago Sul", "Núcleo Bandeirante", 
  "Paranoá", "Park Way", "Planaltina", "Plano Piloto", "Recanto das Emas", 
  "Riacho Fundo", "Riacho Fundo II", "Samambaia", "Santa Maria", "São Sebastião", 
  "SCIA/Estrutural", "SIA", "Sobradinho", "Sobradinho II", "Sol Nascente/Pôr do Sol", 
  "Sudoeste/Octogonal", "Taguatinga", "Varjão", "Vicente Pires"
];

const PROMPT_SYSTEM = `Você é um classificador geográfico ultra-eficiente do Distrito Federal (DF). 
Sua única função é classificar notícias governamentais em uma das 35 Regiões Administrativas ou manter como 'DF' caso seja algo que afete o Distrito Federal como um todo ou seja impossível especificar.
As 35 Regiões Válidas Padrão EXATAS são: 
${RAs.join(", ")}.

Responda ÚNICA e EXCLUSIVAMENTE em formato JSON.
Seu formato de resposta obrigatória:
[
  {"id": 1, "regiao": "Nome Exato da RA Válida ou DF"},
  {"id": 2, "regiao": "..."}
]`;

// Delay para não sobrecarregar API e evitar 429
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log("Iniciando classificador de RAs focado nas 35 RAs originais...");

  const data = JSON.parse(fs.readFileSync(entregasPath, 'utf8'));
  
  let cache = {};
  if (fs.existsSync(cachePath)) {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  }

  // Filtrar apenas o que tem 'DF' (ou variações burras) e ainda não foi cacheado
  const pending = [];
  data.forEach((item, index) => {
    // Vamos corrigir os que estão genéricos como DF, ou variações. 
    // Ignorando os já respondidos pelo cache
    if ((item.regiao === 'DF' || !item.regiao || item.regiao === 'Federal' || item.regiao === 'Distrito Federal') && !cache[item.link]) {
       pending.push({ indexInsideOriginalFile: index, link: item.link, text: item.text });
    }
  });

  console.log(`Entregas genéricas (DF) totais para processar/restantes: ${pending.length} itens.`);

  const BATCH_SIZE = 50;

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    
    console.log(`\nProcessando Lote ${Math.floor(i/BATCH_SIZE) + 1} de ${Math.ceil(pending.length/BATCH_SIZE)}... (Itens ${i} a ${i + batch.length - 1})`);
    
    const userMessageContent = batch.map((item, idx) => `{"id": ${idx}, "text": "${item.text.replace(/"/g, "'")}"}`).join('\n');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: PROMPT_SYSTEM },
            { role: 'user', content: userMessageContent }
          ],
          temperature: 0.0,
        })
      });

      if (!response.ok) {
         console.error("API response error:", await response.text());
         break;
      }

      const resJson = await response.json();
      const answer = resJson.choices[0].message.content;
      
      // Sanitizar JSON devolvido: pode vir com markdown ```json
      let cleanAnswer = answer.trim();
      if (cleanAnswer.startsWith('```json')) cleanAnswer = cleanAnswer.substring(7);
      if (cleanAnswer.startsWith('```')) cleanAnswer = cleanAnswer.substring(3);
      if (cleanAnswer.endsWith('```')) cleanAnswer = cleanAnswer.substring(0, cleanAnswer.length - 3);

      const parsed = JSON.parse(cleanAnswer.trim());

      // Validar os resultados e jogar no cache
      parsed.forEach(resItem => {
         const originalItem = batch[resItem.id];
         if (originalItem) {
             let validRA = resItem.regiao;
             if (validRA !== 'DF' && !RAs.includes(validRA)) {
                // Tenta achar com lower case, se não cai p/ DF
                const fix = RAs.find(r => r.toLowerCase() === validRA.toLowerCase());
                validRA = fix || 'DF';
             }
             cache[originalItem.link] = validRA;
         }
      });

      // Salva o progresso
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
      console.log(`+ ${parsed.length} itens categorizados.`);
      
    } catch (e) {
      console.error(`Erro estrutural no lote.`, e);
      // Salva progresso pra não perder
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
      break; 
    }

    // Delay de resfriamento (1.5 segundos) para manter API saúdavel
    await delay(1500); 
  }

  console.log("\n=========================");
  console.log("Aplicando cache final das predições de volta no entregas-refactored.json...");
  
  let changesCounter = 0;
  data.forEach(d => {
    if (cache[d.link]) {
      if (d.regiao !== cache[d.link]) changesCounter++;
      d.regiao = cache[d.link];
    }
  });

  fs.writeFileSync(entregasPath, JSON.stringify(data, null, 2));
  
  console.log(`Arquivo 'entregas.json' reescrito com sucesso!`);
  console.log(`✅ ${changesCounter} regiões foram migradas de 'DF' para RAs mais específicas.`);
  console.log("=========================");
}

main();
