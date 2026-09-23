const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/prisma');
const { env } = require('../../config/env');
const { AppError } = require('../../utils/AppError');

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function sanitize(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  const defaultCategories = [
    { name: 'Salary', type: 'INCOME', color: '#10B981' },
    { name: 'Freelance', type: 'INCOME', color: '#34D399' },
    { name: 'Housing', type: 'EXPENSE', color: '#6366F1' },
    { name: 'Food', type: 'EXPENSE', color: '#F59E0B' },
    { name: 'Transport', type: 'EXPENSE', color: '#3B82F6' },
    { name: 'Other', type: 'EXPENSE', color: '#94A3B8' },
  ];
  await prisma.category.createMany({
    data: defaultCategories.map((c) => ({ ...c, userId: user.id })),
  });

  return { user: sanitize(user), token: signToken(user) };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  return { user: sanitize(user), token: signToken(user) };
}

async function me(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  return sanitize(user);
}

module.exports = { register, login, me };
