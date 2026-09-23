const TONES = {
  emerald: 'border-emerald-500',
  rose: 'border-rose-500',
  brand: 'border-brand-500',
};

export default function StatCard({ label, value, tone = 'brand', accent = false, raw = false }) {
  const display = raw
    ? value
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(value || 0);

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-card p-5 border-l-4 ${
        TONES[tone] || TONES.brand
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p
        className={`font-display text-2xl font-bold mt-2 tabular-nums ${
          accent ? 'text-brand-600' : 'text-slate-900'
        }`}
      >
        {display}
      </p>
    </div>
  );
}
