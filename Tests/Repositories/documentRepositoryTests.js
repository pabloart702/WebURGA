import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import documentRepository from '../../src/Repositories/documentRepository.js';

// Setup before tests
mongoose.connection.db = {};
mongoose.mongo = {
    GridFSBucket: class {
        constructor(db, options) {
            this.db = db;
            this.options = options;
        }
        find() {
            return {
                toArray: async () => [{ filename: 'doc1.pdf' }]
            };
        }
        openDownloadStreamByName(filename) {
            return 'mock-stream';
        }
    }
};

describe('Document Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o bucket GridFS corretamente', () => {
    const bucket = documentRepository.getBucket();
    expect(bucket.options.bucketName).toBe('documents');
  });

  it('deve buscar todos os documentos (findAll)', async () => {
    const docs = await documentRepository.findAll();
    expect(docs).toHaveLength(1);
    expect(docs[0].filename).toBe('doc1.pdf');
  });

  it('deve buscar um documento por filename (findByFilename)', async () => {
    const docs = await documentRepository.findByFilename('doc1.pdf');
    expect(docs).toHaveLength(1);
    expect(docs[0].filename).toBe('doc1.pdf');
  });

  it('deve retornar a stream de download (getDownloadStream)', () => {
    const stream = documentRepository.getDownloadStream('doc1.pdf');
    expect(stream).toBe('mock-stream');
  });
});
