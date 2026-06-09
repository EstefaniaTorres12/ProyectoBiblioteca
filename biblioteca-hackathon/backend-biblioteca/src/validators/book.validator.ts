import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  isbn: z.string().optional(),
  totalQuantity: z.number().int().positive().default(1)
});
