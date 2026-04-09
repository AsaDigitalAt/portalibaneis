const https = require('https');
const cheerio = require('cheerio');

https.get('https://www.agenciabrasilia.df.gov.br/?s=Ibaneis', res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        const $ = cheerio.load(body);
        const items = [];
        $('a').each((i, el) => {
            const text = $(el).text().trim().replace(/\s+/g, ' ');
            const dateMatch = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
            if (dateMatch) {
                items.push(dateMatch[0] + " - " + text.substring(0, 50));
            }
        });
        console.log(items.slice(0, 10));
    });
});
