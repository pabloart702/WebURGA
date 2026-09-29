import { jest } from '@jest/globals';
import DocumentController from '../../src/Controllers/documentControllers.js';
import documentService from '../../src/Services/documentService.js';
import EventEmitter from 'events';

describe('DocumentController tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      set: jest.fn()
    };
    next = jest.fn();
    jest.restoreAllMocks();
  });

  describe('getAllDocuments', () => {
    it('deve listar todos os documentos e retornar 200', async () => {
      const mockResult = [{ filename: 'doc1.pdf' }];
      jest.spyOn(documentService, 'getAllDocuments').mockResolvedValue(mockResult);

      await DocumentController.getAllDocuments(req, res, next);

      expect(documentService.getAllDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('downloadDocument', () => {
    it('deve retornar 404 se o documento não for encontrado', async () => {
      req.params.filename = 'naoexiste.pdf';
      jest.spyOn(documentService, 'getDocumentByFilename').mockResolvedValue(null);

      await DocumentController.downloadDocument(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Documento não encontrado." });
    });

    it('deve configurar headers e realizar o pipe do stream', async () => {
      req.params.filename = 'existe.pdf';
      const mockFile = { contentType: 'application/pdf', filename: 'existe.pdf', length: 1024 };
      jest.spyOn(documentService, 'getDocumentByFilename').mockResolvedValue(mockFile);

      const mockStream = new EventEmitter();
      mockStream.pipe = jest.fn();
      jest.spyOn(documentService, 'getDownloadStream').mockReturnValue(mockStream);

      await DocumentController.downloadDocument(req, res, next);

      expect(res.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="existe.pdf"',
        'Content-Length': 1024
      });
      expect(mockStream.pipe).toHaveBeenCalledWith(res);
    });
  });
});
