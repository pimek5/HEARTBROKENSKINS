# HEARTBROKENSKINS Backend

Backend server for authentication system with Discord and Google OAuth.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB
You have two options:

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

#### Option B: Local MongoDB
1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Use: `mongodb://localhost:27017/heartbrokenskins`

### 3. Configure Environment Variables
Edit `.env` file:
- ✅ Discord OAuth already configured
- ⚠️ Add Google OAuth credentials (optional)
- ⚠️ Change JWT_SECRET and SESSION_SECRET to random strings
- ⚠️ Update MONGODB_URI with your database URL

### 4. Setup Discord Application
1. Go to https://discord.com/developers/applications/1432113571176906954/oauth2
2. Add redirect URL: `http://localhost:3000/auth/discord/callback`
3. Save changes

### 5. Run Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:3000

## API Endpoints

### Authentication Routes

#### Register (Local)
```
POST /api/auth/register
Body: { username, email, password }
```

#### Login (Local)
```
POST /api/auth/login
Body: { username, password }
```

#### Discord OAuth
```
GET /auth/discord
```

#### Google OAuth
```
GET /auth/google
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
```

## Testing

1. Start server: `npm run dev`
2. Test health check: http://localhost:3000/health
3. Test Discord login: http://localhost:3000/auth/discord

## Frontend Integration

Update login.html to connect to this backend (see instructions in main README)
