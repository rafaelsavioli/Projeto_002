import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/', label: 'Overview', icon: '▦' },
  { to: '/transactions', label: 'Transactions', icon: '⇄' },
  { to: '/kanban', label: 'Kanban', icon: '☰' },
  { to: '/goals', label: 'Goals', icon: '◎' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  const sidebar = (
    <>
      <div className="h-16 px-5 flex items-center gap-2 border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-display font-bold text-sm flex items-center justify-center">
          F
        </div>
        <span className="font-display font-bold text-slate-900">FluxoBoard</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className="text-base leading-none opacity-70">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="mt-3 text-xs font-semibold text-slate-500 hover:text-rose-600 transition"
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:w-60 md:shrink-0 md:flex md:flex-col border-r border-slate-200 bg-white">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-slate-900/40"
            onClick={closeMobile}
            aria-label="Close menu"
          />
          <aside className="relative w-60 h-full bg-white border-r border-slate-200 flex flex-col shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden h-14 px-4 flex items-center gap-3 border-b border-slate-200 bg-white sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-display font-bold text-slate-900">FluxoBoard</span>
          <span className="ml-auto text-xs text-slate-400 truncate max-w-[120px]">
            {location.pathname}
          </span>
        </header>

        <main className="flex-1 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
