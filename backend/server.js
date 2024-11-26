// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(express.json()); // For parsing JSON data

// // Routes
// app.get('/', (req, res) => {
//   res.send('Welcome to the Aurora Project Backend!');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const app = require('./app');

// Port Configuration
const PORT = process.env.PORT || 5001;

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

