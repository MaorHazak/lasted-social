
const express = require('express');
const router = express.Router();
const Comments = require('../Model/Comments')

// Create a new Data
router.post('/new', async (req, res) => {
    try {
        const user = new Comments(req.body);
        const data = await user.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Data
router.get('/', async (req, res) => {
    try {
        const users = await Comments.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/get/:id', async (req, res) => {
    try {
        const user = await Comments.find({ postId: req.params.id });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update a Data by ID
router.put('/:id', async (req, res) => {

    try {
        const user = await Comments.updateOne({_id: req.params.id}, {
            comment: req.body.comment
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a Data by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await Comments.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

