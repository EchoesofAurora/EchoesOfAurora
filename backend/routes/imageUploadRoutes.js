const express = require('express');
const multer = require('multer');
const client = require('../config/db'); // Import database client

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files temporarily in memory

// Route to upload images for tribes or stories
router.post('/upload', upload.array('images', 10), async (req, res) => {
    const { tribe_id, story_id } = req.body;

    try {
        // Prepare and execute insertion queries for all uploaded images
        const queries = req.files.map((file) => {
            const query = `
                INSERT INTO image_store (media_name, media_type, image_data, tribe_id, story_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING media_id;
            `;
            const values = [
                file.originalname,
                file.mimetype,
                file.buffer,  // Store binary data directly
                tribe_id || null,
                story_id || null
            ];
            return client.query(query, values);
        });

        await Promise.all(queries);  // Execute all insertion queries
        res.status(200).json({ message: 'Images uploaded successfully' });
    } catch (error) {
        console.error('Error uploading images:', error.stack);  // Log detailed error info
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

module.exports = router;
