const { z } = require('zod');

const createSchema = z.object({
  name: z.string().min(1).max(60),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#6366F1'),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
