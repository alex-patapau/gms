# GMS Lightbox - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

This will start the Vite dev server at `http://localhost:3000`

### Step 3: Test the Demo

Open your browser and click the "📄 Open PDF Example" button to test the PDF viewer.

---

## 📁 Project Structure Overview

```
gms/
├── src/                      # Source files
│   ├── core/                 # Core lightbox system
│   │   ├── gms-core.js      # Main logic
│   │   └── gms-core.scss    # Core styles
│   ├── modules/              # Feature modules
│   │   ├── pdf/             # ✅ PDF viewer (fully implemented)
│   │   ├── image/           # 🚧 Image viewer (placeholder)
│   │   ├── video/           # 🚧 Video player (placeholder)
│   │   └── gallery/         # 🚧 Gallery (placeholder)
│   ├── styles/              # Style aggregator
│   └── main.js              # Entry point
├── public/                   # Static files
│   └── index-lightbox.html  # Demo page
├── assets/                   # External libraries
│   ├── pdf.min.mjs          # PDF.js
│   └── pdf.worker.min.mjs   # PDF.js worker
└── dist/                     # Build output (generated)
```

---

## 🎯 How It Works

### 1. Core System (`gms-core.js`)

The core handles:
- Creating the overlay and container
- Opening/closing the lightbox
- Keyboard events (ESC, arrows)
- Parsing `data-glightbox` attributes
- Routing to the correct module based on `data-type`
- Mobile detection

### 2. Module Registration

Each module registers itself:

```javascript
// In gms-pdf.js
import { gmsRegisterModule } from '../core/gms-core.js';

gmsRegisterModule('pdf', gmsPdfRender);
```

### 3. Automatic Activation

The core uses event delegation:

```javascript
// Any element with data-glightbox will work
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-glightbox]');
  if (trigger) {
    gmsOpenLightbox(trigger);
  }
});
```

---

## 🎨 Adding Custom Styles

### Option 1: Override in Your CSS

```css
/* In your own stylesheet */
.gms-lightbox-overlay {
  background: rgba(20, 20, 50, 0.95); /* Dark blue overlay */
}

.gms-pdf-nav-btn {
  background-color: #ff6b6b; /* Red buttons */
}
```

### Option 2: Edit SCSS Variables

```scss
// In src/core/gms-core.scss
$gms-primary-color: #ff6b6b; // Change primary color
$gms-overlay-bg: rgba(0, 0, 0, 0.95); // Darker overlay
```

After editing, the dev server will hot-reload automatically.

---

## 📱 Testing on Mobile

### Method 1: Use Your Phone on Same Network

1. Run `npm run dev`
2. Find your computer's IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
3. On your phone, visit: `http://YOUR_IP:3000`

### Method 2: Browser DevTools

1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select a mobile device preset
4. Test touch gestures with mouse

### What to Test

- ✅ Swipe left/right to navigate PDF pages
- ✅ Pinch to zoom (in browser simulation)
- ✅ Tap close button
- ✅ Tap outside to close
- ✅ Rotate device (portrait/landscape)
- ✅ Test on 320px width (iPhone SE)

---

## 🔧 Build for Production

### Create Production Build

```bash
npm run build
```

This generates optimized files in `dist/`:

```
dist/
├── index-lightbox.html
├── assets/
│   ├── main.[hash].js    # Minified JavaScript
│   ├── main.[hash].css   # Compiled CSS
│   ├── pdf.min.mjs
│   └── pdf.worker.min.mjs
```

### Preview Production Build

```bash
npm run preview
```

Opens a local server with the production build.

### Deploy to Production

Upload the entire `dist/` folder to your web server.

**Important:** Ensure the server serves `.mjs` files with the correct MIME type:
```
application/javascript
```

---

## 🧩 Adding a New Module

Let's create an "audio" module as an example:

### Step 1: Create Module File

Create `src/modules/audio/gms-audio.js`:

```javascript
import { gmsRegisterModule } from '../../core/gms-core.js';

async function gmsAudioRender({ url, title, container }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'gms-audio-viewer';
  
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = url;
  
  wrapper.appendChild(audio);
  container.appendChild(wrapper);
}

gmsRegisterModule('audio', gmsAudioRender);
export { gmsAudioRender };
```

### Step 2: Create Styles (Optional)

Create `src/modules/audio/gms-audio.scss`:

```scss
.gms-audio-viewer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 40px;
  
  audio {
    max-width: 500px;
    width: 100%;
  }
}
```

### Step 3: Import in Main

Edit `src/main.js`:

```javascript
import './modules/audio/gms-audio.js';
```

Edit `src/styles/main.scss`:

```scss
@import './modules/audio/gms-audio.scss';
```

### Step 4: Use in HTML

```html
<a href="song.mp3" 
   data-glightbox 
   data-type="audio"
   data-title="My Song">
  Play Audio
</a>
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"

**Problem:** Import path is wrong

**Solution:** Check relative paths:
```javascript
// ❌ Wrong
import { gmsInitCore } from 'gms-core.js';

// ✅ Correct
import { gmsInitCore } from './core/gms-core.js';
```

---

### Issue: PDF doesn't load

**Problem:** PDF.js files not found

**Solution:** Ensure `assets/` folder is in the correct location and check the import path in `gms-pdf.js`:

```javascript
pdfjsLib = await import('/assets/pdf.min.mjs');
```

---

### Issue: Styles not applied

**Problem:** SCSS not compiling

**Solution:** 
1. Check that `sass` is installed: `npm install sass`
2. Verify import in `main.js`: `import './styles/main.scss'`
3. Restart dev server: `npm run dev`

---

### Issue: Mobile gestures don't work

**Problem:** Testing only in browser, not on real device

**Solution:** Test on actual mobile device (see "Testing on Mobile" section above)

---

## 📊 Performance Tips

### 1. PDF Optimization

The system already implements:
- Canvas caching (avoids re-rendering same page)
- Lazy rendering (only renders visible pages)
- Mobile-optimized scale (2x for crisp text)

### 2. Bundle Size

Current bundle size (minified + gzipped):
- Core: ~15 KB
- PDF module: ~25 KB
- PDF.js: ~500 KB (external)

To reduce size, remove unused modules from `main.js`.

### 3. Image Optimization (Future)

When implementing image module:
- Use responsive images (`srcset`)
- Lazy load images
- Compress images before uploading

---

## 🎓 Understanding the Code

### How Lightbox Opens

1. User clicks element with `data-glightbox`
2. Core's event delegation catches it
3. Core parses attributes: `data-type`, `data-url`, `data-title`
4. Core finds registered module for that type
5. Core creates overlay and container
6. Core calls module's render function
7. Module creates its UI inside container
8. Overlay fades in with animation

### How PDF Renders

1. PDF module imports PDF.js library
2. Loads PDF document from URL
3. Gets total page count
4. Renders all pages to canvas elements
5. Appends canvas elements to container
6. Sets up navigation buttons
7. Attaches scroll listener for page tracking
8. Caches canvas elements for performance

### How Mobile is Detected

```javascript
function gmsDetectMobile() {
  return window.innerWidth <= 768 || ('ontouchstart' in window);
}
```

This checks:
- Screen width (768px or less)
- Touch support (`ontouchstart` exists)

---

## 📝 Checklist for Production

Before deploying:

- [ ] Test on real mobile devices (iOS + Android)
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Test all PDF features (zoom, navigation, scroll)
- [ ] Test keyboard shortcuts (ESC, arrows)
- [ ] Build for production (`npm run build`)
- [ ] Check bundle size (`ls -lh dist/assets/`)
- [ ] Verify no console errors
- [ ] Test with slow network (DevTools throttling)
- [ ] Ensure CORS is configured for PDFs
- [ ] Add error handling for failed PDF loads

---

## 🎉 Next Steps

1. **Implement Image Module**
   - Study `gms-pdf.js` structure
   - Create similar setup for images
   - Add zoom/pan features

2. **Implement Video Module**
   - Support HTML5 video
   - Add YouTube/Vimeo embed detection
   - Create custom controls

3. **Add Tests**
   - Unit tests with Vitest
   - E2E tests with Playwright
   - Mobile testing with BrowserStack

4. **Publish as NPM Package**
   - Set up package.json for publishing
   - Add TypeScript definitions
   - Create documentation site

---

## 💡 Tips & Tricks

### Tip 1: Debugging

Enable verbose logging:
```javascript
// In gms-core.js, add to gmsInitCore():
console.log('[GMS Core] Registered modules:', gmsState.registeredModules);
```

### Tip 2: Programmatic Control

Open lightbox from JavaScript:
```javascript
const link = document.createElement('a');
link.setAttribute('data-type', 'pdf');
link.setAttribute('data-url', 'document.pdf');
gmsOpenLightbox(link);
```

### Tip 3: Custom Events

Listen for lightbox events:
```javascript
document.querySelector('.gms-lightbox-overlay')
  .addEventListener('click', (e) => {
    console.log('Overlay clicked', e.target);
  });
```

### Tip 4: Styling Specificity

If your styles aren't applying, increase specificity:
```css
/* Less specific */
.gms-pdf-nav-btn { }

/* More specific */
.gms-lightbox-container .gms-pdf-nav-btn { }

/* Most specific */
body .gms-lightbox-overlay .gms-pdf-controls .gms-pdf-nav-btn { }
```

---

**Happy coding! 🚀**

For more details, see the main [README.md](README.md)
