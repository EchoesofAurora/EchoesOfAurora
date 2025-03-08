const express = require('express');
const multer = require('multer');
const client = require('../config/db');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to handle errors and return JSON
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
};

router.post('/upload', upload.array('images', 10), async (req, res) => {
  const { tribe_id, story_id } = req.body;

  if (!tribe_id && !story_id) {
    return res.status(400).json({ message: 'Either tribe_id or story_id must be provided' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images provided for upload' });
  }

  try {
    await client.query('BEGIN');

    const uploadedMediaIds = [];
    for (const file of req.files) {
      const query = `
        INSERT INTO image_store (media_name, media_type, image_data, tribe_id, story_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING media_id;
      `;
      const values = [file.originalname, file.mimetype, file.buffer, tribe_id || null, story_id || null];
      const result = await client.query(query, values);
      uploadedMediaIds.push(result.rows[0].media_id);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Images uploaded successfully', media_ids: uploadedMediaIds });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

router.delete('/:mediaId', async (req, res) => {
  const { mediaId } = req.params;
  const { tribe_id } = req.query; // Optionally handle tribe_id as a query parameter

  try {
    // Verify the image exists and belongs to the tribe (if tribe_id is provided)
    const imageCheck = await client.query(
      'SELECT * FROM image_store WHERE media_id = $1 AND (tribe_id = $2 OR $2 IS NULL)',
      [mediaId, tribe_id ? parseInt(tribe_id) : null]
    );
    if (imageCheck.rows.length === 0) {
      return res.status(404).json({ message: `Image with media_id ${mediaId} not found or not associated with tribe_id ${tribe_id}.` });
    }

    const result = await client.query('DELETE FROM image_store WHERE media_id = $1 RETURNING *', [mediaId]);

    res.status(200).json({ message: `Image ${mediaId} deleted successfully`, deletedImage: result.rows[0] });

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image', error: error.message });
  }
});

// Apply error handling middleware
router.use(errorHandler);

module.exports = router;