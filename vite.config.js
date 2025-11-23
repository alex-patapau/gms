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
    publicDir: 'public',
    
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          // gms: Custom naming for generated files to avoid conflicts
          entryFileNames: 'assets/gms-main-[hash].js',
          chunkFileNames: 'assets/gms-[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // gms: Rename CSS files with gms- prefix
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/gms-main-[hash].css';
            }
            return 'assets/[name]-[hash][extname]';
          }
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
