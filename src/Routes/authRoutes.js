import { Router } from 'express';
import AuthController from '../Controllers/authController.js';
import { loginLimiter } from '../Middlewares/rateLimitMiddleware.js';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login para obter o token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Email e senha obrigatórios
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", loginLimiter, AuthController.login);

export default router;
