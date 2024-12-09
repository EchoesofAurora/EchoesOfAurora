require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
 
// Import Routes
const tribesRoutes = require('./routes/tribes');
const storiesRoutes = require('./routes/stories');
 
// Initialize the Express App
const app = express();
 
// Middleware
app.use(express.json()); // For parsing JSON
app.use(cors()); // Enable CORS
 
// API Routes
app.use('/api/tribes', tribesRoutes); // Routes for tribes
app.use('/api/stories', storiesRoutes); // Routes for stories
 
// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Aurora Project Backend!');
});
 
module.exports = app; // Export the app instance
 