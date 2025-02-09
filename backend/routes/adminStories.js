const express = require('express');
const router = express.Router();
const Story = require('../models/Story');  // Assuming Story model exists

// GET all stories (admin view)
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stories' });
    }
});

// POST - Add a new story
router.post('/', async (req, res) => {
    try {
        const newStory = new Story(req.body);
        await newStory.save();
        res.status(201).json(newStory);
    } catch (error) {
        res.status(500).json({ error: 'Error creating story' });
    }
});

// PUT - Update a story
router.put('/:id', async (req, res) => {
    try {
        const updatedStory = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedStory);
    } catch (error) {
        res.status(500).json({ error: 'Error updating story' });
    }
});

// DELETE - Remove a story
router.delete('/:id', async (req, res) => {
    try {
        await Story.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting story' });
    }
});

module.exports = router;
