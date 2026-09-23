import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      const details = err.response?.data?.details;
      setError(
        details?.[0] ? `${details[0].path}: ${details[0].message}` : err.response?.data?.error || 'Unable to register'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Link to="/login" className="text-sm text-brand-600 hover:underline">
          ← Back to sign in
        </Link>
        <h2 className="font-display text-2xl font-bold text-slate-900 mt-4">Create account</h2>
        <p className="text-sm text-slate-500 mt-1">Start tracking your finances in minutes.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <label className="block mt-6 text-sm font-medium text-slate-700">Name</label>
        <input
          value={form.name}
          onChange={update('name')}
          required
          minLength={2}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <label className="block mt-4 text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={update('email')}
          required
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <label className="block mt-4 text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={update('password')}
          required
          minLength={8}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}
