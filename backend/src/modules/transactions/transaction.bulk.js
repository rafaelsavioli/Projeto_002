const { z } = require('zod');
const { prisma } = require('../../config/prisma');
const { AppError } = require('../../utils/AppError');

const bulkMoveSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
  status: z.enum(['PLANNED', 'PENDING', 'PAID', 'OVERDUE']),
});

async function bulkMove(userId, { ids, status }) {
  const owned = await prisma.transaction.findMany({
    where: { id: { in: ids }, userId },
    select: { id: true },
  });
  if (owned.length !== ids.length) {
    throw new AppError('One or more transactions not found', 404);
  }
  const result = await prisma.transaction.updateMany({
    where: { id: { in: ids }, userId },
    data: { status },
  });
  return { updated: result.count, status };
}

module.exports = { bulkMove, bulkMoveSchema };
