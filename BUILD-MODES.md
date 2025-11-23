# 🔨 GMS Build Modes

## Режимы сборки

### 1️⃣ Development (`npm run dev`)
**Для разработки с hot reload**

```bash
npm run dev
```

- ✅ Vite dev server на `http://localhost:3000/`
- ✅ Hot Module Replacement (HMR)
- ✅ Source maps включены
- ✅ Без минификации
- ✅ Все console.log активны
- 📁 Файлы не собираются в dist

---

### 2️⃣ Production (`npm run build`)
**Для продакшн-деплоя**

```bash
npm run build
```

- ✅ Полная минификация с Terser
- ✅ Source maps отключены
- ✅ console.log сохранены (для мониторинга)
- ✅ console.debug удалены
- ✅ debugger удалены
- 📁 Результат в `dist/`

**Размеры файлов:**
- `gms-main-*.js` — ~14 KB
- `gms-pdf.min-*.js` — ~437 KB
- `gms-main-*.css` — ~7.5 KB

---

### 3️⃣ Debug (`npm run build-debug`)
**Для отладки в продакшн-окружении (например, в Битриксе)**

```bash
npm run build-debug
```

- ✅ Минификация с сохранением читаемости
- ✅ Source maps включены (.js.map файлы)
- ✅ Все console.log сохранены
- ✅ debugger сохранены
- ✅ Комментарии сохранены
- ✅ Имена переменных НЕ обфусцированы (mangle: false)
- ✅ Код красиво отформатирован (beautify: true)
- 📁 Результат в `dist-debug/`

**Размеры файлов:**
- `gms-main-*.js` — ~22 KB (+8 KB)
- `gms-main-*.js.map` — ~46 KB (source map)
- `gms-pdf.min-*.js` — ~755 KB (+318 KB)
- `gms-pdf.min-*.js.map` — ~1 MB (source map)

---

## 📦 Структура папок после сборки

### Production build (`dist/`)
```
dist/
├── index.html
├── uvvnvdywkmxfnrs6dy2pmbmqgki4ottr.pdf
└── assets/
    ├── gms-main-[hash].js        (14 KB, минимизирован)
    ├── gms-main-[hash].css       (7.5 KB)
    ├── gms-pdf.min-[hash].js     (437 KB)
    └── pdf.worker.min-[hash].mjs (1 MB)
```

### Debug build (`dist-debug/`)
```
dist-debug/
├── index.html
├── uvvnvdywkmxfnrs6dy2pmbmqgki4ottr.pdf
└── assets/
    ├── gms-main-[hash].js        (22 KB, читаемый)
    ├── gms-main-[hash].js.map    (46 KB, source map)
    ├── gms-main-[hash].css       (7.5 KB)
    ├── gms-pdf.min-[hash].js     (755 KB, читаемый)
    ├── gms-pdf.min-[hash].js.map (1 MB, source map)
    └── pdf.worker.min-[hash].mjs (1 MB)
```

---

## 🔍 Использование debug build в Битриксе

### Шаг 1: Соберите debug версию
```bash
npm run build-debug
```

### Шаг 2: Скопируйте файлы в Битрикс
```bash
# Скопируйте содержимое dist-debug/ в:
local/templates/adaptive_template/components/gms/
```

### Шаг 3: Подключите в template.php
```php
<?php
$componentPath = '/local/templates/adaptive_template/components/gms/';
?>

<!-- Подключаем стили -->
<link rel="stylesheet" href="<?= $componentPath ?>assets/gms-main-[hash].css">

<!-- Подключаем скрипт -->
<script type="module" src="<?= $componentPath ?>assets/gms-main-[hash].js"></script>
```

### Шаг 4: Добавьте HTML триггер
```html
<a href="/path/to/file.pdf" 
   class="gms-lightbox" 
   data-gms-type="pdf">
    Открыть PDF
</a>
```

### Шаг 5: Откройте консоль браузера (F12)

Вы увидите подробные логи:
```
[GMS Core] Initializing GMS Lightbox System
[GMS Core] Event delegation setup complete
[GMS Core] Initialization complete
[GMS Core] Opening lightbox...
[GMS Core] Content details: {type: "pdf", url: "/path/to/file.pdf", title: ""}
[GMS Core] Using module: pdf
[GMS PDF] Rendering PDF...
```

---

## 🐛 Отладка проблем

### Проблема: Всплывающее окно не открывается

1. **Проверьте инициализацию:**
```javascript
// В консоли браузера:
console.log(typeof gmsInitCore); // должно быть "function"
```

2. **Проверьте атрибуты элемента:**
```html
<!-- Правильно: -->
<a href="/file.pdf" class="gms-lightbox" data-gms-type="pdf">PDF</a>

<!-- Или альтернатива: -->
<a href="/file.pdf" data-glightbox data-type="pdf">PDF</a>
```

3. **Проверьте Network tab в DevTools:**
   - Все файлы должны загрузиться с кодом 200
   - Проверьте пути к assets/

4. **Проверьте Console tab:**
   - Есть ли ошибки (красные сообщения)?
   - Видны ли логи `[GMS Core]`?

### Проблема: 404 Not Found для assets

Проверьте пути в HTML:
```html
<!-- Неправильно: -->
<script src="/assets/gms-main.js"></script>

<!-- Правильно: -->
<script src="/local/templates/adaptive_template/components/gms/assets/gms-main-[hash].js"></script>
```

---

## 📊 Сравнение режимов

| Параметр | Development | Production | Debug |
|----------|-------------|------------|-------|
| **Hot Reload** | ✅ Да | ❌ Нет | ❌ Нет |
| **Минификация** | ❌ Нет | ✅ Полная | ⚠️ Частичная |
| **Source Maps** | ✅ Да | ❌ Нет | ✅ Да |
| **console.log** | ✅ Все | ✅ Основные | ✅ Все |
| **debugger** | ✅ Да | ❌ Нет | ✅ Да |
| **Комментарии** | ✅ Да | ❌ Нет | ✅ Да |
| **Читаемость** | ✅✅✅ | ❌ | ✅✅ |
| **Размер файлов** | N/A | 🟢 Маленький | 🟡 Средний |
| **Скорость загрузки** | N/A | 🟢 Быстро | 🟡 Средне |
| **Отладка** | ✅✅✅ | ⚠️ Сложно | ✅✅ |
| **Для продакшена** | ❌ | ✅ | ⚠️ Только для отладки |

---

## 🚀 Рекомендации

### Для разработки:
```bash
npm run dev
```

### Для деплоя на сайт:
```bash
npm run build
```

### Для отладки проблем на боевом сервере:
```bash
npm run build-debug
# Временно замените файлы из dist-debug/
# После отладки верните обычный build
```

---

## ⚙️ Настройка конфигурации

Все настройки в `vite.config.js`:

```javascript
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isDebug = mode === 'debug';
  
  return {
    build: {
      outDir: isDebug ? 'dist-debug' : 'dist',
      sourcemap: isDev || isDebug,
      minify: isDev ? false : 'terser',
      terserOptions: isDebug ? {
        compress: { drop_console: false, drop_debugger: false },
        mangle: false,
        format: { comments: 'all', beautify: true }
      } : { /* production settings */ }
    }
  };
});
```

---

## 📝 Примечания

1. **Debug build НЕ предназначен для постоянного использования** на продакшене из-за большего размера файлов

2. **Source maps** содержат исходный код — не загружайте их на публичный сервер в production

3. **Git игнорирует** обе папки `dist/` и `dist-debug/` (см. `.gitignore`)

4. При изменении кода нужно **пересобирать** проект:
   ```bash
   npm run build        # для production
   npm run build-debug  # для отладки
   ```

---

Создано для GMS Lightbox System
