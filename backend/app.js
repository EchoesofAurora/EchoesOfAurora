require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');

// Import Routes
const tribesRoutes = require('./routes/tribes');
const storiesRoutes = require('./routes/stories');
const adminTribeRoutes = require('./routes/adminTribes');
const adminStoriesRoutes = require('./routes/adminStories');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const submissionsRoutes = require('./routes/submissions');
const mapDataRoutes = require('./routes/mapData'); // Ensure this matches the file name
const adminStatsRoutes = require('./routes/adminStats');

// Initialize the Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// API Routes
app.use('/api/tribes', tribesRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/admin/tribes', adminTribeRoutes);
app.use('/api/admin/stories', adminStoriesRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/mapData', mapDataRoutes); // Ensure case matches
app.use('/api/adminStats', adminStatsRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Aurora Project Backend!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack );
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Catch-all route for debugging
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;