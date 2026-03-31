'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiUrl } from '@/lib/utils';

export type Role = 'ADMIN' | 'EDITOR' | 'WRITER';

export interface AuthUser { sub: string; email: string; role: Role; }

interface AuthContextValue {
  user: AuthUser | null; isLoading: boolean; isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  hasRole: (role: Role) => boolean;
  canPublish: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwt(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) return null;
    return { sub: payload.sub, email: payload.email, role: payload.role };
  } catch { return null; }
}

const ROLE_HIERARCHY: Record<Role, number> = { ADMIN: 3, EDITOR: 2, WRITER: 1 };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if we have a valid session via accessToken in response
  useEffect(() => {
    // Try to read from the login response stored in sessionStorage (temp, not a secret)
    const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem('_at') : null;
    if (storedToken) {
      const decoded = decodeJwt(storedToken);
      if (decoded) {
        setUser(decoded);
      } else {
        // Token expired, try to refresh
        refreshAuth().catch(() => {});
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(apiUrl('/api/v1/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // sends/receives httpOnly cookies
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Login failed'); }
    const { data } = await res.json();

    // Store accessToken temporarily for JWT decoding (user info only)
    // The actual auth is handled by httpOnly cookies
    if (data.accessToken) {
      sessionStorage.setItem('_at', data.accessToken);
      setUser(decodeJwt(data.accessToken));
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/v1/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // sends httpOnly refreshToken cookie
      });
      if (!res.ok) throw new Error('Refresh failed');
      const { data } = await res.json();
      if (data.accessToken) {
        sessionStorage.setItem('_at', data.accessToken);
        setUser(decodeJwt(data.accessToken));
      }
    } catch {
      setUser(null);
      sessionStorage.removeItem('_at');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(apiUrl('/api/v1/auth/logout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch { /* ignore */ }

    sessionStorage.removeItem('_at');
    setUser(null);
  }, []);

  const hasRole = useCallback((role: Role): boolean => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[role];
  }, [user]);

  const canPublish = useCallback(() => hasRole('EDITOR'), [hasRole]);
  const isAdmin = useCallback(() => hasRole('ADMIN'), [hasRole]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, refreshAuth, hasRole, canPublish, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
