import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.middleware';
import { LoanController } from '../controllers/loan.controller';

const router = Router();
const controller = new LoanController();

router.post('/', requireAdmin, controller.create.bind(controller));
router.patch('/:id/return', requireAdmin, controller.returnBook.bind(controller));
router.get('/active', requireAdmin, controller.active.bind(controller));
router.get('/overdue', requireAdmin, controller.overdue.bind(controller));
router.get('/user/:userId', requireAdmin, controller.byUser.bind(controller));
router.get('/book/:bookId/history', requireAdmin, controller.byBook.bind(controller));

export default router;
