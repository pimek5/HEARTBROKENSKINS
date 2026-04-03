const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function buildJwt(user) {
    return jwt.sign(
        {
            id: user._id || user.id,
            username: user.username,
            email: user.email || null,
            provider: user.provider || 'discord',
            discordId: user.discordId || null,
            isGuildMember: !!user.isGuildMember
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

function toSafeUser(user) {
    return {
        id: user._id || user.id,
        username: user.username,
        email: user.email || null,
        provider: user.provider,
        avatar: user.avatar || '',
        discordId: user.discordId || null,
        isGuildMember: !!user.isGuildMember
    };
}

router.post('/register', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database is currently unavailable'
            });
        }

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'username, email and password are required'
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        }).lean();

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            provider: 'local',
            isGuildMember: false
        });

        const token = buildJwt(user);

        return res.status(201).json({
            success: true,
            token,
            user: toSafeUser(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database is currently unavailable'
            });
        }

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'username and password are required'
            });
        }

        const user = await User.findOne({
            $or: [
                { email: username.toLowerCase() },
                { username },
                { providerId: username }
            ]
        }).select('+password');

        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = buildJwt(user);

        return res.json({
            success: true,
            token,
            user: toSafeUser(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/me', requireAuth, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const dbUser = await User.findById(req.user.id).lean();
            if (dbUser) {
                return res.json({ success: true, user: toSafeUser(dbUser) });
            }
        }

        return res.json({
            success: true,
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                provider: req.user.provider,
                avatar: req.user.avatar || '',
                discordId: req.user.discordId,
                isGuildMember: !!req.user.isGuildMember
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch current user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', (req, res, next) => {
    passport.authenticate('discord', (err, user, info) => {
        if (err) {
            return next(err);
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8000';

        if (!user) {
            const reason = encodeURIComponent(info?.message || 'Access denied');
            return res.redirect(`${frontendUrl}/login.html?success=false&reason=${reason}`);
        }

        const token = buildJwt(user);
        return res.redirect(`${frontendUrl}/login.html?success=true&token=${encodeURIComponent(token)}`);
    })(req, res, next);
});

router.get('/google', (req, res) => {
    res.status(501).json({
        success: false,
        message: 'Google OAuth is not configured in this build'
    });
});

router.post('/logout', (req, res) => {
    if (typeof req.logout === 'function') {
        req.logout(() => {});
    }

    req.session?.destroy(() => {});

    return res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
