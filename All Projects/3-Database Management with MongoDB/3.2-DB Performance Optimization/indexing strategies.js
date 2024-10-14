                        // This file includes all the strategies of indexing
                        // Following are the types of indexing when we working with mongodb database

                        // 1- Single field indexing => Applies single index on one field in a whole document
                        // 2- Compound field indexing => Applies indexes on more than one fields
                        // 3- Multi-key field indexing => Applies indexes on array type, iterate over array contents
                        // 4- Text field indexing => Applies indexes whenever we need to search text in a given string
                        // 5- Geo-spatial field indexing => Applies indexes querying on geo-graphical data 


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     }, 

//     email: {
//         type: String,
//         required: [true, 'Please enter valid email address'],
//         unique: true,
//         minLength: 10,
//         maxLength: 25,
//         match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

//     },

//     age: {
//         type: Number,
//         required: true
//     }
// });


// userSchema.index({ email: 1 });     // Single field index
// userSchema.index({ name: 1, age: -1});   // Compound index


// const User = mongoose.model('User', userSchema);

// const dbURL = process.env.MONGO_URL;
// console.log('The DBURL is: ', dbURL);
// mongoose.connect(dbURL)
// .then( () => console.log('MongoDB connected successfully...'))
// .catch( err => console.error('MongoDB connection failed...', err));                     