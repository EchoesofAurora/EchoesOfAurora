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

// Get a Single Tribe by ID
router.get('/:tribeId', async (req, res) => {
  const { tribeId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tribes WHERE tribe_id = $1', [tribeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a New Tribe (Admin CRUD)
router.post('/', async (req, res) => {
  const { tribe_name, tribe_text, tribe_images, tribe_references, start_year, end_year, published, geojson_data, map_color } = req.body;
  try {
    
    const result = await pool.query(
      `INSERT INTO tribes (tribe_name, tribe_text, tribe_images, tribe_references, start_year, end_year, published, geojson_data, map_color) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [tribe_name, tribe_text, tribe_images, tribe_references, start_year, end_year, published, geojson_data, map_color]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Tribe by ID (Admin CRUD)
router.put('/:tribeId', async (req, res) => {
  const { tribeId } = req.params;
  const { tribe_name, tribe_text, tribe_images, tribe_references, start_year, end_year, published, geojson_data, map_color } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tribes SET tribe_name = $1, tribe_text = $2, tribe_images = $3, tribe_references = $4, start_year = $5, 
       end_year = $6, published = $7, geojson_data = $8, map_color = $9 WHERE tribe_id = $10 RETURNING *`,
      [tribe_name, tribe_text, tribe_images, tribe_references, start_year, end_year, published, geojson_data, map_color, tribeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tribe not found' });
    }

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
