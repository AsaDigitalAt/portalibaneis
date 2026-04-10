const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('agencia.html', 'utf8');
const $ = cheerio.load(html);

// Discover the container for search results
// Liferay typical structures
const links = [];
$('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('/w/')) {
        links.push(href);
    }
});
console.log('Found article links:', new Set(links));

const items = $('.search-result, .journal-article, .post, article');
console.log('Found generic article items:', items.length);

if (items.length > 0) {
   const first = $(items[0]);
   console.log('Title:', first.text().trim().substring(0, 50));
}
