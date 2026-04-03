const mongoose = require('mongoose');

async function connectDB() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.warn('MONGODB_URI is not set. Running without MongoDB connection.');
        return;
    }

    try {
        await mongoose.connect(mongoUri, {
            autoIndex: true
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.warn('Server will continue running, but database features may fail.');
    }
}

module.exports = connectDB;
