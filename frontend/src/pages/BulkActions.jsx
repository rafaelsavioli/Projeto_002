import { useMemo, useState } from 'react';
import { listTransactions } from '../api/transactions.api';
import { bulkMove } from '../api/bulk.api';
import { formatCurrency } from '../utils/format';
import { StatusBadge } from '../pages/Transactions';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useToast } from '../context/ToastContext';

const STATUSES = ['PLANNED', 'PENDING', 'PAID', 'OVERDUE'];

export default function BulkActions() {
  useDocumentTitle('Bulk actions');
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [target, setTarget] = useState('PAID');
  const [saving, setSaving] = useState(false);

  useMemo(() => {
    listTransactions()
      .then((txs) => setItems(txs))
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((t) => t.id)));
    }
  }

  async function applyBulk() {
    if (selected.size === 0) return;
    setSaving(true);
    try {
      const result = await bulkMove([...selected], target);
      toast.success(`Updated ${result.updated} transactions to ${target}`);
      setSelected(new Set());
      setItems(await listTransactions());
    } catch (err) {
      toast.error(err.response?.data?.error || 'Bulk move failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8"><Spinner label="Loading…" /></div>;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Bulk actions</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select multiple transactions and change their Kanban status at once.
        </p>
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={items.length > 0 && selected.size === items.length} onChange={toggleAll} />
          Select all ({items.length})
        </label>
        <span className="text-sm text-slate-500">{selected.size} selected</span>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Button onClick={applyBulk} disabled={selected.size === 0 || saving}>
            {saving ? 'Applying…' : `Move ${selected.size || ''} → ${target}`}
          </Button>
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="No transactions" description="Create transactions first to use bulk actions." />
      ) : (
        <Card className="divide-y divide-slate-100">
          {items.map((tx) => (
            <label key={tx.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/70 cursor-pointer">
              <input type="checkbox" checked={selected.has(tx.id)} onChange={() => toggle(tx.id)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{tx.title}</p>
                <p className="text-xs text-slate-500">{tx.category?.name || 'Uncategorized'}</p>
              </div>
              <StatusBadge status={tx.status} />
              <span className={`text-sm font-semibold tabular-nums w-24 text-right ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
                {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount)}
              </span>
            </label>
          ))}
        </Card>
      )}
    </div>
  );
}
