import { validationResult } from 'express-validator';
import { loginValidator } from '../../src/Validators/authValidator.js';

// Função auxiliar para rodar a cadeia de middlewares do express-validator
async function runValidation(req, middlewares) {
  for (const middleware of middlewares) {
    await middleware(req, {}, () => { });
  }
  return validationResult(req);
}

describe('Auth Validator Tests', () => {
  it('deve aprovar requisição com email e senha corretos', async () => {
    const req = {
      body: {
        email: 'teste@email.com',
        password: 'minhasenhaforte'
      }
    };

    const result = await runValidation(req, loginValidator);
    expect(result.isEmpty()).toBe(true);
  });

  it('deve falhar se email ou senha não forem enviados', async () => {
    const req = { body: {} };

    const result = await runValidation(req, loginValidator);
    expect(result.isEmpty()).toBe(false);

    const errors = result.array().map(e => e.msg);
    expect(errors).toContain('O email é obrigatório.');
    expect(errors).toContain('A senha é obrigatória.');
  });

  it('deve falhar se os campos excederem o tamanho máximo ou não forem strings', async () => {
    const req = {
      body: {
        email: 12345, // não é string
        password: 'a'.repeat(150) // maior que 50
      }
    };

    const result = await runValidation(req, loginValidator);
    expect(result.isEmpty()).toBe(false);

    const errors = result.array().map(e => e.msg);
    expect(errors).toContain('O email deve ser uma string.');
    expect(errors).toContain('A senha excede o tamanho máximo permitido.');
  });
});
