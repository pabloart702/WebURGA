import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import documentRoutes from '../../src/Routes/documentRoutes.js';
import documentService from '../../src/Services/documentService.js';

describe('Document Routes Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/documents', documentRoutes);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /documents', () => {
    it('deve retornar lista de documentos e 200', async () => {
      jest.spyOn(documentService, 'getAllDocuments').mockResolvedValue([{ filename: 'doc.pdf' }]);

      const response = await request(app).get('/documents');

      expect(response.status).toBe(200);
      expect(response.body[0].filename).toBe('doc.pdf');
    });
  });

  describe('GET /documents/:filename', () => {
    it('deve retornar 404 se não encontrar (validando que a rota está ativa)', async () => {
      jest.spyOn(documentService, 'getDocumentByFilename').mockResolvedValue(null);

      const response = await request(app).get('/documents/naoexiste.pdf');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Documento não encontrado.");
    });
  });
});
