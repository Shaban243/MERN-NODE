const express = require('express');
const app = express();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) return res.status(404).json({ message: 'No users data found!' });

        console.log('Fetching users data: ', users);
        res.render('users', { pageTitle: 'User List', users });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
};


// Render form to add a new user
const renderNewUserForm = (req, res) => {
    res.render('new-user', { pageTitle: 'Add a new user' });
};


// Create a new user
const createUser = async (req, res) => {
    const { name, email, password, age } = req.body;

    try {
        const newUser = new User({ name, email, password, age });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const savedUser = await newUser.save(hashedPassword);

        console.log(savedUser);
        res.redirect('/api/v1/users');
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Server Error', error: err.message });
    }
};


// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ message: 'User with the given ID was not found' });

        res.render('userdetails', { pageTitle: 'User Details', user });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Server Error', error: err.message });
    }
};


// Render a form to update user
const editNewUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ message: 'User not found' });

        res.render('edit-user', { pageTitle: 'Edit User', user });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Server Error', error: err.message });
    }
};


// Update user details by id
const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, age } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate
            (id, { name, email, password, age }, { new: true, runValidators: true });
        if (!updatedUser) return res.status(400).json({ message: 'User with the given ID was not found!' });

        res.redirect('/users');
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Server Error', error: err.message });
    }
};



// Delete user by ID
const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(400).json({ message: 'User with the given ID was not found!' });

        res.redirect('/users');
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getAllUsers,
    renderNewUserForm,
    createUser,
    getUserById,
    editNewUserForm,
    updateUserById,
    deleteUserById
};
