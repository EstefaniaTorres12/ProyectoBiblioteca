import { BookRepository } from '../../src/repositories/book.repository';
import { BookService } from '../../src/services/book.service';

jest.mock('../../src/repositories/book.repository');
const MockedRepo = BookRepository as jest.MockedClass<typeof BookRepository>;

const fakeBook = {
  id: 1,
  title: 'Clean Code',
  author: 'Martin',
  isbn: null,
  totalQuantity: 2,
  availableQuantity: 2,
  createdAt: new Date()
};

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    MockedRepo.mockClear();
    service = new BookService();
  });

  it('crea un libro con los datos correctos', async () => {
    MockedRepo.prototype.create.mockResolvedValue(fakeBook);
    const result = await service.create({ title: 'Clean Code', author: 'Martin', totalQuantity: 2 });
    expect(result).toEqual(fakeBook);
    expect(MockedRepo.prototype.create).toHaveBeenCalledWith({ title: 'Clean Code', author: 'Martin', totalQuantity: 2 });
  });

  it('busca libros por termino', async () => {
    MockedRepo.prototype.findAll.mockResolvedValue([]);
    await service.search('clean');
    expect(MockedRepo.prototype.findAll).toHaveBeenCalledWith('clean');
  });
});
