import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import authRoutes from '../../src/Routes/authRoutes.js';
import AuthService from '../../src/Services/authService.js';

describe('Auth Routes Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /auth/login', () => {
    it('deve retornar 400 se o validator bloquear (sem email/password)', async () => {
      const response = await request(app).post('/auth/login').send({});
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      // O validator deve ter barrado antes de chegar no controller
    });

    it('deve retornar 200 com payload válido', async () => {
      jest.spyOn(AuthService, 'login').mockResolvedValue('fake-token-jwt');

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'teste@teste.com', password: 'Senha Forte 123!' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login realizado com sucesso.');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('deve retornar 429 Too Many Requests após 5 tentativas de login no mesmo IP', async () => {
      jest.spyOn(AuthService, 'login').mockResolvedValue('fake-token-jwt');
      
      // O Limite configurado é de 5 requisições por IP, então fazemos 5 requisições seguidas
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/auth/login')
          .send({ email: 'teste@teste.com', password: 'Senha Forte 123!' });
      }

      // A 6ª requisição deve ser bloqueada pelo Rate Limiter
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'teste@teste.com', password: 'Senha Forte 123!' });

      expect(response.status).toBe(429);
      expect(response.body.mensagem).toMatch(/Muitas tentativas de login/);
    });
  });

  describe('POST /auth/logout', () => {
    it('deve limpar o cookie e retornar 200', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout realizado com sucesso.');
      expect(response.headers['set-cookie'][0]).toMatch(/Max-Age=0/);
    });
  });
});
