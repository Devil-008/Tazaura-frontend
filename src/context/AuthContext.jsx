import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('tazaura_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('tazaura_token'));

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('tazaura_user',  JSON.stringify(userData));
    localStorage.setItem('tazaura_token', authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tazaura_user');
    localStorage.removeItem('tazaura_token');
  }, []);

  // Listen for 401 auto-logout dispatch from axios interceptor
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
