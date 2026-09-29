import { jest } from '@jest/globals';
import documentService from '../../src/Services/documentService.js';
import documentRepository from '../../src/Repositories/documentRepository.js';

describe('DocumentService tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllDocuments', () => {
    it('deve retornar a lista formatada de documentos (com e sem title no metadata)', async () => {
      const mockFiles = [
        { _id: '1', filename: 'doc1.pdf', metadata: { title: 'Doc 1' }, contentType: 'application/pdf', uploadDate: '2023-01-01', length: 1024 },
        { _id: '2', filename: 'doc2.pdf', contentType: 'application/pdf', uploadDate: '2023-01-02', length: 2048 } // sem title
      ];
      jest.spyOn(documentRepository, 'findAll').mockResolvedValue(mockFiles);

      const result = await documentService.getAllDocuments();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Doc 1');
      expect(result[1].title).toBe('doc2.pdf'); // fallback para filename
      expect(result[0].id).toBe('1');
    });
  });

  describe('getDocumentByFilename', () => {
    it('deve retornar null se não encontrar o arquivo', async () => {
      jest.spyOn(documentRepository, 'findByFilename').mockResolvedValue([]);
      const result = await documentService.getDocumentByFilename('teste.pdf');
      expect(result).toBeNull();
    });

    it('deve retornar o primeiro arquivo se encontrar', async () => {
      jest.spyOn(documentRepository, 'findByFilename').mockResolvedValue([{ filename: 'teste.pdf' }]);
      const result = await documentService.getDocumentByFilename('teste.pdf');
      expect(result.filename).toBe('teste.pdf');
    });
  });

  describe('getDownloadStream', () => {
    it('deve repassar a chamada para o repositório', () => {
      jest.spyOn(documentRepository, 'getDownloadStream').mockReturnValue('mock-stream');
      const result = documentService.getDownloadStream('teste.pdf');
      expect(result).toBe('mock-stream');
      expect(documentRepository.getDownloadStream).toHaveBeenCalledWith('teste.pdf');
    });
  });
});
