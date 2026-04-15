const fs = require('fs');
fetch('https://www.agenciabrasilia.df.gov.br/noticias').then(r=>r.text()).then(t => { 
    fs.writeFileSync('page_dump.html', t);
}).catch(console.error);
