import { FormatUtils } from './format.utils';

describe('FormatUtils', () => {
  it('deve formatar data corretamente para input', () => {
    expect(FormatUtils.formatDateForInput('2025-03-15T00:00:00Z')).toBe('2025-03-15');
  });

  it('deve normalizar hora corretamente', () => {
    expect(FormatUtils.normalizeHour('7:5')).toBe('07:05');
  });

  it('deve gerar ID de data corretamente', () => {
    const d = new Date(Date.UTC(2025, 0, 5));
    expect(FormatUtils.toId(d)).toBe('2025-01-05');
  });
});
