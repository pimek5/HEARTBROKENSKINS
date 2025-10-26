require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = [
    'https://pimek5.github.io',
    'https://pimek5.github.io/HEARTBROKENSKINS',
    'http://localhost:8000',
    'http://localhost:5500'
];

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list or matches pattern
        if (allowedOrigins.includes(origin) || origin.startsWith('https://pimek5.github.io')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for OAuth)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/auth', require('./routes/auth')); // For OAuth routes

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        env: {
            hasDiscordClientId: !!process.env.DISCORD_CLIENT_ID,
            hasDiscordSecret: !!process.env.DISCORD_CLIENT_SECRET,
            hasDiscordCallback: !!process.env.DISCORD_CALLBACK_URL,
            hasFrontendUrl: !!process.env.FRONTEND_URL,
            hasMongoUri: !!process.env.MONGODB_URI
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║  🚀 HEARTBROKENSKINS Backend Server      ║
║  ✅ Server running on port ${PORT}          ║
║  🌐 Environment: ${process.env.NODE_ENV}           ║
║  📡 Frontend URL: ${process.env.FRONTEND_URL} ║
╚═══════════════════════════════════════════╝
    `);
});

module.exports = app;
