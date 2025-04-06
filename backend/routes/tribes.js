const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import Database Pool

// Get All Tribes with Images (User-facing)
router.get('/', async (req, res) => {
  try {
    // Fetch published tribes with their first image
    const result = await pool.query(`
      SELECT 
        t.tribe_id,
        t.tribe_name,
        t.tribe_text,
        t.start_year,
        t.end_year,
        t.published,
        i.media_id,
        i.media_name,
        i.media_type,
        i.image_data
      FROM
        public.tribes t
      LEFT JOIN (
        SELECT DISTINCT ON (tribe_id) *
        FROM image_store
        WHERE tribe_id IS NOT NULL
        ORDER BY tribe_id, media_id ASC
      ) i ON i.tribe_id = t.tribe_id
      WHERE
        t.published = true;`);
    
    // Transform the image_data to base64 in each row
    const formattedResults = result.rows.map(row => ({
      ...row,
      image_data: row.image_data ? row.image_data.toString('base64') : null
    }));

    res.status(200).json(formattedResults);
  } catch (err) {
    console.error("Error fetching published tribes:", err.stack);
    res.status(500).json({ 
      error: "Failed to fetch published tribes", 
      details: err.message 
    });
  }
});

// Get a Single Tribe by ID
router.get('/:tribeId', async (req, res) => {
  const { tribeId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tribes WHERE tribe_id = $1 AND published = true', [tribeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tribe not found or unpublished' });
    }
    
    // Get the tribe data
    const tribe = result.rows[0];
    
    // Fetch associated images
    const imagesResult = await pool.query(
      "SELECT media_id, media_name, media_type, image_data FROM image_store WHERE tribe_id = $1",
      [tribeId]
    );

    // Convert image_data (Buffer) to base64
    tribe.images = imagesResult.rows.map((row) => ({
      media_id: row.media_id,
      media_name: row.media_name,
      media_type: row.media_type,
      image_data: row.image_data ? row.image_data.toString("base64") : null,
    }));
    
    // Fetch related stories from the same tribe
    const relatedStoriesResult = await pool.query(`
      SELECT 
        s.story_id, 
        s.story_name, 
        s.story_year, 
        s.story_text,
        i.media_id, 
        i.media_type, 
        i.image_data 
      FROM 
        public.stories s
      LEFT JOIN (
        SELECT DISTINCT ON (story_id) *
        FROM image_store
        ORDER BY story_id, media_id ASC
      ) i ON i.story_id = s.story_id
      WHERE 
        s.tribe_id = $1 AND s.published = true
      LIMIT 3
    `, [tribeId]);
    
    // Convert image_data to base64 for related stories
    tribe.relatedStories = relatedStoriesResult.rows.map(story => ({
      story_id: story.story_id,
      story_name: story.story_name,
      story_year: story.story_year,
      story_text: story.story_text,
      media_id: story.media_id,
      media_type: story.media_type,
      image_data: story.image_data ? story.image_data.toString('base64') : null
    }));
    
    res.json(tribe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
});

// Create a new Tribe
router.post('/', async (req, res) => {
  const { tribe_name, tribe_text, start_year, end_year, published } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tribes (tribe_name, tribe_text, start_year, end_year, published) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tribe_name, tribe_text, start_year, end_year, published]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Tribe by ID
router.put('/:tribeId', async (req, res) => {
  const { tribeId } = req.params;
  const { tribe_name, tribe_text, start_year, end_year } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tribes SET tribe_name = $1, tribe_text = $2, start_year = $3, end_year = $4 WHERE tribe_id = $5 RETURNING *',
      [tribe_name, tribe_text, start_year, end_year, tribeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Tribe by ID
router.delete('/:tribeId', async (req, res) => {
  const { tribeId } = req.params;
  try {
    const result = await pool.query('DELETE FROM tribes WHERE tribe_id = $1 RETURNING *', [tribeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }
    res.json({ message: 'Tribe deleted successfully', tribe: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;