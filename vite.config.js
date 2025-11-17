/**
 * Vite Configuration for GMS Lightbox System
 * Handles bundling, SCSS compilation, asset copying
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  publicDir: 'assets',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index-lightbox.html')
      }
    },
    // Generate sourcemaps for debugging
    sourcemap: true,
    // Ensure assets are properly copied
    assetsDir: 'assets'
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@modules': resolve(__dirname, 'src/modules'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `// GMS SCSS variables and mixins available globally\n`
      }
    }
  },
  
  server: {
    port: 3000,
    open: true
  }
});
