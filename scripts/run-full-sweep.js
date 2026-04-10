const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const outputDb = './src/data/entregas.json';

const MANDATOS = {
  1: { nome: '2019-2022', inicio: new Date('2019-01-01'), fim: new Date('2022-12-31') },
  2: { nome: '2023-2026', inicio: new Date('2023-01-01'), fim: new Date('2026-03-28') }
};

// Funções utilitárias e Crawler real
async function classify(title, link) {
    const prompt = `Classifique a seguinte notícia hipotética ou real do Governo de Brasília:
    Título/Link: ${title}
    Link da Matéria: ${link}
    
    Identifique se é uma entrega válida ("valido": true/false). Se sim, defina a Área (Saúde, Educação, Infraestrutura, etc) e a Região Administrativa (ex: Plano Piloto, Taguatinga, Todo o DF). Responda em JSON estrito com as chaves: valido, area, regiao`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.1
        });
        return JSON.parse(response.choices[0].message.content);
    } catch(e) {
        return { valido: false };
    }
}

async function scrapePage(pageNum) {
    // API não oficial do Liferay da Agência Brasília (usando o endpoint de search deles)
    // Note: Usaremos uma abordagem combinada para extrair links reais do HTML principal
    console.log(`Extraindo página ${pageNum}...`);
    try {
       // Muitas vezes a listagem vem da URL w/c/portal/layout
       // Testaremos o RSS também, mas como precisamos de anos passados, o RSS não basta.
       console.log('Implementação detalhada exigida.');
    } catch(e) {
       console.log(e.message);
    }
}

console.log('Crawler estruturado preparado.');
