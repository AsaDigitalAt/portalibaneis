const cheerio = require('cheerio');
const https = require('https');

https.get('https://www.agenciabrasilia.df.gov.br/noticias', res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        const $ = cheerio.load(body);
        let countDatePassed = 0;
        const minDate = new Date('2019-01-01T00:00:00-03:00');
        const maxDate = new Date('2026-03-28T23:59:59-03:00');

        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('agenciabrasilia.df.gov.br') && !link.includes('category')) {
                let rawText = $(el).text().trim().replace(/\s+/g, ' ');
                const dateMatch = rawText.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                if (dateMatch) {
                    const articleDate = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}T12:00:00-03:00`);
                    if (articleDate >= minDate && articleDate <= maxDate) {
                        countDatePassed++;
                    }
                }
            }
        });
        console.log("Articles passing date filter:", countDatePassed);
    });
});
