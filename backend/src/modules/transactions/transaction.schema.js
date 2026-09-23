const { z } = require('zod');

const statusEnum = z.enum(['PLANNED', 'PENDING', 'PAID', 'OVERDUE']);
const typeEnum = z.enum(['INCOME', 'EXPENSE']);

const createSchema = z.object({
  title: z.string().min(1).max(120),
  amount: z.number().positive('Amount must be positive'),
  type: typeEnum,
  status: statusEnum.default('PENDING'),
  date: z.coerce.date(),
  dueDate: z.coerce.date().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  note: z.string().max(500).optional().nullable(),
});

const updateSchema = createSchema.partial();

const moveSchema = z.object({
  status: statusEnum,
});

const listQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  type: typeEnum.optional(),
  status: statusEnum.optional(),
  categoryId: z.string().optional(),
  q: z.string().max(120).optional(),
});

module.exports = { createSchema, updateSchema, moveSchema, listQuerySchema };
