# 🚀 Railway Deployment Guide - HEARTBROKENSKINS Discord OAuth Backend

## ✅ Checklist przed deploymentem

- [ ] Backend na GitHub
- [ ] Railway account z GitHub connected
- [ ] Discord app OAuth configured
- [ ] MongoDB Atlas w użyciu lub Railway PostgreSQL
- [ ] Wygenerowane JWT_SECRET i SESSION_SECRET

---

## 📋 Krok 1: Przygotowanie na GitHub

1. Upewnij się że folder zawiera:
   ```
   server.js
   package.json
   config/
   routes/
   models/
   middleware/
   .env (gitignore!)
   ```

2. Sprawdź czy `.gitignore` zawiera `.env`:
   ```
   .env
   node_modules/
   .DS_Store
   ```

3. Push na GitHub:
   ```bash
   git add .
   git commit -m "Add Discord OAuth backend for Railway"
   git push origin main
   ```

---

## 🚂 Krok 2: Deploy na Railway

1. Idź na https://railway.app
2. Kliknij "New Project"
3. Wybierz "GitHub Repo"
4. Zaloguj się GitHubem i wybierz swoje repo
5. Railway auto-wykryje `package.json` i Node.js
6. Czekaj na build (2-3 minuty)

---

## 🔧 Krok 3: Konfiguracja Environment Variables

W Railway dashboard, w sekcji "Variables" dodaj:

```
NODE_ENV = production
PORT = auto (lub 3000)

# Discord OAuth credentials
DISCORD_CLIENT_ID = 1432113571176906954
DISCORD_CLIENT_SECRET = [wklej swój z Discord Developer Portal]
DISCORD_CALLBACK_URL = https://YOUR_RAILWAY_APP.up.railway.app/auth/discord/callback
DISCORD_REQUIRED_GUILD_ID = 1153027935553454191
DISCORD_BOT_TOKEN = [wklej twój bot token]

# JWT & Session
JWT_SECRET = [generuj: openssl rand -base64 32]
SESSION_SECRET = [generuj: openssl rand -base64 32]

# MongoDB
MONGODB_URI = [z MongoDB Atlas connection string]

# Frontend
FRONTEND_URL = https://pimek5.github.io/HEARTBROKENSKINS
# (lub gdzie będzie Twój frontend)
```

### Jak generować sekrety na Windows PowerShell:
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

---

## 🎯 Krok 4: Konfiguracja Discord Developer Portal

1. Idź na https://discord.com/developers/applications/1432113571176906954/oauth2
2. W "Redirects" zmień (lub dodaj) URL:
   - **Usuń:** `http://localhost:3000/auth/discord/callback`
   - **Dodaj:** `https://YOUR_RAILWAY_APP.up.railway.app/auth/discord/callback`

3. Zastąp `YOUR_RAILWAY_APP` rzeczywistą nazwą ze statusu Railway

---

## 🔗 Krok 5: Test produkcyjny

Po deploymencie testuj:

1. Health check:
   ```
   https://YOUR_RAILWAY_APP.up.railway.app/health
   ```

2. Discord login:
   ```
   https://YOUR_RAILWAY_APP.up.railway.app/auth/discord
   ```

3. Powinieneś być kierowany na Discord OAuth, a potem do frontendu z tokenem.

---

## 🔒 Bezpieczeństwo

**WAŻNE!** Bot token wyciekł w tym repo. Natychmiast:

1. Wejdź na https://discord.com/developers/applications/1432113571176906954
2. W "Bot" → "Token" kliknij "Regenerate token"
3. Skopiuj nowy token
4. Wklej go do Railway secrets jako `DISCORD_BOT_TOKEN`
5. Nie commituj sekretu do GitHuba nigdy więcej

---

## 📊 Monitoring Railway

W Railway dashboard możesz:
- Obserwować logi w real-time
- Restartować serwer
- Skalować dyno (Rocket Plan)
- Ustawiać health checks

---

## 🐛 Troubleshooting

### CORS error
- Upewnij się że `FRONTEND_URL` jest dokładnie poprawny
- Railway automatycznie dodaje `.railway.app` do CORS

### OAuth redirect failed
- Sprawdź czy `DISCORD_CALLBACK_URL` jest 1:1 identyczny z Discord Developer Portal
- Sprawdź czy `FRONTEND_URL` istnieje i jest dostępna

### MongoDB connection failed
- Sprawdź czy IP Railway jest whitelisted w MongoDB Atlas (0.0.0.0/0 dla development)
- Sprawdź czy `MONGODB_URI` ma poprawną password i hostname

### Bot can't check guild membership
- Sprawdź czy bot jest na guildzie (1153027935553454191)
- Sprawdź czy Server Members Intent jest ON w Discord app settings
- Sprawdź czy token jest poprawny i aktualny

---

## 📱 Frondend integration

W [login.html](../login.html) zmień:
```javascript
const API_URL = 'https://YOUR_RAILWAY_APP.up.railway.app';
```

---

## 🎓 Następne kroki

1. Dodać endpoint launcherowy: `/api/launcher/access-token`
2. Dodać pobieranie paczek: `/api/launcher/skin-package`
3. Dodać rate limiting
4. Dodać analytics tracking
