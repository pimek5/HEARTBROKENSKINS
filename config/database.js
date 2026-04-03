const { Pool } = require('pg');

let pool;
let databaseReady = false;

function getConnectionString() {
    return process.env.DATABASE_URL
        || process.env.POSTGRES_URL
        || process.env.POSTGRESQL_URL
        || process.env.PG_URL
        || null;
}

function isDatabaseReady() {
    return databaseReady;
}

async function query(text, params = []) {
    if (!pool) {
        throw new Error('Database pool is not initialized');
    }

    return pool.query(text, params);
}

async function initializeSchema() {
    await query(`
        CREATE TABLE IF NOT EXISTS users (
            id BIGSERIAL PRIMARY KEY,
            username TEXT NOT NULL,
            email TEXT,
            password TEXT,
            provider TEXT NOT NULL DEFAULT 'local',
            provider_id TEXT,
            avatar TEXT NOT NULL DEFAULT '',
            discord_id TEXT,
            is_guild_member BOOLEAN NOT NULL DEFAULT FALSE,
            last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'local'");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id TEXT");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT NOT NULL DEFAULT ''");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS discord_id TEXT");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_guild_member BOOLEAN NOT NULL DEFAULT FALSE");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW()");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()");

    await query("UPDATE users SET username = COALESCE(NULLIF(username, ''), 'user_' || id) WHERE username IS NULL OR username = ''");

    await query('CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (LOWER(email)) WHERE email IS NOT NULL');
    await query('CREATE UNIQUE INDEX IF NOT EXISTS users_provider_provider_id_unique ON users (provider, provider_id) WHERE provider_id IS NOT NULL');
    await query('CREATE UNIQUE INDEX IF NOT EXISTS users_discord_id_unique ON users (discord_id) WHERE discord_id IS NOT NULL');
}

async function connectDB() {
    const connectionString = getConnectionString();

    if (!connectionString) {
        console.warn('DATABASE_URL is not set. Running without PostgreSQL connection.');
        return;
    }

    try {
        pool = new Pool({
            connectionString,
            ssl: process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false
        });

        await query('SELECT 1');
        await initializeSchema();
        databaseReady = true;
        console.log('PostgreSQL connected successfully.');
    } catch (error) {
        databaseReady = false;
        console.error('PostgreSQL connection error:', error.message);
        console.warn('Server will continue running, but database features may fail.');
    }
}

module.exports = {
    connectDB,
    isDatabaseReady,
    query,
    getConnectionString
};
