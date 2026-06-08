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
}
