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
      // Use terser for better compression (smaller bundles)
      minify: 'terser',
          
      // Advanced terser options for maximum compression
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false,
        },
        mangle: true,
      } : undefined,
          
      // Enhanced code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            icons: ['lucide-react'],
            motion: ['framer-motion'],
          },
          // Optimize chunk file names
          chunkFileNames: isProd ? 'assets/[name]-[hash:8].js' : 'assets/[name]-[hash].js',
          entryFileNames: isProd ? 'assets/[name]-[hash:8].js' : 'assets/[name]-[hash].js',
          assetFileNames: isProd ? 'assets/[name]-[hash:8].[ext]' : 'assets/[name]-[hash].[ext]',
        },
      },
      
      // Performance optimizations
      reportCompressedSize: true,
      sourcemap: false,
      brotliSize: true,
      
      // Optimize for modern browsers
      target: 'ES2020',
      
      // CSS optimizations
      cssCodeSplit: true,
      // cssMinify: 'lightningcss', // Temporarily disable due to compatibility issues
      
      // Chunk size warnings and limits
      chunkSizeWarningLimit: 300,
      
      // Enable module preloading
      modulePreload: {
        polyfill: true,
      },
    },
    
    // Enhanced dependency optimization
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'lucide-react',
        'framer-motion'
      ],
      exclude: ['pg', 'dotenv'],
      esbuildOptions: {
        target: 'ES2020',
      },
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
});
