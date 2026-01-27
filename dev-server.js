#!/usr/bin/env node
// Alternative dev server script that clears cache on start
import { spawn } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const cwd = process.cwd();

// Clear caches
try {
  rmSync(join(cwd, '.vite'), { recursive: true, force: true });
  rmSync(join(cwd, 'node_modules/.vite'), { recursive: true, force: true });
  console.log('✓ Cleared Vite cache');
} catch (e) {
  // Ignore errors
}

// Start Vite dev server using npm
const vite = spawn('npm', ['run', 'dev'], { cwd, stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  vite.kill();
  process.exit(0);
});
