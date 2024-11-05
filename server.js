const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const carRoutes = require('./routes/cars');

const app = express();
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Car API',
            version: '1.0.0',
            description: 'API documentation for Cars CRUD',
        },
    },
    apis: ['./routes/*.js'],  // points to route files for Swagger documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the Cars routes
app.use('/api/cars', carRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
