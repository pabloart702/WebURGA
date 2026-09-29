import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authMiddleware, authorize } from '../../src/Middlewares/authMiddleware.js';

describe('Auth Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {}, headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
    jest.restoreAllMocks();
  });

  describe('authMiddleware', () => {
    it('deve extrair o token do cookie e chamar next', () => {
      req.cookies.token = 'valid-token';
      jest.spyOn(jwt, 'verify').mockReturnValue({ id: '123', role: 'Usuário' });

      authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(req.user).toEqual({ id: '123', role: 'Usuário' });
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(); // next chamado sem erro
    });

    it('deve extrair o token do cabeçalho Bearer (fallback) e chamar next', () => {
      req.headers.authorization = 'Bearer valid-token-header';
      jest.spyOn(jwt, 'verify').mockReturnValue({ id: '456' });

      authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token-header', 'test-secret');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('deve falhar se não houver token', () => {
      authMiddleware(req, res, next);
      
      expect(next).toHaveBeenCalledTimes(1);
      const errorArg = next.mock.calls[0][0];
      expect(errorArg).toBeInstanceOf(Error);
      expect(errorArg.statusCode).toBe(401);
      expect(errorArg.message).toBe("Não autenticado. Faça login para continuar.");
    });

    it('deve repassar erro se o token for inválido', () => {
      req.cookies.token = 'invalid-token';
      const jwtError = new Error('invalid signature');
      jwtError.name = 'JsonWebTokenError';
      jest.spyOn(jwt, 'verify').mockImplementation(() => { throw jwtError });

      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const errorArg = next.mock.calls[0][0];
      expect(errorArg.statusCode).toBe(401);
      expect(errorArg.message).toBe("Sessão expirada ou inválida. Faça login novamente.");
    });
  });

  describe('authorize', () => {
    it('deve permitir acesso se a role estiver na lista', () => {
      req.user = { role: 'Administrador' };
      const middleware = authorize('Usuário', 'Administrador');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(); // Sem erros
    });

    it('deve negar acesso se a role não estiver na lista', () => {
      req.user = { role: 'Convidado' };
      const middleware = authorize('Usuário', 'Administrador');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const errorArg = next.mock.calls[0][0];
      expect(errorArg.statusCode).toBe(403);
      expect(errorArg.message).toBe("Acesso negado.");
    });
  });
});
