const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import Database Pool

// Get All Tribes
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

// Add a Tribe
router.post('/', async (req, res) => {
  const { tribe_name, tribe_text, start_year, end_year } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tribes (tribe_name, tribe_text, start_year, end_year) VALUES ($1, $2, $3, $4) RETURNING *',
      [tribe_name, tribe_text, start_year, end_year]
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
