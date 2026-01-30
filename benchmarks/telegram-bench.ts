import { performance } from 'perf_hooks';

const iterations = 1000000;
const email = "test.user@example.com";

console.log(`Running ${iterations} iterations...`);

// 1. Email Regex Benchmark
// Baseline: Regex inside loop
const start1 = performance.now();
for (let i = 0; i < iterations; i++) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailPattern.test(email);
}
const end1 = performance.now();
console.log(`Regex inside loop: ${(end1 - start1).toFixed(2)}ms`);

// Optimized: Regex outside loop
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const start2 = performance.now();
for (let i = 0; i < iterations; i++) {
  EMAIL_PATTERN.test(email);
}
const end2 = performance.now();
console.log(`Regex outside loop: ${(end2 - start2).toFixed(2)}ms`);


// 2. EscapeHtml Benchmark
function escapeHtmlCurrent(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const HTML_ESCAPE_REGEX = /[&<>"']/g;

function escapeHtmlMap(value: string): string {
  return value.replace(HTML_ESCAPE_REGEX, (match) => HTML_ESCAPE_MAP[match]);
}

function escapeHtmlSwitch(value: string): string {
  return value.replace(HTML_ESCAPE_REGEX, (match) => {
     switch (match) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return match;
     }
  });
}

function escapeHtmlReplaceAll(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const longText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
<script>alert('xss')</script>
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
& " ' < >
`.repeat(10);

console.log(`\nEscapeHtml Benchmark with long text (${longText.length} chars)`);

// Current EscapeHtml
const start3 = performance.now();
for (let i = 0; i < iterations/10; i++) { // Reduce iterations for long text
  escapeHtmlCurrent(longText);
}
const end3 = performance.now();
console.log(`Current escapeHtml: ${(end3 - start3).toFixed(2)}ms`);

// Map EscapeHtml
const start4 = performance.now();
for (let i = 0; i < iterations/10; i++) {
  escapeHtmlMap(longText);
}
const end4 = performance.now();
console.log(`Map escapeHtml: ${(end4 - start4).toFixed(2)}ms`);

// Switch EscapeHtml
const start5 = performance.now();
for (let i = 0; i < iterations/10; i++) {
  escapeHtmlSwitch(longText);
}
const end5 = performance.now();
console.log(`Switch escapeHtml: ${(end5 - start5).toFixed(2)}ms`);

// ReplaceAll EscapeHtml
const start6 = performance.now();
for (let i = 0; i < iterations/10; i++) {
  escapeHtmlReplaceAll(longText);
}
const end6 = performance.now();
console.log(`ReplaceAll escapeHtml: ${(end6 - start6).toFixed(2)}ms`);

const shortText = "John <Doe> & 'Friends'";
console.log(`\nEscapeHtml Benchmark with short text (${shortText.length} chars)`);

// Current EscapeHtml
const start7 = performance.now();
for (let i = 0; i < iterations; i++) {
  escapeHtmlCurrent(shortText);
}
const end7 = performance.now();
console.log(`Current escapeHtml: ${(end7 - start7).toFixed(2)}ms`);

// Map EscapeHtml
const start8 = performance.now();
for (let i = 0; i < iterations; i++) {
  escapeHtmlMap(shortText);
}
const end8 = performance.now();
console.log(`Map escapeHtml: ${(end8 - start8).toFixed(2)}ms`);

// ReplaceAll EscapeHtml
const start9 = performance.now();
for (let i = 0; i < iterations; i++) {
  escapeHtmlReplaceAll(shortText);
}
const end9 = performance.now();
console.log(`ReplaceAll escapeHtml: ${(end9 - start9).toFixed(2)}ms`);
