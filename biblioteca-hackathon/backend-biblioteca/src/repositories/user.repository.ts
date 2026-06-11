import { prisma } from '../config/prisma';

const SELECT_PUBLIC = { id: true, name: true, email: true, phone: true, createdAt: true };

export class UserRepository {
  create(data: { name: string; email: string; password: string; phone?: string }) {
    return prisma.user.create({ data, select: SELECT_PUBLIC });
  }

  findAll() {
    return prisma.user.findMany({ orderBy: { name: 'asc' }, select: SELECT_PUBLIC });
  }

  findById(id: number) {
    return prisma.user.findUnique({ where: { id }, select: SELECT_PUBLIC });
  }
}
