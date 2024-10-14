// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const authmiddleware = require('./middleware/authmiddleware.js')
// const authentication = require('./routes/authentication.js');

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use('/api/authentication', authentication);

// const PORT = 3000;
// const dbURL = process.env.MONGO_URL;
// console.log("DBURL is: ", dbURL);

// app.get('/', (req, res) =>{
//     res.send('Welcome to the Authentication page');
// });

// app.use('/protected', authmiddleware, (req, res) => {
//     res.send({message: `Hello ${req.user}, this is a protected route`});
// });

// mongoose.connect(dbURL)
// .then( () => console.log("Successfully Connected to MongoDB..."))
// .catch( (err) => console.error('MongoDB connectoin failed...', err));

// app.listen( PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));