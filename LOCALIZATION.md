# 🌍 Localization / Локализация

GMS Lightbox PDF Viewer автоматически определяет язык браузера и показывает интерфейс на соответствующем языке.

## 🎯 Поддерживаемые языки

| Язык | Код | Пример |
|------|-----|--------|
| **English** | `en` | Page 1 of 5, Reset, Prev, Next |
| **Русский** | `ru` | Страница 1 из 5, Сброс, Назад, Вперёд |
| **Українська** | `uk` | Сторінка 1 з 5, Скинути, Назад, Вперед |
| **Deutsch** | `de` | Seite 1 von 5, Zurücksetzen, Zurück, Weiter |
| **Français** | `fr` | Page 1 sur 5, Réinit, Préc, Suiv |
| **Español** | `es` | Página 1 de 5, Restablecer, Anterior, Siguiente |

## 📋 Переведённые элементы

### Индикатор загрузки
- 🇬🇧 `Loading PDF...`
- 🇷🇺 `Загрузка PDF...`
- 🇺🇦 `Завантаження PDF...`
- 🇩🇪 `PDF wird geladen...`
- 🇫🇷 `Chargement PDF...`
- 🇪🇸 `Cargando PDF...`

### Навигация по страницам
```
[← Prev] Page 1 of 5 [Next →]
[← Назад] Страница 1 из 5 [Вперёд →]
[← Назад] Сторінка 1 з 5 [Вперед →]
[← Zurück] Seite 1 von 5 [Weiter →]
[← Préc] Page 1 sur 5 [Suiv →]
[← Anterior] Página 1 de 5 [Siguiente →]
```

### Управление масштабом
```
[-] [100%] [+] [Reset]
[-] [100%] [+] [Сброс]
[-] [100%] [+] [Скинути]
[-] [100%] [+] [Zurücksetzen]
[-] [100%] [+] [Réinit]
[-] [100%] [+] [Restablecer]
```

## 🔧 Как это работает

### Автоматическое определение языка

```javascript
// Система автоматически определяет язык из браузера
navigator.language // например: "ru-RU", "en-US", "uk-UA"

// Берётся первая часть до дефиса
language.split('-')[0] // "ru", "en", "uk"

// Если язык не найден, используется английский
```

### Смена языка

Язык определяется один раз при открытии PDF. Чтобы увидеть другой язык:

**В Chrome/Edge:**
1. Settings → Languages
2. Add language или переместите нужный язык вверх
3. Перезагрузите страницу

**В Firefox:**
1. Settings → General → Language
2. Choose your preferred language
3. Перезагрузите страницу

**В Safari:**
1. System Preferences → Language & Region
2. Preferred Languages
3. Перезагрузите браузер

## 💻 Добавление нового языка

Откройте `src/modules/pdf/gms-pdf.js` и добавьте новый язык в объект `gmsPdfTranslations`:

```javascript
const gmsPdfTranslations = {
  // ... existing languages ...
  
  // Italian
  it: {
    loading: 'Caricamento PDF...',
    page: 'Pagina',
    of: 'di',
    prev: 'Prec',
    next: 'Succ',
    reset: 'Reset',
    zoomIn: 'Ingrandisci',
    zoomOut: 'Riduci',
    resetZoom: 'Reimposta zoom',
    previousPage: 'Pagina precedente',
    nextPage: 'Pagina successiva'
  },
  
  // Portuguese
  pt: {
    loading: 'Carregando PDF...',
    page: 'Página',
    of: 'de',
    prev: 'Anterior',
    next: 'Próximo',
    reset: 'Redefinir',
    zoomIn: 'Ampliar',
    zoomOut: 'Reduzir',
    resetZoom: 'Redefinir zoom',
    previousPage: 'Página anterior',
    nextPage: 'Próxima página'
  }
};
```

Затем пересоберите:
```bash
npm run build
npm run build-debug
```

## 🎨 Полный список переводов

### English (en)
```javascript
loading: 'Loading PDF...'
page: 'Page'
of: 'of'
prev: 'Prev'
next: 'Next'
reset: 'Reset'
zoomIn: 'Zoom in'
zoomOut: 'Zoom out'
resetZoom: 'Reset zoom'
previousPage: 'Previous page'
nextPage: 'Next page'
```

### Русский (ru)
```javascript
loading: 'Загрузка PDF...'
page: 'Страница'
of: 'из'
prev: 'Назад'
next: 'Вперёд'
reset: 'Сброс'
zoomIn: 'Увеличить'
zoomOut: 'Уменьшить'
resetZoom: 'Сбросить масштаб'
previousPage: 'Предыдущая страница'
nextPage: 'Следующая страница'
```

### Українська (uk)
```javascript
loading: 'Завантаження PDF...'
page: 'Сторінка'
of: 'з'
prev: 'Назад'
next: 'Вперед'
reset: 'Скинути'
zoomIn: 'Збільшити'
zoomOut: 'Зменшити'
resetZoom: 'Скинути масштаб'
previousPage: 'Попередня сторінка'
nextPage: 'Наступна сторінка'
```

### Deutsch (de)
```javascript
loading: 'PDF wird geladen...'
page: 'Seite'
of: 'von'
prev: 'Zurück'
next: 'Weiter'
reset: 'Zurücksetzen'
zoomIn: 'Vergrößern'
zoomOut: 'Verkleinern'
resetZoom: 'Zoom zurücksetzen'
previousPage: 'Vorherige Seite'
nextPage: 'Nächste Seite'
```

### Français (fr)
```javascript
loading: 'Chargement PDF...'
page: 'Page'
of: 'sur'
prev: 'Préc'
next: 'Suiv'
reset: 'Réinit'
zoomIn: 'Zoomer'
zoomOut: 'Dézoomer'
resetZoom: 'Réinitialiser le zoom'
previousPage: 'Page précédente'
nextPage: 'Page suivante'
```

### Español (es)
```javascript
loading: 'Cargando PDF...'
page: 'Página'
of: 'de'
prev: 'Anterior'
next: 'Siguiente'
reset: 'Restablecer'
zoomIn: 'Acercar'
zoomOut: 'Alejar'
resetZoom: 'Restablecer zoom'
previousPage: 'Página anterior'
nextPage: 'Página siguiente'
```

## 🧪 Тестирование

### Для тестирования разных языков в Chrome DevTools:

1. Откройте DevTools (F12)
2. Console
3. Введите команду для смены языка:

```javascript
// Русский
Object.defineProperty(navigator, 'language', {
  get: () => 'ru-RU'
});
location.reload();

// Українська
Object.defineProperty(navigator, 'language', {
  get: () => 'uk-UA'
});
location.reload();

// Deutsch
Object.defineProperty(navigator, 'language', {
  get: () => 'de-DE'
});
location.reload();
```

## 📱 Accessibility (aria-label)

Все кнопки имеют `aria-label` на текущем языке для screen readers:

```html
<!-- English -->
<button aria-label="Zoom in">+</button>
<button aria-label="Previous page">← Prev</button>

<!-- Русский -->
<button aria-label="Увеличить">+</button>
<button aria-label="Предыдущая страница">← Назад</button>
```

## 🔍 Fallback

Если язык браузера не поддерживается, автоматически используется **английский**:

```javascript
function gmsPdfGetTranslations() {
  const lang = navigator.language.split('-')[0];
  return gmsPdfTranslations[lang] || gmsPdfTranslations.en; // fallback to English
}
```

---

Создано для GMS Lightbox System
