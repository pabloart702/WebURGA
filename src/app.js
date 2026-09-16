import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import userRoutes from './Routes/userRoutes.js';
import formsRoutes from './Routes/formsRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import documentRoutes from './Routes/documentRoutes.js';
import { globalErrorHandler } from './Middlewares/errorMiddleware.js';
import { authMiddleware } from './Middlewares/authMiddleware.js';
import { webLog } from './Middlewares/logMiddleware.js';
import securityHeadersMiddleware from './Middlewares/securityHeadersMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(webLog);

// Configuração segura e autenticada para servir imagens de perfil
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../uploads/profiles');

app.use(
    '/uploads/profiles',
    authMiddleware,
    securityHeadersMiddleware,
    express.static(uploadsPath, {
        dotfiles: 'deny',
        index: false
    })
);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/forms', authMiddleware, formsRoutes);
app.use('/api/documentos', authMiddleware, documentRoutes);

app.use(globalErrorHandler);

export default app;