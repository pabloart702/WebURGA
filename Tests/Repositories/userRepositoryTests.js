import { jest } from '@jest/globals';
import userRepository from '../../src/Repositories/userRepository.js';
import User from '../../src/Models/userModel.js';

describe('User Repository Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('deve listar usuários (findAll) com paginação e busca', async () => {
    const mockFind = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ nome: 'Maria' }])
    };
    jest.spyOn(User, 'find').mockReturnValue(mockFind);
    jest.spyOn(User, 'countDocuments').mockResolvedValue(1);

    const result = await userRepository.findAll(1, 'Maria', 'TI');
    
    expect(User.find).toHaveBeenCalled();
    expect(mockFind.sort).toHaveBeenCalledWith({ nome: 1 });
    expect(mockFind.skip).toHaveBeenCalledWith(0);
    expect(mockFind.limit).toHaveBeenCalledWith(50);
    expect(result.data).toHaveLength(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
  });

  it('deve buscar usuário por id (findById)', async () => {
    jest.spyOn(User, 'findById').mockResolvedValue({ id: '123' });
    const result = await userRepository.findById('123');
    expect(User.findById).toHaveBeenCalledWith('123');
    expect(result.id).toBe('123');
  });

  it('deve buscar usuário por cpf (findByCpf)', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ cpf: '123456' });
    const result = await userRepository.findByCpf('123456');
    expect(User.findOne).toHaveBeenCalledWith({ cpf: '123456' });
    expect(result.cpf).toBe('123456');
  });

  it('deve buscar usuário por nome (findByNome) e escapar regex', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ nome: 'João' });
    const result = await userRepository.findByNome('João');
    expect(User.findOne).toHaveBeenCalledWith({ nome: expect.any(RegExp) });
    expect(result.nome).toBe('João');
  });

  it('deve buscar usuário por matrícula (findByMatricula)', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ matricula: '1234567' });
    const result = await userRepository.findByMatricula('1234567');
    expect(User.findOne).toHaveBeenCalledWith({ matricula: '1234567' });
    expect(result.matricula).toBe('1234567');
  });

  it('deve buscar usuário por email (findByEmail)', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'teste@teste.com' });
    const result = await userRepository.findByEmail('teste@teste.com');
    expect(User.findOne).toHaveBeenCalledWith({ email: 'teste@teste.com' });
    expect(result.email).toBe('teste@teste.com');
  });

  it('deve criar um usuário (create)', async () => {
    jest.spyOn(User, 'create').mockResolvedValue({ nome: 'Novo Usuário' });
    const result = await userRepository.create({ nome: 'Novo Usuário' });
    expect(User.create).toHaveBeenCalledWith({ nome: 'Novo Usuário' });
    expect(result.nome).toBe('Novo Usuário');
  });

  it('deve atualizar um usuário (update)', async () => {
    jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue({ nome: 'Usuário Atualizado' });
    const result = await userRepository.update('123', { nome: 'Usuário Atualizado' });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { nome: 'Usuário Atualizado' }, { returnDocument: 'after' });
    expect(result.nome).toBe('Usuário Atualizado');
  });

  it('deve desativar um usuário (delete)', async () => {
    jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue({ status: 'Inativo' });
    const result = await userRepository.delete('123');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { status: 'Inativo' }, { returnDocument: 'after' });
    expect(result.status).toBe('Inativo');
  });

  it('deve ativar um usuário (activate)', async () => {
    jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue({ status: 'Ativo' });
    const result = await userRepository.activate('123');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { status: 'Ativo' }, { returnDocument: 'after' });
    expect(result.status).toBe('Ativo');
  });
});
