const express = require('express');
const router = express.Router();
const client = require('../config/db'); // Use the existing client from db.js

// GET all stories (admin view)
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM stories');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching stories:', err.stack);
    res.status(500).json({ error: 'Failed to fetch stories', details: err.message });
  }
});

// GET a single story by ID (admin view, with associated images)
router.get('/:storyId', async (req, res) => {
  const { storyId } = req.params;
  try {
    const storyResult = await client.query('SELECT * FROM stories WHERE story_id = $1', [storyId]);
    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const story = storyResult.rows[0];

    // Fetch associated images from image_store using story_id
    const imagesResult = await client.query(
      'SELECT media_id, media_name, media_type, image_data FROM image_store WHERE story_id = $1',
      [storyId]
    );

    // Convert image_data (Buffer) to base64 string for frontend compatibility
    story.images = imagesResult.rows.map(row => ({
      media_id: row.media_id,
      media_name: row.media_name,
      media_type: row.media_type,
      image_data: row.image_data.toString('base64'),
    }));

    res.json(story);
  } catch (err) {
    console.error(`Error fetching story_id ${storyId}:`, err.stack);
    res.status(500).json({ error: 'Failed to fetch story', details: err.message });
  }
});

// POST - Add a new story
router.post('/', async (req, res) => {
  const { story_name, tribe_id, story_year, story_text, story_references, published } = req.body;

  // Validate required fields
  if (!story_name || !tribe_id || !story_year || !story_text) {
    return res.status(400).json({ error: 'Missing required fields: story_name, tribe_id, story_year, story_text' });
  }

  try {
    const result = await client.query(
      `INSERT INTO stories (story_name, tribe_id, story_year, story_text, story_references, published)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [story_name, tribe_id, story_year, story_text, story_references || null, published || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating story:', err.stack);
    res.status(500).json({ error: 'Failed to create story', details: err.message });
  }
});

// PUT - Update a story by ID
router.put('/:storyId', async (req, res) => {
  const { storyId } = req.params;
  const { story_name, tribe_id, story_year, story_text, story_references, published } = req.body;

  try {
    // Check if story exists
    const currentStoryResult = await client.query('SELECT * FROM stories WHERE story_id = $1', [storyId]);
    if (currentStoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const currentStory = currentStoryResult.rows[0];

    // Use current values for missing fields
    const updateData = {
      story_name: story_name || currentStory.story_name,
      tribe_id: tribe_id !== undefined ? tribe_id : currentStory.tribe_id,
      story_year: story_year || currentStory.story_year,
      story_text: story_text || currentStory.story_text,
      story_references: story_references || currentStory.story_references,
      published: published !== undefined ? published : currentStory.published,
    };

    const result = await client.query(
      `UPDATE stories 
       SET story_name = $1, tribe_id = $2, story_year = $3, story_text = $4, story_references = $5, published = $6 
       WHERE story_id = $7 RETURNING *`,
      [
        updateData.story_name,
        updateData.tribe_id,
        updateData.story_year,
        updateData.story_text,
        updateData.story_references,
        updateData.published,
        storyId
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating story_id ${storyId}:`, err.stack);
    res.status(500).json({ error: 'Failed to update story', details: err.message });
  }
});

// DELETE - Remove a story by ID
router.delete('/:storyId', async (req, res) => {
  const { storyId } = req.params;
  try {
    const result = await client.query('DELETE FROM stories WHERE story_id = $1 RETURNING *', [storyId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json({ message: 'Story deleted successfully', story: result.rows[0] });
  } catch (err) {
    console.error(`Error deleting story_id ${storyId}:`, err.stack);
    res.status(500).json({ error: 'Failed to delete story', details: err.message });
  }
});

module.exports = router;