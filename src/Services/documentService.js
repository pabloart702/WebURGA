import documentRepository from '../Repositories/documentRepository.js';

class DocumentService {
    async getAllDocuments() {
        const files = await documentRepository.findAll();
        
        // Map to a cleaner format for the frontend
        return files.map(file => ({
            id: file._id,
            filename: file.filename,
            title: file.metadata?.title || file.filename,
            contentType: file.contentType,
            uploadDate: file.uploadDate,
            length: file.length
        }));
    }

    async getDocumentByFilename(filename) {
        const files = await documentRepository.findByFilename(filename);
        if (files.length === 0) {
            return null;
        }
        return files[0];
    }

    getDownloadStream(filename) {
        return documentRepository.getDownloadStream(filename);
    }
}

export default new DocumentService();
