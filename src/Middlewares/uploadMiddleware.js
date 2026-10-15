import multer from 'multer';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ProfileImageService from '../Services/profileImageService.js';

// Configuração do Multer usando MemoryStorage para não salvar em disco antes da validação
const storage = multer.memoryStorage();

// Filtro inicial básico (Apenas checa Content-Type declarado, a checagem real será no próximo middleware)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Formato de arquivo inválido. Apenas imagens são permitidas.'), false);
    }
};

export const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

// Helper para obter o __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que o diretório de uploads existe
const uploadDir = path.join(__dirname, '../../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const imageProcessMiddleware = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
        }

        const buffer = req.file.buffer;

        // 1. Validação de Magic Numbers
        const type = await fileTypeFromBuffer(buffer);
        
        if (!type || !['image/jpeg', 'image/png', 'image/webp'].includes(type.mime)) {
            return res.status(400).json({ error: 'Arquivo inválido. Apenas JPG, PNG ou WEBP são permitidos.' });
        }

        // 1.5. Validação de Dimensões Mínimas
        const metadata = await sharp(buffer).metadata();
        if (metadata.width < 100 || metadata.height < 100) {
            return res.status(400).json({ error: 'A imagem é muito pequena. O tamanho mínimo é de 100x100 pixels.' });
        }

        // 2. Geração de nome seguro (UUID aleatório em vez do nome original ou bcrypt)
        const safeFilename = `${crypto.randomUUID()}.webp`;

        // 3. Processamento com Sharp para buffer WebP otimizado
        const webpBuffer = await sharp(buffer)
            .resize({
                width: 1500, // Limita largura máxima (para economizar espaço)
                height: 1500, // Limita altura máxima
                fit: 'inside', // Mantém proporção sem cortar
                withoutEnlargement: true // Não amplia imagens pequenas
            })
            .webp({ quality: 80 }) // Converte para webp limpando metadados EXIF
            .toBuffer();

        // 4. Salvar permanentemente no MongoDB GridFS
        await ProfileImageService.uploadProfileImage(safeFilename, webpBuffer, 'image/webp');

        // Cache local opcional em disco
        try {
            const outputPath = path.join(uploadDir, safeFilename);
            await fs.promises.writeFile(outputPath, webpBuffer);
        } catch (diskErr) {
            // Em ambientes efêmeros sem gravação em disco, o GridFS já é a fonte definitiva
        }

        // 5. Anexar o nome gerado ao req para o controller
        req.file.filename = safeFilename;

        next();
    } catch (error) {
        console.error("Erro ao processar imagem:", error);
        res.status(500).json({ error: 'Erro interno ao processar a imagem.' });
    }
};
