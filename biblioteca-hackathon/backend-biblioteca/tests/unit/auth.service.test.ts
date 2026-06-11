import bcrypt from 'bcryptjs';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { AuthService } from '../../src/services/auth.service';

jest.mock('../../src/repositories/auth.repository');
jest.mock('bcryptjs');

const MockedAuthRepository = AuthRepository as jest.MockedClass<typeof AuthRepository>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const fakeUser = {
  id: 1,
  name: 'Admin',
  email: 'admin@biblioteca.com',
  password: 'hashed',
  role: 'ADMIN' as const,
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    MockedAuthRepository.mockClear();
    service = new AuthService();
  });

  it('lanza error si el usuario no existe', async () => {
    MockedAuthRepository.prototype.findByEmail.mockResolvedValue(null);
    await expect(service.login('x@x.com', '123456')).rejects.toThrow('Credenciales inválidas');
  });

  it('lanza error si el password es incorrecto', async () => {
    MockedAuthRepository.prototype.findByEmail.mockResolvedValue(fakeUser);
    (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(service.login('admin@biblioteca.com', 'wrong')).rejects.toThrow('Credenciales inválidas');
  });

  it('lanza error si el usuario no es ADMIN', async () => {
    MockedAuthRepository.prototype.findByEmail.mockResolvedValue({ ...fakeUser, role: 'SOCIO' as const });
    (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
    await expect(service.login('socio@biblioteca.com', 'pass123')).rejects.toThrow('Acceso denegado: solo administradores');
  });

  it('retorna token y role ADMIN si las credenciales son correctas', async () => {
    MockedAuthRepository.prototype.findByEmail.mockResolvedValue(fakeUser);
    (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.login('admin@biblioteca.com', 'demo1234');
    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');
    expect(result.role).toBe('ADMIN');
  });
});
