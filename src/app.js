import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
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
import { globalLimiter, securityHeadersMiddleware } from './Middlewares/securityMiddleware.js';

const app = express();
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, frameguard: { action: 'deny' }
}));

app.set('trust proxy', 1);
app.use(globalLimiter);

const corsOptions = {
    origin: [
        'http://localhost:5173',        // Frontend (Vite)
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Obrigatório para cookies cross-origin (HttpOnly JWT)
    maxAge: 86400,
};
app.use(cors(corsOptions));
app.use(cookieParser()); // Habilita leitura de req.cookies
app.use(express.json({ limit: '100kb' }));

app.use(webLog);

// Configuração segura e autenticada para servir imagens de perfil
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../uploads/profiles');

if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.get('/', (req, res) => {
    res.json({ message: "API da URGA online e rodando no Render!", status: "online" });
});

app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/forms', authMiddleware, formsRoutes);
app.use('/documentos', authMiddleware, documentRoutes);
app.use('/uploads/profiles', authMiddleware, securityHeadersMiddleware, express.static(uploadsPath, { dotfiles: 'deny', index: false }));

app.use((req, res, next) => {
    const error = new Error(`Rota não encontrada`);
    error.statusCode = 404;
    next(error);
});

app.use(globalErrorHandler);

export default app;