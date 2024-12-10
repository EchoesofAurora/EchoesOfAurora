const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import Database Pool

// Get All Stories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a Single Story by ID
router.get('/:storyId', async (req, res) => {
  const { storyId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM stories WHERE story_id = $1', [storyId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a Story
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

// Update a Story by ID
router.put('/:storyId', async (req, res) => {
  const { storyId } = req.params;
  const { story_name, story_text, tribe_id, story_year } = req.body;

  try {
    const result = await pool.query(
      'UPDATE stories SET story_name = $1, story_text = $2, tribe_id = $3, story_year = $4 WHERE story_id = $5 RETURNING *',
      [story_name, story_text, tribe_id, story_year, storyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Story by ID
router.delete('/:storyId', async (req, res) => {
  const { storyId } = req.params;
  try {
    const result = await pool.query('DELETE FROM stories WHERE story_id = $1 RETURNING *', [storyId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json({ message: 'Story deleted successfully', story: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
