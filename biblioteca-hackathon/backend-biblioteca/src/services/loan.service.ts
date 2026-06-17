import { BookRepository } from '../repositories/book.repository';
import { LoanRepository } from '../repositories/loan.repository';
import { UserRepository } from '../repositories/user.repository';

const loans = new LoanRepository();
const books = new BookRepository();
const users = new UserRepository();

const DEFAULT_LOAN_DAYS = Number(process.env.DEFAULT_LOAN_DAYS ?? 7);
const FINE_PER_DAY = Number(process.env.FINE_PER_DAY ?? 1000);

export class LoanService {
  async create(data: { userId: number; bookId: number; expectedReturnDate?: string }) {
    const user = await users.findById(data.userId);
    if (!user) throw new Error('Usuario no existe');

    const book = await books.findById(data.bookId);
    if (!book) throw new Error('Libro no existe');
    if (book.availableQuantity <= 0) throw new Error('No hay ejemplares disponibles para prestar');

    const expectedReturnDate = data.expectedReturnDate
      ? new Date(data.expectedReturnDate)
      : this.addDays(new Date(), DEFAULT_LOAN_DAYS);

    await books.decrementAvailable(data.bookId);
    return loans.create({ userId: data.userId, bookId: data.bookId, expectedReturnDate });
  }

  async returnBook(loanId: number) {
    const loan = await loans.findById(loanId);
    if (!loan) throw new Error('Préstamo no existe');
    if (loan.actualReturnDate) throw new Error('El préstamo ya fue devuelto');

    const actualReturnDate = new Date();
    const fineAmount = this.calculateFine(loan.expectedReturnDate, actualReturnDate);

    await books.incrementAvailable(loan.bookId);
    return loans.returnLoan(loanId, actualReturnDate, fineAmount);
  }

  findActive() {
    return loans.findActive();
  }

  findByUser(userId: number) {
    return loans.findByUser(userId);
  }

  findByBook(bookId: number) {
    return loans.findByBook(bookId);
  }

  findOverdue() {
    return loans.findOverdue(new Date());
  }

  searchByUserName(name: string) {
    if (!name.trim()) throw new Error('El nombre de usuario no puede estar vacío');
    return loans.findByUserName(name.trim());
  }

  async findToday(userName?: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const loansList = await loans.findToday(start, end, userName);
    return { loans: loansList, total: loansList.length };
  }

  calculateFine(expectedReturnDate: Date, actualReturnDate: Date): number {
    const diffMs = actualReturnDate.getTime() - expectedReturnDate.getTime();
    const lateDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return lateDays > 0 ? lateDays * FINE_PER_DAY : 0;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
