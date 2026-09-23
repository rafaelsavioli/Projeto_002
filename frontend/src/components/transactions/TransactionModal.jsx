import { useState } from 'react';
import Button from '../ui/Button';

export default function TransactionModal({ transaction, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    title: transaction?.title || '',
    amount: transaction?.amount ?? '',
    type: transaction?.type || 'EXPENSE',
    status: transaction?.status || 'PENDING',
    date: transaction?.date ? transaction.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    categoryId: transaction?.categoryId || '',
    note: transaction?.note || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave({
        title: form.title.trim(),
        amount: Number(form.amount),
        type: form.type,
        status: form.status,
        date: new Date(form.date + 'T12:00:00').toISOString(),
        categoryId: form.categoryId || null,
        note: form.note || null,
      });
    } catch (err) {
      const details = err.response?.data?.details;
      setError(
        details?.[0]
          ? `${details[0].path}: ${details[0].message}`
          : err.response?.data?.error || 'Failed to save transaction'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 border border-slate-200"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {transaction ? 'Edit transaction' : 'New transaction'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            value={form.title}
            onChange={update('title')}
            required
            maxLength={120}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={update('amount')}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Type</label>
            <select
              value={form.type}
              onChange={update('type')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={update('status')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="PLANNED">Planned</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={update('date')}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Category</label>
          <select
            value={form.categoryId}
            onChange={update('categoryId')}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Note (optional)</label>
          <textarea
            value={form.note}
            onChange={update('note')}
            rows={2}
            maxLength={500}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : transaction ? 'Save changes' : 'Create transaction'}
          </Button>
        </div>
      </form>
    </div>
  );
}
