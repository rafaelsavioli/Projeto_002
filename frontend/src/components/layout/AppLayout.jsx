import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col">
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
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
