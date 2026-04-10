const axios = require('axios');
const cheerio = require('cheerio');

async function checkSearch() {
   const { data } = await axios.get('https://www.agenciabrasilia.df.gov.br/?q=inauguracao');
   const $ = cheerio.load(data);
   
   let results = [];
   $('.search-result, .journal-article, .post, article, .portlet-journal-content').each((i, el) => {
       const a = $(el).find('a').first();
       const href = a.attr('href');
       
       if (href && href.includes('/w/')) {
           const title = $(el).text().replace(/\s+/g, ' ').trim().substring(0, 80);
           results.push({ href, title });
       }
   });
   
   console.log('Results length:', results.length);
   console.log(results.slice(0, 3));
}
checkSearch();
