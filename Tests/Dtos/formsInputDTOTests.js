import { InputFormsDTO, UpdateFormsDTO } from '../../src/Dtos/formsInputDTO.js';

describe('FormsInputDTO tests', () => {
  it('deve converter data_operacao sanitizada para um objeto Date no InputFormsDTO', () => {
    const payload = { data_operacao: '2023-12-25', operacao: 'Operacao X' };
    const dto = new InputFormsDTO(payload, 'user123');
    
    expect(dto.data_operacao).toBeInstanceOf(Date);
    expect(dto.data_operacao.toISOString().split('T')[0]).toBe('2023-12-25');
    expect(dto.criador).toBe('user123');
    expect(dto.status).toBe('pendente');
  });

  it('deve definir data_operacao como null quando não informada no InputFormsDTO', () => {
    const payload = { operacao: 'Operacao Sem Data' };
    const dto = new InputFormsDTO(payload, 'user123');
    
    expect(dto.data_operacao).toBeNull();
    expect(dto.numero_processo).toBeNull();
    expect(dto.numero_cautelar).toBeNull();
  });

  it('deve converter data_operacao no UpdateFormsDTO, se presente', () => {
    const payload = { data_operacao: '2024-01-01', status: 'realizado' };
    const dto = new UpdateFormsDTO(payload);
    
    expect(dto.data_operacao).toBeInstanceOf(Date);
    expect(dto.data_operacao.toISOString().split('T')[0]).toBe('2024-01-01');
    expect(dto.status).toBe('realizado');
    expect(dto.operacao).toBeUndefined(); // Campos ausentes não são definidos
  });
});
