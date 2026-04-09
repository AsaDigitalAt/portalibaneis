const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('agencia.html', 'utf8'));
const dates = [];
$('a').each((i, el) => {
    const txt = $(el).text();
    const m = txt.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (m) dates.push(m[0]);
});
console.log(dates.slice(0, 10));
