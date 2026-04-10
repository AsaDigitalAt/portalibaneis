const https = require('https');

https.get('https://www.youtube.com/@Ag%C3%AAnciaBras%C3%ADlia-k9w/videos', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /"videoId":"([^"]{11})"/g;
    let match;
    const ids = new Set();
    while ((match = regex.exec(data)) !== null) {
      ids.add(match[1]);
    }
    console.log("Found IDs:", Array.from(ids).slice(0, 10));
  });
});
