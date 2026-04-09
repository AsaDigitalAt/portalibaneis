const cheerio = require('cheerio');

async function testFetch() {
    try {
        const response = await fetch('https://www.agenciabrasilia.df.gov.br/noticias');
        const text = await response.text();
        const $ = cheerio.load(text);
        
        const items = [];
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('agenciabrasilia') && !link.includes('category')) {
                const title = $(el).text().trim().replace(/\s+/g, ' ');
                if (title && title.length > 20) {
                    items.push({ link, raw_title: title.substring(0, 150) });
                }
            }
        });
        
        console.log(JSON.stringify(items.slice(0, 10), null, 2));
    } catch (e) {
        console.error(e);
    }
}

testFetch();
