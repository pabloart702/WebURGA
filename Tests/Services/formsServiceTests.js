import { jest } from '@jest/globals';
import formsRepository from '../../src/Repositories/formsRepository.js';
import FormsService from '../../src/Services/formsService.js';

describe('FormsService tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('createForms', () => {
    it('deve sobrescrever o departamento se o usuário não for Administrador', async () => {
      const inputDto = { nome: 'Teste', departamento: 'Financeiro' };
      const reqUser = { role: 'Comum', departamento: 'TI' };
      
      jest.spyOn(formsRepository, 'create').mockResolvedValue({ _id: '123', departamento: 'TI' });

      await FormsService.createForms(inputDto, reqUser);

      expect(inputDto.departamento).toBe('TI');
      expect(formsRepository.create).toHaveBeenCalledWith(inputDto);
    });

    it('deve lançar um erro se o status for realizado e a data_operacao estiver no futuro', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2); // 2 days in the future
      
      const inputDto = { status: 'realizado', data_operacao: futureDate.toISOString() };
      const reqUser = { role: 'Administrador' };

      await expect(FormsService.createForms(inputDto, reqUser)).rejects.toThrow('Não é possível registrar o apoio como realizado se a data da operação for no futuro.');
    });

    it('deve criar o formulário e retornar o DTO correspondente', async () => {
      const inputDto = { status: 'pendente' };
      const reqUser = { role: 'Administrador' };
      const createdRecord = { _id: '1', status: 'pendente' };
      
      jest.spyOn(formsRepository, 'create').mockResolvedValue(createdRecord);

      const result = await FormsService.createForms(inputDto, reqUser);
      
      expect(formsRepository.create).toHaveBeenCalledWith(inputDto);
      expect(result.id).toEqual('1'); // OutFormsDTO maps _id to id usually
    });
  });

  describe('getFormsById', () => {
    it('deve lançar erro 404 se o formulário não for encontrado', async () => {
      jest.spyOn(formsRepository, 'findById').mockResolvedValue(null);
      await expect(FormsService.getFormsById('123', {})).rejects.toThrow('Formulário não encontrado');
    });

    it('deve lançar erro 403 se o usuário não for administrador e o departamento não corresponder', async () => {
      jest.spyOn(formsRepository, 'findById').mockResolvedValue({ departamento: 'Financeiro' });
      const reqUser = { role: 'Comum', departamento: 'TI' };

      await expect(FormsService.getFormsById('123', reqUser)).rejects.toThrow('Acesso negado. O formulário não pertence ao seu departamento.');
    });

    it('deve retornar o DTO em caso de sucesso', async () => {
      jest.spyOn(formsRepository, 'findById').mockResolvedValue({ _id: '123', departamento: 'TI' });
      const reqUser = { role: 'Comum', departamento: 'TI' };

      const result = await FormsService.getFormsById('123', reqUser);
      expect(result.departamento).toBe('TI');
    });
  });

  describe('deleteForms', () => {
    it('deve lançar erro 404 se não for encontrado', async () => {
      jest.spyOn(formsRepository, 'findById').mockResolvedValue(null);
      await expect(FormsService.deleteForms('123', {})).rejects.toThrow('Formulário não encontrado');
    });

    it('deve lançar erro 403 se o usuário não for administrador nem o criador', async () => {
      jest.spyOn(formsRepository, 'findById').mockResolvedValue({ 
        criador: { _id: { toString: () => 'user1' } } 
      });
      const reqUser = { role: 'Comum', id: 'user2' };

      await expect(FormsService.deleteForms('123', reqUser)).rejects.toThrow('Acesso negado. Você só pode deletar os formulários que você mesmo criou.');
    });

    it('deve deletar e retornar o DTO do formulário deletado', async () => {
      jest.spyOn(formsRepository, 'findById').mockResolvedValue({ 
        _id: '123',
        criador: { _id: { toString: () => 'user1' } } 
      });
      jest.spyOn(formsRepository, 'remove').mockResolvedValue({ _id: '123', status: 'cancelado' });

      const reqUser = { role: 'Comum', id: 'user1' };
      const result = await FormsService.deleteForms('123', reqUser);

      expect(formsRepository.remove).toHaveBeenCalledWith('123');
      expect(result.status).toEqual('cancelado');
    });
  });
});
