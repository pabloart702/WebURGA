import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import userRoutes from './Routes/userRoutes.js';
import apoioRoutes from './Routes/apoioRoutes.js';

const app = express();

app.use(express.json());

// Middleware de validação
const meuLog = (req, res, next) => {
    const data = new Date().toISOString();
    console.log(`[${data}] ${req.method} em ${req.url}`);
    next();
};
app.use(meuLog); // Aplica globalmente

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', userRoutes);
app.use('/apoios', apoioRoutes);

export default app;