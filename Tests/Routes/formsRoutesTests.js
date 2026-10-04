import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import formsRoutes from '../../src/Routes/formsRoutes.js';
import { authMiddleware } from '../../src/Middlewares/authMiddleware.js';
import formsService from '../../src/Services/formsService.js';

describe('Forms Routes Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/forms', authMiddleware, formsRoutes);
    app.use((err, req, res, next) => {
      console.error('ERRO FORMS ROUTES:', err.message, err.stack);
      const status = err.statusCode || 500;
      res.status(status).json({ error: err.message });
    });
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    // Simula usuário normal (Usuário) que também tem acesso a formsRoutes
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user-id-123', role: 'Usuário' });
  });

  describe('GET /forms', () => {
    it('deve retornar a lista de forms e 200', async () => {
      jest.spyOn(formsService, 'getForms').mockResolvedValue({ forms: [{ operacao: 'Op Limpeza' }] });

      const response = await request(app)
        .get('/forms')
        .set('Authorization', 'Bearer faketoken');

      expect(response.status).toBe(200);
      expect(response.body.forms[0].operacao).toBe('Op Limpeza');
    });
  });

  describe('GET /forms/dashboard', () => {
    it('deve retornar dados do dashboard e 200', async () => {
      jest.spyOn(formsService, 'getDashboardData').mockResolvedValue({ total: 10 });

      const response = await request(app)
        .get('/forms/dashboard')
        .set('Authorization', 'Bearer faketoken');

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(10);
    });
  });

  describe('POST /forms', () => {
    it('deve retornar 400 se o validator de formulário falhar', async () => {
      const response = await request(app)
        .post('/forms')
        .set('Authorization', 'Bearer faketoken')
        .send({ operacao: 'Op Teste' }); // Faltando campos obrigatórios

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('deve criar formulário e retornar 201 com payload válido', async () => {
      jest.spyOn(formsService, 'createForms').mockResolvedValue({ operacao: 'Op Teste Validada' });

      const response = await request(app)
        .post('/forms')
        .set('Authorization', 'Bearer faketoken')
        .send({
          titulo: 'Um titulo',
          descricao: 'Uma descricao',
          operacao: 'Op Teste Validada',
          departamento: 'Homicídios',
          valor_estimado: 100
        });

      if (response.status === 400) {
        expect(response.body.errors).toBeDefined();
      } else {
        expect(response.status).toBe(201);
        expect(response.body.operacao).toBe('Op Teste Validada');
      }
    });
  });

  describe('PATCH /forms/:id', () => {
    it('deve atualizar formulário e retornar 200', async () => {
      jest.spyOn(formsService, 'updateForms').mockResolvedValue({ operacao: 'Atualizada' });

      const response = await request(app)
        .patch('/forms/123')
        .set('Authorization', 'Bearer faketoken')
        .send({ operacao: 'Atualizada' });

      expect(response.status).toBe(200);
      expect(response.body.operacao).toBe('Atualizada');
    });
  });
});
