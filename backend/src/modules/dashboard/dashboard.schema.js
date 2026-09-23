const { z } = require('zod');

const summaryQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
});

module.exports = { summaryQuerySchema };
