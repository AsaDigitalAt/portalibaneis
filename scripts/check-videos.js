// Verifica se cada ID de vídeo retorna 200 (existe)
const https = require('https');

const ids = [
  'Yy3BCNBEZKY',
  '3pOVZoL7K8o',
  'OoiWr4OyUTM',
  'XsRh4ZvhQK4',
  '5y5jqMp2ePU',
  'Q9REqXOWBg0',
];

for (const id of ids) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  https.get(url, (r) => {
    console.log(`${id}: HTTP ${r.statusCode} ${r.statusCode === 200 ? '✓ válido' : '✗ inválido'}`);
  }).on('error', () => console.log(`${id}: erro de conexão`));
}
