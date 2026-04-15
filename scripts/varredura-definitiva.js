require('dotenv').config({ path: '.env.local' });
const { ApifyClient } = require('apify-client');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Segurança Liferay + Injeção Inteligente
const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DB_PATH = path.join(__dirname, '../src/data/entregas.json');

const MANDATO1_INICIO = new Date('2019-01-01T00:00:00');
const MANDATO2_FIM = new Date('2026-03-28T23:59:59');

const AREAS_PERMITIDAS = [
    "Saúde", "Educação", "Segurança Pública", "Infraestrutura", 
    "Mobilidade e Transporte", "Assistência Social e Cidadania", 
    "Desenvolvimento Econômico", "Agricultura e Desenvolvimento Rural", 
    "Habitação", "Meio Ambiente e Sustentabilidade", "Cultura", 
    "Esporte e Lazer", "Turismo", "Outros"
];

function parseDateBR(dateStr) {
    if (!dateStr || !dateStr.includes('/')) return null;
    const [d, m, y] = dateStr.split('/');
    if (!d || !m || !y) return null;
    return new Date(Number(y), Number(m)-1, Number(d));
}

// Fase 1: Varredura Cega via Apify (Bypass Liferay com Scale)
async function sweepApifyLinks(existingLinks) {
    const anos = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
    const keywords = [
        "obras", "inaugura", "entrega", "conclui", "viaduto", "hospital", "escola",
        "investimentos", "revitaliza", "reforma", "pavimentação", "Ceilândia", "Taguatinga", 
        "Samambaia", "Gama", "Sudoeste", "Guará", "Planaltina", "governo",
        "moradia", "rodoviária", "polícia", "bombeiros", "segurança", "cultura"
    ];
    
    const queries = [];
    anos.forEach(ano => keywords.forEach(kw => queries.push(`site:agenciabrasilia.df.gov.br/w/ "${kw}" ${ano}`)));
    
    // Sortear para não esgotar as mesmas chaves e realmente pegar "inéditos"
    const shuffledQueries = queries.sort(() => 0.5 - Math.random()).slice(0, 150);

    const input = {
        queries: shuffledQueries.join('\n'),
        resultsPerPage: 100,
        maxPagesPerQuery: 4, 
        languageCode: "pt-BR",
        countryCode: "br"
    };

    console.log(`🤖 1/3 Acionando Google Search Scraping no Apify Pago (${shuffledQueries.length} queries elásticas)... `);
    const run = await client.actor("apify/google-search-scraper").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    let linksIneditos = new Set();
    items.forEach(i => {
       if (i.organicResults) i.organicResults.forEach(r => {
           if(r.url.includes('/w/') && !existingLinks.has(r.url)) {
               linksIneditos.add(r.url);
           }
       });
    });
    console.log(`✅ ${linksIneditos.size} LINKS INÉDITOS descobertos via Apify Bypass.`);
    return Array.from(linksIneditos);
}

// Fase 2: Pesca Direta e Categorização (Extraindo Capa e Link Funcional)
async function processarLoteReal(links, bancoExistente) {
    let processadosNovos = [];
    console.log(`\n🔎 2/3 Processando URLs nativamente na Agência Brasília para arrancar Imagens e Datas originais...`);
    
    for (let i = 0; i < links.length; i++) {
        if (processadosNovos.length >= 2000) {
            console.log("🛑 Limite dinâmico de 2000 ocorrências limite atingido.");
            break;
        }

        const url = links[i];
        try {
            const r = await fetch(url);
            const html = await r.text();
            const $ = cheerio.load(html);
            
            // Liferay Extraction Logic
            let realImg = $('meta[property="og:image"]').attr('content');
            if(!realImg) {
                const firstImg = $('.journal-content-article img').first().attr('src');
                if(firstImg) realImg = firstImg.startsWith('/') ? `https://www.agenciabrasilia.df.gov.br${firstImg}` : firstImg;
            }
            if(!realImg) realImg = "https://www.agenciabrasilia.df.gov.br/wp-content/themes/agencia-brasilia/assets/images/placeholder.jpg";

            const exactTitle = $('meta[property="og:title"]').attr('content') || $('title').text().replace(' - Agência Brasília', '');
            
            const htmlText = $('body').text().replace(/\s+/g, ' ');
            const dateMatch = htmlText.match(/(\d{2}\/\d{2}\/\d{4})/);
            
            if (dateMatch) {
                const dateStr = dateMatch[1];
                const dataObj = parseDateBR(dateStr);
                
                if (dataObj >= MANDATO1_INICIO && dataObj <= MANDATO2_FIM) {
                    processadosNovos.push({
                        link: url,
                        img: realImg,
                        text: exactTitle,
                        date: dateStr,
                        objData: dataObj
                    });
                    console.log(`   🎣 [NOVO] ID: ${processadosNovos.length} - ${dateStr} - ${exactTitle.substring(0,40)}...`);
                } else {
                    console.log(`   ⚠️ [PULO] Fora do Teto de Data: ${dateStr}`);
                }
            }
            
        } catch(e) { }
        await new Promise(res => setTimeout(res, 800)); // Delay sutil
    }

    if(processadosNovos.length === 0) {
        console.log(`\nNenhuma matéria útil foi captada no filtro do texto HTML.`);
        return;
    }

    console.log(`\n🧠 3/3 Classificando as ${processadosNovos.length} novas matérias por Área/Região via IA...`);
    
    const chunked = [];
    const chunkSize = 60;
    for (let c = 0; c < processadosNovos.length; c += chunkSize) chunked.push(processadosNovos.slice(c, c + chunkSize));

    const completadosNovos = [];

    for (let c = 0; c < chunked.length; c++) {
        console.log(`[Batch IA ${c+1}/${chunked.length}] Computando...`);
        const chunk = chunked[c];
        const payload = chunk.map((item, id) => `[ID:${id}] Manchete: ${item.text}`).join('\n');
        
        const prompt = `Avalie as manchetes governamentais:
Para cada ID indique 1) a 'area' rigorosamente de (${AREAS_PERMITIDAS.join(', ')})
2) a 'regiao' administrativa sendo favorecida (ou 'DF').
Saída APENAS JSON em chave(id)/valor:
{ "0": { "area": "Saúde", "regiao": "DF" } }

${payload}`;

        try {
            const res = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0
            });

            const aiJson = JSON.parse(res.choices[0].message.content);

            for (let id in aiJson) {
                const numId = parseInt(id);
                if (!isNaN(numId) && chunk[numId]) {
                    const item = chunk[numId];
                    item.area = aiJson[id].area || 'Outros';
                    item.regiao = aiJson[id].regiao || 'DF';
                    item.periodo = item.objData.getFullYear() < 2023 ? '2019-2022' : '2023-2026';
                    delete item.objData; 
                    completadosNovos.push(item);
                }
            }
        } catch (e) {
            console.error(`Falha IA Batch ${c+1}:`, e.message);
        }
    }
    
    console.log(`\n📈 FUNDINDO DADOS... Banco antigo: ${bancoExistente.length} | Inéditos catalogados: ${completadosNovos.length}`);
    const bancoGigante = [...bancoExistente, ...completadosNovos];

    // Sort Geral Descendente
    bancoGigante.sort((a,b) => {
        const da = parseDateBR(a.date);
        const db = parseDateBR(b.date);
        if(!da) return 1;
        if(!db) return -1;
        return db - da; 
    });

    fs.writeFileSync(DB_PATH, JSON.stringify(bancoGigante, null, 2), 'utf-8');
    console.log(`\n🎉 OPERAÇÃO GLOBAL CONCLUÍDA! Banco reatualizado para ${bancoGigante.length} matérias validadas.`);
}

async function boot() {
    console.log("Iniciando varredura EXPANSIVA e INCREMENTAL (Motor Apify Pago)...");
    
    let bancoExistente = [];
    if (fs.existsSync(DB_PATH)) {
        try { bancoExistente = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); } catch(e){}
    }
    const linksExistentes = new Set(bancoExistente.map(i => i.link));
    console.log(`💠 Banco atual identificado com ${bancoExistente.length} matérias cadastradas.`);

    const linksIneditos = await sweepApifyLinks(linksExistentes);
    if(linksIneditos.length > 0) {
        await processarLoteReal(linksIneditos, bancoExistente);
    } else {
        console.log("O Google não revelou novos links além dos 1000 que já temos nestas queries. O script embaralha queries, tente rodar novamente depoi.");
    }
}

boot();
