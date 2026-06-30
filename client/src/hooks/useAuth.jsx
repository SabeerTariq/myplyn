import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (credentials, isAdmin = false) => {
    const { data } = isAdmin
      ? await authApi.adminLogin(credentials)
      : await authApi.login(credentials);
    setUser(data.user);
    return data.user;
  };

  const signup = async (formData) => {
    const { data } = await authApi.signup(formData);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((u) => (u ? { ...u, ...updates } : u));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refresh, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
