/**
 * gms-core.js
 * Core module of the GMS (GLightbox Module System) Lightbox System.
 * 
 * Responsibilities:
 * - Global overlay and container management
 * - Lightbox opening/closing lifecycle
 * - Keyboard event handling (ESC, arrows)
 * - Attribute parsing from data-glightbox elements
 * - Media type detection and routing
 * - Event delegation for dynamic elements
 * - Mobile UI adjustments and viewport fixes
 * - Scroll prevention when lightbox is active
 * 
 * This module acts as the orchestrator, delegating specific
 * media rendering to feature modules (PDF, image, video, etc.)
 */

/**
 * Global state for the GMS lightbox system
 * @private
 */
const gmsState = {
  isActive: false,
  currentType: null,
  overlay: null,
  container: null,
  content: null,
  closeBtn: null,
  registeredModules: {},
  currentElement: null,
  originalBodyOverflow: null,
  isMobile: false
};

/**
 * Detect if the device is mobile based on viewport width and touch support
 * @private
 * @returns {boolean} True if device is mobile
 */
function gmsDetectMobile() {
  return window.innerWidth <= 768 || ('ontouchstart' in window);
}

/**
 * Register a content module (PDF, image, video, etc.)
 * Each module must provide a render function.
 * 
 * @param {string} type - Media type identifier (e.g., 'pdf', 'image', 'video')
 * @param {Function} renderFn - Function to render this media type
 * @example
 * gmsRegisterModule('pdf', gmsPdfRender);
 */
export function gmsRegisterModule(type, renderFn) {
  gmsState.registeredModules[type] = renderFn;
  console.log(`[GMS Core] Module registered: ${type}`);
}

/**
 * Create the overlay and container elements for the lightbox
 * This is called once during initialization
 * @private
 */
function gmsCreateOverlay() {
  // gms: Create overlay backdrop
  const overlay = document.createElement('div');
  overlay.className = 'gms-lightbox-overlay';
  overlay.setAttribute('data-gms-overlay', '1');
  
  // gms: Create main lightbox container
  const container = document.createElement('div');
  container.className = 'gms-lightbox-container';
  container.setAttribute('data-gms-container', '1');
  
  // gms: Create content wrapper for media
  const content = document.createElement('div');
  content.className = 'gms-lightbox-content';
  content.setAttribute('data-gms-content', '1');
  
  // gms: Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'gms-lightbox-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close lightbox');
  closeBtn.setAttribute('data-gms-close', '1');
  
  // gms: Assemble structure
  container.appendChild(closeBtn);
  container.appendChild(content);
  overlay.appendChild(container);
  
  // gms: Store references in state
  gmsState.overlay = overlay;
  gmsState.container = container;
  gmsState.content = content;
  gmsState.closeBtn = closeBtn;
  
  // gms: Attach close handlers
  closeBtn.addEventListener('click', gmsCloseLightbox);
  overlay.addEventListener('click', (e) => {
    // gms: Close only if clicking directly on overlay, not container
    if (e.target === overlay) {
      gmsCloseLightbox();
    }
  });
  
  // gms: Add to DOM but keep hidden
  document.body.appendChild(overlay);
}

/**
 * Open the lightbox with specified content
 * Parses element attributes, determines media type,
 * and delegates to appropriate module
 * 
 * @param {HTMLElement} element - Trigger element with data attributes
 * @example
 * <a href="#" data-glightbox data-type="pdf" data-url="file.pdf">Open PDF</a>
 */
export function gmsOpenLightbox(element) {
  if (gmsState.isActive) {
    console.warn('[GMS Core] Lightbox is already active');
    return;
  }
  
  // gms: Update mobile detection on each open
  gmsState.isMobile = gmsDetectMobile();
  
  // gms: Parse attributes from trigger element
  const type = element.getAttribute('data-gms-type') || element.getAttribute('data-type') || 'image';
  const url = element.getAttribute('data-url') || element.getAttribute('href');
  const title = element.getAttribute('data-title') || '';
  
  console.log(`[GMS Core] Opening lightbox: type=${type}, url=${url}`);
  
  // gms: Check if module exists for this type
  const renderFn = gmsState.registeredModules[type];
  if (!renderFn) {
    console.error(`[GMS Core] No module registered for type: ${type}`);
    return;
  }
  
  // gms: Update state
  gmsState.isActive = true;
  gmsState.currentType = type;
  gmsState.currentElement = element;
  
  // gms: Prevent body scroll on mobile
  gmsState.originalBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  
  // gms: Clear previous content
  gmsState.content.innerHTML = '';
  
  // gms: Add mobile class if needed
  if (gmsState.isMobile) {
    gmsState.container.classList.add('gms-mobile');
  } else {
    gmsState.container.classList.remove('gms-mobile');
  }
  
  // gms: Show overlay with fade-in animation
  gmsState.overlay.classList.add('gms-active');
  
  // gms: Delegate rendering to module
  try {
    renderFn({
      url,
      title,
      element,
      container: gmsState.content,
      isMobile: gmsState.isMobile
    });
  } catch (error) {
    console.error(`[GMS Core] Error rendering ${type}:`, error);
    gmsCloseLightbox();
  }
}

/**
 * Close the lightbox and clean up
 * Restores body scroll, removes active classes, clears content
 */
export function gmsCloseLightbox() {
  if (!gmsState.isActive) {
    return;
  }
  
  console.log('[GMS Core] Closing lightbox');
  
  // gms: Restore body scroll
  document.body.style.overflow = gmsState.originalBodyOverflow || '';
  
  // gms: Hide overlay with fade-out animation
  gmsState.overlay.classList.remove('gms-active');
  
  // gms: Clear content after animation
  setTimeout(() => {
    gmsState.content.innerHTML = '';
  }, 300); // Match CSS transition duration
  
  // gms: Reset state
  gmsState.isActive = false;
  gmsState.currentType = null;
  gmsState.currentElement = null;
  
  // gms: Remove mobile class
  gmsState.container.classList.remove('gms-mobile');
}

/**
 * Handle keyboard events for lightbox navigation
 * ESC: close lightbox
 * Arrow keys: delegated to active module if supported
 * @private
 * @param {KeyboardEvent} e - Keyboard event
 */
function gmsHandleKeyboard(e) {
  // gms: Only handle keyboard when lightbox is active
  if (!gmsState.isActive) {
    return;
  }
  
  switch (e.key) {
    case 'Escape':
      // gms: ESC key closes lightbox
      e.preventDefault();
      gmsCloseLightbox();
      break;
      
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowDown':
      // gms: Arrow keys are handled by individual modules
      // Dispatch custom event for modules to listen
      const arrowEvent = new CustomEvent('gms:keypress', {
        detail: { key: e.key, originalEvent: e }
      });
      gmsState.content.dispatchEvent(arrowEvent);
      break;
  }
}

/**
 * Set up event delegation for data-glightbox elements
 * Handles both static and dynamically added elements
 * @private
 */
function gmsSetupEventDelegation() {
  // gms: Use event delegation on document for maximum compatibility
  document.addEventListener('click', (e) => {
    // gms: Find closest element with gms-lightbox class or data-glightbox attribute
    const trigger = e.target.closest('.gms-lightbox, [data-glightbox]');
    
    if (trigger) {
      e.preventDefault();
      gmsOpenLightbox(trigger);
    }
  });
  
  console.log('[GMS Core] Event delegation setup complete');
}

/**
 * Initialize the core lightbox system
 * Call this once when the DOM is ready
 * Sets up overlay, keyboard handlers, and event delegation
 * 
 * @public
 * @returns {void}
 * @example
 * import { gmsInitCore } from './core/gms-core.js';
 * gmsInitCore();
 */
export function gmsInitCore() {
  console.log('[GMS Core] Initializing GMS Lightbox System');
  
  // gms: Detect initial mobile state
  gmsState.isMobile = gmsDetectMobile();
  
  // gms: Create overlay structure
  gmsCreateOverlay();
  
  // gms: Set up keyboard event handlers
  document.addEventListener('keydown', gmsHandleKeyboard);
  
  // gms: Set up event delegation for triggers
  gmsSetupEventDelegation();
  
  // gms: Update mobile detection on resize
  window.addEventListener('resize', () => {
    gmsState.isMobile = gmsDetectMobile();
  });
  
  // gms: Mark as initialized
  document.body.setAttribute('data-gms-ready', '1');
  
  console.log('[GMS Core] Initialization complete');
}

/**
 * Get current lightbox state (useful for debugging or extensions)
 * @returns {Object} Current state object
 */
export function gmsGetState() {
  return { ...gmsState };
}
