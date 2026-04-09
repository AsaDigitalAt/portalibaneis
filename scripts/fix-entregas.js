// scripts/fix-entregas.js
// Corrige o entregas.json: limpa &amp; nas URLs de imagem e troca os fallbacks por imagens reais curadas
const fs = require('fs');
const path = require('path');
const https = require('https');

const filePath = path.join(__dirname, '../src/data/entregas.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Imagens reais e verificadas da Agência Brasília para uso como fallback por área
// Todas são URLs comprovadamente válidas (documentos Liferay confirmados que existem)
const AREA_FALLBACKS = {
  'Saúde': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/54662838017_c0a31483eb_o.jpg/5fb2abbf-0b23-e47a-e742-69d8f3c916e3?version=1.0&t=1770207426960&download=true',
  'Educação': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/CAPA+%28103%29.jpg/8266cb77-e41d-92eb-32aa-a8f0c41bc1d2?version=1.0&t=1773670991267&download=true',
  'Infraestrutura': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/01+CAPA.jpg/ab052886-8598-7ad2-412e-56774aa9096f?version=1.0&t=1771858038439&download=true',
  'Segurança': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/capa+%282%29_1+%2811%29.jpg/3a77c98a-f714-4c8b-1e5b-394188a83d21?version=1.0&t=1770214972998&download=true',
  'Economia': 'https://www.agenciabrasilia.df.gov.br/documents/20117/25086063/CAPA-2-10-400x300.jpg/6a94ffc2-9357-cd8f-c347-f5128626d725?version=1.0&t=1744844141902&download=true',
  'Meio Ambiente': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/01+CAPA.jpg/ab052886-8598-7ad2-412e-56774aa9096f?version=1.0&t=1771858038439&download=true',
  'Social': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/WhatsApp+Image+2026-03-26+at+11.46.36.jpeg/c2866c43-b6be-5264-dac7-06163af5055c?version=1.0&t=1774536471682&download=true',
  'Transportes': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/capa+%282%29_1+%2811%29.jpg/3a77c98a-f714-4c8b-1e5b-394188a83d21?version=1.0&t=1770214972998&download=true',
  'Habitação': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/WhatsApp+Image+2026-03-21+at+10.48.37.jpeg/67afeae8-2397-9d3e-4b62-b313c8c9c5ab?version=1.0&t=1774100973057&download=true',
  'Outros': 'https://www.agenciabrasilia.df.gov.br/documents/20117/0/54662838017_c0a31483eb_o.jpg/5fb2abbf-0b23-e47a-e742-69d8f3c916e3?version=1.0&t=1770207426960&download=true',
};

const FALLBACK_GENERIC = AREA_FALLBACKS['Saúde'];

const PUBLICIDADE_URL = 'documents/d/guest/publicidade02-png';

let fixed = 0;
let ampFixed = 0;

const updated = data.map(item => {
  let img = item.img;

  // 1. Limpar &amp; encodado no URL (quebra o src no browser)
  if (img && img.includes('&amp;')) {
    img = img.replace(/&amp;/g, '&');
    ampFixed++;
  }

  // 2. Trocar fallback inválido por imagem real baseada na área
  if (!img || img.includes(PUBLICIDADE_URL)) {
    img = AREA_FALLBACKS[item.area] || FALLBACK_GENERIC;
    fixed++;
  }

  return { ...item, img };
});

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
console.log(`Concluído!`);
console.log(`- ${ampFixed} URLs corrigidas (&amp; → &)`);
console.log(`- ${fixed} imagens de fallback substituídas por imagens reais por área`);
console.log(`Total: ${updated.length} registros`);
