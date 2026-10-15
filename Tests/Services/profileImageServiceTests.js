import { jest } from '@jest/globals';
import ProfileImageService from '../../src/Services/profileImageService.js';
import ProfileImageRepository from '../../src/Repositories/profileImageRepository.js';

describe('ProfileImageService tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getImageByFilename', () => {
    it('deve chamar o repositório para buscar metadados da imagem', async () => {
      const mockFile = { filename: 'foto.webp', length: 12345 };
      jest.spyOn(ProfileImageRepository, 'findByFilename').mockResolvedValue(mockFile);

      const result = await ProfileImageService.getImageByFilename('foto.webp');
      expect(result).toEqual(mockFile);
      expect(ProfileImageRepository.findByFilename).toHaveBeenCalledWith('foto.webp');
    });
  });

  describe('getDownloadStream', () => {
    it('deve retornar o stream fornecido pelo repositório', () => {
      jest.spyOn(ProfileImageRepository, 'getDownloadStream').mockReturnValue('mock-stream');
      const stream = ProfileImageService.getDownloadStream('foto.webp');
      expect(stream).toBe('mock-stream');
      expect(ProfileImageRepository.getDownloadStream).toHaveBeenCalledWith('foto.webp');
    });
  });

  describe('deleteProfileImage', () => {
    it('não deve deletar se a imagem for uma foto padrão de seed (ex: img1M.jpeg)', async () => {
      const spyDelete = jest.spyOn(ProfileImageRepository, 'deleteByFilename').mockResolvedValue();
      await ProfileImageService.deleteProfileImage('img1M.jpeg');
      expect(spyDelete).not.toHaveBeenCalled();
    });

    it('deve deletar do GridFS se for uma imagem customizada (ex: uuid.webp)', async () => {
      const spyDelete = jest.spyOn(ProfileImageRepository, 'deleteByFilename').mockResolvedValue();
      await ProfileImageService.deleteProfileImage('custom-uuid.webp');
      expect(spyDelete).toHaveBeenCalledWith('custom-uuid.webp');
    });
  });
});
