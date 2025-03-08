require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');

// Import Routes
const tribesRoutes = require('./routes/tribes');
const storiesRoutes = require('./routes/stories');
const adminTribeRoutes = require('./routes/adminTribes');
const adminStoriesRoutes = require('./routes/adminStories');
const imageUploadRoutes = require('./routes/imageUploadRoutes');

// Initialize the Express App
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON
app.use(cors({
    origin: 'http://localhost:3000',  // Frontend address
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// API Routes
app.use('/api/tribes', tribesRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/admin/tribes', adminTribeRoutes);
app.use('/api/admin/stories', adminStoriesRoutes);
app.use('/api/images', imageUploadRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Aurora Project Backend!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;