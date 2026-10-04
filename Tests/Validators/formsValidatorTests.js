import { jest } from '@jest/globals';
import { validationResult } from 'express-validator';
import { CreateFormsValidator, UpdateFormsValidator } from '../../src/Validators/formsValidator.js';

async function runValidation(req, middlewares) {
  const rules = middlewares.slice(0, -1);
  for (const rule of rules) {
    await rule(req, {}, () => { });
  }
  return validationResult(req);
}

describe('Forms Validator Tests', () => {
  describe('CreateFormsValidator', () => {
    it('deve aprovar dados válidos', async () => {
      const req = {
        body: {
          departamento: 'URGA',
          operacao: 'Operação Limpeza',
          data_operacao: '25/08/2026',
          numero_processo: '123456789012345',
          medida_cautelar: 'Busca e apreensão',
          numero_cautelar: '9876543210',
          resultados: ['Apreensão', 'Sequestro'],
          tipos_apreendidos: ['CARRO', 'DINHEIRO'],
          descricao_operacao: 'Apreensão de bens ilícitos.',
          valor_estimado: 150000.00
        }
      };

      const result = await runValidation(req, CreateFormsValidator);
      const errors = result.array().map(e => e.msg);

      expect(errors.length).toBe(0);
      // Verifica se a data foi sanitizada corretamente para YYYY-MM-DD
      expect(req.body.data_operacao).toBe('2026-08-25');
    });

    it('deve aprovar criação sem data_operacao, numero_processo e numero_cautelar (campos opcionais)', async () => {
      const req = {
        body: {
          departamento: 'URGA',
          operacao: 'Operação Sem Data',
          medida_cautelar: 'Busca e apreensão',
          resultados: ['Apreensão'],
          tipos_apreendidos: ['CARRO'],
          descricao_operacao: 'Sem data e processos informados.',
          valor_estimado: 50000.00
        }
      };

      const result = await runValidation(req, CreateFormsValidator);
      const errors = result.array().map(e => e.msg);

      expect(errors.length).toBe(0);
      expect(req.body.data_operacao).toBeFalsy();
    });

    it('deve rejeitar campos obrigatórios ausentes', async () => {
      const req = { body: {} };
      const result = await runValidation(req, CreateFormsValidator);
      const errors = result.array().map(e => e.msg);

      expect(errors).toContain('Departamento é obrigatório');
      expect(errors).toContain('Operação é obrigatória');
      expect(errors).not.toContain('Data da operação é obrigatória');
      expect(errors).not.toContain('Número do processo é obrigatório');
      expect(errors).not.toContain('Número da medida cautelar é obrigatório');
      expect(errors).toContain('Medida cautelar é obrigatória');
      expect(errors).toContain('Resultados é obrigatório');
      expect(errors).toContain('Tipos apreendidos é obrigatório');
      expect(errors).toContain('O valor estimado total da operação é obrigatório');
    });

    it('deve rejeitar valores inválidos (enum e formatos)', async () => {
      const req = {
        body: {
          departamento: 'Departamento Inexistente',
          data_operacao: '2026-25-08', // formato incorreto
          numero_processo: 'abc', // não é número e é muito curto
          medida_cautelar: 'Prisão', // valor inválido
          resultados: ['Resultado Falso'],
          valor_estimado: 'não numérico'
        }
      };

      const result = await runValidation(req, CreateFormsValidator);
      const errors = result.array().map(e => e.msg);

      expect(errors).toContain('Departamento inválido.');
      expect(errors).toContain('Data da operação deve estar no formato DD/MM/YYYY ou DD-MM-YYYY');
      expect(errors).toContain('O número do processo deve ter entre 15 e 30 carateres');
      expect(errors).toContain('O número do processo deve conter apenas números');
      expect(errors).toContain('Medida cautelar inválida. Valores aceitos: Busca e Apreensão, Auto de Prisão em Flagrante, Sequestro, Bloqueio.');
      expect(errors).toContain('Resultado inválido. Valores aceitos: Uso, Apreensão, Sequestro, Indisponibilidades, Bloqueio, Depósito.');
      expect(errors).toContain('O valor estimado total da operação deve ser um número');
    });
  });

  describe('UpdateFormsValidator', () => {
    it('deve aprovar atualização parcial (campos opcionais)', async () => {
      const req = {
        body: {
          operacao: 'Operação Nova'
        }
      };

      const result = await runValidation(req, UpdateFormsValidator);
      const errors = result.array().map(e => e.msg);

      expect(errors.length).toBe(0);
    });
  });
});
