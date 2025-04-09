const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Initial lightweight data endpoint
router.get('/', async (req, res) => {
    try {
        // Fetch tribes with minimal data
        const tribeResult = await pool.query(`
            SELECT tribe_id, tribe_name, geojson_data, map_color
            FROM tribes
            WHERE published = true
        `);
        const tribes = tribeResult.rows;

        if (tribes.length === 0) {
            console.log('No published tribes found in the database at:', new Date().toISOString());
        }

        // Fetch stories with minimal data and convert to geometry
        const storyResult = await pool.query(`
            SELECT story_id, story_name, story_year, tribe_id, latitude, longitude
            FROM stories
            WHERE published = true
        `);
        const stories = storyResult.rows.map(story => ({
            story_id: story.story_id,
            story_name: story.story_name,
            story_year: story.story_year,
            tribe_id: story.tribe_id,
            geometry: {
                type: 'MultiPoint',
                coordinates: [[story.longitude, story.latitude]] // [lng, lat] order for Mapbox
            }
        }));

        // Construct the response
        const response = {
            tribes: tribes,
            stories: stories
        };

        res.json(response);
    } catch (err) {
        console.error('Query error:', err.message, 'at:', new Date().toISOString());
        res.status(500).json({ error: err.message });
    }
});

// Admin endpoint that includes all stories (published and unpublished)
router.get('/admin', async (req, res) => {
    try {
        // Fetch all tribes data for admin
        const tribeResult = await pool.query(`
            SELECT tribe_id, tribe_name, geojson_data, map_color
            FROM tribes
        `);
        const tribes = tribeResult.rows;

        // Fetch all stories including unpublished ones
        const storyResult = await pool.query(`
            SELECT story_id, story_name, story_year, tribe_id, latitude, longitude, published
            FROM stories
        `);
        const stories = storyResult.rows.map(story => ({
            story_id: story.story_id,
            story_name: story.story_name,
            story_year: story.story_year,
            tribe_id: story.tribe_id,
            published: story.published,
            geometry: {
                type: 'MultiPoint',
                coordinates: [[story.longitude, story.latitude]] // [lng, lat] order for Mapbox
            }
        }));

        // Construct the response
        const response = {
            tribes: tribes,
            stories: stories
        };

        res.json(response);
    } catch (err) {
        console.error('Admin query error:', err.message, 'at:', new Date().toISOString());
        res.status(500).json({ error: err.message });
    }
});

// Endpoint for detailed tribe data including all stories
router.get('/tribes/:tribeId', async (req, res) => {
    const { tribeId } = req.params;
    try {
        // Fetch tribe details
        const tribeResult = await pool.query(
            `SELECT tribe_id, tribe_name, tribe_text, tribe_references,start_year, end_year
             FROM tribes
             WHERE tribe_id = $1 AND published = true`,
            [tribeId]
        );
        const tribe = tribeResult.rows[0];

        if (!tribe) {
            return res.status(404).json({ error: 'Tribe not found' });
        }

        // Fetch the first image for the tribe
        const tribeImageResult = await pool.query(
            `SELECT media_id, media_name, media_type, image_data
             FROM image_store
             WHERE tribe_id = $1
             ORDER BY media_id ASC
             LIMIT 1`,
            [tribeId]
        );
        const tribeImage = tribeImageResult.rows[0] ? {
            media_id: tribeImageResult.rows[0].media_id,
            media_name: tribeImageResult.rows[0].media_name,
            media_type: tribeImageResult.rows[0].media_type,
            image_data: tribeImageResult.rows[0].image_data ? tribeImageResult.rows[0].image_data.toString('base64') : null
        } : null;

        // Fetch all stories for the tribe
        const storyResult = await pool.query(
            `SELECT story_id, story_name, story_text, story_references, tribe_id, story_year
             FROM stories
             WHERE tribe_id = $1 AND published = true`,
            [tribeId]
        );
        const stories = storyResult.rows;

        // Fetch the first image for each story
        const storiesWithImages = await Promise.all(stories.map(async (story) => {
            const imageResult = await pool.query(
                `SELECT media_id, media_name, media_type, image_data
                 FROM image_store
                 WHERE story_id = $1
                 ORDER BY media_id ASC
                 LIMIT 1`,
                [story.story_id]
            );
            const image = imageResult.rows[0] ? {
                media_id: imageResult.rows[0].media_id,
                media_name: imageResult.rows[0].media_name,
                media_type: imageResult.rows[0].media_type,
                image_data: imageResult.rows[0].image_data ? imageResult.rows[0].image_data.toString('base64') : null
            } : null;

            return {
                story_id: story.story_id,
                story_name: story.story_name,
                story_text: story.story_text,
                story_references: story.story_references,
                story_year: story.story_year,
                tribe_id: story.tribe_id,
                image: image
            };
        }));

        const response = {
            tribe_id: tribe.tribe_id,
            tribe_name: tribe.tribe_name,
            tribe_text: tribe.tribe_text,
            tribe_references: tribe.tribe_references,
            image: tribeImage,
            start_year: tribe.start_year,
            end_year: tribe.end_year,
            stories: storiesWithImages
        };

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin endpoint for detailed tribe data including all stories (published and unpublished)
router.get('/admin/tribes/:tribeId', async (req, res) => {
    const { tribeId } = req.params;
    try {
        // Fetch tribe details without published filter
        const tribeResult = await pool.query(
            `SELECT tribe_id, tribe_name, tribe_text, tribe_references, start_year, end_year, published
             FROM tribes
             WHERE tribe_id = $1`,
            [tribeId]
        );
        const tribe = tribeResult.rows[0];

        if (!tribe) {
            return res.status(404).json({ error: 'Tribe not found' });
        }

        // Fetch the first image for the tribe
        const tribeImageResult = await pool.query(
            `SELECT media_id, media_name, media_type, image_data
             FROM image_store
             WHERE tribe_id = $1
             ORDER BY media_id ASC
             LIMIT 1`,
            [tribeId]
        );
        const tribeImage = tribeImageResult.rows[0] ? {
            media_id: tribeImageResult.rows[0].media_id,
            media_name: tribeImageResult.rows[0].media_name,
            media_type: tribeImageResult.rows[0].media_type,
            image_data: tribeImageResult.rows[0].image_data ? tribeImageResult.rows[0].image_data.toString('base64') : null
        } : null;

        // Fetch all stories for the tribe including unpublished
        const storyResult = await pool.query(
            `SELECT story_id, story_name, story_text, story_references, tribe_id, story_year, published, latitude, longitude
             FROM stories
             WHERE tribe_id = $1`,
            [tribeId]
        );
        const stories = storyResult.rows;

        // Fetch the first image for each story
        const storiesWithImages = await Promise.all(stories.map(async (story) => {
            const imageResult = await pool.query(
                `SELECT media_id, media_name, media_type, image_data
                 FROM image_store
                 WHERE story_id = $1
                 ORDER BY media_id ASC
                 LIMIT 1`,
                [story.story_id]
            );
            const image = imageResult.rows[0] ? {
                media_id: imageResult.rows[0].media_id,
                media_name: imageResult.rows[0].media_name,
                media_type: imageResult.rows[0].media_type,
                image_data: imageResult.rows[0].image_data ? imageResult.rows[0].image_data.toString('base64') : null
            } : null;

            return {
                story_id: story.story_id,
                story_name: story.story_name,
                story_text: story.story_text,
                story_references: story.story_references,
                story_year: story.story_year,
                tribe_id: story.tribe_id,
                published: story.published,
                latitude: story.latitude,
                longitude: story.longitude,
                image: image
            };
        }));

        const response = {
            tribe_id: tribe.tribe_id,
            tribe_name: tribe.tribe_name,
            tribe_text: tribe.tribe_text,
            tribe_references: tribe.tribe_references,
            image: tribeImage,
            published: tribe.published,
            start_year: tribe.start_year,
            end_year: tribe.end_year,
            stories: storiesWithImages
        };

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;