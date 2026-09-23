import { useEffect, useState } from 'react';
import { fetchSummary } from '../api/dashboard.api';
import { currentMonth } from '../utils/format';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import StatCard from '../components/dashboard/StatCard';
import BalanceChart from '../components/charts/BalanceChart';
import CategoryDonut from '../components/charts/CategoryDonut';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(currentMonth());
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    fetchSummary(month)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Failed to load summary');
      });
    return () => {
      cancelled = true;
    };
  }, [month]);

  function shiftMonth(delta) {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Your financial snapshot for the month.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            ‹
          </Button>
          <span className="font-medium text-sm text-slate-700 min-w-[110px] text-center">
            {month}
          </span>
          <Button variant="secondary" onClick={() => shiftMonth(1)} aria-label="Next month">
            ›
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!summary && !error && (
        <div className="text-slate-400 text-sm">Loading summary…</div>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Balance" value={summary.balance} accent />
            <StatCard label="Income" value={summary.income} tone="emerald" />
            <StatCard label="Expenses" value={summary.expense} tone="rose" />
            <StatCard
              label="Pending / Overdue"
              value={`${summary.counts.pending} / ${summary.counts.overdue}`}
              raw
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="xl:col-span-2">
              <CardHeader title="Cash flow" subtitle="Last 6 months" />
              <div className="px-4 pb-5">
                <BalanceChart data={summary.monthlySeries} />
              </div>
            </Card>
            <Card>
              <CardHeader title="Expenses by category" subtitle={summary.month} />
              <div className="px-4 pb-5">
                <CategoryDonut data={summary.categoryBreakdown} />
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Recent transactions" subtitle="Latest activity across accounts" />
            <div className="divide-y divide-slate-100">
              {summary.recent.length === 0 && (
                <p className="px-6 py-6 text-sm text-slate-500">No transactions yet.</p>
              )}
              {summary.recent.map((tx) => (
                <div key={tx.id} className="px-6 py-3.5 flex items-center gap-4">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: tx.category?.color || '#94A3B8' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{tx.title}</p>
                    <p className="text-xs text-slate-500">
                      {tx.category?.name || 'Uncategorized'} · {tx.status}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '−'}$
                    {Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
