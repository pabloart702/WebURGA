import { jest } from '@jest/globals';
import { webLog } from '../../src/Middlewares/logMiddleware.js';

describe('Log Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', path: '/api/test' };
    res = {};
    next = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve logar a requisição e chamar next', () => {
    webLog(req, res, next);
    
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('['));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GET em /api/test'));
    expect(next).toHaveBeenCalledTimes(1);
  });
});
