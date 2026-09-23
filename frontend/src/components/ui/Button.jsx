export default function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 px-4 py-2.5 text-sm',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-4 py-2.5 text-sm',
    ghost: 'text-slate-600 hover:bg-slate-100 px-3 py-2 text-sm',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 px-4 py-2.5 text-sm',
  };

  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
