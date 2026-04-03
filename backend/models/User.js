const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        // Only required for local auth, not OAuth
        required: function() {
            return !this.discordId && !this.googleId;
        }
    },
    discordId: {
        type: String,
        unique: true,
        sparse: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    displayName: String,
    avatar: String,
    provider: {
        type: String,
        enum: ['local', 'discord', 'google'],
        default: 'local'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
