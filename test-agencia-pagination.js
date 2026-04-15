const cheerio = require('cheerio');
fetch('https://www.agenciabrasilia.df.gov.br/noticias?cur=2').then(r=>r.text()).then(t => { 
    const $ = cheerio.load(t);
    const postTexts = [];
    $('a').each((i, el) => {
        const link = $(el).attr('href');
        if (link && link.includes('/w/')) {
            postTexts.push($(el).text().substring(0,40).trim());
        }
    });
    console.log(postTexts.slice(0,3));
}).catch(console.error);
