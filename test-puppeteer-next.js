const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching brwoser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.agenciabrasilia.df.gov.br/noticias', { waitUntil: 'networkidle2' });
    
    // Find Next button
    const paginationLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const nextLinks = links.filter(a => a.textContent.includes('Próxima') || a.textContent.includes('>>') || a.textContent.includes('Seta'));
        return nextLinks.map(a => a.outerHTML);
    });
    
    console.log("Pagination Next links:", paginationLinks);
    
    await browser.close();
})();
