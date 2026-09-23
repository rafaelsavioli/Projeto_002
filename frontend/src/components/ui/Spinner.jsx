export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-slate-500 text-sm">
      <span className="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      {label}
    </div>
  );
}
