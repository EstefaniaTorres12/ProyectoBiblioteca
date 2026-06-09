import { BookRepository } from '../../src/repositories/book.repository';
import { LoanRepository } from '../../src/repositories/loan.repository';
import { UserRepository } from '../../src/repositories/user.repository';
import { LoanService } from '../../src/services/loan.service';

jest.mock('../../src/repositories/loan.repository');
jest.mock('../../src/repositories/book.repository');
jest.mock('../../src/repositories/user.repository');

const MockedLoans = LoanRepository as jest.MockedClass<typeof LoanRepository>;
const MockedBooks = BookRepository as jest.MockedClass<typeof BookRepository>;
const MockedUsers = UserRepository as jest.MockedClass<typeof UserRepository>;

const fakeUser = { id: 1, name: 'Ana', email: 'ana@test.com', password: 'hashed', phone: null, role: 'SOCIO' as const, createdAt: new Date() };
const fakeBook = { id: 1, title: 'Clean Code', author: 'Martin', isbn: null, totalQuantity: 2, availableQuantity: 1, createdAt: new Date() };
const fakeLoan = {
  id: 1, userId: 1, bookId: 1,
  loanDate: new Date(), expectedReturnDate: new Date(), actualReturnDate: null,
  status: 'ACTIVO' as const, fineAmount: 0,
  user: fakeUser, book: fakeBook,
};

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(() => {
    MockedLoans.mockClear();
    MockedBooks.mockClear();
    MockedUsers.mockClear();
    service = new LoanService();
  });

  describe('create', () => {
    it('lanza error si el usuario no existe', async () => {
      MockedUsers.prototype.findById.mockResolvedValue(null);
      await expect(service.create({ userId: 99, bookId: 1 })).rejects.toThrow('Usuario no existe');
    });

    it('lanza error si no hay ejemplares disponibles', async () => {
      MockedUsers.prototype.findById.mockResolvedValue(fakeUser);
      MockedBooks.prototype.findById.mockResolvedValue({ ...fakeBook, availableQuantity: 0 });
      await expect(service.create({ userId: 1, bookId: 1 })).rejects.toThrow('No hay ejemplares disponibles');
    });

    it('crea el préstamo y decrementa disponibilidad', async () => {
      MockedUsers.prototype.findById.mockResolvedValue(fakeUser);
      MockedBooks.prototype.findById.mockResolvedValue(fakeBook);
      MockedBooks.prototype.decrementAvailable.mockResolvedValue(undefined as any);
      MockedLoans.prototype.create.mockResolvedValue(fakeLoan as any);

      const result = await service.create({ userId: 1, bookId: 1 });
      expect(result).toEqual(fakeLoan);
      expect(MockedBooks.prototype.decrementAvailable).toHaveBeenCalledWith(1);
    });
  });

  describe('returnBook', () => {
    it('lanza error si el préstamo no existe', async () => {
      MockedLoans.prototype.findById.mockResolvedValue(null);
      await expect(service.returnBook(99)).rejects.toThrow('Préstamo no existe');
    });

    it('lanza error si el préstamo ya fue devuelto', async () => {
      MockedLoans.prototype.findById.mockResolvedValue(
        { ...fakeLoan, actualReturnDate: new Date() } as any
      );
      await expect(service.returnBook(1)).rejects.toThrow('El préstamo ya fue devuelto');
    });

    it('registra devolución con multa cuando hay días de retraso', async () => {
      const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      MockedLoans.prototype.findById.mockResolvedValue(
        { ...fakeLoan, expectedReturnDate: past, actualReturnDate: null } as any
      );
      MockedBooks.prototype.incrementAvailable.mockResolvedValue(undefined as any);
      MockedLoans.prototype.returnLoan.mockResolvedValue(
        { ...fakeLoan, status: 'DEVUELTO', fineAmount: 3000, actualReturnDate: new Date() } as any
      );
      await service.returnBook(1);
      expect(MockedBooks.prototype.incrementAvailable).toHaveBeenCalledWith(1);
      expect(MockedLoans.prototype.returnLoan).toHaveBeenCalledWith(
        1, expect.any(Date), expect.any(Number)
      );
    });

    it('registra devolución sin multa cuando se entrega a tiempo', async () => {
      const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      MockedLoans.prototype.findById.mockResolvedValue(
        { ...fakeLoan, expectedReturnDate: future, actualReturnDate: null } as any
      );
      MockedBooks.prototype.incrementAvailable.mockResolvedValue(undefined as any);
      MockedLoans.prototype.returnLoan.mockResolvedValue(
        { ...fakeLoan, status: 'DEVUELTO', fineAmount: 0, actualReturnDate: new Date() } as any
      );
      await service.returnBook(1);
      expect(MockedLoans.prototype.returnLoan).toHaveBeenCalledWith(1, expect.any(Date), 0);
    });
  });

  describe('calculateFine', () => {
    it('calcula multa cuando hay días de retraso', () => {
      const expected = new Date('2026-06-01T00:00:00.000Z');
      const actual = new Date('2026-06-04T00:00:00.000Z');
      expect(service.calculateFine(expected, actual)).toBe(3000);
    });

    it('no calcula multa cuando se devuelve a tiempo', () => {
      const expected = new Date('2026-06-04T00:00:00.000Z');
      const actual = new Date('2026-06-01T00:00:00.000Z');
      expect(service.calculateFine(expected, actual)).toBe(0);
    });
  });
});
