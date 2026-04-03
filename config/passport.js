const passport = require('passport');
const { Strategy: DiscordStrategy } = require('passport-discord');
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkGuildMembership(discordUserId) {
    const guildId = process.env.DISCORD_REQUIRED_GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;

    if (!guildId || !botToken) {
        return {
            allowed: false,
            reason: 'Missing DISCORD_REQUIRED_GUILD_ID or DISCORD_BOT_TOKEN on server'
        };
    }

    const response = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
        {
            headers: {
                Authorization: `Bot ${botToken}`
            }
        }
    );

    if (response.status === 200) {
        return { allowed: true };
    }

    if (response.status === 404) {
        return {
            allowed: false,
            reason: 'User is not a member of required Discord server'
        };
    }

    const body = await response.text();
    throw new Error(`Discord API error ${response.status}: ${body.substring(0, 300)}`);
}

passport.serializeUser((user, done) => {
    done(null, user.id || user._id || null);
});

passport.deserializeUser(async (id, done) => {
    try {
        if (!id) {
            return done(null, false);
        }

        if (mongoose.connection.readyState !== 1) {
            return done(null, { id });
        }

        const user = await User.findById(id).lean();
        return done(null, user || false);
    } catch (error) {
        return done(error, null);
    }
});

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ['identify', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const membership = await checkGuildMembership(profile.id);

                if (!membership.allowed) {
                    return done(null, false, { message: membership.reason });
                }

                const baseUserData = {
                    username: profile.username || `discord_${profile.id}`,
                    email: profile.email || undefined,
                    provider: 'discord',
                    providerId: profile.id,
                    discordId: profile.id,
                    avatar: profile.avatar
                        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                        : '',
                    isGuildMember: true,
                    lastLoginAt: new Date()
                };

                if (mongoose.connection.readyState !== 1) {
                    return done(null, {
                        id: profile.id,
                        ...baseUserData
                    });
                }

                const user = await User.findOneAndUpdate(
                    { provider: 'discord', providerId: profile.id },
                    { $set: baseUserData },
                    { new: true, upsert: true }
                );

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
