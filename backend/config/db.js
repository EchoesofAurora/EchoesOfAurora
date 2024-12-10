const { Client } = require('pg');
 
// Database connection configuration (hardcoded credentials)
const client = new Client({
    host: 'localhost',
    user: 'devakodali', // Replace with your database username
    password: 'admin123', // Replace with your database password
    database: 'echoes_of_aurora', // Replace with your database name
    port: 5432, // Default PostgreSQL port
});
 
// Connect to the database
client.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});
 
module.exports = client;