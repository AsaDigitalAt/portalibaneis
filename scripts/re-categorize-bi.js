require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const AREAS_PERMITIDAS = [
    "Saúde", "Educação", "Segurança Pública", "Infraestrutura", 
    "Mobilidade e Transporte", "Assistência Social e Cidadania", 
    "Desenvolvimento Econômico", "Agricultura e Desenvolvimento Rural", 
    "Habitação", "Meio Ambiente e Sustentabilidade", "Cultura", 
    "Esporte e Lazer", "Turismo"
];

const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'entregas.json');

async function run() {
    console.log("Lendo mock database...");
    const data = require(JSON_PATH);
    
    // Process limit
    const items = data.slice(0, 1000); 

    const chunked = [];
    const chunkSize = 80;
    for (let i = 0; i < items.length; i += chunkSize) chunked.push(items.slice(i, i + chunkSize));

    const finalData = [];

    for (let c = 0; c < chunked.length; c++) {
        console.log(`[Batch ${c+1}/${chunked.length}] Conversando com OpenAI...`);
        const chunk = chunked[c];
        const payload = chunk.map((item, id) => `[ID:${id}] Título: ${item.text || item.title}`).join('\n');
        
        const prompt = `Analise cada [ID] abaixo de matérias do Governo do DF. Para cada um, infirme:
1) 'area' (escolha EXATAMENTE deste conjunto: ${AREAS_PERMITIDAS.join(', ')})
2) 'regiao' (nome da Região Administrativa do DF. Se for assunto geral/centro, escreva 'Plano Piloto' ou 'DF').
Retorne APENAS um JSON válido no formato chave(id)/valor:
{ "0": { "area": "Saúde", "regiao": "DF" }, "1": { ... } }

${payload}`;

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0,
                    response_format: { type: "json_object" }
                })
            });

            const aiResponse = await res.json();
            if (aiResponse.error) throw new Error(aiResponse.error.message);
            const aiJson = JSON.parse(aiResponse.choices[0].message.content);

            for (let id in aiJson) {
                const numericId = parseInt(id);
                if (!isNaN(numericId) && chunk[numericId]) {
                    chunk[numericId].area = aiJson[id].area || 'DF';
                    chunk[numericId].regiao = aiJson[id].regiao || 'DF';
                    finalData.push(chunk[numericId]);
                }
            }
        } catch (e) {
            console.error(`Erro Batch ${c+1}:`, e.message);
            chunk.forEach(i => finalData.push({...i, area: 'Infraestrutura', regiao: 'DF'}));
        }
    }

    fs.writeFileSync(JSON_PATH, JSON.stringify(finalData, null, 2), 'utf-8');
    console.log(`🔥 SUCESSO! Banco catalogado pela I.A estritamente seguindo o padrão!`);
}

run();
