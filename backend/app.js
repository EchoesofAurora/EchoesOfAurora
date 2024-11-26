// Import required modules
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON data
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Aurora Project Backend!');
});

// Export the app to be used in server.js
module.exports = app;
