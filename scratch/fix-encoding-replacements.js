const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/translations/fr.ts');
console.log('Reading file:', filePath);

let content = fs.readFileSync(filePath, 'utf8');

// Replacements map
const replacements = [
  { pattern: /Ã©/g, replacement: 'é' },
  { pattern: /Ã /g, replacement: 'à' }, // regular space
  { pattern: /Ã\u00a0/g, replacement: 'à' }, // NBSP
  { pattern: /Ã¨/g, replacement: 'è' },
  { pattern: /Ã¢/g, replacement: 'â' },
  { pattern: /Ãª/g, replacement: 'ê' },
  { pattern: /Ã®/g, replacement: 'î' },
  { pattern: /Ã´/g, replacement: 'ô' },
  { pattern: /Ã»/g, replacement: 'û' },
  { pattern: /Ã¹/g, replacement: 'ù' },
  { pattern: /Ã§/g, replacement: 'ç' },
  { pattern: /Ã¯/g, replacement: 'ï' },
  { pattern: /Ã«/g, replacement: 'ë' },
  { pattern: /Ã‰/g, replacement: 'É' },
  { pattern: /Ã€/g, replacement: 'À' },
  { pattern: /â€”/g, replacement: '—' },
  { pattern: /â€“/g, replacement: '–' },
  { pattern: /â€™/g, replacement: '’' }
];

let replacedCount = 0;
for (const item of replacements) {
  const match = content.match(item.pattern);
  if (match) {
    replacedCount += match.length;
    content = content.replace(item.pattern, item.replacement);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully performed ${replacedCount} character replacements in fr.ts!`);
