# 🚀 Launcher API Integration Guide

## 📌 Overview

Backend oferuje API dla custom launchera:
1. OAuth login → JWT token
2. Generate launcher-specific token z device binding
3. Pobierz listę paczek
4. Download pack (z signed URL)
5. Verify installation

---

## 🔐 Flow

```
1. User zaloguje się na froncie przez Discord OAuth
   → dostaje JWT token

2. Launcher wysyła JWT + deviceId
   → `/api/launcher/access-token` (POST)
   → dostaje launcherToken (7 dni ważny)

3. Launcher pyta o paczki
   → `/api/launcher/packages` (GET)
   → dostaje listę dostępnych skinów

4. Launcher pobiera paczkę
   → `/api/launcher/packages/{id}/download` (GET)
   → dostaje signed URL (1h ważny) + checksum

5. Po instalacji, launcher weryfikuje
   → `/api/launcher/verify-installation` (POST)
   → potwierdzenie integralności
```

---

## 📡 Endpoints

### 1. Generate Launcher Token

```
POST /api/launcher/access-token
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Body:
{
  "deviceId": "UNIQUE_DEVICE_HWID_OR_MAC"
}

Response:
{
  "success": true,
  "launcherToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 604800,
  "message": "Launcher token generated successfully"
}
```

**Ważne:**
- `deviceId` powinno być unikatowe dla urządzenia (HWID, MAC address, itp.)
- Token ważny 7 dni
- Bound do device'a - na innym urządzeniu trzeba nowy token

---

### 2. Get Available Packages

```
GET /api/launcher/packages
Authorization: Bearer launcherToken_123...

Response:
{
  "success": true,
  "userId": "user_id_123",
  "deviceId": "DEVICE_HWID",
  "packages": [
    {
      "id": "pkg_001",
      "name": "Celestial Bundle",
      "description": "Premium exclusive skins",
      "version": "1.2.0",
      "size": "2.5GB",
      "checksum": "abc123def456",
      "releaseDate": "2025-03-15",
      "free": false
    },
    {
      "id": "pkg_002",
      "name": "Free Starter Pack",
      "description": "Free basic skins",
      "version": "1.0.0",
      "size": "512MB",
      "checksum": "xyz789uvw123",
      "releaseDate": "2025-02-01",
      "free": true
    }
  ],
  "timestamp": "2025-04-03T12:00:00.000Z"
}
```

---

### 3. Get Download Link

```
GET /api/launcher/packages/pkg_001/download
Authorization: Bearer launcherToken_123...

Response:
{
  "success": true,
  "packageId": "pkg_001",
  "downloadUrl": "https://cdn.heartbrokenskins.com/packages/pkg_001/download?token=...",
  "expiresIn": 3600,
  "checksum": "abc123def456",
  "message": "Download link generated"
}
```

**Ważne:**
- URL ważny 1 godzinę
- Download URL zwraca signed token - nie wolno go shaować

---

### 4. Verify Installation

```
POST /api/launcher/verify-installation
Authorization: Bearer launcherToken_123...

Body:
{
  "packageId": "pkg_001",
  "checksum": "abc123def456"
}

Response:
{
  "success": true,
  "packageId": "pkg_001",
  "verified": true,
  "message": "Installation verified"
}
```

---

## 🔒 Security Features

- **Device Binding**: Token tied to specific device via deviceId
- **Short TTL**: Download tokens expire after 1 hour
- **Checksum Verification**: Launcher musi weryfikować fileIntegrity
- **Rate Limiting**: (to do) Limit requesty per IP/device
- **Guild Gate**: Tylko members authorized serwera mogą pobierać

---

## 💻 Launcher Example (C#/Electron/Python)

### Flow w launche:

```csharp
// 1. User logged in, got JWT token from frontend
string jwtToken = GetStoredJWTToken();
string deviceId = GetHardwareId(); // HWID lub MAC address

// 2. Generate launcher token
var launcherResponse = await POST("/api/launcher/access-token", 
    new { deviceId }, 
    jwtToken);

string launcherToken = launcherResponse["launcherToken"];
SaveLauncherToken(launcherToken);

// 3. Get packages
var packages = await GET("/api/launcher/packages", launcherToken);

// 4. Download package
var downloadResponse = await GET(
    $"/api/launcher/packages/{packageId}/download", 
    launcherToken);

string downloadUrl = downloadResponse["downloadUrl"];
string expectedChecksum = downloadResponse["checksum"];

// Download file from URL
await DownloadFile(downloadUrl, "skins.zip");

// 5. Verify integrity
string actualChecksum = ComputeFileChecksum("skins.zip");
var verifyResponse = await POST("/api/launcher/verify-installation",
    new { packageId, checksum = actualChecksum },
    launcherToken);

if (verifyResponse["verified"]) {
    ExtractAndInstall("skins.zip");
}
```

---

## 🚨 Error Handling

```json
{
  "success": false,
  "message": "Invalid or expired launcher token",
  "error": "Development mode error message"
}
```

Możliwe kody:
- `401`: Missing/Invalid token
- `400`: Missing required fields
- `404`: Package not found
- `500`: Server error

---

## 📊 Testing Endpoints

```bash
# 1. Get JWT token from login endpoint
curl http://localhost:3000/auth/discord

# 2. Generate launcher token
curl -X POST http://localhost:3000/api/launcher/access-token \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"TEST_DEVICE_123"}'

# 3. List packages
curl http://localhost:3000/api/launcher/packages \
  -H "Authorization: Bearer LAUNCHER_TOKEN"

# 4. Download link
curl http://localhost:3000/api/launcher/packages/pkg_001/download \
  -H "Authorization: Bearer LAUNCHER_TOKEN"
```

---

## 🔄 Deployment

Czy chcesz:
- [ ] Dodać rate limiting (Helmet/express-rate-limit)
- [ ] Dodać analytics tracking
- [ ] Integrować AWS S3 dla file storage
- [ ] Dodać update checker endpoint
- [ ] Anticheat hooks
