const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const jsonPath = path.join(__dirname, 'src', 'data', 'entregas.json');
let data = require(jsonPath);

async function run() {
    console.log("Iniciando batch update de imagens e links reais...");
    let updated = 0;
    
    // Testaremos apenas os primeiros 3 para ver se funciona.
    for (let i = 0; i < 3; i++) {
        const item = data[i];
        try {
            const searchUrl = 'https://www.agenciabrasilia.df.gov.br/?s=' + encodeURIComponent(item.text);
            const res = await fetch(searchUrl);
            const html = await res.text();
            
            const $ = cheerio.load(html);
            // Cada tema WP muda. Geralmente resultados ficam em tags a.
            // Vamos procurar o link de materia no body.
            let firstLink = '';
            let firstImg = '';
            
            // O site deles provavelmente usa blocos comuns.
            // Quando a gnt testou o /noticias, achamos <a> com href='/w/...'.
            $('a').each((i, el) => {
                const link = $(el).attr('href');
                if (!firstLink && link && link.includes('agenciabrasilia') && !link.includes('category') && link.includes('/w/')) {
                    firstLink = link;
                    let foundImg = $(el).find('img').attr('src');
                    if(foundImg) {
                        firstImg = foundImg.startsWith('/') ? 'https://www.agenciabrasilia.df.gov.br'+foundImg : foundImg;
                    }
                }
            });

            if (firstLink) {
                console.log(`[${i}] Achou ->`, firstLink);
                item.link = firstLink;
                if(firstImg) item.img = firstImg;
                updated++;
            } else {
                console.log(`[${i}] Nada p/ ${item.text.substring(0,20)}...`);
            }
        } catch(e) {
            console.error(`Erro no idx ${i}`, e.message);
        }
        
        await new Promise(r => setTimeout(r, 800)); // anti-spam
    }

    console.log("Test Update finalizado. Alterados: ", updated);
}

run();
