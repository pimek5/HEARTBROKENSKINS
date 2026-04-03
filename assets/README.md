# Background Image Setup

## Jak dodać obraz tła:

1. **Zapisz załączony obraz** jako `background.jpg` w tym folderze (`assets/`)
2. **Upewnij się** że nazwa pliku to dokładnie `background.jpg`
3. **Odśwież stronę** - tło automatycznie się pojawi z efektem rozmycia

## Obecne ustawienia CSS:

- **Rozmycie**: Obraz jest automatycznie rozmazany przez CSS overlay
- **Pozycja**: Centrowany i pokrywa cały ekran
- **Przyciemnienie**: 85-90% overlay dla lepszej czytelności
- **Animacja**: Subtelna animacja pulsowania kolorów
- **Backup**: Jeśli obraz się nie załaduje, użyty zostanie gradient w kolorach czerwono-różowych

## Obsługiwane formaty:
- `.jpg` (zalecane)
- `.png` 
- `.webp`

Jeśli chcesz zmienić format, edytuj plik `styles/main.css` i zmień `background.jpg` na odpowiednią nazwę pliku.