require('dotenv').config(); // Load environment variables
const { Client } = require('pg'); // PostgreSQL client

// Database connection configuration
let connectionConfig;

// Check if Heroku's DATABASE_URL is available
if (process.env.DATABASE_URL) {
    // Use Heroku's DATABASE_URL
    connectionConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Heroku PostgreSQL
        }
    };
} else {
    // Use local environment variables for development
    connectionConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    };
}

const client = new Client(connectionConfig);

// Connect to the database
client.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = client;
