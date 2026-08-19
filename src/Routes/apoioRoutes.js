import { Router } from "express";
import { 
    listApoios, 
    searchApoioForId, 
    createApoio, 
    updateApoio, 
    deleteApoio 
} from "../Controllers/apoioControllers.js";
import { apoioValidator, apoioUpdateValidator } from "../Validators/apoioValidator.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Apoio:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *       properties:
 *         id:
 *           type: number
 *           description: O ID gerado automaticamente para a solicitação
 *         titulo:
 *           type: string
 *           description: Título da solicitação de apoio
 *         descricao:
 *           type: string
 *           description: Descrição da solicitação
 *         status:
 *           type: string
 *           description: Status da solicitação (pendente, aprovado, cancelado)
 *       example:
 *         id: 1693000000000
 *         titulo: Suporte TI
 *         descricao: O computador não liga
 *         status: pendente
 */

/**
 * @swagger
 * tags:
 *   name: Apoios
 *   description: API para gerenciamento de solicitações de apoio
 */

/**
 * @swagger
 * /apoios:
 *   get:
 *     summary: Retorna a lista de todas as solicitações de apoio
 *     tags: [Apoios]
 *     responses:
 *       200:
 *         description: A lista de solicitações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Apoio'
 */
router.get("/", listApoios);

/**
 * @swagger
 * /apoios/{id}:
 *   get:
 *     summary: Retorna uma solicitação pelo seu ID
 *     tags: [Apoios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da solicitação
 *     responses:
 *       200:
 *         description: A solicitação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apoio'
 *       404:
 *         description: Solicitação não encontrada
 */
router.get("/:id", searchApoioForId);

/**
 * @swagger
 * /apoios:
 *   post:
 *     summary: Cria uma nova solicitação de apoio
 *     tags: [Apoios]
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
 *         description: A solicitação foi criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apoio'
 */
router.post("/", apoioValidator, createApoio);

/**
 * @swagger
 * /apoios/{id}:
 *   put:
 *     summary: Atualiza os dados de uma solicitação pelo ID
 *     tags: [Apoios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da solicitação
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
 *         description: A solicitação foi atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apoio'
 *       404:
 *         description: Solicitação não encontrada
 */
router.put("/:id", apoioUpdateValidator, updateApoio);

/**
 * @swagger
 * /apoios/{id}:
 *   delete:
 *     summary: Cancela uma solicitação pelo ID (Soft Delete)
 *     tags: [Apoios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da solicitação
 *     responses:
 *       200:
 *         description: A solicitação foi cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 apoio:
 *                   $ref: '#/components/schemas/Apoio'
 *       404:
 *         description: Solicitação não encontrada
 */
router.delete("/:id", deleteApoio);

export default router;
