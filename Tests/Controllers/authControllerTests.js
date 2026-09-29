import { jest } from '@jest/globals';
import AuthController from '../../src/Controllers/authController.js';
import AuthService from '../../src/Services/authService.js';

describe('AuthController tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    next = jest.fn();
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('deve lançar erro 400 se email ou senha estiverem ausentes', async () => {
      req.body = { email: 'teste@teste.com' }; // sem password
      
      await AuthController.login(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Email e senha são obrigatórios');
      expect(error.statusCode).toBe(400);
    });

    it('deve definir o cookie token e retornar sucesso 200', async () => {
      req.body = { email: 'teste@teste.com', password: '123' };
      jest.spyOn(AuthService, 'login').mockResolvedValue('fake-token');

      await AuthController.login(req, res, next);

      expect(AuthService.login).toHaveBeenCalledWith('teste@teste.com', '123');
      expect(res.cookie).toHaveBeenCalledWith('token', 'fake-token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login realizado com sucesso.' });
    });

    it('deve repassar o erro para o next() se AuthService.login lançar exceção', async () => {
      req.body = { email: 'teste@teste.com', password: '123' };
      const mockError = new Error('Credenciais inválidas');
      mockError.statusCode = 401;
      
      jest.spyOn(AuthService, 'login').mockRejectedValue(mockError);

      await AuthController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('deve limpar o cookie token com maxAge 0 e retornar 200', async () => {
      await AuthController.logout(req, res);

      expect(res.cookie).toHaveBeenCalledWith('token', '', expect.objectContaining({ maxAge: 0 }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout realizado com sucesso.' });
    });
  });
});
