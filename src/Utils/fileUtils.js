import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ProfileImageService from '../Services/profileImageService.js';

export const deleteProfileImage = (filename) => {
    if (!filename) return;

    // Se o banco estiver conectado, remove também do GridFS em segundo plano
    if (ProfileImageService && typeof ProfileImageService.deleteProfileImage === 'function') {
        ProfileImageService.deleteProfileImage(filename).catch(() => {});
    }

    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const oldPath = path.join(__dirname, '../../uploads/profiles', filename);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    } catch (err) {
        console.error('Erro ao deletar imagem antiga:', err);
    }
};
