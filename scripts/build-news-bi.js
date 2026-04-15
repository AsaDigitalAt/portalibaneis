require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error("ERRO: OPENAI_API_KEY não localizada no seu .env.local!");
    process.exit(1);
}

const LIMIT_ITEMS = 1000;
const START_DATE = new Date(2019, 0, 1); // 1 Jan 2019
const END_DATE = new Date(2026, 2, 28); // 28 Mar 2026
const AREAS_PERMITIDAS = [
    "Saúde", "Educação", "Segurança Pública", "Infraestrutura", 
    "Mobilidade e Transporte", "Assistência Social e Cidadania", 
    "Desenvolvimento Econômico", "Agricultura e Desenvolvimento Rural", 
    "Habitação", "Meio Ambiente e Sustentabilidade", "Cultura", 
    "Esporte e Lazer", "Turismo", "Outros"
];

const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'entregas.json');

function parseDateBR(dateStr) {
    const [d, m, y] = dateStr.split('/');
    return new Date(Number(y), Number(m)-1, Number(d));
}

async function scrapePortal() {
    let currentPage = 1;
    const extractedData = [];
    let insideDateRange = true;
    let itemsFound = 0;

    console.log("Iniciando extração do portal da Agência Brasília...");

    while (insideDateRange && itemsFound < LIMIT_ITEMS) {
        try {
            console.log(`Carregando página ${currentPage}... (${itemsFound} itens acumulados)`);
            const res = await fetch(`https://www.agenciabrasilia.df.gov.br/noticias/page/${currentPage}`);
            const text = await res.text();
            const $ = cheerio.load(text);
            
            const anchors = $('a').toArray();
            if(anchors.length === 0) break; // fim das views
            
            let itemsOnView = 0;

            for (const el of anchors) {
                if (itemsFound >= LIMIT_ITEMS) break;

                let link = $(el).attr('href');
                if (link && link.includes('agenciabrasilia') && !link.includes('category')) {
                    const rawTitle = $(el).text().trim().replace(/\s+/g, ' ');
                    const dateMatch = rawTitle.match(/(\d{2}\/\d{2}\/\d{4})/);
                    
                    if (dateMatch) {
                        const postDateStr = dateMatch[1];
                        const postDate = parseDateBR(postDateStr);

                        if (postDate >= START_DATE && postDate <= END_DATE) {
                            // Limpa cabeçalho para ter só o título real
                            const titleSplit = rawTitle.match(/^(.*?)(?=\s\d{2}\/\d{2}\/\d{4})/);
                            const cleanTitle = titleSplit ? titleSplit[1].trim() : rawTitle.replace(dateMatch[0], '').substring(0, 150).trim();

                            if (cleanTitle.length > 20 && !extractedData.find(x => x.link === link)) {
                                let img = $(el).find('img').attr('src') || 'https://www.agenciabrasilia.df.gov.br/wp-content/themes/agencia-brasilia/assets/images/placeholder.jpg';
                                if (img.startsWith('/')) img = `https://www.agenciabrasilia.df.gov.br${img}`;

                                extractedData.push({
                                    link: link,
                                    text: cleanTitle,
                                    date: postDateStr,
                                    img: img
                                });
                                itemsFound++;
                                itemsOnView++;
                            }
                        } else if (postDate < START_DATE) {
                            // Descemos muito no tempo. Hora de parar a paginação principal.
                            console.log(`❌ Encontramos notícia de ${postDateStr}, ultrapassou 01/2019. Saindo...`);
                            insideDateRange = false;
                            break;
                        }
                    }
                }
            }
            if(!insideDateRange && itemsOnView===0) break; // Abort
            currentPage++;
        } catch (e) {
            console.error(`Erro fatal raspando agência:`, e.message);
            break;
        }
    }

    console.log(`✅ Raspagem offline completa! ${extractedData.length} matérias coletadas. Iniciando categorização de I.A...`);
    return extractedData;
}

async function categorizeWithAI(items) {
    const chunked = [];
    const chunkSize = 50; 
    for(let i=0; i<items.length; i+=chunkSize) chunked.push(items.slice(i, i+chunkSize));

    const finalData = [];

    for (let c = 0; c < chunked.length; c++) {
        console.log(`🧠 Processando Chunk ${c+1}/${chunked.length} pela OpenAI...`);
        const chunk = chunked[c];
        
        const payload = chunk.map((item, id) => `[ID:${id}] Título: ${item.text}`).join('\n');
        
        const prompt = `Você é um robô de análise semântica. Abaixo listarei publicações da Agência Brasília (Governo Ibaneis).
Sua missão é classificar CADA [ID] listado definindo uma única 'area' aplicável e a 'regiao' administrativa sendo contemplada (escreva 'DF' se abranger a capital inteira ou se não for explícito).
A 'area' DEVE ser ESTRITAMENTE escolhida e sorteada a partir desta lista: ${AREAS_PERMITIDAS.join(', ')}.

Retorne a resposta EXCLUSIVAMENTE em formato JSON nativo (SEM blocos markdown extra).
Exemplo esperado de Response:
{
  "0": { "area": "Saúde", "regiao": "Gama" },
  "1": { "area": "Segurança Pública", "regiao": "Plano Piloto" }
}

Notícias a classificar:
${payload}`;

        try {
            const result = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0,
                    response_format: { type: "json_object" }
                })
            });

            const data = await result.json();
            if(data.error) throw new Error(data.error.message);
            
            const aiJson = JSON.parse(data.choices[0].message.content);

            for (let id in aiJson) {
                const numericId = parseInt(id);
                if (!isNaN(numericId) && chunk[numericId]) {
                    chunk[numericId].area = aiJson[id].area || 'Outros';
                    chunk[numericId].regiao = aiJson[id].regiao || 'DF';
                    
                    // Ajuste estético - Anos
                    const dt = parseDateBR(chunk[numericId].date);
                    chunk[numericId].periodo = dt.getFullYear() < 2023 ? '2019-2022' : '2023-2026';
                    
                    finalData.push(chunk[numericId]);
                }
            }
        } catch (e) {
            console.error(`Erro na OpenAI Chunk ${c+1}:`, e.message);
            // Salvar fallback temporario para não perder scrap
            chunk.forEach(i => finalData.push({...i, area: 'Outros', regiao: 'DF', periodo: '2023-2026'}));
        }
    }
    return finalData;
}

async function run() {
    const rawData = await scrapePortal();
    if (rawData.length === 0) {
        console.log("Nenhum dado raspado no range.");
        return;
    }
    
    const finalized = await categorizeWithAI(rawData);
    
    // Escreve sobrepondo JSON atual
    fs.writeFileSync(JSON_PATH, JSON.stringify(finalized, null, 2), 'utf-8');
    console.log(`🔥 SUCESSO! ${finalized.length} reportagens de Entregas salvas em entregas.json!`);
}

run();
