const express = require('express');
const logger = require('./middleware/logger')
const app = express();

const PORT = 3000;

// Get Route for handling HTTP requests at rool URL
app.get('/', (req, res) => {

    res.send('Hello World from Express.js!');
});

app.listen( PORT, () => console.log(`The Server is running on http://localhost:${PORT}`));

