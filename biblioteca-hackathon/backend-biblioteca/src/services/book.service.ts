import { BookRepository } from '../repositories/book.repository';

const repository = new BookRepository();

export class BookService {
  create(data: { title: string; author: string; isbn?: string; totalQuantity: number }) {
    return repository.create(data);
  }

  search(search?: string) {
    return repository.findAll(search);
  }
}
