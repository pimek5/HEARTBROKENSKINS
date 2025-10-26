# Dokumentacja Funkcjonalności Strony Mods

## Przegląd
Strona `/mods` została wyposażona w pełną funkcjonalność filtrowania, wyszukiwania, sortowania i paginacji wzorowaną na Divine Skins, ale z motywem HEARTBROKENSKINS.

## Pliki

### 1. `mods.html`
Główny plik HTML zawierający:
- **Sidebar** (linie 52-182): 5 sekcji filtrów
  - Categories (9 opcji)
  - Themes (8 opcji) 
  - Features (5 opcji)
  - Colors (10 opcji)
  - Champions (z wyszukiwaniem)

- **Panel kontrolny** (linie 185-330):
  - Search bar
  - Free/Paid toggles
  - Sort dropdown (8 opcji)
  - View size (12/20/32/48)
  - Grid/List toggle

- **Kontener modów** (linia 325): `#modsGrid`
- **Paginacja** (linia 330): `#paginationContainer`

### 2. `scripts/mods-functionality.js`
Główny skrypt zarządzający funkcjonalnością:

#### Klasa `ModsPageManager`
Zarządza całym stanem i logiką strony.

##### Stan aplikacji:
```javascript
{
    allMods: [],           // Wszystkie dostępne mody
    filteredMods: [],      // Przefiltrowane mody
    currentPage: 1,        // Aktualna strona
    modsPerPage: 20,       // Ilość modów na stronę
    currentSort: 'latest', // Typ sortowania
    viewMode: 'grid',      // Tryb widoku (grid/list)
    searchQuery: '',       // Zapytanie wyszukiwania
    filters: {
        categories: Set,   // Wybrane kategorie
        themes: Set,       // Wybrane motywy
        features: Set,     // Wybrane funkcje
        colors: Set,       // Wybrane kolory
        champions: Set,    // Wybrani championowie
        freeOnly: false,   // Tylko darmowe
        paidOnly: false    // Tylko płatne
    }
}
```

##### Główne metody:

**`init()`**
- Czeka na załadowanie danych z `contentDataManager`
- Konfiguruje event listenery
- Uruchamia sidebar toggles

**`loadMods()`**
- Pobiera wszystkie posty z `contentDataManager`
- Uruchamia pierwszy render

**`setupEventListeners()`**
Konfiguruje:
- Search input (wyszukiwanie po tytule/opisie/tagach)
- Free/Paid toggles
- Sort options (latest, oldest, most viewed, most downloaded, name A-Z/Z-A, price)
- View size options (12/20/32/48)
- Grid/List toggle

**`applyFilters()`**
Filtruje mody według:
1. Search query
2. Free/Paid
3. Categories (z sidebar)
4. Themes (z sidebar)
5. Features (z sidebar)
6. Colors (z sidebar)
7. Champions (z sidebar)

Następnie sortuje i renderuje.

**`sortMods(mods)`**
Sortuje według wybranej opcji:
- `latest` - najnowsze (po dacie)
- `oldest` - najstarsze (po dacie)
- `most-viewed` - najczęściej oglądane
- `most-downloaded` - najczęściej pobierane
- `name-az` - nazwa A-Z
- `name-za` - nazwa Z-A
- `price-low` - cena rosnąco
- `price-high` - cena malejąco

**`renderMods()`**
Renderuje karty modów w wybranym trybie (grid/list):
- Oblicza paginację (startIndex, endIndex)
- Generuje HTML kart
- Pokazuje komunikat "No mods found" jeśli brak wyników

**`createModCard(mod)` - Grid View**
Generuje kartę moda zawierającą:
- Miniaturę (aspect ratio 16:9)
- Tytuł i opis
- Statystyki (views, downloads, likes)
- Badge kategorii (pokazuje się przy hover)
- Hover effects (border #ff0000, scale miniaturki)

**`createModListItem(mod)` - List View**
Generuje item listy:
- Większa miniatura (192x128px)
- Rozszerzony opis
- Statystyki z labelkami
- Layout poziomy

**`renderPagination()`**
Generuje przyciski paginacji:
- Przycisk Previous (wyłączony na stronie 1)
- Numery stron (max 5 widocznych)
- Ellipsis (...) jeśli więcej stron
- Przycisk Next (wyłączony na ostatniej stronie)
- Highlight aktywnej strony (#ff0000)

**`goToPage(page)`**
- Zmienia currentPage
- Re-renderuje mody i paginację
- Scrolluje do góry

**`clearFilters()`**
- Resetuje wszystkie filtry
- Czyści UI (checkboxy, active states)
- Re-renderuje z pełną listą modów

## Integracja z content-data.js

Skrypt czeka na event `contentReady` z `contentDataManager`:

```javascript
document.addEventListener('contentReady', () => {
    this.loadMods();
});
```

Pobiera dane przez:
```javascript
this.allMods = window.contentDataManager.getAllPosts();
```

## Struktura danych moda

Oczekiwany format:
```javascript
{
    id: 1,
    title: "Mod Title",
    description: "Mod description",
    image: "path/to/image.jpg",
    category: "champion-mod", // lub "map-mod", "hud-ui", "announcer"
    type: "free",             // lub "premium"
    tags: ["tag1", "tag2"],   // dla filtrowania
    price: 0,                 // dla sortowania po cenie
    views: 100,
    date: "2025-01-26",
    details: {
        creator: "Author Name",
        downloads: "500",
        rating: 4.5
    }
}
```

## Stylowanie

Wszystkie style używają motywu HEARTBROKENSKINS:
- Tło główne: `#0d0d0d`
- Tło sekundarne: `#121212`
- Bordery: `#1c1c1c`
- Akcent (aktywne): `#ff0000`
- Tekst nieaktywny: `#999`
- Tekst aktywny: `white`

### Grid View
- 4 kolumny na XL (≥1280px)
- 3 kolumny na LG (≥1024px)
- 2 kolumny na MD (≥768px)
- 1 kolumna na SM (<768px)
- Gap: 4px (16px)

### Hover Effects
- Border zmienia się na `#ff0000`
- Miniatura: `scale(1.05)`
- Smooth transitions (300ms)

## Responsywność

### Desktop (≥1024px)
- Sidebar widoczny
- Grid 3-4 kolumny
- Pełne kontrolki

### Mobile (<1024px)
- Sidebar ukryty (może być toggle button)
- Grid 1-2 kolumny
- Kontrolki stack vertically

## Testowanie

### Krok 1: Uruchom lokalny serwer
```bash
python -m http.server 8000
# lub
npx serve
```

### Krok 2: Otwórz mods.html
```
http://localhost:8000/mods.html
```

### Krok 3: Testuj funkcjonalność

**Wyszukiwanie:**
- Wpisz tekst w search bar
- Sprawdź filtrowanie w czasie rzeczywistym

**Filtry Free/Paid:**
- Kliknij "Free Only" - powinny pokazać się tylko darmowe
- Kliknij "Paid Only" - powinny pokazać się tylko płatne
- Oba wyłączone - wszystkie mody

**Sidebar Filtry:**
- Kliknij kategorię/motyw/feature/color/champion
- Przycisk zmienia kolor na #ff0000
- Mody są filtrowane
- Można wybrać wiele filtrów

**Sortowanie:**
- Otwórz dropdown "Sort by"
- Wybierz opcję
- Sprawdź kolejność modów

**View Size:**
- Zmień z 20 na 12/32/48
- Sprawdź ilość modów na stronie
- Paginacja powinna się zaktualizować

**Grid/List:**
- Przełącz między Grid a List
- Layout powinien się zmienić

**Paginacja:**
- Przejdź między stronami
- Sprawdź Previous/Next
- Kliknij konkretny numer strony

## Known Issues & TODO

### Do naprawienia:
1. ~~Brak prawdziwych danych - używa fallback data~~
2. Champion search w sidebar nie jest podłączony
3. Brak animacji ładowania przy filtrowaniu
4. View size nie zapisuje się w localStorage
5. Brak deep linking (URL params dla filtrów)

### Do dodania:
1. Skeleton loaders podczas ładowania
2. Infinite scroll jako opcja
3. Bookmark/favorite mods
4. Mod quick preview modal
5. Advanced filters (data range, autor, rating)
6. Export filtered results

## API dla developerów

### Globalny dostęp
```javascript
window.modsPageManager
```

### Metody publiczne
```javascript
// Zmień stronę
window.modsPageManager.goToPage(3);

// Wyczyść filtry
window.modsPageManager.clearFilters();

// Zmień tryb widoku
window.modsPageManager.viewMode = 'list';
window.modsPageManager.renderMods();

// Ustaw sortowanie
window.modsPageManager.currentSort = 'most-viewed';
window.modsPageManager.applyFilters();
```

### Events (do implementacji)
```javascript
// Słuchaj zmian filtrów
document.addEventListener('modsFiltered', (e) => {
    console.log('Filtered mods:', e.detail.count);
});

// Słuchaj zmian strony
document.addEventListener('pageChanged', (e) => {
    console.log('Current page:', e.detail.page);
});
```

## Performance

### Optymalizacje:
- Lazy loading obrazów (`loading="lazy"`)
- Debounce na search input (300ms) - TODO
- Virtual scrolling dla dużych list - TODO
- Image srcset dla różnych rozdzielczości - TODO

### Limity:
- Maksymalnie 1000 modów (zalecane)
- 48 modów per page max
- 28 stron w paginacji

## Bezpieczeństwo

### XSS Protection:
- Wszystkie dane są escapowane
- Brak `innerHTML` z user input
- Sanityzacja HTML w kartach

### CSP Headers (zalecane):
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' https://ddragon.leagueoflegends.com; 
               script-src 'self' https://cdn.tailwindcss.com">
```

## Changelog

### v1.0 (2025-01-26)
- ✅ Pełna implementacja filtrowania
- ✅ Search functionality
- ✅ Free/Paid toggles
- ✅ Sortowanie (8 opcji)
- ✅ Paginacja z numerami stron
- ✅ Grid/List view
- ✅ View size (12/20/32/48)
- ✅ Responsywny design
- ✅ HEARTBROKENSKINS theme
- ✅ Sidebar z 5 sekcjami filtrów

## Support

Problemy? Sprawdź:
1. Console logs w DevTools
2. Network tab dla błędów ładowania
3. `window.modsPageManager.filteredMods` - zobacz przefiltrowane dane
4. `window.contentDataManager` - sprawdź dostępność danych

---

**Created**: 2025-01-26  
**Author**: HEARTBROKENSKINS Team  
**Based on**: Divine Skins functionality
