const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const carRoutes = require('./routes/cars');
const authRegisterRoute = require("./auth/register");
const authLoginRoute = require("./auth/login");

const app = express();
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Car API",
            version: "1.0.0",
            description: "API documentation for Cars CRUD",
            contact: {
                name: "temurbek2310",
                url: "https://github.com/temurbek2310",
            }
        },
        servers: [
            { url: "http://localhost:5000" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    bearerFormat: "JWT",
                    description: "Enter JWT token in the format: Bearer <token>"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./routes/*.js", "./auth/*.js"]
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the Cars routes
app.use('/api/cars', carRoutes);
app.use("/auth", authRegisterRoute);
app.use("/auth", authLoginRoute);
app.use(cors());

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
