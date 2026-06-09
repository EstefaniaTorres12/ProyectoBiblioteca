import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { createBookSchema } from '../validators/book.validator';

const service = new BookService();

export class BookController {
  async create(req: Request, res: Response) {
    try {
      const data = createBookSchema.parse(req.body);
      const book = await service.create(data);
      res.status(201).json(book);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        res.status(409).json({ message: 'Ya existe un libro con ese ISBN' });
        return;
      }
      throw error;
    }
  }

  async findAll(req: Request, res: Response) {
    const books = await service.search(req.query.search as string | undefined);
    res.json(books);
  }
}
