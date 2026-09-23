import api from './client';

export async function listTransactions(params = {}) {
  const { data } = await api.get('/transactions', { params });
  return data.transactions;
}

export async function createTransaction(payload) {
  const { data } = await api.post('/transactions', payload);
  return data.transaction;
}

export async function updateTransaction(id, payload) {
  const { data } = await api.patch(`/transactions/${id}`, payload);
  return data.transaction;
}

export async function moveTransaction(id, status) {
  const { data } = await api.patch(`/transactions/${id}/move`, { status });
  return data.transaction;
}

export async function deleteTransaction(id) {
  await api.delete(`/transactions/${id}`);
}
