/**
 * Vite Configuration for GMS Lightbox System
 * Handles bundling, SCSS compilation, asset copying
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isDebug = mode === 'debug';
  
  return {
    root: './',
    publicDir: 'public',
    
    build: {
      outDir: isDebug ? 'dist-debug' : 'dist',
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
          },
          // gms: Manual chunks for code splitting
          manualChunks: (id) => {
            // Split PDF.js library and module into separate chunk
            if (id.includes('pdf.min.mjs') || id.includes('modules/pdf/gms-pdf.js')) {
              return 'pdf.min';
            }
          }
        }
      },
      // gms: Generate sourcemaps in development and debug modes
      sourcemap: isDev || isDebug,
      // Ensure assets are properly copied
      assetsDir: 'assets',
      
      // gms: Minification settings
      minify: isDev ? false : 'terser',
      terserOptions: isDev ? {} : (isDebug ? {
        // Debug mode: minify but keep console and comments
        compress: {
          drop_console: false,        // Keep all console.log
          drop_debugger: false,       // Keep debugger statements
          pure_funcs: []              // Don't remove any functions
        },
        mangle: false,                // Don't mangle variable names
        format: {
          comments: 'all',            // Keep all comments
          beautify: true              // Pretty output for readability
        }
      } : {
        // Production mode: full minification
        compress: {
          drop_console: false,        // Keep console.log
          drop_debugger: true,        // Remove debugger statements
          pure_funcs: ['console.debug'] // Remove console.debug only
        }
      })
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
  
  // gms: Custom plugin to copy PDF worker to assets directory
  plugins: [
    {
      name: 'copy-pdf-worker',
      closeBundle() {
        const outDir = isDebug ? 'dist-debug' : 'dist';
        const workerSrc = resolve(__dirname, 'src/lib/pdf.worker.min.mjs');
        const workerDest = resolve(__dirname, outDir, 'assets/pdf.worker.min.mjs');
        
        try {
          mkdirSync(dirname(workerDest), { recursive: true });
          copyFileSync(workerSrc, workerDest);
          console.log(`[GMS] PDF worker copied to ${outDir}/assets/`);
        } catch (err) {
          console.error('[GMS] Failed to copy PDF worker:', err);
        }
      }
    }
  ],
  
  server: {
    port: 3000,
    open: true
  }
  };
});
