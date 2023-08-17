const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Sign Up route
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        user = new User({
            username,
            password
        });

        await user.save();
        res.json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password by directly comparing them
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update to send success and plants data (assuming user.garden is the plants data)
        res.json({ success: true, message: 'Logged in successfully', plants: user.garden });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
