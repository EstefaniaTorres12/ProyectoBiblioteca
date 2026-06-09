import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { createBookSchema } from '../validators/book.validator';

const service = new BookService();

export class BookController {
  async create(req: Request, res: Response) {
    const data = createBookSchema.parse(req.body);
    const book = await service.create(data);
    res.status(201).json(book);
  }

  async findAll(req: Request, res: Response) {
    const books = await service.search(req.query.search as string | undefined);
    res.json(books);
  }
}
