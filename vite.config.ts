import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        middlewareMode: false,
        fs: {
          allow: ['..'],
        },
      },
      preview: {
        port: 4173,
        host: '0.0.0.0',
      },
      plugins: [
        react({
          jsxRuntime: 'automatic',
        }),
        visualizer({
          filename: 'dist/stats.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY),
        'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
      },
      base: '/',
      build: {
        target: 'ES2022',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: mode === 'production',
            drop_debugger: true,
          },
          format: {
            comments: false,
          },
        },
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('react')) return 'vendor-react';
                if (id.includes('google') || id.includes('genai')) return 'vendor-gemini';
                if (id.includes('framer')) return 'vendor-motion';
                if (id.includes('three')) return 'vendor-three';
                return 'vendor';
              }
              if (id.includes('services')) return 'services';
              if (id.includes('components')) return 'components';
            },
            entryFileNames: 'js/[name]-[hash].js',
            chunkFileNames: 'js/[name]-[hash].js',
            assetFileNames: ({ name }) => {
              if (name?.endsWith('.css')) return 'css/[name]-[hash][extname]';
              return '[name]-[hash][extname]';
            },
          },
        },
        reportCompressedSize: true,
        chunkSizeWarningLimit: 800,
        sourcemap: false,
        cssCodeSplit: true,
        assetsInlineLimit: 4096,
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'framer-motion'],
        exclude: ['@google/genai'],
      },
    };
});
