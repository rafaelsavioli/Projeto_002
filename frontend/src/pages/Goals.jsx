import { useEffect, useState } from 'react';
import { listGoals, createGoal, updateGoal, deleteGoal } from '../api/goals.api';
import { formatCurrency, formatDate } from '../utils/format';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useToast } from '../context/ToastContext';

export default function Goals() {
  useDocumentTitle('Goals');
  const toast = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '', currentAmount: '', deadline: '' });

  async function load() {
    setLoading(true);
    try {
      setGoals(await listGoals());
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createGoal({
        name: form.name.trim(),
        targetAmount: Number(form.targetAmount),
        currentAmount: Number(form.currentAmount) || 0,
        deadline: form.deadline ? new Date(form.deadline + 'T12:00:00').toISOString() : null,
      });
      setForm({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
      setShowForm(false);
      toast.success('Goal created');
      await load();
    } catch (err) {
      const details = err.response?.data?.details;
      setError(
        details?.[0]
          ? `${details[0].path}: ${details[0].message}`
          : err.response?.data?.error || 'Failed to create goal'
      );
    }
  }

  async function handleContribute(goal, amount) {
    const next = Math.max(0, goal.currentAmount + amount);
    try {
      await updateGoal(goal.id, { currentAmount: next });
      toast.success(amount > 0 ? `Added $${amount} to ${goal.name}` : `Withdrew $${Math.abs(amount)} from ${goal.name}`);
      await load();
    } catch {
      toast.error('Failed to update goal');
    }
  }

  async function handleDelete(goal) {
    if (!window.confirm(`Delete goal "${goal.name}"?`)) return;
    await deleteGoal(goal.id);
    toast.success('Goal deleted');
    await load();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Goals</h1>
          <p className="text-sm text-slate-500 mt-1">Savings targets with live progress.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close' : '+ New goal'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              placeholder="Goal name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              maxLength={80}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Target amount"
              value={form.targetAmount}
              onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Saved so far"
              value={form.currentAmount}
              onChange={(e) => setForm((f) => ({ ...f, currentAmount: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <Button type="submit">Create goal</Button>
          </form>
        </Card>
      )}

      {loading ? (
        <Spinner label="Loading goals…" />
      ) : goals.length === 0 ? (
        <EmptyState
          title="No goals yet"
          description="Create your first savings goal to start tracking progress."
          action={<Button onClick={() => setShowForm(true)}>+ New goal</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-semibold text-slate-900">{goal.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {goal.deadline ? `Deadline ${formatDate(goal.deadline)}` : 'No deadline'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(goal)}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-700"
                >
                  Delete
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {formatCurrency(goal.currentAmount)}
                  </span>
                  <span className="text-slate-500 tabular-nums">
                    of {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-600">{goal.progress}%</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleContribute(goal, -50)}
                      className="text-xs font-semibold px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      −$50
                    </button>
                    <button
                      onClick={() => handleContribute(goal, 50)}
                      className="text-xs font-semibold px-2 py-1 rounded border border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100"
                    >
                      +$50
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
