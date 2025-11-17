# GMS Lightbox - Quick Reference

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📝 Basic Usage

```html
<a href="document.pdf" 
   data-glightbox 
   data-type="pdf"
   data-title="My PDF">
  Open PDF
</a>
```

## 🎨 Available Data Types

| Type | Status | Description |
|------|--------|-------------|
| `pdf` | ✅ Working | PDF documents |
| `image` | 🚧 Coming Soon | Images (JPG, PNG, etc.) |
| `video` | 🚧 Coming Soon | Videos (MP4, YouTube) |
| `gallery` | 🚧 Coming Soon | Image collections |

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ESC` | Close lightbox |
| `←` / `→` | Navigate pages (PDF) |
| `↑` / `↓` | Navigate pages (PDF) |

## 👆 Touch Gestures

| Gesture | Action |
|---------|--------|
| **Swipe left** | Next page |
| **Swipe right** | Previous page |
| **Tap outside** | Close lightbox |
| **Tap close button** | Close lightbox |

## 🔧 NPM Commands

```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview production build (port 4173)
```

## 📁 Project Structure

```
src/
├── core/          # Core lightbox system
├── modules/       # Feature modules (pdf, image, etc.)
├── styles/        # SCSS files
└── main.js        # Entry point

public/
└── index-lightbox.html  # Demo page

dist/              # Build output (generated)
```

## 🎯 Core API

```javascript
import { 
  gmsInitCore,        // Initialize system
  gmsRegisterModule,  // Register custom module
  gmsOpenLightbox,    // Open programmatically
  gmsCloseLightbox    // Close programmatically
} from './core/gms-core.js';
```

## 🎨 CSS Classes (All use `gms-` prefix)

**Core:**
- `.gms-lightbox-overlay` - Main overlay
- `.gms-lightbox-container` - Content container
- `.gms-lightbox-close` - Close button

**PDF:**
- `.gms-pdf-viewer` - PDF wrapper
- `.gms-pdf-page` - Individual page canvas
- `.gms-pdf-controls` - Control buttons
- `.gms-pdf-nav-btn` - Navigation buttons
- `.gms-pdf-zoom-btn` - Zoom buttons

## 🔧 Customization

```css
/* Override in your CSS */
.gms-lightbox-overlay {
  background: rgba(0, 0, 0, 0.95);
}

.gms-pdf-nav-btn {
  background-color: #your-color;
}
```

## 📱 Mobile Support

**Supported:**
- ✅ iOS Safari (iOS 12+)
- ✅ Android Chrome (Android 6+)
- ✅ 320px - 2048px+ screens
- ✅ Portrait & landscape

**Features:**
- 2x scale on mobile for crisp PDF text
- Touch gestures (swipe)
- Responsive controls
- 44px minimum touch targets

## 🐛 Troubleshooting

**Lightbox won't open:**
```javascript
// Check console for errors
// Verify data-glightbox attribute exists
// Confirm gmsInitCore() was called
```

**PDF won't load:**
```javascript
// Check PDF URL is correct
// Verify PDF.js files in assets/
// Check for CORS errors in console
```

**Styles not working:**
```bash
# Ensure sass is installed
npm install sass

# Restart dev server
npm run dev
```

## 📚 Documentation

- **README.md** - Full documentation (500+ lines)
- **GUIDE.md** - Quick start guide (400+ lines)
- **SUMMARY.md** - Project overview
- **VALIDATION.md** - Build validation
- **Inline JSDoc** - In source code

## 🎯 Adding Custom Module

```javascript
// 1. Create module file
// src/modules/custom/gms-custom.js
import { gmsRegisterModule } from '../../core/gms-core.js';

function gmsCustomRender({ url, title, container }) {
  // Your rendering logic
  const div = document.createElement('div');
  div.textContent = 'Custom content: ' + url;
  container.appendChild(div);
}

gmsRegisterModule('custom', gmsCustomRender);

// 2. Import in main.js
import './modules/custom/gms-custom.js';

// 3. Use in HTML
<a href="#" data-glightbox data-type="custom" data-url="data">
  Open Custom
</a>
```

## 📊 Bundle Sizes

| Component | Size | Gzipped |
|-----------|------|---------|
| Core JS | 13.51 KB | 4.21 KB |
| Core CSS | 7.50 KB | 1.84 KB |
| PDF.js | 443.16 KB | 130.03 KB |

## 🎨 Naming Convention

**Everything uses `gms` prefix:**
- Functions: `gmsInitCore()`, `gmsOpenLightbox()`
- CSS: `.gms-lightbox-overlay`, `.gms-pdf-page`
- Data attributes: `data-gms-ready`, `data-gms-page`
- State: `gmsState`, `gmsPdfState`

## ⚡ Performance Tips

1. **PDF.js is lazy-loaded** (only when PDF opens)
2. **Canvas caching** (avoids re-rendering)
3. **Source maps** (for debugging)
4. **Minified** (production build)
5. **Gzipped** (70%+ compression)

## 🚀 Deployment

```bash
# 1. Build
npm run build

# 2. Deploy dist/ folder to your server
# - Netlify: drag and drop
# - Vercel: connect Git repo
# - FTP: upload dist/ contents
```

## 📞 Quick Help

**Build fails?**
- Check Node.js version (18+)
- Delete `node_modules`, run `npm install`
- Check console for specific error

**Runtime error?**
- Open browser console (F12)
- Check for red error messages
- Verify file paths are correct

**Mobile not working?**
- Test on real device, not just browser resize
- Check touch event listeners
- Verify viewport meta tag

## 🎯 Next Steps

1. **Test the demo:** `npm run dev`
2. **Read docs:** See README.md
3. **Customize:** Edit SCSS variables
4. **Deploy:** Build and upload

---

**Need more help?** See full documentation in README.md

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**License:** MIT
