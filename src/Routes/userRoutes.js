import { Router } from "express";
import UserController from "../Controllers/userControllers.js";
import { createUserValidator, updateUserValidator } from "../Validators/userValidator.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/permissionMiddleware.js";
import { validateRequest } from "../Middlewares/errorMiddleware.js";

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
 *         role: ADMINISTRADOR
 *         departamento: Homicídios
 *         status: ATIVO
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
router.get("/", authMiddleware, authorize('Administrador'), UserController.listUsers);

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
router.get("/id/:id", authMiddleware, authorize('Administrador'), UserController.searchUserForId);

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
router.post("/", authMiddleware, authorize('Administrador'), createUserValidator, validateRequest, UserController.createUser);

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
router.patch("/id/:id", authMiddleware, authorize('Usuário', 'Administrador'), updateUserValidator, validateRequest, UserController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Desativa um usuário pelo ID (Soft Delete)
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
router.delete("/id/:id", authMiddleware, authorize('Administrador'), UserController.deleteUser);

export default router;