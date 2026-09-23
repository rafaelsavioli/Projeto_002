import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../api/transactions.api';
import { listCategories } from '../api/categories.api';
import { currentMonth, formatCurrency, formatDate } from '../utils/format';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import TransactionModal from '../components/transactions/TransactionModal';

const EMPTY_FILTERS = { month: currentMonth(), type: '', status: '', categoryId: '', q: '' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const categoriesRef = useRef(categories);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v != null)
      );
      const [txs, cats] = await Promise.all([
        listTransactions(params),
        categoriesRef.current.length
          ? Promise.resolve(categoriesRef.current)
          : listCategories(),
      ]);
      setTransactions(txs);
      setCategories(cats);
      categoriesRef.current = cats;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(tx) {
    setEditing(tx);
    setModalOpen(true);
  }

  async function handleSave(payload) {
    if (editing) {
      await updateTransaction(editing.id, payload);
    } else {
      await createTransaction(payload);
    }
    setModalOpen(false);
    await load();
  }

  async function handleDelete(tx) {
    if (!window.confirm(`Delete "${tx.title}"?`)) return;
    await deleteTransaction(tx.id);
    await load();
  }

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((a, t) => a + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((a, t) => a + t.amount, 0);
    return { income, expense, count: transactions.length };
  }, [transactions]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">
            {totals.count} records · in {formatCurrency(totals.income)} · out{' '}
            {formatCurrency(totals.expense)}
          </p>
        </div>
        <Button onClick={openCreate}>+ New transaction</Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="month"
            value={filters.month}
            onChange={(e) => setFilter('month', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <select
            value={filters.type}
            onChange={(e) => setFilter('type', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="">All statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          <select
            value={filters.categoryId}
            onChange={(e) => setFilter('categoryId', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Search title…"
            value={filters.q}
            onChange={(e) => setFilter('q', e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </Card>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <p className="px-6 py-8 text-sm text-slate-500">Loading…</p>
        ) : transactions.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">
            No transactions match these filters.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-3.5 font-medium text-slate-800">{tx.title}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: tx.category?.color || '#94A3B8' }}
                      />
                      {tx.category?.name || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-semibold tabular-nums ${
                      tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '−'}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(tx)}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx)}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {modalOpen && (
        <TransactionModal
          transaction={editing}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    PLANNED: 'bg-slate-100 text-slate-600',
    PENDING: 'bg-amber-50 text-amber-700',
    PAID: 'bg-emerald-50 text-emerald-700',
    OVERDUE: 'bg-rose-50 text-rose-700',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
        styles[status] || styles.PLANNED
      }`}
    >
      {status}
    </span>
  );
}
