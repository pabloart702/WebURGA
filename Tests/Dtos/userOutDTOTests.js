import outUserDTO from '../../src/Dtos/userOutDTO.js';

describe('userOutDTO tests', () => {
  it('deve formatar o objeto do usuário mapeando _id para id e profilePicture para fotoPerfil', () => {
    const mockUser = {
      _id: 'mongo-id-123',
      nome: 'Carlos',
      email: 'carlos@teste.com',
      cpf: '00000000000',
      role: 'Usuário',
      matricula: '5555',
      cargo: 'Agente',
      departamento: 'Operações',
      status: 'Ativo',
      profilePicture: 'foto.jpg'
    };

    const dto = new outUserDTO(mockUser);

    expect(dto.id).toBe('mongo-id-123');
    expect(dto.nome).toBe('Carlos');
    expect(dto.fotoPerfil).toBe('foto.jpg');
    expect(dto._id).toBeUndefined(); // Não deve expor o _id original
    expect(dto.profilePicture).toBeUndefined();
  });
});
