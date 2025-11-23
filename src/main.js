/**
 * main.js
 * Entry point for the GMS Lightbox System
 * 
 * This is the main file that initializes the entire lightbox system.
 * It imports the core module and all feature modules, then starts the system.
 * 
 * Usage:
 * <script type="module" src="js/main.js"></script>
 * 
 * The system will automatically activate on elements with [data-glightbox] attribute.
 */

// gms: Import core system
import { gmsInitCore } from './core/gms-core.js';

// gms: Import feature modules with dynamic import for code splitting
// PDF module is loaded dynamically to create a separate chunk
import('./modules/pdf/gms-pdf.js');

// gms: Other modules (placeholder - can be loaded dynamically too)
import './modules/image/gms-image.js';
import './modules/video/gms-video.js';
import './modules/gallery/gms-gallery.js';

// gms: Import styles
import './styles/main.scss';

/**
 * Initialize the GMS Lightbox System when DOM is ready
 */
function gmsInit() {
  console.log('[GMS] Starting GMS Lightbox System initialization...');
  
  // gms: Initialize core lightbox functionality
  gmsInitCore();
  
  console.log('[GMS] GMS Lightbox System ready!');
}

// gms: Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', gmsInit);
} else {
  // DOM is already ready
  gmsInit();
}

// gms: Export init function for manual initialization if needed
export { gmsInit };
