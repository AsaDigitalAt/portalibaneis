import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        const response = await fetch('https://www.agenciabrasilia.df.gov.br/noticias', { next: { revalidate: 3600 } });
        const text = await response.text();
        const $ = cheerio.load(text);
        
        const items = [];
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.includes('agenciabrasilia') && !link.includes('category')) {
                let img = $(el).find('img').attr('src') || 'https://www.agenciabrasilia.df.gov.br/wp-content/themes/agencia-brasilia/assets/images/placeholder.jpg';
                if (img.startsWith('/')) img = `https://www.agenciabrasilia.df.gov.br${img}`;
                
                const rawTitle = $(el).text().trim().replace(/\s+/g, ' ');
                const titleMatch = rawTitle.match(/^(.*?)(?=\s\d{2}\/\d{2}\/\d{4})/);
                const cleanTitle = titleMatch ? titleMatch[1].trim() : rawTitle.substring(0, 100);

                if (cleanTitle && cleanTitle.length > 20) {
                    if (!items.find(item => item.link === link)) {
                        items.push({ 
                            link: link, 
                            text: cleanTitle, 
                            area: 'Destaque',
                            img: img 
                        });
                    }
                }
            }
        });
        
        return NextResponse.json({ noticias: items.slice(0, 10) });
    } catch(err) {
        console.error("Erro no scraping da Agencia", err);
        // Fallback robusto para quando a AWS/Netlify for bloqueada pelo servidor do GDF
        // Fallback robusto usando banco de dados original!
        const bd = require('../../../data/entregas.json');
        
        // Cava 4 registros nobres reais mais recentes que possuam link e imagem de fato
        const fallbacks = bd.filter(e => e.img && e.link && e.text && !e.img.includes('placeholder')).slice(0, 4).map(e => ({
            link: e.link,
            text: e.text || e.title,
            area: e.area || 'Saúde',
            img: e.img
        }));
        
        return NextResponse.json({ noticias: fallbacks });
    }
}
