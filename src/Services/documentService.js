import DocumentRepository from '../Repositories/documentRepository.js';

class DocumentService {
    static async getAllDocuments() {
        const files = await DocumentRepository.findAll();

        // Mapear para um formato mais limpo para o frontend
        return files.map(file => ({
            id: file._id,
            filename: file.filename,
            title: file.metadata?.title || file.filename,
            contentType: file.contentType,
            uploadDate: file.uploadDate,
            length: file.length
        }));
    }

    static async getDocumentByFilename(filename) {
        const files = await DocumentRepository.findByFilename(filename);
        if (files.length === 0) {
            const err = new Error("Documento não encontrado.");
            err.statusCode = 404;
            throw err;
        }
        return files[0];
    }

    static getDownloadStream(filename) {
        return DocumentRepository.getDownloadStream(filename);
    }
}

export default DocumentService;
