import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository';

const repository = new AuthRepository();
const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me';

export class AuthService {
  async login(email: string, password: string): Promise<{ token: string; role: string }> {
    const user = await repository.findByEmail(email);

    if (!user) throw new Error('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Credenciales inválidas');

    if (user.role !== 'ADMIN') throw new Error('Acceso denegado: solo administradores');

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token, role: user.role };
  }
}
