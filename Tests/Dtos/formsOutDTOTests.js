import { OutFormsDTO } from '../../src/Dtos/formsOutDTO.js';

describe('FormsOutDTO tests', () => {
  it('deve formatar a data_operacao de um objeto Date para string DD-MM-YYYY', () => {
    const mockForm = {
      _id: { toString: () => 'mongo-id-123' },
      departamento: 'TI',
      data_operacao: new Date('2023-12-25T00:00:00.000Z')
    };

    const dto = new OutFormsDTO(mockForm);
    expect(dto.id).toBe('mongo-id-123');
    expect(dto.data_operacao).toBe('25-12-2023');
    expect(dto.departamento).toBe('TI');
  });
});
