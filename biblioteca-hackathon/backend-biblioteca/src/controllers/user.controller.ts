import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserSchema } from '../validators/user.validator';

const service = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await service.create(data);
      res.status(201).json(user);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
        return;
      }
      throw error;
    }
  }

  async findAll(_req: Request, res: Response) {
    const users = await service.findAll();
    res.json(users);
  }
}
