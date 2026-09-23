const { prisma } = require('../../config/prisma');
const { AppError } = require('../../utils/AppError');
const { parseMonth } = require('../../utils/dates');

function buildWhere(userId, query) {
  const where = { userId };

  if (query.month) {
    const range = parseMonth(query.month);
    if (range) {
      where.date = { gte: range.start, lte: range.end };
    }
  }
  if (query.type) where.type = query.type;
  if (query.status) where.status = query.status;
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.q) where.title = { contains: query.q };

  return where;
}

async function list(userId, query) {
  return prisma.transaction.findMany({
    where: buildWhere(userId, query),
    include: { category: true },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
}

async function create(userId, data) {
  if (data.categoryId) {
    await assertCategoryOwned(userId, data.categoryId);
  }
  return prisma.transaction.create({
    data: { ...data, userId },
    include: { category: true },
  });
}

async function update(userId, id, data) {
  await assertOwned(userId, id);
  if (data.categoryId) {
    await assertCategoryOwned(userId, data.categoryId);
  }
  return prisma.transaction.update({
    where: { id },
    data,
    include: { category: true },
  });
}

async function move(userId, id, status) {
  await assertOwned(userId, id);
  return prisma.transaction.update({
    where: { id },
    data: { status },
    include: { category: true },
  });
}

async function remove(userId, id) {
  await assertOwned(userId, id);
  await prisma.transaction.delete({ where: { id } });
  return { id };
}

async function assertOwned(userId, id) {
  const tx = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!tx) throw new AppError('Transaction not found', 404);
  return tx;
}

async function assertCategoryOwned(userId, categoryId) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) throw new AppError('Category not found', 404);
}

module.exports = { list, create, update, move, remove };
