import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.middleware';
import { BookController } from '../controllers/book.controller';

const router = Router();
const controller = new BookController();

router.post('/', requireAdmin, controller.create.bind(controller));
router.get('/', requireAdmin, controller.findAll.bind(controller));

export default router;
