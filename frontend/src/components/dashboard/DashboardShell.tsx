'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderOpen, Image, Users, Settings, PenSquare, LogOut, Menu, X, ChevronRight, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { SEO_CONFIG } from '@/lib/seo.config';
import type { Role } from '@/context/AuthContext';

const NAV_ITEMS = [
  { label: 'Overview',   href: '/dashboard',            icon: LayoutDashboard, roles: ['ADMIN','EDITOR','WRITER'] as Role[], exact: true },
  { label: 'Posts',      href: '/dashboard/posts',      icon: FileText,        roles: ['ADMIN','EDITOR','WRITER'] as Role[] },
  { label: 'Categories', href: '/dashboard/categories', icon: FolderOpen,      roles: ['ADMIN','EDITOR'] as Role[] },
  { label: 'Media',      href: '/dashboard/media',      icon: Image,           roles: ['ADMIN','EDITOR','WRITER'] as Role[] },
  { label: 'Users',      href: '/dashboard/users',      icon: Users,           roles: ['ADMIN'] as Role[] },
  { label: 'Settings',   href: '/dashboard/settings',   icon: Settings,        roles: ['ADMIN'] as Role[] },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout, hasRole } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter((item) => item.roles.some((r) => hasRole(r)));

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const roleStyles: Record<string, string> = {
    ADMIN:  'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    EDITOR: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    WRITER: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-muted dark:bg-dark">
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn('fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-surface-border bg-surface transition-transform dark:border-dark-border dark:bg-dark-muted lg:static lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center justify-between border-b border-surface-border px-6 dark:border-dark-border">
          <Link href="/" className="font-serif text-lg font-bold text-slate-900 dark:text-white">{SEO_CONFIG.siteName}</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, 'exact' in item ? item.exact : false);
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setSidebarOpen(false)}
                    className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', active ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300' : 'text-slate-600 hover:bg-surface-subtle hover:text-slate-900 dark:text-slate-400 dark:hover:bg-dark-subtle dark:hover:text-white')}>
                    <Icon size={18} />{item.label}
                    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 px-3">
            <Link href="/dashboard/posts/new" className="btn-primary w-full justify-center text-sm"><PenSquare size={16} />New Post</Link>
          </div>
        </nav>
        <div className="border-t border-surface-border p-4 dark:border-dark-border">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{user?.email?.[0]?.toUpperCase() || 'U'}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user?.email}</p>
              <span className={cn('badge text-[10px]', roleStyles[user?.role || ''] || '')}>{user?.role}</span>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors" title="Sign out"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-surface-border bg-surface px-6 dark:border-dark-border dark:bg-dark-muted">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-slate-600 lg:hidden"><Menu size={22} /></button>
          <nav className="hidden items-center gap-1.5 text-sm md:flex">
            {pathname.split('/').filter(Boolean).map((part, i, arr) => {
              const href = '/' + arr.slice(0, i + 1).join('/');
              const isLast = i === arr.length - 1;
              const label = part.charAt(0).toUpperCase() + part.slice(1);
              return (
                <span key={href} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={14} className="text-slate-300" />}
                  {isLast ? <span className="font-medium text-slate-900 dark:text-white">{label}</span> : <Link href={href} className="text-slate-400 hover:text-slate-600">{label}</Link>}
                </span>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <button className="btn-ghost p-2 relative"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" /></button>
            <Link href="/dashboard/posts/new" className="btn-primary hidden text-sm md:flex"><PenSquare size={16} />Write</Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
