const { query } = require('../config/database');

function mapRow(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.id,
        username: row.username,
        email: row.email,
        password: row.password,
        provider: row.provider,
        providerId: row.provider_id,
        avatar: row.avatar,
        discordId: row.discord_id,
        isGuildMember: row.is_guild_member,
        lastLoginAt: row.last_login_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

async function findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return mapRow(result.rows[0]);
}

async function findExistingByEmailOrUsername(email, username) {
    const result = await query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR username = $2 LIMIT 1',
        [email, username]
    );
    return mapRow(result.rows[0]);
}

async function findByLogin(login) {
    const result = await query(
        `SELECT *
         FROM users
         WHERE LOWER(email) = LOWER($1)
            OR username = $1
            OR provider_id = $1
         LIMIT 1`,
        [login]
    );
    return mapRow(result.rows[0]);
}

async function createLocalUser({ username, email, password }) {
    const result = await query(
        `INSERT INTO users (username, email, password, provider, is_guild_member, last_login_at, updated_at)
         VALUES ($1, LOWER($2), $3, 'local', FALSE, NOW(), NOW())
         RETURNING *`,
        [username, email, password]
    );
    return mapRow(result.rows[0]);
}

async function upsertDiscordUser(baseUserData) {
    const result = await query(
        `INSERT INTO users (
            username, email, provider, provider_id, discord_id, avatar, is_guild_member, last_login_at, updated_at
        ) VALUES (
            $1, LOWER($2), $3, $4, $5, $6, $7, $8, NOW()
        )
        ON CONFLICT (provider, provider_id)
        DO UPDATE SET
            username = EXCLUDED.username,
            email = EXCLUDED.email,
            discord_id = EXCLUDED.discord_id,
            avatar = EXCLUDED.avatar,
            is_guild_member = EXCLUDED.is_guild_member,
            last_login_at = EXCLUDED.last_login_at,
            updated_at = NOW()
        RETURNING *`,
        [
            baseUserData.username,
            baseUserData.email || null,
            baseUserData.provider,
            baseUserData.providerId,
            baseUserData.discordId,
            baseUserData.avatar,
            baseUserData.isGuildMember,
            baseUserData.lastLoginAt
        ]
    );
    return mapRow(result.rows[0]);
}

async function updateLastLogin(id) {
    const result = await query(
        'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return mapRow(result.rows[0]);
}

module.exports = {
    findById,
    findExistingByEmailOrUsername,
    findByLogin,
    createLocalUser,
    upsertDiscordUser,
    updateLastLogin
};
