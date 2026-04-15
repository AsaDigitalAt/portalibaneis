require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error("ERRO: OPENAI_API_KEY não localizada!");
    process.exit(1);
}

const LIMIT_ITEMS = 1000;
const END_DATE = new Date(2026, 2, 28); // Mar 2026
const START_DATE = new Date(2019, 0, 1); // Jan 2019

const AREAS_PERMITIDAS = [
    "Saúde", "Educação", "Segurança Pública", "Infraestrutura", 
    "Mobilidade e Transporte", "Assistência Social e Cidadania", 
    "Desenvolvimento Econômico", "Agricultura e Desenvolvimento Rural", 
    "Habitação", "Meio Ambiente e Sustentabilidade", "Cultura", 
    "Esporte e Lazer", "Turismo"
];

const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'entregas.json');

function parseDateBR(dateStr) {
    const [d, m, y] = dateStr.split('/');
    return new Date(Number(y), Number(m)-1, Number(d));
}

async function run() {
    console.log("Iniciando Puppeteer headless...");
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Abrir a aba mestra
    const page = await browser.newPage();
    
    // Otimiza load
    await page.setRequestInterception(true);
    page.on('request', req => {
        if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font') req.abort();
        else req.continue();
    });

    console.log("Acessando Agência Brasília...");
    await page.goto('https://www.agenciabrasilia.df.gov.br/noticias', { waitUntil: 'domcontentloaded', timeout: 60000 });

    let collected = [];
    let currentPage = 1;
    let keepScraping = true;

    while (keepScraping && collected.length < LIMIT_ITEMS) {
        console.log(`Raspando página ${currentPage} (Total já salvo: ${collected.length})...`);
        
        // Timeout pequeno pra garantir carregamento de elementos AUI / Liferay
        await new Promise(r => setTimeout(r, 2000));
        
        // Extract news
        const pageItems = await page.evaluate(() => {
            const arr = [];
            // Liferay articles usually inside list containers or generic grid
            document.querySelectorAll('a').forEach((el) => {
                const link = el.href;
                if (!link.includes('category') && link.includes('/w/')) {
                    const textRaw = el.innerText || '';
                    if (textRaw.trim().length > 10) {
                       let img = '';
                       const imgEl = el.querySelector('img');
                       if (imgEl) img = imgEl.src;
                       arr.push({ link, textRaw, img });
                    }
                }
            });
            return arr;
        });

        let foundValidInPage = false;
        
        for (const it of pageItems) {
            if (collected.length >= LIMIT_ITEMS) break;
            
            // Regex ajustado para pegar datas que Liferay vomita na interface
            const dateMatch = it.textRaw.match(/(\d{2}\/\d{2}\/\d{4})/);
            if (dateMatch) {
                const postDateStr = dateMatch[1];
                const postDate = parseDateBR(postDateStr);

                if (postDate >= START_DATE && postDate <= END_DATE) {
                    const cleanTitleSplit = it.textRaw.match(/^(.*?)(?=\s\d{2}\/\d{2}\/\d{4})/);
                    let cleanTitle = cleanTitleSplit ? cleanTitleSplit[1].replace(/\n/g,' ').trim() : it.textRaw.substring(0, 150).replace(/\n/g,' ').trim();

                    if (cleanTitle.length > 15 && !collected.find(x => x.link === it.link)) {
                        collected.push({
                            link: it.link,
                            text: cleanTitle,
                            date: postDateStr,
                            img: it.img || 'https://www.agenciabrasilia.df.gov.br/wp-content/themes/agencia-brasilia/assets/images/placeholder.jpg'
                        });
                        foundValidInPage = true;
                    }
                } else if (postDate < START_DATE) {
                    console.log(`❌ Notícia antiga (${postDateStr}). Finalizando escopo Liferay...`);
                    keepScraping = false;
                    break;
                }
            }
        }

        if (!keepScraping || collected.length >= LIMIT_ITEMS) break;
        
        currentPage++;
        
        // Lógica ROBUSTA Liferay pagination bypass
        console.log(`Buscando ativador Liferay para página ${currentPage}...`);
        const clicked = await page.evaluate((nextNum) => {
            // No liferay a pagination tem "Página X" ou apenas tag strong nas ativas
            const anchors = Array.from(document.querySelectorAll('a'));
            const target = anchors.find(a => a.innerText && (a.innerText.trim() === String(nextNum) || a.innerText.includes(`Página\n${nextNum}`)));
            
            if (target) {
                target.click();
                return true;
            }
            
            // Try generic "next" button using SVG/icon if innerText matches fail
            const genericNext = anchors.find(a => a.title === 'Próxima' || a.title === 'Next');
            if(genericNext) {
                genericNext.click();
                return true;
            }
            
            return false;
        }, currentPage);

        if (!clicked) {
            console.log("❌ Liferay Paginator esgotado ou inacessível via DOM standard. Iteração paralisada.");
            break;
        }

        console.log(`> Aguardando portlet refresh...`);
        await new Promise(r => setTimeout(r, 6000));
    }

    console.log(`✅ Raspagem Liferay Crawler completa! ${collected.length} reportagens extraídas da matriz.`);

    if (collected.length === 0) {
        await browser.close();
        return;
    }

    console.log(`🧠 Iniciando LLM Categorization...`);
    const chunked = [];
    const chunkSize = 100;
    for (let i = 0; i < collected.length; i += chunkSize) chunked.push(collected.slice(i, i + chunkSize));

    const finalData = [];

    for (let c = 0; c < chunked.length; c++) {
        console.log(`[Batch AI ${c+1}/${chunked.length}] Computando...`);
        const chunk = chunked[c];
        const payload = chunk.map((item, id) => `[ID:${id}] Título: ${item.text}`).join('\n');
        
        const prompt = `Analise os títulos do Governo do DF abaixo.
Para cada ID, forneça APENAS UM JSON VÁLIDO contendo 'area' e 'regiao':
1) 'area' (ESTRITAMENTE destas opções: ${AREAS_PERMITIDAS.join(', ')})
2) 'regiao' (Região Administrativa citada. Caso seja macro/geral use 'DF').

{ "0": { "area": "Saúde", "regiao": "DF" }, "1": { ... } }

${payload}`;

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
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

            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            const aiJson = JSON.parse(data.choices[0].message.content);

            for (let id in aiJson) {
                const numericId = parseInt(id);
                if (!isNaN(numericId) && chunk[numericId]) {
                    chunk[numericId].area = aiJson[id].area || 'Outros';
                    chunk[numericId].regiao = aiJson[id].regiao || 'DF';
                    
                    const dt = parseDateBR(chunk[numericId].date);
                    chunk[numericId].periodo = dt.getFullYear() < 2023 ? '2019-2022' : '2023-2026';
                    
                    finalData.push(chunk[numericId]);
                }
            }
        } catch (e) {
            console.error(`Erro AI Batch ${c+1}:`, e.message);
            chunk.forEach(i => finalData.push({...i, area: 'Outros', regiao: 'DF', periodo: '2023-2026'}));
        }
    }

    fs.writeFileSync(JSON_PATH, JSON.stringify(finalData, null, 2), 'utf-8');
    console.log(`🔥 SUCESSO! ${finalData.length} entregas catalogadas salvas internamente em entregas.json!`);
    await browser.close();
}

run();
