import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';

const repository = new UserRepository();

export class UserService {
  async create(data: { name: string; email: string; password: string; phone?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return repository.create({ ...data, password: hashedPassword });
  }

  findAll() {
    return repository.findAll();
  }
}
