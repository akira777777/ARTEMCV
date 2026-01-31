import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiKey = env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY;
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      middlewareMode: false,
    },
    
    plugins: [react()],
    
    build: {
      // Optimize bundle size
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
        },
        output: {
          comments: false,
        },
      },
      
      // Code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['lucide-react'],
          },
        },
      },
      
      // Report compressed size
      reportCompressedSize: true,
      sourcemap: false,
      
      // Optimize for modern browsers
      target: 'ES2020',
    },
    
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      globals: true,
      clearMocks: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
    },
    
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
