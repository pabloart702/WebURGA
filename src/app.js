import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import userRoutes from './Routes/userRoutes.js';
import formsRoutes from './Routes/formsRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import { globalErrorHandler } from './Middlewares/errorMiddleware.js';
import { authMiddleware } from './Middlewares/authMiddleware.js';
import { webLog } from './Middlewares/logMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(webLog);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/forms', authMiddleware, formsRoutes);

app.use(globalErrorHandler);

export default app;