import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  // Ensure Vite correctly handles base paths
  base: '/',
  // Improve build output
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Improve chunking strategy
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  // Resolve path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  // Handle server redirects for SPA
  server: {
    historyApiFallback: true,
  },
});