import { escapeRegex } from '../../src/Utils/sanitizers.js';

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
});
