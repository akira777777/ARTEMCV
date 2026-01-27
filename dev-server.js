#!/usr/bin/env node
// Alternative dev server script that clears cache on start
import { spawn } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';

const cwd = process.cwd();

// Clear caches
try {
  rmSync(join(cwd, '.vite'), { recursive: true, force: true });
  rmSync(join(cwd, 'node_modules/.vite'), { recursive: true, force: true });
  console.log('✓ Cleared Vite cache');
} catch (e) {
  // Ignore errors
}

// Start Vite dev server
const vite = spawn('vite', ['--force'], { cwd, stdio: 'inherit' });

process.on('SIGINT', () => {
  vite.kill();
  process.exit(0);
});
