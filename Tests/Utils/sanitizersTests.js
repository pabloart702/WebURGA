import { escapeRegex, formatNomeProprio } from '../../src/Utils/sanitizers.js';

describe('Sanitizers Tests', () => {

  describe('escapeRegex', () => {
    it('deve escapar caracteres especiais de regex', () => {
      const input = '.*+?^${}()|[]\\';
      const output = escapeRegex(input);
      expect(output).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('deve retornar string vazia se não for string', () => {
      expect(escapeRegex(null)).toBe('');
      expect(escapeRegex(123)).toBe('');
    });
  });

  describe('formatNomeProprio', () => {
    it('deve capitalizar nomes próprios simples', () => {
      expect(formatNomeProprio('admin')).toBe('Admin');
      expect(formatNomeProprio('user')).toBe('User');
    });

    it('deve capitalizar nomes compostos e manter preposições em minúsculo', () => {
      expect(formatNomeProprio('marcelo dantas fontes')).toBe('Marcelo Dantas Fontes');
      expect(formatNomeProprio('joao da silva')).toBe('Joao da Silva');
      expect(formatNomeProprio('MARIA DE SOUZA')).toBe('Maria de Souza');
      expect(formatNomeProprio('pedro e paulo dos santos')).toBe('Pedro e Paulo dos Santos');
    });

    it('deve capitalizar preposição se for a primeira palavra', () => {
      expect(formatNomeProprio('da silva')).toBe('Da Silva');
    });

    it('deve remover espaços extras e tratar hífens', () => {
      expect(formatNomeProprio('  ana    maria  ')).toBe('Ana Maria');
      expect(formatNomeProprio('jean-paul sartre')).toBe('Jean-Paul Sartre');
    });

    it('deve retornar o valor original se não for string ou for vazio', () => {
      expect(formatNomeProprio('')).toBe('');
      expect(formatNomeProprio(null)).toBe(null);
      expect(formatNomeProprio(undefined)).toBe(undefined);
    });
  });
});

