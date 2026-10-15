import express from 'express';
import ProfileImageController from '../Controllers/profileImageController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Perfil
 *   description: Endpoints para gerenciamento e visualização de fotos de perfil
 */

/**
 * @swagger
 * /uploads/profiles/{filename}:
 *   get:
 *     summary: Retorna a imagem de perfil do usuário
 *     description: Transmite a imagem de perfil a partir do MongoDB GridFS ou do armazenamento de assets com cabeçalhos inline e cache.
 *     tags: [Perfil]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do arquivo da imagem de perfil (ex. img1M.jpeg ou uuid.webp)
 *     responses:
 *       200:
 *         description: Imagem retornada com sucesso
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
 *       404:
 *         description: Imagem de perfil não encontrada
 *       401:
 *         description: Não autenticado
 */
router.get('/:filename', ProfileImageController.getProfileImage);

export default router;
