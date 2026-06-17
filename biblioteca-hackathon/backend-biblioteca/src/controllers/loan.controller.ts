import { Request, Response } from 'express';
import { LoanService } from '../services/loan.service';
import { createLoanSchema } from '../validators/loan.validator';

const service = new LoanService();

export class LoanController {
  async create(req: Request, res: Response) {
    const data = createLoanSchema.parse(req.body);
    const loan = await service.create(data);
    res.status(201).json(loan);
  }

  async returnBook(req: Request, res: Response) {
    const loan = await service.returnBook(Number(req.params.id));
    res.json(loan);
  }

  async active(_req: Request, res: Response) {
    res.json(await service.findActive());
  }

  async byUser(req: Request, res: Response) {
    res.json(await service.findByUser(Number(req.params.userId)));
  }

  async byBook(req: Request, res: Response) {
    res.json(await service.findByBook(Number(req.params.bookId)));
  }

  async overdue(_req: Request, res: Response) {
    res.json(await service.findOverdue());
  }

  async today(req: Request, res: Response) {
    const userName = req.query.userName as string | undefined;
    res.json(await service.findToday(userName || undefined));
  }

  async searchByUserName(req: Request, res: Response) {
    const name = req.query.userName as string | undefined;
    if (!name) {
      res.status(400).json({ message: 'El parámetro userName es requerido' });
      return;
    }
    res.json(await service.searchByUserName(name));
  }
}
