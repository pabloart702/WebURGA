import { Router } from "express";
import formsController from "../Controllers/formsControllers.js";
import { CreateFormsValidator, UpdateFormsValidator } from "../Validators/formsValidator.js";
import { authorize } from "../Middlewares/authMiddleware.js";
import { validateRequest } from "../Middlewares/errorMiddleware.js";
import { createLimiter } from "../Middlewares/securityMiddleware.js";

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
 *           type: string
 *           description: O ID gerado automaticamente para o formulário
 *         departamento:
 *           type: string
 *         operacao:
 *           type: string
 *         data_operacao:
 *           type: string
 *         numero_processo:
 *           type: string
 *         medida_cautelar:
 *           type: string
 *         numero_cautelar:
 *           type: string
 *         resultados:
 *           type: array
 *           items:
 *             type: string
 *         tipos_apreendidos:
 *           type: array
 *           items:
 *             type: string
 *         descricao_operacao:
 *           type: string
 *         valor_estimado:
 *           type: number
 *         status:
 *           type: string
 *         criador:
 *           type: string
 *       example:
 *         id: 6a8f52....
 *         departamento: Homicídios
 *         operacao: Operação Limpeza
 *         data_operacao: 25-08-2026
 *         numero_processo: 123456789012345
 *         medida_cautelar: BUSCA E APREENSÃO
 *         numero_cautelar: 9876543210
 *         resultados: ["APREENSAO", "SEQUESTRO"]
 *         tipos_apreendidos: ["CARRO", "DINHEIRO"]
 *         descricao_operacao: Apreensão de bens ilícitos.
 *         valor_estimado: 150000.00
 *         status: pendente
 *         criador: 6a8f52...
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
router.get("/", authorize('Usuário', 'Administrador'), formsController.listForms);

/**
 * @swagger
 * /forms/dashboard:
 *   get:
 *     summary: Retorna os dados estatísticos para o dashboard
 *     tags: [Forms]
 *     responses:
 *       200:
 *         description: Dados do dashboard
 */
router.get("/dashboard", authorize('Usuário', 'Administrador'), formsController.getDashboardData);

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
router.get("/:id", authorize('Usuário', 'Administrador'), formsController.searchFormsById);

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
 *               departamento:
 *                 type: string
 *               operacao:
 *                 type: string
 *               data_operacao:
 *                 type: string
 *               numero_processo:
 *                 type: string
 *               medida_cautelar:
 *                 type: string
 *               numero_cautelar:
 *                 type: string
 *               resultados:
 *                 type: array
 *                 items:
 *                   type: string
 *               tipos_apreendidos:
 *                 type: array
 *                 items:
 *                   type: string
 *               descricao_operacao:
 *                 type: string
 *               valor_estimado:
 *                 type: number
 *             example:
 *               departamento: Homicídios
 *               operacao: Operação Limpeza
 *               data_operacao: 25-08-2026
 *               numero_processo: 123456789012345
 *               medida_cautelar: BUSCA E APREENSÃO
 *               numero_cautelar: 9876543210
 *               resultados: ["APREENSAO", "SEQUESTRO"]
 *               tipos_apreendidos: ["CARRO", "DINHEIRO"]
 *               descricao_operacao: Apreensão de bens ilícitos.
 *               valor_estimado: 150000.00
 *     responses:
 *       201:
 *         description: O formulário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forms'
 */
router.post("/", authorize('Usuário', 'Administrador'), createLimiter, CreateFormsValidator, validateRequest, formsController.createForms);

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
 *               departamento:
 *                 type: string
 *               operacao:
 *                 type: string
 *               data_operacao:
 *                 type: string
 *               numero_processo:
 *                 type: string
 *               medida_cautelar:
 *                 type: string
 *               numero_cautelar:
 *                 type: string
 *               resultados:
 *                 type: array
 *                 items:
 *                   type: string
 *               tipos_apreendidos:
 *                 type: array
 *                 items:
 *                   type: string
 *               descricao_operacao:
 *                 type: string
 *               valor_estimado:
 *                 type: number
 *             example:
 *               operacao: Operação Limpeza Fase 2
 *               valor_estimado: 250000.00
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
router.patch("/:id", authorize('Usuário', 'Administrador'), UpdateFormsValidator, validateRequest, formsController.updateForms);

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
router.delete("/:id", authorize('Usuário', 'Administrador'), formsController.deleteForms);

export default router;
