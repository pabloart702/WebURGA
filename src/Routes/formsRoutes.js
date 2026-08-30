import { Router } from "express";
import formsController from "../Controllers/formsControllers.js";
import { CreateFormsValidator, UpdateFormsValidator } from "../Validators/formsValidator.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/permissionMiddleware.js";
import { validateRequest } from "../Middlewares/errorMiddleware.js";


const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Forms:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *       properties:
 *         id:
 *           type: number
 *           description: O ID gerado automaticamente para o formulário
 *         titulo:
 *           type: string
 *           description: Título do formulário
 *         descricao:
 *           type: string
 *           description: Descrição do formulário
 *         status:
 *           type: string
 *           description: Status do formulário (pendente, aprovado, cancelado)
 *       example:
 *         id: 1693000000000
 *         titulo: Suporte TI
 *         descricao: O computador não liga
 *         status: pendente
 */

/**
 * @swagger
 * tags:
 *   name: Forms
 *   description: API para gerenciamento de formulários
 */

/**
 * @swagger
 * /forms:
 *   get:
 *     summary: Retorna a lista de todos os formulários
 *     tags: [Forms]
 *     responses:
 *       200:
 *         description: A lista de formulários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Forms'
 */
router.get("/", authMiddleware, authorize('USUÁRIO', 'ADMINISTRADOR'), formsController.listForms);

/**
 * @swagger
 * /forms/{id}:
 *   get:
 *     summary: Retorna um formulário pelo seu ID
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do formulário
 *     responses:
 *       200:
 *         description: O formulário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forms'
 *       404:
 *         description: Formulário não encontrado
 */
router.get("/:id", authMiddleware, authorize('USUÁRIO', 'ADMINISTRADOR'), formsController.searchFormsById);

/**
 * @swagger
 * /forms:
 *   post:
 *     summary: Cria um novo formulário
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *             example:
 *               titulo: Suporte TI
 *               descricao: O computador não liga
 *     responses:
 *       201:
 *         description: O formulário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forms'
 */
router.post("/", authMiddleware, authorize('USUÁRIO', 'ADMINISTRADOR'), CreateFormsValidator, validateRequest, formsController.createForms);

/**
 * @swagger
 * /forms/{id}:
 *   patch:
 *     summary: Atualiza os dados de um formulário pelo ID
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do formulário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *             example:
 *               titulo: Manutenção Elétrica
 *               descricao: Trocar lâmpada da sala 3
 *     responses:
 *       200:
 *         description: O formulário foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forms'
 *       404:
 *         description: Formulário não encontrado
 */
router.patch("/:id", authMiddleware, authorize('USUÁRIO', 'ADMINISTRADOR'), UpdateFormsValidator, validateRequest, formsController.updateForms);

/**
 * @swagger
 * /forms/{id}:
 *   delete:
 *     summary: Cancela um formulário pelo ID (Soft Delete)
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do formulário
 *     responses:
 *       200:
 *         description: O formulário foi cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 forms:
 *                   $ref: '#/components/schemas/Forms'
 *       404:
 *         description: Formulário não encontrado
 */
router.delete("/:id", authMiddleware, authorize('USUÁRIO', 'ADMINISTRADOR'), formsController.deleteForms);

export default router;
