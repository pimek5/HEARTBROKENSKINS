const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin Discord IDs
const ADMIN_DISCORD_IDS = [
    '318104006385729538' // pimek
];

// Check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is admin
        if (!ADMIN_DISCORD_IDS.includes(user.discordId)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // User is admin, attach to request
        req.user = user;
        req.isAdmin = true;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = { isAdmin, ADMIN_DISCORD_IDS };
