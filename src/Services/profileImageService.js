import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ProfileImageRepository from '../Repositories/profileImageRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProfilesDir = path.join(__dirname, '../Assets/defaultProfiles');

class ProfileImageService {
    /**
     * Faz o upload de uma imagem para o GridFS.
     */
    static async uploadProfileImage(filename, buffer, contentType = 'image/webp') {
        return await ProfileImageRepository.upload(filename, buffer, contentType);
    }

    /**
     * Busca os metadados de uma imagem de perfil no GridFS.
     */
    static async getImageByFilename(filename) {
        return await ProfileImageRepository.findByFilename(filename);
    }

    /**
     * Retorna o stream para download/leitura da imagem de perfil.
     */
    static getDownloadStream(filename) {
        return ProfileImageRepository.getDownloadStream(filename);
    }

    /**
     * Remove uma imagem de perfil do GridFS.
     * Imagens padrão de seed (img1M.jpeg, etc.) são preservadas.
     */
    static async deleteProfileImage(filename) {
        if (!filename) return;
        // Evita deletar fotos padrão de seed
        if (/^img\d+[MH]\.jpeg$/i.test(filename)) {
            return;
        }
        await ProfileImageRepository.deleteByFilename(filename);
    }

    /**
     * Semeia automaticamente as imagens de perfil padrão para o GridFS no MongoDB Atlas
     * caso ainda não existam no banco.
     */
    static async seedDefaultProfiles() {
        try {
            if (!fs.existsSync(defaultProfilesDir)) return;

            const files = await fs.promises.readdir(defaultProfilesDir);
            let seededCount = 0;

            for (const file of files) {
                const exists = await ProfileImageRepository.findByFilename(file);
                if (!exists) {
                    const filePath = path.join(defaultProfilesDir, file);
                    const buffer = await fs.promises.readFile(filePath);
                    await ProfileImageRepository.upload(file, buffer, 'image/jpeg');
                    seededCount++;
                }
            }

            if (seededCount > 0) {
                console.log(`📸 ${seededCount} imagens de perfil padrão semeadas com sucesso no MongoDB GridFS.`);
            }
        } catch (error) {
            console.error('⚠️ Erro ao semear imagens de perfil no GridFS:', error.message);
        }
    }
}

export default ProfileImageService;
