const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { globalRateLimit } = require('./middlewares/rateLimit');
const { requestLogger } = require('./middlewares/requestLogger');
const authRoutes = require('./modules/auth/auth.routes');
const transactionRoutes = require('./modules/transactions/transaction.routes');
const categoryRoutes = require('./modules/categories/category.routes');
const goalRoutes = require('./modules/goals/goal.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(globalRateLimit);
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'fluxoboard-api' });
});

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);
app.use('/goals', goalRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
