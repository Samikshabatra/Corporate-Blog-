'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { PenSquare, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { SEO_CONFIG } from '@/lib/seo.config';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-md dark:border-dark-border dark:bg-dark/80">
      <nav className="container-blog flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold text-slate-900 dark:text-white">{SEO_CONFIG.siteName}</Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/blog" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Blog</Link>
          <Link href="/category" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Categories</Link>
        </div>
        <div className="flex items-center gap-3">
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn-ghost p-2" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="btn-ghost flex items-center gap-1.5 text-sm"><LayoutDashboard size={16} />Dashboard</Link>
              <Link href="/dashboard/posts/new" className="btn-primary text-sm"><PenSquare size={16} />Write</Link>
              <button onClick={logout} className="btn-ghost p-2" aria-label="Logout"><LogOut size={16} /></button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary text-sm">Sign in</Link>
              <Link href="/auth/register" className="btn-primary text-sm">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
