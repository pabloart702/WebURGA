import { jest } from '@jest/globals';
import formsRepository from '../../src/Repositories/formsRepository.js';
import Forms from '../../src/Models/formsModel.js';

describe('Forms Repository Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('deve listar formulários (findAll) com paginação', async () => {
    const mockFind = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([{ operacao: 'Op 1' }])
    };
    jest.spyOn(Forms, 'find').mockReturnValue(mockFind);
    jest.spyOn(Forms, 'countDocuments').mockResolvedValue(1);

    const result = await formsRepository.findAll(1, 10, {}, { createdAt: -1 });

    expect(Forms.find).toHaveBeenCalledWith({});
    expect(mockFind.populate).toHaveBeenCalledWith('criador', 'nome cpf');
    expect(mockFind.skip).toHaveBeenCalledWith(0);
    expect(mockFind.limit).toHaveBeenCalledWith(10);
    expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result.forms).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('deve buscar formulário por id (findById)', async () => {
    const mockFindById = {
      populate: jest.fn().mockResolvedValue({ operacao: 'Op 1' })
    };
    jest.spyOn(Forms, 'findById').mockReturnValue(mockFindById);

    const result = await formsRepository.findById('123');

    expect(Forms.findById).toHaveBeenCalledWith('123');
    expect(mockFindById.populate).toHaveBeenCalledWith('criador', 'nome cpf');
    expect(result.operacao).toBe('Op 1');
  });

  it('deve atualizar formulário (update)', async () => {
    jest.spyOn(Forms, 'findByIdAndUpdate').mockResolvedValue({ operacao: 'Op 2' });
    const result = await formsRepository.update('123', { operacao: 'Op 2' });
    expect(Forms.findByIdAndUpdate).toHaveBeenCalledWith('123', { operacao: 'Op 2' }, { new: true, runValidators: true });
    expect(result.operacao).toBe('Op 2');
  });

  it('deve cancelar formulário, também conhecido como remover (remove)', async () => {
    jest.spyOn(Forms, 'findByIdAndUpdate').mockResolvedValue({ status: 'cancelado' });
    const result = await formsRepository.remove('123');
    expect(Forms.findByIdAndUpdate).toHaveBeenCalledWith('123', { status: 'cancelado' }, { new: true });
    expect(result.status).toBe('cancelado');
  });

  it('deve retornar as métricas do dashboard (getDashboardMetrics)', async () => {
    jest.spyOn(Forms, 'countDocuments')
      .mockResolvedValueOnce(5)  // apoiosPrestados
      .mockResolvedValueOnce(10); // apoiosSolicitados

    jest.spyOn(Forms, 'aggregate')
      .mockResolvedValueOnce([{ _id: null, totalValor: 1000 }]) // valorAgg
      .mockResolvedValueOnce([{ _id: 'Delegacia A', count: 3 }]) // delegaciasMaisSolicitam
      .mockResolvedValueOnce([{ _id: 'Veículo', count: 2 }]) // tiposMaisApreendidos
      .mockResolvedValueOnce([{ _id: 'Apreensão', count: 4 }]); // resultadosMaisComuns

    const metrics = await formsRepository.getDashboardMetrics();

    expect(metrics.apoiosPrestados).toBe(5);
    expect(metrics.apoiosSolicitados).toBe(10);
    expect(metrics.totalValorEstimado).toBe(1000);
    expect(metrics.delegaciasMaisSolicitam[0]._id).toBe('Delegacia A');
    expect(metrics.tiposMaisApreendidos[0]._id).toBe('Veículo');
    expect(metrics.resultadosMaisComuns[0]._id).toBe('Apreensão');
  });

  it('deve criar formulário (create)', async () => {
    const mockSave = jest.spyOn(Forms.prototype, 'save').mockResolvedValue({ operacao: 'Op Criada' });
    const result = await formsRepository.create({ operacao: 'Op Criada' });
    expect(mockSave).toHaveBeenCalled();
    expect(result.operacao).toBe('Op Criada');
  });
});
