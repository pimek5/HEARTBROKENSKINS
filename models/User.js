const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true
        },
        password: {
            type: String,
            select: false
        },
        provider: {
            type: String,
            enum: ['local', 'discord', 'google'],
            default: 'local'
        },
        providerId: {
            type: String,
            sparse: true,
            index: true
        },
        avatar: {
            type: String,
            default: ''
        },
        discordId: {
            type: String,
            sparse: true,
            index: true
        },
        isGuildMember: {
            type: Boolean,
            default: false
        },
        lastLoginAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

userSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
