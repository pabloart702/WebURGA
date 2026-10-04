import { jest } from '@jest/globals';
import UserController from '../../src/Controllers/userControllers.js';
import UserService from '../../src/Services/userService.js';

describe('UserController tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {}, user: { id: 'user123' }, file: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.restoreAllMocks();
  });

  describe('listUsers', () => {
    it('deve retornar lista de usuários com paginação', async () => {
      req.query = { page: '1', search: 'teste', departamento: 'TI' };
      const mockUsersData = { data: [{ _id: '1', nome: 'P1' }], total: 1 };
      
      jest.spyOn(UserService, 'findAll').mockResolvedValue(mockUsersData);

      await UserController.listUsers(req, res, next);

      expect(UserService.findAll).toHaveBeenCalledWith(1, 'teste', 'TI');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('deve chamar create do UserService com InputUserDTO e retornar 201', async () => {
      req.body = { nome: 'João', email: 'joao@teste.com' };
      jest.spyOn(UserService, 'create').mockResolvedValue({ _id: '2', nome: 'João' });

      await UserController.createUser(req, res, next);

      expect(UserService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário e retornar mensagem de sucesso', async () => {
      req.params.id = '123';
      jest.spyOn(UserService, 'delete').mockResolvedValue({ _id: '123', status: 'Inativo' });

      await UserController.deleteUser(req, res, next);

      expect(UserService.delete).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        mensagem: "Usuário desativado com sucesso"
      }));
    });
  });

  describe('uploadProfilePicture', () => {
    it('deve retornar 400 se nenhuma imagem for processada', async () => {
      req.file = undefined;
      await UserController.uploadProfilePicture(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Nenhuma imagem foi processada.' });
    });

    it('deve fazer upload e retornar sucesso', async () => {
      req.file = { filename: 'foto.jpg' };
      jest.spyOn(UserService, 'updateProfilePicture').mockResolvedValue({ _id: 'user123', profilePicture: 'foto.jpg' });

      await UserController.uploadProfilePicture(req, res, next);

      expect(UserService.updateProfilePicture).toHaveBeenCalledWith('user123', 'foto.jpg');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        mensagem: "Foto de perfil atualizada com sucesso."
      }));
    });
  });
});
