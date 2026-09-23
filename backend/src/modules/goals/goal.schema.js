const { z } = require('zod');

const createSchema = z.object({
  name: z.string().min(1).max(80),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().min(0).default(0),
  deadline: z.coerce.date().optional().nullable(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
