require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'entregas.json');

const AREAS_PERMITIDAS = [
    "Saúde", "Educação", "Segurança Pública", "Infraestrutura", 
    "Mobilidade e Transporte", "Assistência Social e Cidadania", 
    "Desenvolvimento Econômico", "Agricultura e Desenvolvimento Rural", 
    "Habitação", "Meio Ambiente e Sustentabilidade", "Cultura", 
    "Esporte e Lazer", "Turismo", "Outros"
];

// Lista oficial estrita de Regiões Administrativas para forçar a IA a não errar e não chutar "DF" atoa
const REGIOES_DF = [
    "Plano Piloto", "Gama", "Taguatinga", "Brazlândia", "Sobradinho", "Planaltina", "Paranoá", 
    "Núcleo Bandeirante", "Ceilândia", "Guará", "Cruzeiro", "Samambaia", "Santa Maria", 
    "São Sebastião", "Recanto das Emas", "Lago Sul", "Riacho Fundo", "Lago Norte", 
    "Candangolândia", "Águas Claras", "Riacho Fundo II", "Sudoeste/Octogonal", "Varjão", 
    "Park Way", "SCIA/Estrutural", "Sobradinho II", "Jardim Botânico", "Itapoã", "SIA", 
    "Vicente Pires", "Fercal", "Sol Nascente/Pôr do Sol", "Arniqueira", "Arapoanga", "Água Quente"
];

async function run() {
    console.log("Lendo banco gigantesco de matérias...");
    const data = require(JSON_PATH);
    
    // Vamos varrer o banco TODO de 5000+
    const items = data;

    const chunked = [];
    const chunkSize = 60; // 60 matérias por request
    for (let i = 0; i < items.length; i += chunkSize) chunked.push(items.slice(i, i + chunkSize));

    let finalData = [];
    console.log(`🔥 Iniciando Recategorização Profunda de ${items.length} itens...`);

    for (let c = 0; c < chunked.length; c++) {
        console.log(`[Batch ${c+1}/${chunked.length}] Conversando com OpenAI...`);
        const chunk = chunked[c];
        const payload = chunk.map((item, id) => `[ID:${id}] Título: ${item.text || item.title}`).join('\n');
        
        const prompt = `Analise cada [ID] abaixo que representa uma manchete do Governo do Distrito Federal.
        
Para CADA UM infira:
1) 'area': Escolha a secretária afim mais próxima estritamente desta lista: ${AREAS_PERMITIDAS.join(', ')}.
2) 'regiao': OBRIGATORIAMENTE procure por qualquer menção fonética ou equivalente das Regiões Administrativas nesta lista estrita: ${REGIOES_DF.join(', ')}. 
Exemplo: Se aparecer "asfalto no Sol Nascente", ponha "Sol Nascente/Pôr do Sol". Se aparecer "escola no Recanto", ponha "Recanto das Emas".
SE E SOMENTE SE a manchete não citar nenhuma região ou for algo muito genérico de abragência estadual, use 'DF'.

Retorne APENAS um JSON válido no formato chave(id)/valor:
{ "0": { "area": "Infraestrutura", "regiao": "Recanto das Emas" }, "1": { ... } }

${payload}`;

        try {
            const res = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0
            });

            const aiJson = JSON.parse(res.choices[0].message.content);

            for (let id in aiJson) {
                const numId = parseInt(id);
                if (!isNaN(numId) && chunk[numId]) {
                    chunk[numId].area = aiJson[id].area || 'Outros';
                    chunk[numId].regiao = aiJson[id].regiao || 'DF';
                    finalData.push(chunk[numId]);
                }
            }
            
            // Backup incremental para não perder progresso na metade se a API cair!
            fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');

        } catch (e) {
            console.error(`Erro Batch ${c+1}:`, e.message);
            // Em caso de erro, repassa as originais pra nao apagar o arquivo
            chunk.forEach(i => finalData.push(i));
        }
        
        await new Promise(res => setTimeout(res, 500)); // Rate limit pause
    }

    // Gravação definitiva
    fs.writeFileSync(JSON_PATH, JSON.stringify(finalData, null, 2), 'utf-8');
    console.log(`\n🎉 SUCESSO ABSOLUTO! Todas as ${finalData.length} matérias do seu painel foram re-estudadas pela I.A com Mapa Restrito de Regiões!`);
}

run();
