import { InputFormsDTO, UpdateFormsDTO } from '../../src/Dtos/formsInputDTO.js';

describe('FormsInputDTO tests', () => {
  it('deve formatar a data_operacao de DD-MM-YYYY para um objeto Date no InputFormsDTO', () => {
    const payload = { data_operacao: '25-12-2023', operacao: 'Operacao X' };
    const dto = new InputFormsDTO(payload, 'user123');
    
    expect(dto.data_operacao).toBeInstanceOf(Date);
    expect(dto.data_operacao.toISOString()).toBe('2023-12-25T00:00:00.000Z');
    expect(dto.criador).toBe('user123');
    expect(dto.status).toBe('pendente');
  });

  it('deve formatar a data_operacao no UpdateFormsDTO, se presente', () => {
    const payload = { data_operacao: '01-01-2024', status: 'realizado' };
    const dto = new UpdateFormsDTO(payload);
    
    expect(dto.data_operacao).toBeInstanceOf(Date);
    expect(dto.data_operacao.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    expect(dto.status).toBe('realizado');
    expect(dto.operacao).toBeUndefined(); // Campos ausentes não são definidos
  });
});
