/**
 * gms-pdf.js
 * PDF viewer module for the GMS Lightbox System.
 * 
 * Responsibilities:
 * - PDF.js library initialization and worker setup
 * - PDF document loading and parsing
 * - Multi-page rendering with canvas
 * - Page navigation (next/prev/goto)
 * - Zoom controls (in/out/reset)
 * - Scroll-based page tracking
 * - Mobile-optimized rendering (higher scale for crisp text)
 * - Touch gesture support (swipe navigation)
 * - Lazy rendering and canvas caching for performance
 * 
 * This module handles all PDF-specific logic and is loaded
 * by the core when a PDF type is requested.
 */

import { gmsRegisterModule } from '../../core/gms-core.js';

/**
 * PDF.js library (imported from local assets)
 * Using local files to avoid CDN dependencies
 */
let pdfjsLib = null;

/**
 * Module state for current PDF session
 * @private
 */
const gmsPdfState = {
  pdfDoc: null,
  currentPage: 1,
  scale: 1.0,
  container: null,
  pagesContainer: null,
  canvasCache: {},
  renderedPages: new Set(),
  loading: null,
  isMobile: false,
  scrollTimeout: null,
  touchStartX: 0,
  touchStartY: 0
};

/**
 * Initialize PDF.js library and worker
 * This is called once when the module is loaded
 * @private
 * @returns {Promise<void>}
 */
async function gmsInitPdfJs() {
  if (pdfjsLib) {
    return; // Already initialized
  }
  
  try {
    // gms: Import PDF.js from src/lib directory
    pdfjsLib = await import('../../lib/pdf.min.mjs');
    
    // gms: Configure worker from local file using URL constructor
    const workerUrl = new URL('../../lib/pdf.worker.min.mjs', import.meta.url);
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.toString();
    
    console.log('[GMS PDF] PDF.js initialized successfully');
  } catch (error) {
    console.error('[GMS PDF] Failed to initialize PDF.js:', error);
    throw error;
  }
}

/**
 * Render a single PDF page to canvas
 * Uses caching to avoid re-rendering same page/scale
 * 
 * @private
 * @param {number} pageNum - Page number (1-indexed)
 * @returns {Promise<HTMLCanvasElement>} Canvas element with rendered page
 */
async function gmsPdfRenderPage(pageNum) {
  if (!gmsPdfState.pdfDoc) {
    return null;
  }
  
  // gms: Check cache first (key includes scale for invalidation)
  const cacheKey = `${pageNum}_${gmsPdfState.scale}`;
  const cached = gmsPdfState.canvasCache[cacheKey];
  
  if (cached) {
    console.log(`[GMS PDF] Using cached canvas for page ${pageNum}`);
    return cached;
  }
  
  // gms: Get page from PDF document
  const page = await gmsPdfState.pdfDoc.getPage(pageNum);
  
  // gms: Calculate viewport with current scale
  const viewport = page.getViewport({ scale: gmsPdfState.scale });
  
  // gms: Create canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.className = 'gms-pdf-page';
  canvas.setAttribute('data-gms-page', pageNum);
  
  // gms: Render page to canvas
  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };
  
  await page.render(renderContext).promise;
  
  // gms: Cache the canvas
  gmsPdfState.canvasCache[cacheKey] = canvas;
  gmsPdfState.renderedPages.add(pageNum);
  
  console.log(`[GMS PDF] Rendered page ${pageNum} at scale ${gmsPdfState.scale}`);
  
  return canvas;
}

/**
 * Render all pages of the PDF document
 * This allows continuous scrolling through the document
 * On mobile, uses higher initial scale for crisp text
 * 
 * @private
 * @returns {Promise<void>}
 */
async function gmsPdfRenderAllPages() {
  if (!gmsPdfState.pdfDoc) {
    return;
  }
  
  try {
    // gms: Clear previous pages
    gmsPdfState.pagesContainer.innerHTML = '';
    
    // gms: Show loading indicator
    if (gmsPdfState.loading) {
      gmsPdfState.loading.classList.add('gms-active');
    }
    
    // gms: Render all pages sequentially
    for (let pageNum = 1; pageNum <= gmsPdfState.pdfDoc.numPages; pageNum++) {
      const canvas = await gmsPdfRenderPage(pageNum);
      if (canvas) {
        gmsPdfState.pagesContainer.appendChild(canvas);
      }
    }
    
    // gms: Update UI after rendering
    gmsPdfUpdateUI();
    
    // gms: Scroll to current page
    const currentPageElement = gmsPdfState.pagesContainer.querySelector(
      `[data-gms-page="${gmsPdfState.currentPage}"]`
    );
    if (currentPageElement) {
      currentPageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
  } catch (err) {
    console.error('[GMS PDF] Error rendering pages:', err);
  } finally {
    // gms: Hide loading indicator
    if (gmsPdfState.loading) {
      gmsPdfState.loading.classList.remove('gms-active');
    }
  }
}

/**
 * Update UI elements (page counter, button states, zoom level)
 * @private
 */
function gmsPdfUpdateUI() {
  const currentPageSpan = gmsPdfState.container.querySelector('.gms-pdf-current-page');
  const totalPagesSpan = gmsPdfState.container.querySelector('.gms-pdf-total-pages');
  const prevBtn = gmsPdfState.container.querySelector('[data-gms-nav="prev"]');
  const nextBtn = gmsPdfState.container.querySelector('[data-gms-nav="next"]');
  const zoomLevelSpan = gmsPdfState.container.querySelector('.gms-pdf-zoom-level');
  
  if (currentPageSpan) {
    currentPageSpan.textContent = gmsPdfState.currentPage;
  }
  
  if (totalPagesSpan && gmsPdfState.pdfDoc) {
    totalPagesSpan.textContent = gmsPdfState.pdfDoc.numPages;
  }
  
  if (prevBtn) {
    prevBtn.disabled = gmsPdfState.currentPage <= 1;
  }
  
  if (nextBtn && gmsPdfState.pdfDoc) {
    nextBtn.disabled = gmsPdfState.currentPage >= gmsPdfState.pdfDoc.numPages;
  }
  
  if (zoomLevelSpan) {
    zoomLevelSpan.textContent = `${Math.round(gmsPdfState.scale * 100)}%`;
  }
}

/**
 * Update current page based on scroll position
 * Finds the page closest to the center of the viewport
 * @private
 */
function gmsPdfUpdateCurrentPageFromScroll() {
  if (!gmsPdfState.pdfDoc) {
    return;
  }
  
  const contentContainer = gmsPdfState.container.querySelector('.gms-pdf-content');
  if (!contentContainer) {
    return;
  }
  
  const scrollTop = contentContainer.scrollTop;
  const containerHeight = contentContainer.clientHeight;
  
  // gms: Find page closest to viewport center
  let bestPage = 1;
  let bestDistance = Infinity;
  
  for (let pageNum = 1; pageNum <= gmsPdfState.pdfDoc.numPages; pageNum++) {
    const pageElement = gmsPdfState.pagesContainer.querySelector(
      `[data-gms-page="${pageNum}"]`
    );
    
    if (pageElement) {
      const pageTop = pageElement.offsetTop - gmsPdfState.pagesContainer.offsetTop;
      const pageHeight = pageElement.offsetHeight;
      const pageCenter = pageTop + pageHeight / 2;
      const viewportCenter = scrollTop + containerHeight / 2;
      const distance = Math.abs(pageCenter - viewportCenter);
      
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPage = pageNum;
      }
    }
  }
  
  // gms: Update current page if changed
  if (bestPage !== gmsPdfState.currentPage) {
    gmsPdfState.currentPage = bestPage;
    gmsPdfUpdateUI();
  }
}

/**
 * Navigate to a specific page
 * @private
 * @param {number} pageNum - Target page number
 */
function gmsPdfGoToPage(pageNum) {
  if (!gmsPdfState.pdfDoc) {
    return;
  }
  
  // gms: Clamp page number to valid range
  pageNum = Math.max(1, Math.min(pageNum, gmsPdfState.pdfDoc.numPages));
  
  gmsPdfState.currentPage = pageNum;
  
  // gms: Scroll to page
  const pageElement = gmsPdfState.pagesContainer.querySelector(
    `[data-gms-page="${pageNum}"]`
  );
  
  if (pageElement) {
    pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  gmsPdfUpdateUI();
}

/**
 * Change zoom level and re-render
 * Clears canvas cache to force re-render at new scale
 * @private
 * @param {number} newScale - New scale value
 */
async function gmsPdfSetZoom(newScale) {
  // gms: Clamp zoom to reasonable range
  newScale = Math.max(0.5, Math.min(3.0, newScale));
  
  if (newScale === gmsPdfState.scale) {
    return;
  }
  
  gmsPdfState.scale = newScale;
  
  // gms: Clear cache to force re-render at new scale
  gmsPdfState.canvasCache = {};
  gmsPdfState.renderedPages.clear();
  
  // gms: Re-render all pages
  await gmsPdfRenderAllPages();
}

/**
 * Create PDF viewer UI structure
 * Includes header, content area, and controls footer
 * @private
 * @param {string} title - PDF title
 * @returns {HTMLElement} Complete PDF viewer structure
 */
function gmsPdfCreateUI(title) {
  const wrapper = document.createElement('div');
  wrapper.className = 'gms-pdf-viewer';
  
  // gms: Header with title
  const header = document.createElement('div');
  header.className = 'gms-pdf-header';
  header.innerHTML = `
    <h2 class="gms-pdf-title">${title || 'PDF Document'}</h2>
  `;
  
  // gms: Content area with loading indicator and pages container
  const content = document.createElement('div');
  content.className = 'gms-pdf-content';
  content.innerHTML = `
    <div class="gms-pdf-loading">Loading PDF...</div>
    <div class="gms-pdf-pages-container"></div>
  `;
  
  // gms: Controls footer with zoom and navigation
  const controls = document.createElement('div');
  controls.className = 'gms-pdf-controls';
  controls.innerHTML = `
    <div class="gms-pdf-zoom-controls">
      <button class="gms-pdf-zoom-btn" data-gms-zoom="out" aria-label="Zoom out">−</button>
      <span class="gms-pdf-zoom-level">100%</span>
      <button class="gms-pdf-zoom-btn" data-gms-zoom="in" aria-label="Zoom in">+</button>
      <button class="gms-pdf-zoom-btn" data-gms-zoom="reset" aria-label="Reset zoom">Reset</button>
    </div>
    <div class="gms-pdf-navigation">
      <button class="gms-pdf-nav-btn" data-gms-nav="prev" disabled aria-label="Previous page">← Prev</button>
      <span class="gms-pdf-page-info">
        Page <span class="gms-pdf-current-page">1</span> of <span class="gms-pdf-total-pages">?</span>
      </span>
      <button class="gms-pdf-nav-btn" data-gms-nav="next" aria-label="Next page">Next →</button>
    </div>
  `;
  
  // gms: Assemble structure
  wrapper.appendChild(header);
  wrapper.appendChild(content);
  wrapper.appendChild(controls);
  
  return wrapper;
}

/**
 * Set up event handlers for PDF controls
 * Handles navigation, zoom, scroll tracking, touch gestures, keyboard
 * @private
 */
function gmsPdfSetupEventHandlers() {
  // gms: Navigation buttons
  const prevBtn = gmsPdfState.container.querySelector('[data-gms-nav="prev"]');
  const nextBtn = gmsPdfState.container.querySelector('[data-gms-nav="next"]');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      gmsPdfGoToPage(gmsPdfState.currentPage - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      gmsPdfGoToPage(gmsPdfState.currentPage + 1);
    });
  }
  
  // gms: Zoom buttons
  const zoomInBtn = gmsPdfState.container.querySelector('[data-gms-zoom="in"]');
  const zoomOutBtn = gmsPdfState.container.querySelector('[data-gms-zoom="out"]');
  const zoomResetBtn = gmsPdfState.container.querySelector('[data-gms-zoom="reset"]');
  
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      gmsPdfSetZoom(gmsPdfState.scale + 0.25);
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      gmsPdfSetZoom(gmsPdfState.scale - 0.25);
    });
  }
  
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      const defaultScale = gmsPdfState.isMobile ? 2.0 : 1.0;
      gmsPdfSetZoom(defaultScale);
    });
  }
  
  // gms: Scroll tracking for page updates
  const contentContainer = gmsPdfState.container.querySelector('.gms-pdf-content');
  if (contentContainer) {
    contentContainer.addEventListener('scroll', () => {
      // gms: Debounce scroll updates for performance
      clearTimeout(gmsPdfState.scrollTimeout);
      gmsPdfState.scrollTimeout = setTimeout(() => {
        gmsPdfUpdateCurrentPageFromScroll();
      }, 100);
    });
    
    // gms: Enable smooth scrolling on mobile
    if (gmsPdfState.isMobile) {
      contentContainer.style.webkitOverflowScrolling = 'touch';
    }
  }
  
  // gms: Touch gestures for mobile swipe navigation
  if (gmsPdfState.isMobile && gmsPdfState.pagesContainer) {
    gmsPdfState.pagesContainer.addEventListener('touchstart', (e) => {
      gmsPdfState.touchStartX = e.touches[0].clientX;
      gmsPdfState.touchStartY = e.touches[0].clientY;
    });
    
    gmsPdfState.pagesContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - gmsPdfState.touchStartX;
      const deltaY = touchEndY - gmsPdfState.touchStartY;
      
      // gms: Detect horizontal swipe (ignore if vertical scroll)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // gms: Swipe right = previous page
          gmsPdfGoToPage(gmsPdfState.currentPage - 1);
        } else {
          // gms: Swipe left = next page
          gmsPdfGoToPage(gmsPdfState.currentPage + 1);
        }
      }
    });
  }
  
  // gms: Keyboard navigation (listen for core events)
  gmsPdfState.container.addEventListener('gms:keypress', (e) => {
    const { key } = e.detail;
    
    switch (key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        gmsPdfGoToPage(gmsPdfState.currentPage - 1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        gmsPdfGoToPage(gmsPdfState.currentPage + 1);
        break;
    }
  });
}

/**
 * Main render function for PDF module
 * Called by core when a PDF type is opened
 * 
 * @param {Object} params - Render parameters
 * @param {string} params.url - PDF file URL
 * @param {string} params.title - PDF title
 * @param {HTMLElement} params.element - Trigger element
 * @param {HTMLElement} params.container - Lightbox content container
 * @param {boolean} params.isMobile - Mobile device flag
 * @returns {Promise<void>}
 */
async function gmsPdfRender({ url, title, element, container, isMobile }) {
  console.log(`[GMS PDF] Rendering PDF: ${url}`);
  
  // gms: Initialize PDF.js if needed
  await gmsInitPdfJs();
  
  // gms: Reset module state
  gmsPdfState.pdfDoc = null;
  gmsPdfState.currentPage = 1;
  gmsPdfState.scale = isMobile ? 2.0 : 1.0; // Higher scale on mobile for crisp text
  gmsPdfState.container = container;
  gmsPdfState.canvasCache = {};
  gmsPdfState.renderedPages.clear();
  gmsPdfState.isMobile = isMobile;
  
  // gms: Create UI structure
  const pdfViewer = gmsPdfCreateUI(title);
  container.appendChild(pdfViewer);
  
  // gms: Store references to key elements
  gmsPdfState.pagesContainer = container.querySelector('.gms-pdf-pages-container');
  gmsPdfState.loading = container.querySelector('.gms-pdf-loading');
  
  // gms: Set up event handlers
  gmsPdfSetupEventHandlers();
  
  // gms: Load PDF document
  try {
    if (gmsPdfState.loading) {
      gmsPdfState.loading.classList.add('gms-active');
    }
    
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    
    gmsPdfState.pdfDoc = pdf;
    
    console.log(`[GMS PDF] PDF loaded: ${pdf.numPages} pages`);
    
    // gms: Render all pages
    await gmsPdfRenderAllPages();
    
  } catch (error) {
    console.error('[GMS PDF] Error loading PDF:', error);
    
    if (gmsPdfState.loading) {
      gmsPdfState.loading.textContent = 'Error loading PDF';
      gmsPdfState.loading.classList.add('gms-error');
    }
  }
}

/**
 * Initialize and register the PDF module
 * Called when module is imported
 */
(function gmsPdfInit() {
  console.log('[GMS PDF] PDF module loaded');
  gmsRegisterModule('pdf', gmsPdfRender);
})();

export { gmsPdfRender };
