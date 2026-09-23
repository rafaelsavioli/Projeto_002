import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.api';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('fluxoboard:user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fluxoboard:token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .fetchMe()
      .then((u) => {
        setUser(u);
        localStorage.setItem('fluxoboard:user', JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem('fluxoboard:token');
        localStorage.removeItem('fluxoboard:user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        const data = await authApi.login(email, password);
        localStorage.setItem('fluxoboard:token', data.token);
        localStorage.setItem('fluxoboard:user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      },
      async register(name, email, password) {
        const data = await authApi.register(name, email, password);
        localStorage.setItem('fluxoboard:token', data.token);
        localStorage.setItem('fluxoboard:user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      },
      logout() {
        localStorage.removeItem('fluxoboard:token');
        localStorage.removeItem('fluxoboard:user');
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
