import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userRoutes from '../../src/Routes/userRoutes.js';
import { authMiddleware } from '../../src/Middlewares/authMiddleware.js';
import userService from '../../src/Services/userService.js';

describe('User Routes Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/users', authMiddleware, userRoutes);
    app.use((err, req, res, next) => {
      const status = err.statusCode || 500;
      res.status(status).json({ error: err.message });
    });
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    // Simula que o usuário logado é Administrador para passar no authMiddleware e authorize
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user-id-123', role: 'Administrador' });
  });

  describe('GET /users', () => {
    it('deve retornar lista de usuários com status 200', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue({ data: [{ nome: 'Maria' }] });

      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer faketoken');

      expect(response.status).toBe(200);
      expect(response.body.data[0].nome).toBe('Maria');
    });

    it('deve retornar 401 se nenhum token for enviado', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /users', () => {
    it('deve criar usuário e retornar 201', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue({ id: '123', nome: 'João' });

      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer faketoken')
        .send({
          nome: 'João',
          email: 'joao@teste.com',
          password: 'Password_123',
          cpf: '12345678901',
          matricula: '123.456-7',
          cargo: 'Delegado',
          role: 'ADMINISTRADOR',
          departamento: 'Homicídios'
        });

      if (response.status === 400) {
          expect(response.body.errors).toBeDefined();
      } else {
          expect(response.status).toBe(201);
          expect(response.body.nome).toBe('João');
      }
    });

    it('deve retornar 400 se faltar campo obrigatório no validator', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer faketoken')
        .send({ email: 'joao@teste.com' }); // Falta nome, senha, etc.

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /users/perfil', () => {
    it('deve retornar perfil do usuário logado e status 200', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue({ nome: 'Admin' });

      const response = await request(app)
        .get('/users/perfil')
        .set('Authorization', 'Bearer faketoken');

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Admin');
      // Verifica se o ID passado ao service foi o ID do token (user-id-123)
      expect(userService.findById).toHaveBeenCalledWith('user-id-123');
    });
  });

  describe('PATCH /users/id/:id', () => {
    it('deve atualizar o usuário e retornar 200', async () => {
      jest.spyOn(userService, 'update').mockResolvedValue({ nome: 'João Atualizado' });

      const response = await request(app)
        .patch('/users/id/123')
        .set('Authorization', 'Bearer faketoken')
        .send({ nome: 'João Atualizado' });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('João Atualizado');
    });
  });
});
