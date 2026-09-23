const { prisma } = require('../../config/prisma');
const { parseMonth, startOfMonth, endOfMonth, lastSixMonths } = require('../../utils/dates');

function round2(n) {
  return Math.round(n * 100) / 100;
}

async function summary(userId, query) {
  const range =
    (query.month && parseMonth(query.month)) ||
    { start: startOfMonth(), end: endOfMonth(), label: monthLabel(new Date()) };

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: range.start, lte: range.end },
    },
    include: { category: true },
  });

  const income = round2(
    transactions.filter((t) => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0)
  );
  const expense = round2(
    transactions.filter((t) => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0)
  );
  const balance = round2(income - expense);

  const byCategory = {};
  for (const t of transactions) {
    if (t.type !== 'EXPENSE') continue;
    const key = t.category ? t.category.name : 'Uncategorized';
    byCategory[key] = round2((byCategory[key] || 0) + t.amount);
  }
  const categoryBreakdown = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const pending = transactions.filter((t) => t.status === 'PENDING' || t.status === 'PLANNED').length;
  const overdue = transactions.filter((t) => t.status === 'OVERDUE').length;
  const paid = transactions.filter((t) => t.status === 'PAID').length;

  const months = lastSixMonths();
  const allTxs = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: parseMonth(months[0]).start,
        lte: endOfMonth(),
      },
    },
  });

  const monthlySeries = months.map((m) => {
    const inMonth = allTxs.filter((t) => monthLabel(t.date) === m);
    const inc = round2(inMonth.filter((t) => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0));
    const exp = round2(inMonth.filter((t) => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0));
    return { month: m, income: inc, expense: exp, balance: round2(inc - exp) };
  });

  const recent = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
    take: 5,
  });

  const goals = await prisma.goal.findMany({ where: { userId } });

  return {
    month: range.label,
    income,
    expense,
    balance,
    counts: { pending, overdue, paid, total: transactions.length },
    categoryBreakdown,
    monthlySeries,
    recent,
    goals: goals.map((g) => ({
      ...g,
      progress:
        g.targetAmount > 0
          ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
          : 0,
    })),
  };
}

function monthLabel(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

module.exports = { summary };
