import { LoanStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export class LoanRepository {
  create(data: { userId: number; bookId: number; expectedReturnDate: Date }) {
    return prisma.loan.create({ data, include: { user: true, book: true } });
  }

  findActive() {
    return prisma.loan.findMany({ where: { status: 'ACTIVO' }, include: { user: true, book: true } });
  }

  findByUser(userId: number) {
    return prisma.loan.findMany({ where: { userId }, include: { book: true } });
  }

  findByBook(bookId: number) {
    return prisma.loan.findMany({ where: { bookId }, include: { user: true } });
  }

  findOverdue(now: Date) {
    return prisma.loan.findMany({
      where: { status: 'ACTIVO', expectedReturnDate: { lt: now } },
      include: { user: true, book: true }
    });
  }

  findToday(start: Date, end: Date, userName?: string) {
    return prisma.loan.findMany({
      where: {
        loanDate: { gte: start, lt: end },
        ...(userName ? { user: { name: { contains: userName } } } : {}),
      },
      include: { user: true, book: true },
    });
  }

  findByUserName(name: string) {
    return prisma.loan.findMany({
      where: { user: { name: { contains: name } } },
      include: { user: true, book: true },
      orderBy: { loanDate: 'desc' },
    });
  }

  findById(id: number) {
    return prisma.loan.findUnique({ where: { id } });
  }

  returnLoan(id: number, actualReturnDate: Date, fineAmount: number, status: LoanStatus = 'DEVUELTO') {
    return prisma.loan.update({
      where: { id },
      data: { actualReturnDate, fineAmount, status },
      include: { user: true, book: true }
    });
  }
}
