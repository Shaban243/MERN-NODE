const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        minLength: 10,
        maxLength: 255,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    }, 

    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 255
    }
});

// Hash password before saving the user into the database
userSchema.pre('save', async function(next) {
    try {   
        if (!this.isModified('password')) return next(); 

        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt);

        next(); 
    } catch (err) {
        next(err); 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
