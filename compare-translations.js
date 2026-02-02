import { readFileSync } from 'fs';

const content = readFileSync('i18n.tsx', 'utf8');

// Extract keys for each language
const enMatches = content.match(/en:\s*{([^}]*)}/s);
const ruMatches = content.match(/ru:\s*{([^}]*)}/s);
const csMatches = content.match(/cs:\s*{([^}]*)}/s);

if (enMatches && ruMatches && csMatches) {
  const enKeys = enMatches[1].match(/'([^']+)':/g) || [];
  const ruKeys = ruMatches[1].match(/'([^']+)':/g) || [];
  const csKeys = csMatches[1].match(/'([^']+)':/g) || [];
  
  console.log(`EN keys: ${enKeys.length}`);
  console.log(`RU keys: ${ruKeys.length}`);
  console.log(`CS keys: ${csKeys.length}`);
  
  // Find missing keys in Russian
  const enKeySet = new Set(enKeys.map(k => k.replace(/'/g, '').replace(':', '')));
  const ruKeySet = new Set(ruKeys.map(k => k.replace(/'/g, '').replace(':', '')));
  const csKeySet = new Set(csKeys.map(k => k.replace(/'/g, '').replace(':', '')));
  
  const missingInRu = [...enKeySet].filter(key => !ruKeySet.has(key));
  const missingInCs = [...enKeySet].filter(key => !csKeySet.has(key));
  
  console.log('\nMissing in RU:', missingInRu);
  console.log('\nMissing in CS:', missingInCs);
}