import { InputUserDTO, AdminUpdateUserDTO, ProfileUpdateDTO } from '../../src/Dtos/userInputDTO.js';

describe('userInputDTO tests', () => {
  describe('InputUserDTO', () => {
    it('deve mapear os campos e definir valores padrão para role e status', () => {
      const payload = {
        nome: 'João',
        email: 'joao@teste.com',
        password: '123',
        cpf: '12345678900',
        matricula: '1234',
        cargo: 'Analista',
        departamento: 'TI'
      };

      const dto = new InputUserDTO(payload);

      expect(dto.nome).toBe('João');
      expect(dto.email).toBe('joao@teste.com');
      expect(dto.role).toBe('Usuário');
      expect(dto.status).toBe('Ativo');
    });

    it('deve aceitar role e status customizados caso sejam passados', () => {
      const payload = { role: 'Administrador', status: 'Inativo' };
      const dto = new InputUserDTO(payload);

      expect(dto.role).toBe('Administrador');
      expect(dto.status).toBe('Inativo');
    });
  });

  describe('AdminUpdateUserDTO', () => {
    it('deve mapear apenas os campos que forem passados', () => {
      const payload = { nome: 'Maria', status: 'Inativo' };
      const dto = new AdminUpdateUserDTO(payload);

      expect(dto.nome).toBe('Maria');
      expect(dto.status).toBe('Inativo');
      expect(dto.email).toBeUndefined(); // Não deve existir se não foi passado
      expect(dto.role).toBeUndefined();
    });
  });

  describe('ProfileUpdateDTO', () => {
    it('deve permitir atualizar apenas campos restritos ao próprio perfil', () => {
      // payload tenta alterar propriedades admin como role e departamento
      const payload = { nome: 'Pedro', email: 'pedro@teste.com', role: 'Administrador', departamento: 'Diretoria' };
      const dto = new ProfileUpdateDTO(payload);

      expect(dto.nome).toBe('Pedro');
      expect(dto.email).toBe('pedro@teste.com');
      expect(dto.role).toBeUndefined(); // Bloqueado no DTO
      expect(dto.departamento).toBeUndefined(); // Bloqueado no DTO
    });
  });
});
