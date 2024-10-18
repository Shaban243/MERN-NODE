const express = require('express');
const app = express();
const logger = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/error-handler.js');
const userRoutes = require('./routes/userRoutes.js');

app.use(express.json());

app.use(logger);            // Use logger middleware
app.use(errorHandler);     // Use error handler middleware

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen( PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));

