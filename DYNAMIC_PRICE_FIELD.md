✅ **Dynamic Price Field Added!**

## Zmiany które zostały wprowadzone:

### 💰 **Smart Price Field**
- ✅ Pole ceny pojawia się **TYLKO** gdy wybierzesz "Premium" w polu TYPE
- ✅ Automatycznie ukrywa się dla "Free" i "Featured"
- ✅ Czyści wartość ceny gdy się ukrywa
- ✅ Dynamiczne pokazywanie/ukrywanie za pomocą JavaScript

### 🔒 **Nowe Ikonki**
- ✅ **Darmowe posty:** 🔒 Free (zamiast 💰 Free)
- ✅ **Płatne posty:** 💰 [Cena] [Waluta] (np. 💰 15.99 PLN)
- ✅ Konsekwentne wyświetlanie w admin panel i na głównej stronie

### ⚡ **JavaScript Logic**
- ✅ `togglePriceField()` - pokazuje/ukrywa pole ceny
- ✅ `onchange="togglePriceField()"` - reaguje na zmianę typu
- ✅ Automatyczne uruchamianie przy otwieraniu modali (Create/Edit)
- ✅ Wyczyszczenie pola price gdy przełączamy na Free/Featured

### 📝 **Workflow**
1. **Kliknij "Create New Post"**
2. **Wybierz TYPE "Free"** → pole ceny ukryte
3. **Przełącz na "Premium"** → pojawia się pole ceny
4. **Wpisz cenę i walutę**
5. **Zapisz post** → cena wyświetla się jako 💰 15.99 PLN

### 🎨 **Visual Changes**
- **Free posts:** 🔒 Free
- **Paid posts:** 💰 [Price] [Currency]
- **Clean interface** - pole ceny tylko gdy potrzebne

Teraz system cen jest jeszcze bardziej intuicyjny! 💰🔒✨