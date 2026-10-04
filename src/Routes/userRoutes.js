import { Router } from "express";
import UserController from "../Controllers/userControllers.js";
import { createUserValidator, updateUserValidator, updateProfileValidator } from "../Validators/userValidator.js";
import { authorize } from "../Middlewares/authMiddleware.js";
import { validateRequest } from "../Middlewares/errorMiddleware.js";
import { createLimiter, uploadLimiter } from "../Middlewares/securityMiddleware.js";
import { uploadMiddleware, imageProcessMiddleware } from "../Middlewares/uploadMiddleware.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         id:
 *           type: string
 *           description: O ID gerado automaticamente para o usuário
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *         cpf:
 *           type: string
 *         matricula:
 *           type: string
 *         cargo:
 *           type: string
 *         role:
 *           type: string
 *         departamento:
 *           type: string
 *         status:
 *           type: string
 *           description: Status do usuário (ativo, inativo)
 *       example:
 *         id: 6a8f52.....
 *         nome: Maria Silva
 *         email: maria@gmail.com
 *         cpf: 51256825120
 *         matricula: 111.222-3
 *         cargo: Delegado
 *         role: Administrador
 *         departamento: Homicídios
 *         status: Ativo
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", authorize('Administrador'), UserController.listUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo seu ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário
 *     responses:
 *       200:
 *         description: O usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/id/:id", authorize('Administrador'), UserController.searchUserForId);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               cpf:
 *                 type: string
 *               matricula:
 *                 type: string
 *               cargo:
 *                 type: string
 *               role:
 *                 type: string
 *               departamento:
 *                 type: string
 *             example:
 *               nome: Maria Silva
 *               email: maria@gmail.com
 *               password: password123
 *               cpf: 12345678901
 *               matricula: 999.888-7
 *               cargo: Escrivão
 *               role: USUÁRIO
 *               departamento: Homicídios
 *     responses:
 *       201:
 *         description: O usuário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", authorize('Administrador'), createLimiter, createUserValidator, validateRequest, UserController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Atualiza os dados de um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *               matricula:
 *                 type: string
 *               cargo:
 *                 type: string
 *               role:
 *                 type: string
 *               departamento:
 *                 type: string
 *             example:
 *               nome: Maria Silva Atualizada
 *               departamento: Narcóticos
 *     responses:
 *       200:
 *         description: O usuário foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.patch("/id/:id", authorize('Administrador'), updateUserValidator, validateRequest, UserController.updateUser);

/**
 * @swagger
 * /users/id/{id}:
 *   delete:
 *     summary: Desativa um usuário pelo ID (Soft Delete)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do usuário
 *     responses:
 *       200:
 *         description: O usuário foi desativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.delete("/id/:id", authorize('Administrador'), UserController.deleteUser);

/**
 * @swagger
 * /users/id/{id}/ativar:
 *   patch:
 *     summary: Ativa um usuário inativo pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do usuário
 *     responses:
 *       200:
 *         description: O usuário foi ativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.patch("/id/:id/ativar", authorize('Administrador'), UserController.activateUser);

/**
 * @swagger
 * /users/perfil:
 *   patch:
 *     summary: Atualiza os dados do perfil do usuário autenticado
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               cargo:
 *                 type: string
 *             example:
 *               nome: Maria Silva Atualizada
 *               email: maria_nova@gmail.com
 *     responses:
 *       200:
 *         description: O perfil foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.patch("/perfil", authorize('Usuário', 'Administrador'), updateProfileValidator, validateRequest, UserController.updateProfile);

/**
 * @swagger
 * /users/perfil:
 *   get:
 *     summary: Retorna os dados do perfil do usuário autenticado
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/perfil", authorize('Usuário', 'Administrador'), UserController.getProfile);

/**
 * @swagger
 * /users/profile-picture:
 *   patch:
 *     summary: Atualiza a foto de perfil do usuário autenticado
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto de perfil atualizada com sucesso
 *       400:
 *         description: Erro na imagem enviada
 *       401:
 *         description: Não autorizado
 */
router.patch("/profile-picture", authorize('Usuário', 'Administrador'), uploadLimiter, uploadMiddleware.single('profilePicture'), imageProcessMiddleware, UserController.uploadProfilePicture);

/**
 * @swagger
 * /users/profile-picture:
 *   delete:
 *     summary: Remove a foto de perfil do usuário autenticado
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Foto de perfil removida com sucesso
 *       400:
 *         description: O usuário não possui foto para remover
 *       401:
 *         description: Não autorizado
 */
router.delete("/profile-picture", authorize('Usuário', 'Administrador'), UserController.deleteProfilePicture);

export default router;/**
 * @swagger
 * /uploads/profiles/{filename}:
 *   get:
 *     summary: Retorna a imagem de perfil protegida
 *     description: Rota estática e autenticada para servir fotos de perfil salvas no servidor. Requer cookie HttpOnly ou cabeçalho Authorization Bearer. A tag img no frontend deve conter crossorigin="use-credentials".
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do arquivo de imagem (ex. 6a8f52-1728000000000.webp)
 *     responses:
 *       200:
 *         description: Imagem transmitida com sucesso
 *         content:
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       404:
 *         description: Imagem não encontrada
 */

