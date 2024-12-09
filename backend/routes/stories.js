const express = require('express');
const router = express.Router();
const pool = require('../config/db.js'); // Assuming you have a db.js for database connection
 
// Get all stories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// Add a new story
router.post('/', async (req, res) => {
  const { story_name, story_text, tribe_id, story_year } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO stories (story_name, story_text, tribe_id, story_year) VALUES ($1, $2, $3, $4) RETURNING *',
      [story_name, story_text, tribe_id, story_year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;