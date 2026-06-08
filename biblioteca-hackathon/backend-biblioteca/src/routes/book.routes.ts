import { Router } from 'express';
import { BookController } from '../controllers/book.controller';

const router = Router();
const controller = new BookController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));

export default router;
