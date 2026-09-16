import multer from 'multer';

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

const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

export default uploadMiddleware;
