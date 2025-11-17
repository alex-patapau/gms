# 🎯 GMS Lightbox System

**Modern, Modular, Mobile-First JavaScript Lightbox Library**

A fully extensible, plugin-based lightbox system built with ES modules, featuring PDF viewing, image galleries, video playback, and more. Designed for seamless embedding on any website without naming conflicts.

---

## ✨ Features

- 🧩 **Modular Architecture** - Plugin-based system with core + feature modules
- 📱 **Mobile-First** - Optimized for iOS Safari, Android Chrome, tablets
- 🎨 **Zero Conflicts** - All classes/functions use `gms-` prefix
- ⚡ **Vite-Powered** - Fast development and optimized production builds
- 📄 **PDF Support** - Full PDF.js integration with zoom, navigation, scroll
- 🎹 **Keyboard Navigation** - ESC to close, arrows for navigation
- 👆 **Touch Gestures** - Swipe navigation on mobile devices
- 📦 **Tree-Shakeable** - Import only what you need
- 📚 **Well Documented** - JSDoc comments throughout
- ♿ **Accessible** - ARIA labels, keyboard support, focus management

---

## 📦 Installation

### Option 1: Development Mode (Recommended)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` to see the demo.

### Option 2: Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory.

### Option 3: Direct Integration

Include the bundled files in your HTML:

```html
<link rel="stylesheet" href="path/to/dist/assets/main.css">
<script type="module" src="path/to/dist/assets/main.js"></script>
```

---

## 🚀 Quick Start

### Basic Usage

Add the `data-glightbox` attribute to any element:

```html
<!-- PDF Example -->
<a href="#" 
   data-glightbox 
   data-type="pdf" 
   data-url="document.pdf"
   data-title="My Document">
  Open PDF
</a>

<!-- Image Example (Coming Soon) -->
<a href="photo.jpg" 
   data-glightbox 
   data-type="image"
   data-title="Sunset Photo">
  View Image
</a>

<!-- Video Example (Coming Soon) -->
<a href="video.mp4" 
   data-glightbox 
   data-type="video">
  Play Video
</a>
```

### Required Attributes

- `data-glightbox` - Marks element as a lightbox trigger
- `data-type` - Media type: `pdf`, `image`, `video`, `gallery`
- `data-url` - URL to the media file (or `href` attribute)

### Optional Attributes

- `data-title` - Title/caption for the media
- `data-gallery` - Gallery group name (for galleries)

---

## 🏗️ Architecture

### Project Structure

```
gms/
├── src/
│   ├── core/
│   │   ├── gms-core.js          # Core lightbox system
│   │   └── gms-core.scss        # Core styles
│   ├── modules/
│   │   ├── pdf/
│   │   │   ├── gms-pdf.js       # PDF viewer module
│   │   │   └── gms-pdf.scss     # PDF styles
│   │   ├── image/
│   │   │   └── gms-image.js     # Image viewer (placeholder)
│   │   ├── video/
│   │   │   └── gms-video.js     # Video player (placeholder)
│   │   └── gallery/
│   │       └── gms-gallery.js   # Gallery viewer (placeholder)
│   ├── styles/
│   │   └── main.scss            # Main stylesheet aggregator
│   └── main.js                  # Entry point
├── public/
│   └── index-lightbox.html      # Demo page
├── assets/
│   ├── pdf.min.mjs              # PDF.js library
│   ├── pdf.worker.min.mjs       # PDF.js worker
│   └── glightbox.min.*          # GLightbox (legacy, not used)
├── vite.config.js               # Vite configuration
└── package.json                 # Project metadata
```

### Module System

The GMS system follows a modular architecture:

#### 1. Core Module (`gms-core.js`)

**Responsibilities:**
- Global overlay and container management
- Lightbox open/close lifecycle
- Keyboard event handling (ESC, arrows)
- Attribute parsing from trigger elements
- Media type detection and routing
- Event delegation for dynamic elements
- Mobile detection and adjustments
- Scroll prevention when active

**Public API:**
```javascript
import { gmsInitCore, gmsRegisterModule, gmsOpenLightbox, gmsCloseLightbox } from './core/gms-core.js';

// Initialize the core system
gmsInitCore();

// Register a custom module
gmsRegisterModule('custom-type', renderFunction);

// Programmatically open lightbox
gmsOpenLightbox(element);

// Programmatically close lightbox
gmsCloseLightbox();
```

#### 2. Feature Modules

Each feature module handles a specific media type:

**PDF Module (`gms-pdf.js`)** ✅ Fully Implemented
- PDF.js library initialization
- Worker setup for background processing
- Multi-page rendering with canvas
- Zoom controls (in/out/reset)
- Page navigation (prev/next/scroll-based)
- Mobile-optimized scaling (2x on mobile)
- Touch gesture support (swipe)
- Canvas caching for performance
- Lazy rendering

**Image Module (`gms-image.js`)** 🚧 Placeholder
- Single image display
- Zoom and pan
- Touch pinch-zoom
- Caption support
- Responsive sizing

**Video Module (`gms-video.js`)** 🚧 Placeholder
- HTML5 video playback
- YouTube/Vimeo embed support
- Custom controls
- Autoplay options

**Gallery Module (`gms-gallery.js`)** 🚧 Placeholder
- Collection browsing
- Thumbnail navigation
- Mixed media support
- Keyboard/swipe navigation

---

## 🎨 Styling

### Naming Convention

**All custom classes use the `gms-` prefix** to avoid conflicts:

- Core: `.gms-lightbox-overlay`, `.gms-lightbox-container`, `.gms-lightbox-close`
- PDF: `.gms-pdf-viewer`, `.gms-pdf-page`, `.gms-pdf-controls`
- Buttons: `.gms-btn`, `.gms-pdf-nav-btn`, `.gms-pdf-zoom-btn`

### Customization

Override styles in your own CSS:

```css
/* Customize overlay background */
.gms-lightbox-overlay {
  background: rgba(0, 0, 0, 0.95);
}

/* Customize button colors */
.gms-pdf-nav-btn {
  background-color: #your-color;
}

/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .gms-pdf-controls {
    padding: 10px;
  }
}
```

### SCSS Variables

Edit `src/core/gms-core.scss` to change global variables:

```scss
$gms-primary-color: #4a6ee0;
$gms-overlay-bg: rgba(0, 0, 0, 0.85);
$gms-transition-speed: 300ms;
```

---

## 📱 Mobile Support

### Supported Platforms

✅ iOS Safari (iOS 12+)  
✅ Android Chrome (Android 6+)  
✅ Mobile Firefox  
✅ Samsung Internet  

### Mobile Features

- **Responsive Scaling**: Content adapts to viewport (320px - 2048px)
- **Touch Gestures**: Swipe left/right for navigation, tap to close
- **Optimized PDF Rendering**: 2x scale on mobile for crisp text
- **Smooth Scrolling**: `-webkit-overflow-scrolling: touch`
- **Viewport Meta**: Handles mobile browser UI (address bar)
- **Touch Targets**: Minimum 44x44px for buttons (iOS HIG)
- **Landscape Support**: Special adjustments for landscape orientation

### Mobile Testing Checklist

- [ ] Test on real devices (not just simulators)
- [ ] Test in both portrait and landscape
- [ ] Test swipe gestures
- [ ] Test zoom controls
- [ ] Test with small screens (320px)
- [ ] Test with tablets (768px+)
- [ ] Test keyboard appearance (iOS Safari)

---

## 🔧 Advanced Usage

### Adding a Custom Module

Create a new module file:

```javascript
// src/modules/custom/gms-custom.js
import { gmsRegisterModule } from '../../core/gms-core.js';

async function gmsCustomRender({ url, title, element, container, isMobile }) {
  console.log('[GMS Custom] Rendering custom content');
  
  // Your rendering logic here
  const customElement = document.createElement('div');
  customElement.className = 'gms-custom-viewer';
  customElement.textContent = 'Custom content: ' + url;
  
  container.appendChild(customElement);
}

// Auto-register the module
(function() {
  gmsRegisterModule('custom', gmsCustomRender);
})();

export { gmsCustomRender };
```

Import it in `main.js`:

```javascript
import './modules/custom/gms-custom.js';
```

Use it in HTML:

```html
<a href="#" 
   data-glightbox 
   data-type="custom" 
   data-url="custom-data">
  Open Custom
</a>
```

### Programmatic Control

```javascript
import { gmsOpenLightbox, gmsCloseLightbox, gmsGetState } from './core/gms-core.js';

// Open lightbox programmatically
const element = document.createElement('a');
element.setAttribute('data-type', 'pdf');
element.setAttribute('data-url', 'document.pdf');
gmsOpenLightbox(element);

// Close programmatically
gmsCloseLightbox();

// Get current state
const state = gmsGetState();
console.log('Lightbox active:', state.isActive);
console.log('Current type:', state.currentType);
```

### Event Listening

Listen for custom events:

```javascript
// Listen for lightbox open
document.addEventListener('gms:open', (e) => {
  console.log('Lightbox opened:', e.detail);
});

// Listen for lightbox close
document.addEventListener('gms:close', (e) => {
  console.log('Lightbox closed');
});
```

---

## 🔨 Build Configuration

### Vite Configuration

Edit `vite.config.js` for custom build settings:

```javascript
export default defineConfig({
  root: './public',
  publicDir: '../assets',
  build: {
    outDir: '../dist',
    sourcemap: true,
    rollupOptions: {
      // Add custom entry points
      input: {
        main: resolve(__dirname, 'public/index-lightbox.html')
      }
    }
  }
});
```

### Build Commands

```bash
# Development server with hot reload
npm run dev

# Production build (minified, optimized)
npm run build

# Preview production build locally
npm run preview
```

### Output Structure

After `npm run build`:

```
dist/
├── index-lightbox.html
├── assets/
│   ├── main.[hash].js        # Bundled JavaScript
│   ├── main.[hash].css       # Compiled styles
│   ├── pdf.min.mjs           # PDF.js library
│   └── pdf.worker.min.mjs    # PDF.js worker
```

---

## 🐛 Troubleshooting

### Common Issues

**Lightbox doesn't open**
- Check console for errors
- Ensure `data-glightbox` attribute is present
- Verify `data-type` matches a registered module
- Check that `gmsInitCore()` is called

**PDF doesn't load**
- Verify PDF.js files are in `/assets/` directory
- Check PDF URL is correct and accessible
- Look for CORS errors in console
- Ensure PDF file is valid

**Styles not working**
- Check that CSS is imported: `import './styles/main.scss'`
- Verify Vite is compiling SCSS (sass package installed)
- Check for CSS class name conflicts

**Mobile not working**
- Test on real device, not just browser resize
- Check viewport meta tag is present
- Verify touch event listeners are attached
- Check for iOS-specific CSS issues

### Debug Mode

Enable verbose logging:

```javascript
// In browser console
localStorage.setItem('gms-debug', 'true');
location.reload();
```

---

## 📚 API Reference

### Core Functions

#### `gmsInitCore()`
Initialize the core lightbox system. Call once when DOM is ready.

**Returns:** `void`

**Example:**
```javascript
import { gmsInitCore } from './core/gms-core.js';
gmsInitCore();
```

---

#### `gmsRegisterModule(type, renderFn)`
Register a new content module.

**Parameters:**
- `type` (string) - Media type identifier
- `renderFn` (Function) - Render function for this type

**Returns:** `void`

**Example:**
```javascript
gmsRegisterModule('pdf', gmsPdfRender);
```

---

#### `gmsOpenLightbox(element)`
Open the lightbox with content from element.

**Parameters:**
- `element` (HTMLElement) - Trigger element with data attributes

**Returns:** `void`

---

#### `gmsCloseLightbox()`
Close the active lightbox.

**Returns:** `void`

---

#### `gmsGetState()`
Get current lightbox state (for debugging/extensions).

**Returns:** `Object` - State object with `isActive`, `currentType`, etc.

---

### PDF Module Functions

#### `gmsPdfRender(params)`
Render a PDF document in the lightbox.

**Parameters:**
- `params.url` (string) - PDF file URL
- `params.title` (string) - PDF title
- `params.element` (HTMLElement) - Trigger element
- `params.container` (HTMLElement) - Content container
- `params.isMobile` (boolean) - Mobile device flag

**Returns:** `Promise<void>`

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test on multiple devices/browsers
5. Commit with descriptive messages
6. Push and create a Pull Request

### Code Style

- Use `gms` prefix for all custom identifiers
- Add JSDoc comments to all public functions
- Include inline comments for complex logic
- Follow existing code structure
- Test on mobile devices

### Adding a New Module

1. Create module file: `src/modules/[name]/gms-[name].js`
2. Create styles: `src/modules/[name]/gms-[name].scss`
3. Implement render function
4. Register module on init
5. Import in `main.js`
6. Add to `main.scss`
7. Update README

---

## 📄 License

MIT License - feel free to use in personal and commercial projects.

---

## 🙏 Credits

- **PDF.js** - Mozilla's PDF rendering library
- **Vite** - Fast build tool and dev server
- **GLightbox** - Original inspiration (not used in final version)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Docs**: This README + inline JSDoc comments

---

## 🗺️ Roadmap

- [x] Core lightbox system
- [x] PDF module with full features
- [x] Mobile optimization
- [x] Touch gestures
- [x] Vite build system
- [x] Comprehensive documentation
- [ ] Image module
- [ ] Video module
- [ ] Gallery module
- [ ] TypeScript definitions
- [ ] Unit tests
- [ ] E2E tests
- [ ] CDN distribution
- [ ] npm package

---

**Built with ❤️ for modern web development**
