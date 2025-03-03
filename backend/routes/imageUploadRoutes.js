const express = require('express');
const multer = require('multer');
const client = require('../config/db');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route to upload images for tribes or stories
router.post('/upload', upload.array('images', 10), async (req, res) => {
  const { tribe_id, story_id } = req.body;

  if (!tribe_id && !story_id) {
    return res.status(400).json({ message: 'Either tribe_id or story_id must be provided' });
  }

  try {
    if (tribe_id) {
      const tribeCheck = await client.query('SELECT tribe_id FROM tribes WHERE tribe_id = $1', [tribe_id]);
      if (tribeCheck.rows.length === 0) {
        return res.status(400).json({ message: `Tribe with ID ${tribe_id} does not exist` });
      }
    }
    if (story_id) {
      const storyCheck = await client.query('SELECT story_id FROM stories WHERE story_id = $1', [story_id]);
      if (storyCheck.rows.length === 0) {
        return res.status(400).json({ message: `Story with ID ${story_id} does not exist` });
      }
    }

    const uploadedMediaIds = [];
    const queries = req.files.map((file) => {
      const query = `
        INSERT INTO image_store (media_name, media_type, image_data, tribe_id, story_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING media_id;
      `;
      const values = [file.originalname, file.mimetype, file.buffer, tribe_id || null, story_id || null];
      return client.query(query, values).then(result => uploadedMediaIds.push(result.rows[0].media_id));
    });

    await Promise.all(queries);
    res.status(200).json({ message: 'Images uploaded successfully', media_ids: uploadedMediaIds });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

// Route to delete an image by media_id with tribe_id validation
router.delete('/images/:mediaId', async (req, res) => {
  const { mediaId } = req.params;
  const tribeId = req.query.tribe_id; // Expect tribe_id as a query parameter

  if (!tribeId) {
    return res.status(400).json({ message: 'tribe_id is required for deletion' });
  }

  try {
    const tribeCheck = await client.query('SELECT tribe_id FROM tribes WHERE tribe_id = $1', [tribeId]);
    if (tribeCheck.rows.length === 0) {
      return res.status(400).json({ message: `Tribe with ID ${tribeId} does not exist` });
    }

    const result = await client.query(
      'DELETE FROM image_store WHERE media_id = $1 AND tribe_id = $2 RETURNING *',
      [mediaId, tribeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: `Image with media_id ${mediaId} not found for tribe_id ${tribeId}` });
    }
    console.log(`Deleted image with media_id ${mediaId} for tribe_id ${tribeId}`);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image', error: error.message });
  }
});

module.exports = router;