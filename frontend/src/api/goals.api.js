import api from './client';

export async function listGoals() {
  const { data } = await api.get('/goals');
  return data.goals;
}

export async function createGoal(payload) {
  const { data } = await api.post('/goals', payload);
  return data.goal;
}

export async function updateGoal(id, payload) {
  const { data } = await api.patch(`/goals/${id}`, payload);
  return data.goal;
}

export async function deleteGoal(id) {
  await api.delete(`/goals/${id}`);
}
