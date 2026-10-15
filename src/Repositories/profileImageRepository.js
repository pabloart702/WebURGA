import mongoose from 'mongoose';
import { Readable } from 'stream';

class ProfileImageRepository {
    static getBucket() {
        const db = mongoose.connection?.db;
        if (!db) return null;
        return new mongoose.mongo.GridFSBucket(db, { bucketName: 'profiles' });
    }

    /**
     * Salva um buffer de imagem diretamente no bucket GridFS 'profiles'.
     */
    static async upload(filename, buffer, contentType = 'image/webp') {
        const bucket = ProfileImageRepository.getBucket();
        if (!bucket) throw new Error("Conexão com o banco de dados não disponível.");

        return new Promise((resolve, reject) => {
            const readableStream = Readable.from(buffer);
            const uploadStream = bucket.openUploadStream(filename, {
                contentType,
                metadata: { contentType, uploadedAt: new Date() }
            });

            readableStream.pipe(uploadStream)
                .on('error', (err) => reject(err))
                .on('finish', () => resolve(uploadStream.id));
        });
    }

    /**
     * Localiza os metadados de uma imagem pelo nome de arquivo.
     */
    static async findByFilename(filename) {
        const bucket = ProfileImageRepository.getBucket();
        if (!bucket) return null;

        const files = await bucket.find({ filename }).toArray();
        return files.length > 0 ? files[0] : null;
    }

    /**
     * Retorna o stream de leitura do arquivo no GridFS.
     */
    static getDownloadStream(filename) {
        const bucket = ProfileImageRepository.getBucket();
        if (!bucket) throw new Error("Conexão com o banco de dados não disponível.");

        return bucket.openDownloadStreamByName(filename);
    }

    /**
     * Deleta o arquivo do GridFS pelo nome (se existir).
     */
    static async deleteByFilename(filename) {
        if (!filename) return;
        try {
            const bucket = ProfileImageRepository.getBucket();
            if (!bucket) return;

            const files = await bucket.find({ filename }).toArray();
            for (const file of files) {
                await bucket.delete(file._id);
            }
        } catch (error) {
            console.error(`Erro ao deletar imagem "${filename}" do GridFS:`, error.message);
        }
    }
}

export default ProfileImageRepository;
