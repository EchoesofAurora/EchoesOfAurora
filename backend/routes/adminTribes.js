const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Database connection

// Get All Tribes (Admin View)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tribes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a Single Tribe by ID (with associated images via tribe_id)
router.get('/:tribeId', async (req, res) => {
  const { tribeId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tribes WHERE tribe_id = $1', [tribeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }

    const tribe = result.rows[0];

    // Fetch associated images from image_store using tribe_id (avoiding tribe_images)
    const imagesResult = await pool.query(
      'SELECT media_id, media_name, media_type, image_data FROM image_store WHERE tribe_id = $1',
      [tribeId]
    );
    
    // Convert image_data (Buffer) to base64 string for frontend compatibility
    tribe.images = imagesResult.rows.map(row => ({
      media_id: row.media_id,
      media_name: row.media_name,
      media_type: row.media_type,
      image_data: row.image_data.toString('base64'), // Convert Buffer to base64
    }));

    res.json(tribe);
  } catch (err) {
    console.error(`Error fetching tribe_id ${tribeId}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Add a New Tribe (Admin CRUD)
router.post('/', async (req, res) => {
  const { tribe_name, tribe_text, tribe_references, start_year, end_year, published, geojson_data, map_color } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tribes (tribe_name, tribe_text, tribe_references, start_year, end_year, published, geojson_data, map_color) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [tribe_name, tribe_text, tribe_references, start_year, end_year, published, geojson_data, map_color]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Tribe by ID (Admin CRUD) without tribe_images
router.put('/:tribeId', async (req, res) => {
  const { tribeId } = req.params;
  const { tribe_name, tribe_text, tribe_references, start_year, end_year, published, geojson_data, map_color } = req.body;

  try {
    // Fetch current tribe data to preserve non-nullable fields
    const currentTribeResult = await pool.query('SELECT * FROM tribes WHERE tribe_id = $1', [tribeId]);
    if (currentTribeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }

    const currentTribe = currentTribeResult.rows[0];

    // Use current values for missing required fields
    const updateData = {
      tribe_name: tribe_name || currentTribe.tribe_name,
      tribe_text: tribe_text || currentTribe.tribe_text,
      tribe_references: tribe_references || currentTribe.tribe_references,
      start_year: start_year !== undefined ? start_year : currentTribe.start_year,
      end_year: end_year !== undefined ? end_year : currentTribe.end_year,
      published: published !== undefined ? published : currentTribe.published,
      geojson_data: geojson_data || currentTribe.geojson_data,
      map_color: map_color || currentTribe.map_color,
    };

    const result = await pool.query(
      `UPDATE tribes SET tribe_name = $1, tribe_text = $2, tribe_references = $3, start_year = $4, 
       end_year = $5, published = $6, geojson_data = $7, map_color = $8 WHERE tribe_id = $9 RETURNING *`,
      [
        updateData.tribe_name,
        updateData.tribe_text,
        updateData.tribe_references,
        updateData.start_year,
        updateData.end_year,
        updateData.published,
        updateData.geojson_data,
        updateData.map_color,
        tribeId
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Tribe by ID (Admin CRUD)
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