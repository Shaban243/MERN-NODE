const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// Route for Registering a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with given email already exists' });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        const savedUser = await newUser.save();
        const payLoad = { id: savedUser._id };
        const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            },
            token
        });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ message: 'Server Error', Error: err.message });
    }
});

// Route for logging an existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password!' });
        
        console.log('User found:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)  return res.status(400).json({ message: 'Invalid email or password' });
        
        const payLoad = { id: user._id, role: user.role };
        const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ message: 'Server Error', Error: err.message });
    }
});

module.exports = router;


