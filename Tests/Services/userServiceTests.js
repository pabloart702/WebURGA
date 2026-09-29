import { jest } from '@jest/globals';
import UserService from '../../src/Services/userService.js';
import UserRepository from '../../src/Repositories/userRepository.js';
import bcrypt from 'bcrypt';

describe('UserService tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('findById', () => {
    it('deve lançar erro 404 se usuário não for encontrado', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(null);
      await expect(UserService.findById('123')).rejects.toThrow('Usuário não encontrado.');
    });

    it('deve retornar o usuário se for encontrado', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue({ _id: '123', nome: 'João' });
      const user = await UserService.findById('123');
      expect(user.nome).toBe('João');
    });
  });

  describe('create', () => {
    it('deve lançar erro se o CPF já estiver cadastrado', async () => {
      jest.spyOn(UserRepository, 'findByCpf').mockResolvedValue({ _id: '2' });
      await expect(UserService.create({ cpf: '111' })).rejects.toThrow('Já existe um usuário cadastrado com este CPF.');
    });

    it('deve lançar erro se a Matrícula já estiver cadastrada', async () => {
      jest.spyOn(UserRepository, 'findByCpf').mockResolvedValue(null);
      jest.spyOn(UserRepository, 'findByNome').mockResolvedValue(null);
      jest.spyOn(UserRepository, 'findByMatricula').mockResolvedValue({ _id: '3' });
      
      await expect(UserService.create({ matricula: '999' })).rejects.toThrow('Já existe um usuário cadastrado com esta Matrícula.');
    });

    it('deve criptografar a senha e criar o usuário', async () => {
      jest.spyOn(UserRepository, 'findByCpf').mockResolvedValue(null);
      jest.spyOn(UserRepository, 'findByNome').mockResolvedValue(null);
      jest.spyOn(UserRepository, 'findByMatricula').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('senha-hash');
      jest.spyOn(UserRepository, 'create').mockResolvedValue({ _id: '1', password: 'senha-hash' });

      const userData = { password: '123' };
      const result = await UserService.create(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('123', expect.any(Number));
      expect(UserRepository.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'senha-hash' }));
      expect(result.password).toBe('senha-hash');
    });
  });

  describe('update', () => {
    it('deve lançar erro se nenhum dado for enviado', async () => {
      await expect(UserService.update('123', {})).rejects.toThrow('Nenhum dado para atualizar.');
    });

    it('deve atualizar o usuário validando conflito de email', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue({ _id: '123', email: 'old@teste.com' });
      jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue({ _id: '456' }); // outro usuario tem esse email
      
      await expect(UserService.update('123', { email: 'new@teste.com' })).rejects.toThrow('Já existe um usuário cadastrado com este E-mail.');
    });
  });
});
