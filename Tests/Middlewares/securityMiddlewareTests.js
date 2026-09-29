import { jest } from '@jest/globals';
import { 
  globalLimiter, 
  loginLimiter, 
  downloadLimiter, 
  uploadLimiter, 
  createLimiter, 
  securityHeadersMiddleware 
} from '../../src/Middlewares/securityMiddleware.js';

describe('Security Middleware Tests', () => {
  describe('Rate Limiters', () => {
    it('deve exportar os limiters como funções middleware', () => {
      expect(typeof globalLimiter).toBe('function');
      expect(typeof loginLimiter).toBe('function');
      expect(typeof downloadLimiter).toBe('function');
      expect(typeof uploadLimiter).toBe('function');
      expect(typeof createLimiter).toBe('function');
    });
  });

  describe('securityHeadersMiddleware', () => {
    it('deve definir os cabeçalhos de segurança e chamar next', () => {
      const req = {};
      const res = { setHeader: jest.fn() };
      const next = jest.fn();

      securityHeadersMiddleware(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Security-Policy', "default-src 'none'");
      expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'inline');
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
