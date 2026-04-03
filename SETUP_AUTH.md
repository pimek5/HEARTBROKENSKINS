# 🚀 HEARTBROKENSKINS - Complete Setup Guide

## ✅ Co zostało zrobione:

1. **Backend Node.js** - Kompletny system autentykacji
2. **Discord OAuth** - Już skonfigurowane z Twoim Client ID i Secret
3. **Google OAuth** - Przygotowane (potrzebujesz dodać credentials)
4. **Login przez Username/Password** - Gotowe
5. **JWT Tokens** - Bezpieczna autoryzacja
6. **MongoDB** - Model użytkownika

## 📋 Kroki do uruchomienia:

### 1. Zainstaluj Node.js
Jeśli nie masz, pobierz z: https://nodejs.org/ (wersja LTS)

### 2. Zainstaluj MongoDB
**Opcja A: MongoDB Atlas (Cloud - Łatwiejsze)**
1. Idź na: https://www.mongodb.com/cloud/atlas
2. Stwórz darmowe konto
3. Utwórz cluster
4. Kliknij "Connect" → "Connect your application"
5. Skopiuj connection string (wygląda tak: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Wklej do `backend/.env` w linii `MONGODB_URI=`

**Opcja B: Lokalny MongoDB**
1. Pobierz: https://www.mongodb.com/try/download/community
2. Zainstaluj
3. W `.env` zostaw: `MONGODB_URI=mongodb://localhost:27017/heartbrokenskins`

### 3. Zainstaluj zależności backendu
```powershell
cd backend
npm install
```

### 4. Skonfiguruj Discord OAuth Redirect URL
1. Idź na: https://discord.com/developers/applications/1432113571176906954/oauth2
2. W sekcji "Redirects" dodaj:
   - `http://localhost:3000/auth/discord/callback`
3. Kliknij "Save Changes"

### 5. (Opcjonalne) Skonfiguruj Google OAuth
1. Idź na: https://console.cloud.google.com
2. Stwórz nowy projekt
3. Włącz "Google+ API"
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
7. Skopiuj Client ID i Client Secret
8. Wklej do `backend/.env`:
   ```
   GOOGLE_CLIENT_ID=twój_client_id
   GOOGLE_CLIENT_SECRET=twój_client_secret
   ```

### 6. Uruchom Backend
```powershell
# W folderze backend/
npm run dev
```

Powinieneś zobaczyć:
```
╔═══════════════════════════════════════════╗
║  🚀 HEARTBROKENSKINS Backend Server      ║
║  ✅ Server running on port 3000          ║
║  🌐 Environment: development             ║
║  📡 Frontend URL: http://localhost:8000  ║
╚═══════════════════════════════════════════╝
✅ MongoDB Connected Successfully
```

### 7. Uruchom Frontend
```powershell
# W głównym folderze projektu
python -m http.server 8000
```

### 8. Otwórz przeglądarkę
- Frontend: http://localhost:8000/login.html
- Backend health check: http://localhost:3000/health

## 🧪 Testowanie:

### Test 1: Discord Login
1. Kliknij "Continue with Discord" na stronie login
2. Zaloguj się przez Discord
3. Powinieneś zostać przekierowany z powrotem i zalogowany

### Test 2: Rejestracja lokalna
1. Użyj Postman lub curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'
```

### Test 3: Login lokalny
1. Na stronie login.html wpisz:
   - Username/Email: testuser (lub email który użyłeś)
   - Password: Test123!
2. Kliknij "Log In"

## 🔧 Troubleshooting:

### Backend nie startuje
- Sprawdź czy Node.js jest zainstalowany: `node --version`
- Sprawdź czy wszystkie pakiety są zainstalowane: `npm install`
- Sprawdź logi w konsoli

### MongoDB connection error
- Upewnij się że MongoDB działa (jeśli lokalny)
- Sprawdź czy connection string w `.env` jest poprawny
- Dla Atlas: Sprawdź czy IP jest whitelisted (0.0.0.0/0 dla development)

### Discord OAuth nie działa
- Sprawdź czy redirect URL jest dokładnie: `http://localhost:3000/auth/discord/callback`
- Sprawdź czy Client ID i Secret są poprawne w `.env`
- Sprawdź konsole backendu czy są błędy

### CORS errors
- Upewnij się że backend działa na porcie 3000
- Upewnij się że frontend działa na porcie 8000
- Sprawdź czy `FRONTEND_URL` w `.env` to `http://localhost:8000`

## 📁 Struktura plików:

```
HEARTBROKENSKINS/
├── backend/                    # Backend Node.js
│   ├── config/
│   │   ├── database.js        # Połączenie MongoDB
│   │   └── passport.js        # Konfiguracja OAuth
│   ├── models/
│   │   └── User.js            # Model użytkownika
│   ├── routes/
│   │   └── auth.js            # Trasy autentykacji
│   ├── middleware/
│   │   └── auth.js            # Middleware JWT
│   ├── .env                   # Zmienne środowiskowe (WAŻNE!)
│   ├── server.js              # Główny plik serwera
│   └── package.json
├── login.html                  # Zaktualizowane z API
└── ... (reszta frontendu)
```

## 🔐 Bezpieczeństwo - WAŻNE dla produkcji!

Przed wrzuceniem na produkcję:
1. Zmień `JWT_SECRET` i `SESSION_SECRET` na losowe, długie stringi
2. Zmień `MONGODB_URI` na produkcyjną bazę
3. Zaktualizuj `FRONTEND_URL` na właściwy URL
4. Zaktualizuj Discord/Google redirect URLs na produkcyjne
5. Ustaw `NODE_ENV=production`
6. NIE commituj pliku `.env` do GitHuba!

## 📞 Support:

Jeśli masz problemy:
1. Sprawdź logi w konsoli backendu
2. Sprawdź console w przeglądarce (F12)
3. Upewnij się że oba serwery działają (backend:3000, frontend:8000)

Wszystko gotowe! 🎉
