import { LoanService } from '../../src/services/loan.service';

describe('LoanService', () => {
  it('calcula multa cuando hay días de retraso', () => {
    const service = new LoanService();
    const expected = new Date('2026-06-01T00:00:00.000Z');
    const actual = new Date('2026-06-04T00:00:00.000Z');

    expect(service.calculateFine(expected, actual)).toBe(3000);
  });

  it('no calcula multa cuando se devuelve a tiempo', () => {
    const service = new LoanService();
    const expected = new Date('2026-06-04T00:00:00.000Z');
    const actual = new Date('2026-06-01T00:00:00.000Z');

    expect(service.calculateFine(expected, actual)).toBe(0);
  });
});
