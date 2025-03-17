const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get All Published Stories (User-facing)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stories WHERE published = true');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching published stories:', err.stack);
    res.status(500).json({ error: 'Failed to fetch published stories', details: err.message });
  }
});

// Get a Single Published Story by ID (User-facing)
router.get('/:storyId', async (req, res) => {
  const { storyId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM stories WHERE story_id = $1 AND published = true', [storyId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found or not published' });
    }

    const story = result.rows[0];

    // Fetch associated images
    const imagesResult = await pool.query(
      'SELECT media_id, media_name, media_type, image_data FROM image_store WHERE story_id = $1',
      [storyId]
    );

    // Convert image_data (Buffer) to base64
    story.images = imagesResult.rows.map(row => ({
      media_id: row.media_id,
      media_name: row.media_name,
      media_type: row.media_type,
      image_data: row.image_data ? row.image_data.toString('base64') : null,
    }));

    res.status(200).json(story);
  } catch (err) {
    console.error(`Error fetching story_id ${storyId}:`, err.stack);
    res.status(500).json({ error: 'Failed to fetch story', details: err.message });
  }
});

module.exports = router;