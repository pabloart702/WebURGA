import { Router } from 'express';
import AuthController from '../Controllers/authController.js';
import { loginLimiter } from '../Middlewares/rateLimitMiddleware.js';
import { loginValidator } from '../Validators/authValidator.js';
import { validateRequest } from '../Middlewares/errorMiddleware.js';

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
 *                 example: teste@gmail.com
 *                 description: O email cadastrado do usuário
 *               password:
 *                 type: string
 *                 example: Password_123
 *                 description: A senha do usuário
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       400:
 *         description: Email e senha obrigatórios
 *       401:
 *         description: Credenciais inválidas
 *       429:
 *         description: Muitas requisições (Rate Limit)
 */
router.post("/login", loginLimiter, loginValidator, validateRequest, AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Realiza o logout invalidando o cookie HttpOnly
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso."
 */
router.post("/logout", AuthController.logout);

export default router;
