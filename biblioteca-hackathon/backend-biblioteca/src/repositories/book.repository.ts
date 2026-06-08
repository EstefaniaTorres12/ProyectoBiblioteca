import { prisma } from '../config/prisma';

export class BookRepository {
  create(data: { title: string; author: string; isbn?: string; totalQuantity: number }) {
    return prisma.book.create({ data: { ...data, availableQuantity: data.totalQuantity } });
  }

  findAll(search?: string) {
    return prisma.book.findMany({
      where: search
        ? { OR: [{ title: { contains: search } }, { author: { contains: search } }] }
        : undefined,
      orderBy: { title: 'asc' }
    });
  }

  findById(id: number) {
    return prisma.book.findUnique({ where: { id } });
  }

  decrementAvailable(id: number) {
    return prisma.book.update({ where: { id }, data: { availableQuantity: { decrement: 1 } } });
  }

  incrementAvailable(id: number) {
    return prisma.book.update({ where: { id }, data: { availableQuantity: { increment: 1 } } });
  }
}
