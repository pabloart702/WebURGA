import request from 'supertest';
import app from '../src/app.js';

describe('App Tests', () => {
  it('deve exportar a instância do Express configurada', () => {
    expect(app).toBeDefined();
    expect(typeof app.use).toBe('function');
  });

  it('deve retornar 404 em JSON e usar o globalErrorHandler para rotas não mapeadas', async () => {
    const response = await request(app).get('/rota-inexistente');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      statusCode: 404,
      message: 'Rota não encontrada'
    });
  });
});
