const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'User API',
        version: '1.0.0',
        description: 'API documentation for Building RESTFUL APIs'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server'
        }
    ]
};


const options = {
    swaggerDefinition,
    apis: ['./server.js'],
};


const swaggerSpec = swaggerJsdoc(options);


module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


const swaggerSetup = require('./swagger');
swaggerSetup(app);
