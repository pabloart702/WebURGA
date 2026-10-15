import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ProfileImageService from '../Services/profileImageService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../../uploads/profiles');
const defaultProfilesPath = path.join(__dirname, '../Assets/defaultProfiles');

class ProfileImageController {
    /**
     * Busca e transmite a imagem de perfil solicitada a partir do GridFS
     * com fallback para o sistema de arquivos local.
     */
    static async getProfileImage(req, res, next) {
        try {
            const { filename } = req.params;

            // 1. Tentar buscar no GridFS do MongoDB
            const file = await ProfileImageService.getImageByFilename(filename);

            if (file) {
                res.set({
                    'Content-Type': file.metadata?.contentType || file.contentType || (filename.endsWith('.png') ? 'image/png' : filename.endsWith('.jpeg') || filename.endsWith('.jpg') ? 'image/jpeg' : 'image/webp'),
                    'Content-Length': file.length,
                    'Cache-Control': 'public, max-age=86400',
                    'Content-Disposition': 'inline'
                });

                const downloadStream = ProfileImageService.getDownloadStream(filename);
                downloadStream.on('error', (err) => next(err));
                return downloadStream.pipe(res);
            }

            // 2. Fallback: verificar se existe no diretório local de assets ou uploads
            const assetPath = path.join(defaultProfilesPath, filename);
            if (fs.existsSync(assetPath)) {
                return res.sendFile(assetPath);
            }

            const localUploadPath = path.join(uploadsPath, filename);
            if (fs.existsSync(localUploadPath)) {
                return res.sendFile(localUploadPath);
            }

            // 3. Não encontrada
            const error = new Error('Imagem de perfil não encontrada.');
            error.statusCode = 404;
            return next(error);
        } catch (error) {
            next(error);
        }
    }
}

export default ProfileImageController;
