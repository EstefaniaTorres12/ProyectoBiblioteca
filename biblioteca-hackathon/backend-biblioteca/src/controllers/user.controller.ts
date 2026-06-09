import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserSchema } from '../validators/user.validator';

const service = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    const data = createUserSchema.parse(req.body);
    const user = await service.create(data);
    res.status(201).json(user);
  }

  async findAll(_req: Request, res: Response) {
    const users = await service.findAll();
    res.json(users);
  }
}
