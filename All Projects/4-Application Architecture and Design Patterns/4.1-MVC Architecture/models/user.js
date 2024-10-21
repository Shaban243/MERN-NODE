const mongoose = require('mongoose');
const validator = require('validator');

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
        minLength: 15,
        maxLength: 255,
        // match: [validator.isEmail, 'Please enter a valid email address']
    },

    
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 250
    },
    
    age: {
        type: Number,
        required: true
    },
});


const User = mongoose.model('User', userSchema);

module.exports = User;