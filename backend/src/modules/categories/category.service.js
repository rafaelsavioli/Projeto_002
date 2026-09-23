const { prisma } = require('../../config/prisma');
const { AppError } = require('../../utils/AppError');

async function list(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { transactions: true } } },
  });
}

async function create(userId, data) {
  const existing = await prisma.category.findFirst({
    where: { userId, name: data.name },
  });
  if (existing) throw new AppError('Category already exists', 409);
  return prisma.category.create({ data: { ...data, userId } });
}

async function update(userId, id, data) {
  await assertOwned(userId, id);
  return prisma.category.update({ where: { id }, data });
}

async function remove(userId, id) {
  await assertOwned(userId, id);
  await prisma.category.delete({ where: { id } });
  return { id };
}

async function assertOwned(userId, id) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) throw new AppError('Category not found', 404);
}

module.exports = { list, create, update, remove };
