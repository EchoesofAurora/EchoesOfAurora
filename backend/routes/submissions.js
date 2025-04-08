const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const crypto = require('crypto');

// POST route for contact form submissions
router.post('/', async (req, res) => {
  const { name, email, phone, topic, message } = req.body;

  // Hash the phone number for security
  const phoneHash = crypto.createHash('sha256').update(phone || '').digest('hex');

  try {
    const query = `
      INSERT INTO user_submissions (name, email, phone_hash, topic, message, is_read)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, email, phoneHash, topic, message, false]; // Default to unread
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving submission:', err.stack);
    res.status(500).json({ error: 'Failed to save submission', details: err.message });
  }
});

// GET route to fetch all submissions (for admin panel)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, topic, message, stared, is_read, created_at
      FROM user_submissions
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching submissions:', err.stack);
    res.status(500).json({ error: 'Failed to fetch submissions', details: err.message });
  }
});

// GET route to fetch starred submissions
router.get('/starred', async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, topic, message, stared, is_read, created_at
      FROM user_submissions
      WHERE stared = true
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching starred submissions:', err.stack);
    res.status(500).json({ error: 'Failed to fetch starred submissions', details: err.message });
  }
});

// GET route to fetch unread submissions
router.get('/unread', async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, topic, message, stared, is_read, created_at
      FROM user_submissions
      WHERE is_read = false
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching unread submissions:', err.stack);
    res.status(500).json({ error: 'Failed to fetch unread submissions', details: err.message });
  }
});

// GET route to fetch a single submission by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT id, name, email, topic, message, stared, is_read, created_at
      FROM user_submissions
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found', details: 'No submission with the provided ID exists' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching submission_id ${id}:`, err.stack);
    res.status(500).json({ error: 'Failed to fetch submission', details: err.message });
  }
});

// PUT route to toggle starred status
router.put('/:id/star', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE user_submissions
      SET stared = NOT stared
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found', details: 'No submission with the provided ID exists' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error toggling star status:', err.stack);
    res.status(500).json({ error: 'Failed to toggle star status', details: err.message });
  }
});

// PUT route to mark a submission as read
router.put('/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE user_submissions
      SET is_read = true
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found', details: 'No submission with the provided ID exists' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error marking submission as read:', err.stack);
    res.status(500).json({ error: 'Failed to mark submission as read', details: err.message });
  }
});

// DELETE route to permanently delete a submission
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      DELETE FROM user_submissions
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found', details: 'No submission with the provided ID exists' });
    }
    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (err) {
    console.error('Error deleting submission:', err.stack);
    res.status(500).json({ error: 'Failed to delete submission', details: err.message });
  }
});

module.exports = router;