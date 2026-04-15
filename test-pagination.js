const cheerio = require('cheerio');

async function testPage(pageNumber) {
    const url = `https://www.agenciabrasilia.df.gov.br/noticias/page/${pageNumber}`;
    const res = await fetch(url);
    const text = await res.text();
    const $ = cheerio.load(text);
    
    const dates = [];
    $('a').each((i, el) => {
        const rawTitle = $(el).text().trim().replace(/\s+/g, ' ');
        const dateMatch = rawTitle.match(/\s(\d{2}\/\d{2}\/\d{4})/);
        if(dateMatch) dates.push(dateMatch[1]);
    });
    console.log(`Page ${pageNumber} first date: ${dates[0]}, last date: ${dates[dates.length - 1]}`);
}

async function run() {
    await testPage(1);
    await testPage(50);
    await testPage(500);
}

run();
