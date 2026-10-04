import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AuthService from '../../src/Services/authService.js';
import UserService from '../../src/Services/userService.js';

describe('AuthService tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('deve lançar um erro se o usuário não for encontrado', async () => {
      jest.spyOn(UserService, 'findByEmail').mockResolvedValue(null);

      await expect(AuthService.login('test@test.com', 'password123')).rejects.toThrow('Credenciais inválidas');
      
      try {
        await AuthService.login('test@test.com', 'password123');
      } catch (err) {
        expect(err.statusCode).toBe(401);
      }
    });

    it('deve lançar um erro se a senha não corresponder', async () => {
      jest.spyOn(UserService, 'findByEmail').mockResolvedValue({ password: 'hashedPassword' });
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(AuthService.login('test@test.com', 'wrongpassword')).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar um erro se o status do usuário for Inativo', async () => {
      jest.spyOn(UserService, 'findByEmail').mockResolvedValue({ password: 'hashedPassword', status: 'Inativo' });
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      await expect(AuthService.login('test@test.com', 'password123')).rejects.toThrow('Credenciais inválidas');
    });

    it('deve retornar um token se as credenciais forem válidas', async () => {
      const mockUser = {
        _id: { toString: () => '12345' },
        email: 'test@test.com',
        role: 'Admin',
        departamento: 'TI',
        status: 'Ativo',
        password: 'hashedPassword'
      };
      jest.spyOn(UserService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken');
      process.env.JWT_SECRET = 'secret';

      const token = await AuthService.login('test@test.com', 'password123');

      expect(token).toBe('mockedToken');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '12345', email: 'test@test.com', role: 'Admin', departamento: 'TI' },
        'secret',
        { expiresIn: '20m' }
      );
    });
  });
});
