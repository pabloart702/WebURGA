import { jest } from '@jest/globals';

jest.unstable_mockModule('express-validator', () => ({
  validationResult: jest.fn()
}));

const { validateRequest, globalErrorHandler } = await import('../../src/Middlewares/errorMiddleware.js');
const { validationResult } = await import('express-validator');

describe('Error Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateRequest', () => {
    it('deve chamar next se não houver erros de validação', () => {
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => true
      });

      validateRequest(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar 400 e os erros se a validação falhar', () => {
      const mockErrors = [{ msg: 'Erro de validação 1' }];
      jest.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      validateRequest(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: mockErrors });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('globalErrorHandler', () => {
    it('deve retornar erro genérico 500 para erros desconhecidos sem statusCode', () => {
      const error = new Error('Database connection failed');
      
      globalErrorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 500,
        message: 'Ocorreu um erro interno no servidor'
      });
    });

    it('deve retornar o statusCode e a mensagem original se fornecidos', () => {
      const error = new Error('Não encontrado');
      error.statusCode = 404;

      globalErrorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 404,
        message: 'Não encontrado'
      });
    });
  });
});
