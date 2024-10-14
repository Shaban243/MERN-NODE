// const express = require('express');
// const mongoose  = require('mongoose');
// const dotenv = require('dotenv');
// const postRoutes = require('./routes/postRoute.js');


// const app = express();
// app.use(express.json());


// dotenv.config();

// const  PORT = 3000;

// const dbURL = process.env.MONGO_URL;
// console.log('DBURL is: ', dbURL);
// app.use('/api', postRoutes);
// mongoose.connect(dbURL)
// .then( () => console.log('MongoDB connected Successfully...'))
// .catch( (err) => console.error('MongoDB connection failed...', err.message));


// app.get('/', (req, res) => {
//     res.send('Welcome to User and Post Validation Schema!');
// });

// app.listen( PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));