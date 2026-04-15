const cheerio = require('cheerio');
fetch('https://www.agenciabrasilia.df.gov.br/noticias/page/1').then(r=>r.text()).then(t => { 
    const $ = cheerio.load(t);
    // Find the first post block
    const block = $('.item-noticia, article, .post').first();
    console.log("HTML:", block.html());
}).catch(console.error);
