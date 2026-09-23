import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { listTransactions, moveTransaction } from '../api/transactions.api';
import { formatCurrency } from '../utils/format';
import { StatusBadge } from './Transactions';
import Spinner from '../components/ui/Spinner';
import useDocumentTitle from '../hooks/useDocumentTitle';

const COLUMNS = [
  { id: 'PLANNED', label: 'Planned', accent: 'bg-slate-400' },
  { id: 'PENDING', label: 'Pending', accent: 'bg-amber-500' },
  { id: 'PAID', label: 'Paid', accent: 'bg-emerald-500' },
  { id: 'OVERDUE', label: 'Overdue', accent: 'bg-rose-500' },
];

function KanbanCard({ tx, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tx.id,
    data: { type: 'card', tx },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !overlay ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-slate-200 rounded-lg p-3.5 shadow-card cursor-grab active:cursor-grabbing ${
        overlay ? 'ring-2 ring-brand-500 scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 leading-snug">{tx.title}</p>
        <span
          className={`text-sm font-bold tabular-nums shrink-0 ${
            tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-700'
          }`}
        >
          {tx.type === 'INCOME' ? '+' : '−'}
          {formatCurrency(tx.amount)}
        </span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500 truncate">
          {tx.category?.name || 'Uncategorized'}
        </span>
        <StatusBadge status={tx.status} />
      </div>
    </div>
  );
}

function Column({ column, txs }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const total = txs.reduce((a, t) => a + (t.type === 'EXPENSE' ? t.amount : 0), 0);

  return (
    <div className="flex flex-col min-w-[240px] flex-1">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${column.accent}`} />
        <h3 className="text-sm font-semibold text-slate-700">{column.label}</h3>
        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
          {txs.length}
        </span>
        <span className="ml-auto text-xs font-medium text-slate-500 tabular-nums">
          {formatCurrency(total)}
        </span>
      </div>
      <SortableContext items={txs.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex-1 space-y-2.5 rounded-xl p-2 min-h-[320px] transition-colors ${
            isOver ? 'bg-brand-50 ring-2 ring-brand-500/40' : 'bg-slate-100/70'
          }`}
        >
          {txs.length === 0 && (
            <p className="text-xs text-slate-400 text-center pt-8">Drop cards here</p>
          )}
          {txs.map((tx) => (
            <KanbanCard key={tx.id} tx={tx} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function Kanban() {
  useDocumentTitle('Kanban');
  const [transactions, setTransactions] = useState([]);
  const [activeTx, setActiveTx] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    listTransactions()
      .then(setTransactions)
      .catch((err) => setError(err.response?.data?.error || 'Failed to load board'))
      .finally(() => setLoading(false));
  }, []);

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    for (const tx of transactions) {
      const key = map[tx.status] ? tx.status : 'PENDING';
      map[key].push(tx);
    }
    return map;
  }, [transactions]);

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTx(null);
    if (!over) return;

    const tx = transactions.find((t) => t.id === active.id);
    if (!tx) return;

    let newStatus = null;
    if (['PLANNED', 'PENDING', 'PAID', 'OVERDUE'].includes(over.id)) {
      newStatus = over.id;
    } else {
      const target = transactions.find((t) => t.id === over.id);
      if (target) newStatus = target.status;
    }

    if (!newStatus || newStatus === tx.status) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: newStatus } : t))
    );
    try {
      await moveTransaction(tx.id, newStatus);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to move card');
      setTransactions((prev) =>
        prev.map((t) => (t.id === tx.id ? { ...t, status: tx.status } : t))
      );
    }
  }

  if (loading) {
    return (
      <div className="p-8"><Spinner label="Loading board…" /></div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Kanban</h1>
        <p className="text-sm text-slate-500 mt-1">
          Drag cards between columns to update payment status.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e) => {
          const tx = transactions.find((t) => t.id === e.active.id);
          setActiveTx(tx || null);
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTx(null)}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <Column key={col.id} column={col} txs={byStatus[col.id]} />
          ))}
        </div>
        <DragOverlay>{activeTx ? <KanbanCard tx={activeTx} overlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
