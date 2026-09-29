import { jest } from '@jest/globals';
import FormsController from '../../src/Controllers/formsControllers.js';
import formsService from '../../src/Services/formsService.js';
import { InputFormsDTO, UpdateFormsDTO } from '../../src/Dtos/formsInputDTO.js';

describe('FormsController tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {}, user: { id: 'user123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.restoreAllMocks();
  });

  describe('createForms', () => {
    it('deve criar um formulário chamando formsService com DTO e retornar 201', async () => {
      req.body = { departamento: 'TI', operacao: 'Op 1' };
      jest.spyOn(formsService, 'createForms').mockResolvedValue({ id: 'form-id' });

      await FormsController.createForms(req, res, next);

      expect(formsService.createForms).toHaveBeenCalledWith(expect.any(InputFormsDTO), req.user);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 'form-id' });
    });
  });

  describe('listForms', () => {
    it('deve chamar getForms passando paginacao e options e retornar 200', async () => {
      req.query = { page: '2', limit: '5', status: 'pendente' };
      jest.spyOn(formsService, 'getForms').mockResolvedValue({ total: 10, page: 2 });

      await FormsController.listForms(req, res, next);

      expect(formsService.getForms).toHaveBeenCalledWith(2, 5, req.user, expect.objectContaining({ status: 'pendente' }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ total: 10, page: 2 });
    });
  });

  describe('updateForms', () => {
    it('deve chamar updateForms do servico e retornar 200', async () => {
      req.params.id = '123';
      req.body = { status: 'realizado' };
      jest.spyOn(formsService, 'updateForms').mockResolvedValue({ id: '123', status: 'realizado' });

      await FormsController.updateForms(req, res, next);

      expect(formsService.updateForms).toHaveBeenCalledWith('123', expect.any(UpdateFormsDTO), req.user);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteForms', () => {
    it('deve deletar formulário chamando servico e retornar mensagem', async () => {
      req.params.id = '123';
      jest.spyOn(formsService, 'deleteForms').mockResolvedValue({ id: '123' });

      await FormsController.deleteForms(req, res, next);

      expect(formsService.deleteForms).toHaveBeenCalledWith('123', req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Formulário cancelado com sucesso", form: { id: '123' } });
    });
  });
});
