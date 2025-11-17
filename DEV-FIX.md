# Dev Server Fix - November 18, 2025

## Issue
Dev server was failing with error:
```
Pre-transform error: Failed to load url /src/main.js
```

## Root Cause
Vite's `root` configuration was set to `./public`, which made file resolution incorrect.

## Solution Applied

### 1. Updated `vite.config.js`
```javascript
// Before:
root: './public',
publicDir: '../assets',

// After:
root: './',
publicDir: 'assets',
```

### 2. Updated `public/index-lightbox.html`
```html
<!-- Correct absolute path -->
<script type="module" src="/src/main.js"></script>
```

### 3. Updated `src/modules/pdf/gms-pdf.js`
```javascript
// Assets are served from public directory at root
pdfjsLib = await import('/pdf.min.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
```

## Result
✅ Dev server runs successfully at `http://localhost:3000/`
✅ All files resolve correctly
✅ PDF.js assets accessible

## How to Use

### Development:
```bash
npm run dev
# Visit: http://localhost:3000/public/index-lightbox.html
```

### Production Build:
```bash
npm run build
# Output: dist/
```

## File Resolution in Dev Mode

With root set to `./`:
- `/src/main.js` → `./src/main.js` ✅
- `/pdf.min.mjs` → `./assets/pdf.min.mjs` ✅ (publicDir)
- `/uvvnvdywkmxfnrs6dy2pmbmqgki4ottr.pdf` → `./assets/...pdf` ✅

## Status
✅ Fixed and working
✅ Dev server operational
✅ Build still works correctly
