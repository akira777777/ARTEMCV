import assert from 'assert';

// Implementation from api/send-telegram.ts
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const testCases = [
    { input: 'Hello World', expected: 'Hello World' },
    { input: '<script>', expected: '&lt;script&gt;' },
    { input: '"quoted"', expected: '&quot;quoted&quot;' },
    { input: "'single'", expected: '&#39;single&#39;' },
    { input: 'Fish & Chips', expected: 'Fish &amp; Chips' },
    { input: '<"&>', expected: '&lt;&quot;&amp;&gt;' },
];

console.log('Running verify-escape-html...');
let passed = 0;
for (const { input, expected } of testCases) {
    const actual = escapeHtml(input);
    try {
        assert.strictEqual(actual, expected);
        passed++;
    } catch (e) {
        console.error(`FAILED: Input "${input}"`);
        console.error(`  Expected: ${expected}`);
        console.error(`  Actual:   ${actual}`);
        process.exit(1);
    }
}
console.log(`All ${passed} tests passed.`);
