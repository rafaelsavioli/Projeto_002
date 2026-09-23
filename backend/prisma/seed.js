const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: 'INCOME', color: '#10B981' },
  { name: 'Freelance', type: 'INCOME', color: '#34D399' },
  { name: 'Investments', type: 'INCOME', color: '#6EE7B7' },
  { name: 'Housing', type: 'EXPENSE', color: '#6366F1' },
  { name: 'Food', type: 'EXPENSE', color: '#F59E0B' },
  { name: 'Transport', type: 'EXPENSE', color: '#3B82F6' },
  { name: 'Health', type: 'EXPENSE', color: '#EF4444' },
  { name: 'Leisure', type: 'EXPENSE', color: '#A855F7' },
  { name: 'Education', type: 'EXPENSE', color: '#06B6D4' },
  { name: 'Subscriptions', type: 'EXPENSE', color: '#EC4899' },
];

async function main() {
  const email = 'demo@fluxoboard.dev';
  const passwordHash = await bcrypt.hash('demo1234', 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: 'Demo User', email, passwordHash },
  });

  await prisma.category.deleteMany({ where: { userId: user.id } });
  const categories = [];
  for (const cat of DEFAULT_CATEGORIES) {
    categories.push(
      await prisma.category.create({ data: { ...cat, userId: user.id } })
    );
  }

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.goal.deleteMany({ where: { userId: user.id } });

  const now = new Date();
  const day = (offset) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d;
  };

  const food = categories.find((c) => c.name === 'Food');
  const housing = categories.find((c) => c.name === 'Housing');
  const transport = categories.find((c) => c.name === 'Transport');
  const leisure = categories.find((c) => c.name === 'Leisure');
  const salary = categories.find((c) => c.name === 'Salary');
  const freelance = categories.find((c) => c.name === 'Freelance');

  const samples = [
    { title: 'Monthly salary', amount: 5200, type: 'INCOME', status: 'PAID', date: day(-10), categoryId: salary.id },
    { title: 'Landing page project', amount: 1400, type: 'INCOME', status: 'PAID', date: day(-5), categoryId: freelance.id },
    { title: 'Apartment rent', amount: 1650, type: 'EXPENSE', status: 'PAID', date: day(-12), categoryId: housing.id },
    { title: 'Grocery run', amount: 210.5, type: 'EXPENSE', status: 'PAID', date: day(-3), categoryId: food.id },
    { title: 'Fuel', amount: 95, type: 'EXPENSE', status: 'PENDING', date: day(-1), dueDate: day(4), categoryId: transport.id },
    { title: 'Concert tickets', amount: 320, type: 'EXPENSE', status: 'PLANNED', date: day(6), categoryId: leisure.id },
    { title: 'Internet bill', amount: 129.9, type: 'EXPENSE', status: 'OVERDUE', date: day(-15), dueDate: day(-8), categoryId: housing.id },
    { title: 'Gym membership', amount: 89.9, type: 'EXPENSE', status: 'PENDING', date: day(2), dueDate: day(8), categoryId: healthCategory(categories) },
    { title: 'Dinner out', amount: 148.7, type: 'EXPENSE', status: 'PLANNED', date: day(3), categoryId: food.id },
    { title: 'Design consultation', amount: 600, type: 'INCOME', status: 'PENDING', date: day(5), dueDate: day(12), categoryId: freelance.id },
  ];

  for (const t of samples) {
    await prisma.transaction.create({ data: { ...t, userId: user.id } });
  }

  await prisma.goal.createMany({
    data: [
      { userId: user.id, name: 'Emergency fund', targetAmount: 15000, currentAmount: 6200, deadline: day(180) },
      { userId: user.id, name: 'Japan trip', targetAmount: 12000, currentAmount: 3400, deadline: day(300) },
      { userId: user.id, name: 'New laptop', targetAmount: 9000, currentAmount: 7800, deadline: day(60) },
    ],
  });

  console.log('Seed completed. Demo login: demo@fluxoboard.dev / demo1234');
}

function healthCategory(categories) {
  return categories.find((c) => c.name === 'Health').id;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
