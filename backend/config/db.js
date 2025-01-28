require('dotenv').config(); // Load environment variables
const { Client } = require('pg'); // PostgreSQL client

// Database connection configuration
const client = new Client({
    host: process.env.DB_HOST, // Use environment variable
    user: process.env.DB_USER, // Use environment variable
    password: process.env.DB_PASSWORD, // Use environment variable
    database: process.env.DB_NAME, // Use environment variable
    port: process.env.DB_PORT, // Use environment variable
});
//sdfasdfasd
// Connect to the database
client.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = client;
