import bcrypt from 'bcryptjs';
import { UserRepository } from '../../src/repositories/user.repository';
import { UserService } from '../../src/services/user.service';

jest.mock('../../src/repositories/user.repository');
jest.mock('bcryptjs');

const MockedUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const fakeUser = {
  id: 1,
  name: 'Ana García',
  email: 'ana@biblioteca.com',
  phone: null,
  createdAt: new Date()
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    MockedUserRepository.mockClear();
    service = new UserService();
  });

  it('crea un usuario y retorna datos sin password', async () => {
    (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
    MockedUserRepository.prototype.create.mockResolvedValue(fakeUser);
    const result = await service.create({ name: 'Ana García', email: 'ana@biblioteca.com', password: 'secret123' });
    expect(result).toEqual(fakeUser);
    expect(result).not.toHaveProperty('password');
  });

  it('hashea la password antes de guardar', async () => {
    (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
    MockedUserRepository.prototype.create.mockResolvedValue(fakeUser);
    await service.create({ name: 'Ana García', email: 'ana@biblioteca.com', password: 'secret123' });
    expect(mockedBcrypt.hash).toHaveBeenCalledWith('secret123', 10);
    expect(MockedUserRepository.prototype.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'hashed_pass' })
    );
  });

  it('retorna lista de usuarios', async () => {
    MockedUserRepository.prototype.findAll.mockResolvedValue([fakeUser]);
    const result = await service.findAll();
    expect(result).toEqual([fakeUser]);
    expect(MockedUserRepository.prototype.findAll).toHaveBeenCalled();
  });
});
