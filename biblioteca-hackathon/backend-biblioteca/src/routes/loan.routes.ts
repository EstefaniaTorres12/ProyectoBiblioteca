import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = Router();
const controller = new LoanController();

router.post('/', controller.create.bind(controller));
router.patch('/:id/return', controller.returnBook.bind(controller));
router.get('/active', controller.active.bind(controller));
router.get('/overdue', controller.overdue.bind(controller));
router.get('/user/:userId', controller.byUser.bind(controller));
router.get('/book/:bookId/history', controller.byBook.bind(controller));

export default router;
