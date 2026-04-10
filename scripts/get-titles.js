const https = require('https');

const ids = [
  'Zf8CbDNTDJI',
  'EfOF47DavOU',
  'VIGzkw5KuCM',
  'Kjc5NIUykmw',
  'bmoyJmj46JQ',
  '9s-YSOZeMXw'
];

async function getTitle(id) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, (r) => {
      let data = '';
      r.on('data', chunk => data += chunk);
      r.on('end', () => {
        try {
          resolve(JSON.parse(data).title);
        } catch(e) {
          resolve('Agência Brasília Vídeo');
        }
      });
    });
  });
}

async function run() {
  for (const id of ids) {
    const title = await getTitle(id);
    console.log(`{ url: 'https://www.youtube.com/watch?v=${id}', title: '${title}', duration: '...' },`);
  }
}
run();
