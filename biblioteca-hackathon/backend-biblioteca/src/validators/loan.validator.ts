import { z } from 'zod';

export const createLoanSchema = z.object({
  userId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  expectedReturnDate: z.string().datetime().optional()
});
