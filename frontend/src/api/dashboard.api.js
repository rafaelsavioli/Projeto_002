import api from './client';

export async function fetchSummary(month) {
  const params = month ? { month } : {};
  const { data } = await api.get('/dashboard/summary', { params });
  return data;
}
