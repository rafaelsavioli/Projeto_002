import api from './client';

export async function bulkMove(ids, status) {
  const { data } = await api.post('/transactions/bulk-move', { ids, status });
  return data;
}
