export default function EmptyState({ title, description, action }) {
  return (
    <div className="border border-dashed border-slate-300 rounded-xl bg-white p-10 text-center">
      <p className="font-display font-semibold text-slate-800">{title}</p>
      {description && <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
