# Railway Deployment Guide

## Krok po kroku:

### 1. Wejdź na Railway
https://railway.app/

### 2. Zaloguj się przez GitHub
Kliknij "Login with GitHub"

### 3. Stwórz nowy projekt
- Kliknij "New Project"
- Wybierz "Deploy from GitHub repo"
- Wybierz swoje repo: `HEARTBROKENSKINS`
- Railway zapyta o uprawnienia - zaakceptuj

### 4. Konfiguracja
Railway automatycznie wykryje Node.js projekt, ale:
- Wybierz **root directory**: `backend`
- Railway powinien automatycznie wykryć `package.json`

### 5. Dodaj zmienne środowiskowe
W Railway dashboard kliknij na swój projekt → Variables, dodaj:

```
NODE_ENV=production
PORT=3000
DISCORD_CLIENT_ID=1432113571176906954
DISCORD_CLIENT_SECRET=Sk6NVyuTPoWMmmqMIrKGn-M4votmchg4
DISCORD_CALLBACK_URL=https://twoj-projekt.railway.app/auth/discord/callback
JWT_SECRET=super_secret_jwt_key_change_this_12345
SESSION_SECRET=super_secret_session_key_change_this_67890
MONGODB_URI=mongodb+srv://heartbrokencluster:heartbroken123@cluster0.i2piscf.mongodb.net/heartbrokenskins?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=https://pimek5.github.io/HEARTBROKENSKINS
```

### 6. Deploy
Railway automatycznie zrobi deploy! Poczekaj 2-3 minuty.

### 7. Dostaniesz URL
Będzie wyglądał tak: `https://heartbrokenskins-production-xxxx.railway.app`

### 8. Zaktualizuj Discord Application
- Idź na: https://discord.com/developers/applications/1432113571176906954/oauth2
- W "Redirects" dodaj: `https://twoj-railway-url.railway.app/auth/discord/callback`
- Save Changes

### 9. Zaktualizuj login.html
Zmień API_URL na Railway URL

Gotowe! 🚀
