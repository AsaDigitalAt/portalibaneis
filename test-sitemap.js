const cheerio = require('cheerio');
fetch('https://agenciabrasilia.df.gov.br/sitemap.xml?p_l_id=36&layoutUuid=9666e41f-1429-18a4-cdbb-3a9a0219ef2d&groupId=20117&privateLayout=false')
.then(r => r.text())
.then(t => {
    const $ = cheerio.load(t, {xmlMode: true});
    const locs = $('loc').map((i,el)=>$(el).text()).get();
    console.log("Total entries in sitemap part:", locs.length);
    console.log("Sample:", locs.slice(-10));
}).catch(console.error);
