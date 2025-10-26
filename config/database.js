const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting MongoDB connection...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
        console.log('Database:', mongoose.connection.db.databaseName);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = connectDB;
