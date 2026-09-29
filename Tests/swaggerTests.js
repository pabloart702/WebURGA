import swaggerSpec from '../src/swagger.js';

describe('Swagger Tests', () => {
  it('deve exportar uma configuração válida do Swagger', () => {
    expect(swaggerSpec).toBeDefined();
    expect(swaggerSpec.openapi).toBe('3.0.0');
    expect(swaggerSpec.info.title).toBe('API URGA');
    expect(swaggerSpec.info.version).toBe('1.0.0');
    expect(swaggerSpec.paths).toBeDefined();
  });
});
