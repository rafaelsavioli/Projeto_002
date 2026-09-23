import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@fluxoboard.dev');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-brand-600 p-12 text-white">
        <div className="font-display text-xl font-bold">FluxoBoard</div>
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Take control of
            <br />
            your money flow.
          </h1>
          <p className="mt-4 text-brand-100 max-w-md">
            Track income and expenses, drag accounts across a Kanban board and hit your savings
            goals — all in one dashboard.
          </p>
        </div>
        <p className="text-sm text-brand-100">Personal finance · React + Node.js</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="text-sm text-slate-500 mt-1">
            Use the demo account or your own credentials.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <label className="block mt-6 text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />

          <label className="block mt-4 text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>

          <p className="text-sm text-slate-500 mt-4 text-center">
            No account?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
