const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('agencia.html', 'utf8');
const $ = cheerio.load(html);

const items = [];
$('a').each((i, el) => {
    const link = $(el).attr('href');
    if (link && link.includes('agenciabrasilia.df.gov.br') && !link.includes('category')) {
        const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || $(el).parent().find('img').attr('src');
        const text = $(el).text().trim().replace(/\s+/g, ' ') || $(el).parent().text().trim().replace(/\s+/g, ' ');
        if (img && text.length > 20) {
            items.push({ link, img, text: text.substring(0, 80) });
        }
    }
});
console.log(JSON.stringify(items.slice(0, 10), null, 2));
