const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 25
    }, 

    email: {
        type: String, 
        required: true,
        unique: true,
        minLength: 25,
        maxLength: 255,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
    },

    age: {
        type: Number,
        required: true,
        min: 18
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;