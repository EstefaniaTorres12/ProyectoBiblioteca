import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('demo1234', 10);

  await prisma.user.upsert({
    where: { email: 'admin@biblioteca.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@biblioteca.com',
      password: passwordHash,
    },
  });

  console.log('Seed completado: admin@biblioteca.com / demo1234');
}

main().finally(() => prisma.$disconnect());
