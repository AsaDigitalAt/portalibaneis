const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  try {
    const { data } = await axios.get('https://www.agenciabrasilia.df.gov.br/?s=obras');
    const $ = cheerio.load(data);
    const articles = $('article');
    console.log('Articles length:', articles.length);
    
    if (articles.length > 0) {
      const first = $(articles.get(0));
      console.log('Link:', first.find('a').attr('href'));
      console.log('Title:', first.find('.entry-title, h2, h3').text().trim());
      console.log('Date:', first.find('time').text().trim() || first.find('.published').text().trim() || first.find('.date').text().trim());
      console.log('Img:', first.find('img').attr('src'));
    }
  } catch(e) {
    console.error(e.message);
  }
}
test();
