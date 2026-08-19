import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API URGA',
            version: '1.0.0',
            description: 'API de gerenciamento do site URGA',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        servers: [
            {
                url: `http://localhost:${process.env.PORT_HOST || 3000}`,
            },
        ],
    },
    apis: ['./src/Routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
