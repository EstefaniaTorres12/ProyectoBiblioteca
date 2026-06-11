import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';

const router = Router();
const controller = new UserController();

router.post('/', requireAdmin, controller.create.bind(controller));
router.get('/', requireAdmin, controller.findAll.bind(controller));

export default router;
