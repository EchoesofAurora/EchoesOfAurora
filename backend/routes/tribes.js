// const express = require('express');
// const router = express.Router();
// const pool = require('../config/db'); // Import Database Pool

// // Get All Tribes
// router.get('/', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM tribes');
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Add a Tribe
// router.post('/', async (req, res) => {
//   const { tribe_name, tribe_text, start_year, end_year } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO tribes (tribe_name, tribe_text, start_year, end_year) VALUES ($1, $2, $3, $4) RETURNING *',
//       [tribe_name, tribe_text, start_year, end_year]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();

// Mock Route: Get All Tribes
router.get('/', (req, res) => {
    res.json({ message: 'All tribes route works!' });
});

// Mock Route: Add a Tribe
router.post('/', (req, res) => {
    res.json({ message: 'Add tribe route works!' });
});

module.exports = router; // Export the router
