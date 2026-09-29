import { jest } from '@jest/globals';
import fs from 'fs';
import { deleteProfileImage } from '../../src/Utils/fileUtils.js';

describe('FileUtils Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(fs, 'existsSync');
    jest.spyOn(fs, 'unlinkSync');
  });

  it('não deve fazer nada se o filename não for fornecido', () => {
    deleteProfileImage(null);
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  it('deve deletar o arquivo se ele existir', () => {
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});
    
    deleteProfileImage('perfil.jpg');
    
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();
  });

  it('não deve chamar unlinkSync se o arquivo não existir', () => {
    fs.existsSync.mockReturnValue(false);
    
    deleteProfileImage('perfil.jpg');
    
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });

  it('deve capturar e logar o erro se unlinkSync falhar', () => {
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {
      throw new Error('Erro falso');
    });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    deleteProfileImage('perfil.jpg');
    
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao deletar imagem antiga:', expect.any(Error));
  });
});
