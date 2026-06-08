import { Request, Response } from 'express';
import { loginSchema } from '../validators/auth.validator';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);
    const result = await service.login(email, password);
    res.json(result);
  }
}
