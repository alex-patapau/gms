/**
 * Vite Configuration for GMS Lightbox System
 * Handles bundling, SCSS compilation, asset copying
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
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
      // gms: Generate sourcemaps only in development
      sourcemap: isDev,
      // Ensure assets are properly copied
      assetsDir: 'assets',
      
      // gms: Minification settings for production
      minify: isDev ? false : 'terser',
      terserOptions: isDev ? {} : {
        compress: {
          drop_console: false,    // Keep console.log
          drop_debugger: true,    // Remove debugger statements
          pure_funcs: ['console.debug'] // Remove console.debug only
        }
      }
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
  };
});
