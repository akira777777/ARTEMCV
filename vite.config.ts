import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiKey = env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY;
  const isProd = mode === 'production';
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    
    plugins: [react()],
    
    build: {
      // Use esbuild for minification (faster, built-in)
      minify: 'esbuild',
      
      // esbuild options for production
      esbuildOptions: isProd ? {
        drop: ['console', 'debugger'],
        legalComments: 'none',
      } : undefined,
      
      // Code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            icons: ['lucide-react'],
            motion: ['framer-motion'],
          },
          // Optimize chunk file names
          chunkFileNames: isProd ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
          entryFileNames: isProd ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
          assetFileNames: isProd ? 'assets/[hash].[ext]' : 'assets/[name]-[hash].[ext]',
        },
      },
      
      // Report compressed size
      reportCompressedSize: true,
      sourcemap: false,
      
      // Optimize for modern browsers
      target: 'ES2020',
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Chunk size warnings
      chunkSizeWarningLimit: 500,
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react'],
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
      // Include test files
      include: ['tests/**/*.{test,spec}.{ts,tsx}'],
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
