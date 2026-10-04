import { Router } from "express";
import { downloadLimiter } from "../Middlewares/securityMiddleware.js";
import DocumentController from "../Controllers/documentControllers.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do arquivo no GridFS
 *         filename:
 *           type: string
 *           description: Nome do arquivo gravado
 *         title:
 *           type: string
 *           description: Título amigável do documento
 *         contentType:
 *           type: string
 *           description: Tipo MIME do arquivo
 *         uploadDate:
 *           type: string
 *           format: date-time
 *           description: Data de upload do arquivo
 *         length:
 *           type: integer
 *           description: Tamanho do arquivo em bytes
 *       example:
 *         id: 6ac1ae7580de57833434ea38
 *         filename: Destinacao de Ativos.pdf
 *         title: Destinacao de Ativos.pdf
 *         contentType: application/pdf
 *         uploadDate: 2026-10-03T20:15:00.000Z
 *         length: 1174405
 */

/**
 * @swagger
 * tags:
 *   name: Documentos
 *   description: API para consulta e download de documentos institucionais (PDFs via GridFS)
 */

/**
 * @swagger
 * /documentos:
 *   get:
 *     summary: Retorna a lista de todos os documentos disponíveis
 *     description: Lista todos os arquivos PDF institucionais armazenados no banco de dados. Requer autenticação.
 *     tags: [Documentos]
 *     responses:
 *       200:
 *         description: Lista de documentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 */
router.get("/", DocumentController.getAllDocuments);

/**
 * @swagger
 * /documentos/{filename}:
 *   get:
 *     summary: Realiza o download ou visualização de um documento PDF
 *     description: Transmite o arquivo PDF solicitado via stream a partir do GridFS com cabeçalhos inline. Requer autenticação e possui limitação de taxa (downloadLimiter).
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome exato do arquivo (ex. "Destinacao de Ativos.pdf")
 *     responses:
 *       200:
 *         description: Arquivo transmitido com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       404:
 *         description: Documento não encontrado
 *       429:
 *         description: Limite de downloads excedido (tente novamente mais tarde)
 */
router.get("/:filename", downloadLimiter, DocumentController.downloadDocument);

export default router;
