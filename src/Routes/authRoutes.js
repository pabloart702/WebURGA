import { Router } from 'express';
import AuthController from '../Controllers/authController.js';
import { loginLimiter } from '../Middlewares/securityMiddleware.js';
import { loginValidator } from '../Validators/authValidator.js';
import { validateRequest } from '../Middlewares/errorMiddleware.js';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login
 *     description: Autentica o usuário e retorna o JWT através de um cookie HttpOnly (Não é retornado no corpo da resposta).
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
 *                 example: SenhaForte123
 *                 description: A senha do usuário
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=abcde12345; Path=/; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso."
 *       400:
 *         description: Erro de validação nos campos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "O email é obrigatório."
 *       401:
 *         description: Credenciais inválidas (usuário não encontrado, senha errada ou inativo)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Credenciais inválidas"
 *       429:
 *         description: Muitas requisições (Bloqueado após 5 tentativas em 5 minutos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Muitas tentativas de login a partir deste IP, por favor tente novamente após 5 minutos."
 */
router.post("/login", loginLimiter, loginValidator, validateRequest, AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Realiza o logout
 *     description: Invalida e remove o cookie HttpOnly de autenticação (Max-Age=0).
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=; Path=/; Max-Age=0; HttpOnly; Secure
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
