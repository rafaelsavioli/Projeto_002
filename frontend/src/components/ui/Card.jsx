export default function Card({ className = '', children }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
      <div>
        <h3 className="font-display font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
