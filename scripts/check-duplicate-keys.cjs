// Script to check for duplicate translation keys in i18n.tsx
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'i18n.tsx');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract translation sections
const enMatch = content.match(/en:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*ru:/);
const ruMatch = content.match(/ru:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*cs:/);
const csMatch = content.match(/cs:\s*\{([\s\S]*?)\n\s*\}\s*\};/);

function extractKeys(section) {
  if (!section) return [];
  const keys = [];
  const regex = /['"]([\w.]+)['"]\s*:/g;
  let match;
  while ((match = regex.exec(section)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

const enKeys = extractKeys(enMatch ? enMatch[1] : '');
const ruKeys = extractKeys(ruMatch ? ruMatch[1] : '');
const csKeys = extractKeys(csMatch ? csMatch[1] : '');

console.log('English keys:', enKeys.length);
console.log('Russian keys:', ruKeys.length);
console.log('Czech keys:', csKeys.length);

// Find duplicates within each language
function findDuplicates(keys, lang) {
  const seen = new Set();
  const duplicates = [];
  keys.forEach(k => {
    if (seen.has(k)) {
      duplicates.push(k);
    } else {
      seen.add(k);
    }
  });
  if (duplicates.length > 0) {
    console.log(`\nDuplicates in ${lang}:`, duplicates);
  }
  return duplicates;
}

const enDups = findDuplicates(enKeys, 'en');
const ruDups = findDuplicates(ruKeys, 'ru');
const csDups = findDuplicates(csKeys, 'cs');

// Check for key consistency across languages
const enSet = new Set(enKeys);
const ruSet = new Set(ruKeys);
const csSet = new Set(csKeys);

const allKeys = new Set([...enKeys, ...ruKeys, ...csKeys]);
const missingInRu = [...allKeys].filter(k => !ruSet.has(k));
const missingInCs = [...allKeys].filter(k => !csSet.has(k));
const missingInEn = [...allKeys].filter(k => !enSet.has(k));

if (missingInRu.length > 0) {
  console.log('\nKeys missing in Russian:', missingInRu);
}
if (missingInCs.length > 0) {
  console.log('\nKeys missing in Czech:', missingInCs);
}
if (missingInEn.length > 0) {
  console.log('\nKeys missing in English:', missingInEn);
}

console.log('\n=== Summary ===');
console.log('Total unique keys across all languages:', allKeys.size);
console.log('English-only keys:', enKeys.length);
console.log('Russian-only keys:', ruKeys.length);
console.log('Czech-only keys:', csKeys.length);

if (enDups.length === 0 && ruDups.length === 0 && csDups.length === 0) {
  console.log('\n✓ No duplicate keys found in any language!');
} else {
  console.log('\n✗ Found duplicate keys - need to fix');
  process.exit(1);
}
