import documentService from '../Services/documentService.js';

class DocumentController {
    // Retorna uma lista de todos os documentos disponíveis
    async getAllDocuments(req, res, next) {
        try {
            const result = await documentService.getAllDocuments();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // Transmite um documento específico de volta para o cliente
    async downloadDocument(req, res, next) {
        try {
            const { filename } = req.params;

            const file = await documentService.getDocumentByFilename(filename);

            // Defina os cabeçalhos apropriados para o PDF.
            res.set({
                'Content-Type': file.contentType || 'application/pdf',
                'Content-Disposition': `inline; filename="${file.filename}"`,
                'Content-Length': file.length
            });

            // Abra o fluxo de download e direcione-o para a resposta.
            const downloadStream = documentService.getDownloadStream(filename);

            downloadStream.on('error', (err) => {
                console.error("Erro ao transmitir o arquivo:", err);
                res.status(500).json({ message: "Erro ao baixar o documento." });
            });

            downloadStream.pipe(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new DocumentController();
