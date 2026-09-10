import documentService from '../Services/documentService.js';

class DocumentController {
    // Returns a list of all documents available
    async getAllDocuments(req, res, next) {
        try {
            const result = await documentService.getAllDocuments();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // Streams a specific document back to the client
    async downloadDocument(req, res, next) {
        try {
            const { filename } = req.params;
            
            const file = await documentService.getDocumentByFilename(filename);
            
            if (!file) {
                return res.status(404).json({ message: "Documento não encontrado." });
            }

            // Set appropriate headers for the PDF
            res.set({
                'Content-Type': file.contentType || 'application/pdf',
                'Content-Disposition': `inline; filename="${file.filename}"`,
                'Content-Length': file.length
            });

            // Open download stream and pipe it to response
            const downloadStream = documentService.getDownloadStream(filename);
            
            downloadStream.on('error', (err) => {
                console.error("Error streaming file:", err);
                res.status(500).json({ message: "Erro ao baixar o documento." });
            });

            downloadStream.pipe(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new DocumentController();
