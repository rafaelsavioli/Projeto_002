const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./modules/auth/auth.routes');
const transactionRoutes = require('./modules/transactions/transaction.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'fluxoboard-api' });
});

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
