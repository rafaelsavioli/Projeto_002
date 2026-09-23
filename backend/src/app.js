const express = require('express');
const cors = require('cors');
const { buildCorsOptions } = require('./config/cors');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { globalRateLimit } = require('./middlewares/rateLimit');
const { requestLogger } = require('./middlewares/requestLogger');
const { securityHeaders } = require('./middlewares/securityHeaders');
const authRoutes = require('./modules/auth/auth.routes');
const transactionRoutes = require('./modules/transactions/transaction.routes');
const categoryRoutes = require('./modules/categories/category.routes');
const goalRoutes = require('./modules/goals/goal.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();
const startedAt = Date.now();

app.use(cors(buildCorsOptions()));
app.use(express.json());
app.use(securityHeaders);
app.use(globalRateLimit);
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'fluxoboard-api',
    version: process.env.npm_package_version || '1.0.0',
    uptimeSec: Math.round((Date.now() - startedAt) / 1000),
    env: process.env.NODE_ENV || 'development',
  });
});

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);
app.use('/goals', goalRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
