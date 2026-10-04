import { Router } from "express";
import FormsController from "../Controllers/formsControllers.js";
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
 *         - departamento
 *         - operacao
 *         - medida_cautelar
 *         - resultados
 *         - tipos_apreendidos
 *         - valor_estimado
 *       properties:
 *         id:
 *           type: string
 *           description: O ID gerado para o formulário
 *         departamento:
 *           type: string
 *           description: Delegacia / Departamento policial solicitante
 *         operacao:
 *           type: string
 *           description: Nome da operação
 *         data_operacao:
 *           type: string
 *           description: Data da realização da operação (formato DD-MM-YYYY)
 *         numero_processo:
 *           type: string
 *           description: Número do processo judicial
 *         medida_cautelar:
 *           type: string
 *           description: Tipo de medida cautelar (Busca e Apreensão, etc.)
 *         numero_cautelar:
 *           type: string
 *           description: Número da cautelar
 *         resultados:
 *           type: array
 *           items:
 *             type: string
 *           description: Resultados obtidos (Apreensão, Sequestro, etc.)
 *         tipos_apreendidos:
 *           type: array
 *           items:
 *             type: string
 *           description: Tipos de bens apreendidos (CARRO, DINHEIRO, etc.)
 *         descricao_operacao:
 *           type: string
 *           description: Breve descrição dos fatos e apreensões
 *         valor_estimado:
 *           type: number
 *           description: Valor estimado total dos bens em reais
 *         status:
 *           type: string
 *           description: Status atual (solicitado, ciente, realizado, cancelado)
 *         dataCiente:
 *           type: string
 *           format: date-time
 *           description: Data em que a URGA tomou ciência
 *         dataRealizado:
 *           type: string
 *           format: date-time
 *           description: Data em que a operação foi concluída
 *         criador:
 *           type: object
 *           description: Dados do usuário criador (populado ou ID)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 6a8f52....
 *         departamento: Homicídios
 *         operacao: Operação Limpeza
 *         data_operacao: 25-08-2026
 *         numero_processo: 123456789012345
 *         medida_cautelar: Busca e Apreensão
 *         numero_cautelar: 9876543210
 *         resultados: ["Apreensão", "Sequestro"]
 *         tipos_apreendidos: ["CARRO", "DINHEIRO"]
 *         descricao_operacao: Apreensão de bens ilícitos.
 *         valor_estimado: 150000.00
 *         status: solicitado
 *         criador: { id: "6a8f52...", nome: "Carlos", cpf: "00000000000" }
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
router.get("/", authorize('Usuário', 'Administrador'), FormsController.listForms);

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
router.get("/dashboard", authorize('Usuário', 'Administrador'), FormsController.getDashboardData);

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
router.get("/:id", authorize('Usuário', 'Administrador'), FormsController.searchFormsById);

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
router.post("/", authorize('Usuário', 'Administrador'), createLimiter, CreateFormsValidator, validateRequest, FormsController.createForms);

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
router.patch("/:id", authorize('Usuário', 'Administrador'), UpdateFormsValidator, validateRequest, FormsController.updateForms);

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
router.delete("/:id", authorize('Usuário', 'Administrador'), FormsController.deleteForms);

export default router;
