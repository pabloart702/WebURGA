import { jest } from '@jest/globals';
import { uploadMiddleware, imageProcessMiddleware } from '../../src/Middlewares/uploadMiddleware.js';

describe('Upload Middleware Tests', () => {
  describe('uploadMiddleware', () => {
    it('deve exportar uma instância configurada do multer com método single', () => {
      expect(uploadMiddleware).toBeDefined();
      expect(typeof uploadMiddleware.single).toBe('function');
      expect(typeof uploadMiddleware.array).toBe('function');
    });
  });

  describe('imageProcessMiddleware', () => {
    it('deve ser exportado como uma função middleware', () => {
      expect(typeof imageProcessMiddleware).toBe('function');
    });

    it('deve retornar erro 400 se nenhum arquivo for enviado (req.file vazio)', async () => {
      const req = {}; // Sem req.file
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await imageProcessMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nenhuma imagem foi enviada.' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
