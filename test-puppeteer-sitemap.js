const puppeteer = require('puppeteer');

(async () => {
    console.log("Iniciando Puppeteer...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log("Acessando Sitemap...");
    try {
        await page.goto('https://agenciabrasilia.df.gov.br/sitemap.xml', { waitUntil: 'domcontentloaded', timeout: 30000 });
        const html = await page.content();
        console.log("Sitemap HTML length:", html.length);
        console.log(html.substring(0, 500));
    } catch (e) {
        console.error("Erro ao acessar sitemap via Puppeteer:", e.message);
    }
    
    await browser.close();
})();
