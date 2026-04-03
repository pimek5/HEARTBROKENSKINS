const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Generate launcher access token with device binding
// Body: { deviceId: string (unique per device, e.g., hwid or mac address) }
// Requires: JWT from Discord OAuth login
router.post('/access-token', requireAuth, (req, res) => {
    try {
        const { deviceId } = req.body;

        if (!deviceId || deviceId.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'deviceId is required'
            });
        }

        // Create short-lived launcher token bound to device
        const launcherToken = jwt.sign(
            {
                userId: req.user.id,
                username: req.user.username,
                deviceId: deviceId.trim(),
                scope: 'launcher',
                issuedAt: Date.now()
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // 7 days for launcher access
        );

        return res.json({
            success: true,
            launcherToken,
            expiresIn: 604800, // 7 days in seconds
            message: 'Launcher token generated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to generate launcher token',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get list of available skin packages
// Requires: launcher token from /api/launcher/access-token
router.get('/packages', (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const [, token] = authHeader.split(' ');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Missing launcher token'
            });
        }

        let launcherPayload;
        try {
            launcherPayload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired launcher token'
            });
        }

        // Verify token is for launcher
        if (launcherPayload.scope !== 'launcher') {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid for launcher access'
            });
        }

        // Mock skin packages - replace with DB query
        const packages = [
            {
                id: 'pkg_001',
                name: 'Celestial Bundle',
                description: 'Premium exclusive skins',
                version: '1.2.0',
                size: '2.5GB',
                checksum: 'abc123def456',
                releaseDate: '2025-03-15',
                free: false
            },
            {
                id: 'pkg_002',
                name: 'Free Starter Pack',
                description: 'Free basic skins',
                version: '1.0.0',
                size: '512MB',
                checksum: 'xyz789uvw123',
                releaseDate: '2025-02-01',
                free: true
            }
        ];

        return res.json({
            success: true,
            userId: launcherPayload.userId,
            deviceId: launcherPayload.deviceId,
            packages,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch packages',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Download skin package
// Requires: launcher token
router.get('/packages/:packageId/download', (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const [, token] = authHeader.split(' ');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Missing launcher token'
            });
        }

        let launcherPayload;
        try {
            launcherPayload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired launcher token'
            });
        }

        const { packageId } = req.params;

        // Generate short-lived signed URL for direct download
        const downloadToken = jwt.sign(
            {
                userId: launcherPayload.userId,
                packageId,
                deviceId: launcherPayload.deviceId,
                scope: 'download',
                issuedAt: Date.now()
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Valid for 1 hour
        );

        // In production, this would be an S3 URL or similar
        const downloadUrl = `https://cdn.heartbrokenskins.com/packages/${packageId}/download?token=${encodeURIComponent(downloadToken)}`;

        return res.json({
            success: true,
            packageId,
            downloadUrl,
            expiresIn: 3600, // 1 hour
            checksum: 'abc123def456', // For integrity verification
            message: 'Download link generated'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to generate download link',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Verify launcher installation
router.post('/verify-installation', (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const [, token] = authHeader.split(' ');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Missing launcher token'
            });
        }

        let launcherPayload;
        try {
            launcherPayload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired launcher token'
            });
        }

        const { packageId, checksum } = req.body;

        if (!packageId || !checksum) {
            return res.status(400).json({
                success: false,
                message: 'packageId and checksum are required'
            });
        }

        // Verify checksum against stored value
        // This is a mock - in production compare with database
        const isValid = checksum === 'abc123def456'; // Replace with real check

        return res.json({
            success: true,
            packageId,
            verified: isValid,
            message: isValid ? 'Installation verified' : 'Checksum mismatch'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Verification failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
