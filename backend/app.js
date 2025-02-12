require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');

// Import Routes
const tribesRoutes = require('./routes/tribes');
const storiesRoutes = require('./routes/stories');
const adminTribeRoutes = require('./routes/adminTribes');
const imageUploadRoutes = require('./routes/imageUploadRoutes'); // Import image upload routes

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
app.use('/api/tribes', tribesRoutes); // Routes for tribes
app.use('/api/stories', storiesRoutes); // Routes for stories
app.use('/api/admin/tribes', adminTribeRoutes); // Admin-specific routes
app.use('/api/images', imageUploadRoutes); // Mount the image upload routes

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Aurora Project Backend!');
});

module.exports = app; // Export the app instance
