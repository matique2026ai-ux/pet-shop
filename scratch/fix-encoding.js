const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/translations/fr.ts');
console.log('Reading file:', filePath);

const content = fs.readFileSync(filePath, 'utf8');
const fixed = Buffer.from(content, 'binary').toString('utf8');

fs.writeFileSync(filePath, fixed, 'utf8');
console.log('Successfully fixed encoding for fr.ts!');
