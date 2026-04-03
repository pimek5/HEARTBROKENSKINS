# Railway URL Setup

Kiedy deployujesz na Railway, aplikacja dostaje automatyczny URL:

## Format URL-a
```
https://[project-name]-[environment].up.railway.app
```

## Jak znaleźć swój URL

### Opcja 1: Railway Dashboard
1. https://railway.app → Twój projekt
2. Kliknij na serwis (backend Node.js)
3. Wejdź w "Settings"
4. Szukaj "Domains" - tam będzie publiczny URL

### Opcja 2: Railway CLI
```bash
railway link
railway status
```

### Opcja 3: Logi deploymentu
Po pushnięciu kodu, Railway wyświetli URL w logu deployment-u:
```
✓ Deployment successful
🎉 Your app is live at: https://heartbrokenskins-prod.up.railway.app
```

## Discord OAuth Setup

Gdy masz URL (np. `https://heartbrokenskins-prod.up.railway.app`):

1. Idź na https://discord.com/developers/applications/1432113571176906954/oauth2
2. W "Redirects" dodaj:
   ```
   https://heartbrokenskins-prod.up.railway.app/auth/discord/callback
   ```
3. Kliknij "Save Changes"

## Railway Variables Setup

Gdy wiesz swój URL, w Railway Variables ustaw:
```
DISCORD_CALLBACK_URL=https://heartbrokenskins-prod.up.railway.app/auth/discord/callback
FRONTEND_URL=https://pimek5.github.io/HEARTBROKENSKINS
```

Potem redeploy i będzie działać.

## Testing

```bash
# Health check
curl https://heartbrokenskins-prod.up.railway.app/health

# Discord OAuth
# Idź w przeglądarce: https://heartbrokenskins-prod.up.railway.app/auth/discord
```
