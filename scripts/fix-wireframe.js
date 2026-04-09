const fs = require('fs');
const content = fs.readFileSync('src/app/wireframe.js', 'utf8');
const startMarker = '\n        <!-- KPIs topo -->';
const endMarker = '\n<!-- ===================== PALAVRA DO DIA';
const start = content.indexOf(startMarker);
const end = content.indexOf(endMarker);
console.log('start:', start, 'end:', end);
if (start >= 0 && end >= 0) {
  const fixed = content.substring(0, start) + '\n' + content.substring(end);
  fs.writeFileSync('src/app/wireframe.js', fixed);
  console.log('Fixed! Removed', end - start, 'chars');
} else {
  console.log('Markers not found');
}
