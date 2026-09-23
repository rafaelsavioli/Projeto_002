const { prisma } = require('../../config/prisma');
const { AppError } = require('../../utils/AppError');

function withProgress(goal) {
  const progress =
    goal.targetAmount > 0
      ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
      : 0;
  return { ...goal, progress };
}

async function list(userId) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
  return goals.map(withProgress);
}

async function create(userId, data) {
  const goal = await prisma.goal.create({ data: { ...data, userId } });
  return withProgress(goal);
}

async function update(userId, id, data) {
  await assertOwned(userId, id);
  const goal = await prisma.goal.update({ where: { id }, data });
  return withProgress(goal);
}

async function remove(userId, id) {
  await assertOwned(userId, id);
  await prisma.goal.delete({ where: { id } });
  return { id };
}

async function assertOwned(userId, id) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) throw new AppError('Goal not found', 404);
}

module.exports = { list, create, update, remove };
