import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    // Limite definido: Apenas notícias antes de 28 de março de 2026
    const limiteData = new Date('2026-03-28T00:00:00-03:00');
    
    const validarData = (dataStr) => {
        if (!dataStr) return true; // assume q pode prosseguir se n achar data
        const t = dataStr.split('/');
        if (t.length !== 3) return true;
        const nDate = new Date(`${t[2]}-${t[1]}-${t[0]}T00:00:00-03:00`);
        return nDate.getTime() < limiteData.getTime();
    };

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
                const dateMatch = rawTitle.match(/\s(\d{2})\/(\d{2})\/(\d{4})/);
                const dateExtracted = dateMatch ? `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}` : null;
                
                const titleMatch = rawTitle.match(/^(.*?)(?=\s\d{2}\/\d{2}\/\d{4})/);
                const cleanTitle = titleMatch ? titleMatch[1].trim() : rawTitle.substring(0, 100);

                // Aplica o filtro de Data!
                if (!dateExtracted || !validarData(dateExtracted)) {
                    return; // equivalente a continue num loop each do cheerio
                }

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
        if (items.length < 6) {
             throw new Error("Poucas notícias reais passadas no filtro de data (ou fim de página), acionando Fallback DB.");
        }
        
        return NextResponse.json({ noticias: items.slice(0, 10) });
    } catch(err) {
        console.error("Erro no scraping da Agencia", err);
        // Fallback robusto para quando a AWS/Netlify for bloqueada pelo servidor do GDF
        // Fallback robusto usando banco de dados original!
        const bd = require('../../../data/entregas.json');
        
        // Cava registros nobres reais mais recentes antes do limite temporal que possuam link e imagem
        const fallbacks = bd.filter(e => e.img && e.link && e.text && !e.img.includes('placeholder') && validarData(e.date)).slice(0, 10).map(e => ({
            link: e.link,
            text: e.text || e.title,
            area: e.area || 'Saúde',
            img: e.img
        }));
        
        return NextResponse.json({ noticias: fallbacks });
    }
}
