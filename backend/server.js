const app = require('./app'); // Import the app instance from app.js
 
// Port Configuration
const PORT = process.env.PORT || 5001; // Use PORT from environment variables or default to 5001
 
// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});