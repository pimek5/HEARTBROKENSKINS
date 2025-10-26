const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Discord Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ discordId: profile.id });

        if (user) {
            // Update last login
            user.lastLogin = Date.now();
            user.avatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
            await user.save();
            return done(null, user);
        }

        // Create new user
        user = await User.create({
            discordId: profile.id,
            username: profile.username,
            email: profile.email,
            displayName: profile.global_name || profile.username,
            avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
            provider: 'discord'
        });

        done(null, user);
    } catch (error) {
        console.error('Discord auth error:', error);
        done(error, null);
    }
}));

// Google Strategy - tylko jeśli są credentials
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // Update last login
                user.lastLogin = Date.now();
                user.avatar = profile.photos?.[0]?.value;
                await user.save();
                return done(null, user);
            }

            // Create new user
            user = await User.create({
                googleId: profile.id,
                email: profile.emails?.[0]?.value,
                displayName: profile.displayName,
                avatar: profile.photos?.[0]?.value,
                provider: 'google'
            });

            done(null, user);
        } catch (error) {
            console.error('Google auth error:', error);
            done(error, null);
        }
    }));
}

module.exports = passport;
