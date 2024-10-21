const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const routes = require('./routes/userRoute.js');
    

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', routes);


const PORT = process.env.PORT || 3000;

const dbURL = process.env.MONGO_URL;
console.log('DBURL is: ', dbURL);

mongoose.connect(dbURL)
.then( () => console.log('MongoDB connected successfully...'))
.catch( err => console.error('MongoDB connection failed...', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/home', (req, res) => {
    res.send('This is Application Architecture and Design Patterns Project!');
});


app.get('/title', (req, res) => {
    res.render('index', {pageTitle: 'Index view', message: 'Welcome to MVC Architecture App!'});
});

app.get('/users', (req, res) => {
    res.render('users', {pageTitle:'New User'});
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});


app.listen( PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));