'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiUrl } from '@/lib/utils';
import Cookies from 'js-cookie';
import { FileText, Eye, PenSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export function DashboardOverview() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = Cookies.get('accessToken');
        const res = await fetch(apiUrl('/api/v1/dashboard/stats'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch { /* silently fail */ }
    }
    void loadStats();
  }, []);

  const STATS_CONFIG = [
    { label: 'Total Posts', value: stats ? stats.totalPosts.toLocaleString() : '—', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
    { label: 'Published', value: stats ? stats.publishedPosts.toLocaleString() : '—', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Drafts', value: stats ? stats.draftPosts.toLocaleString() : '—', icon: PenSquare, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
    { label: 'Total Views', value: stats ? stats.totalViews.toLocaleString() : '—', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good {getTimeOfDay()}, {user?.email?.split('@')[0]} 👋</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Here&apos;s what&apos;s happening with your content.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS_CONFIG.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card flex items-center gap-4">
              <div className={cn('rounded-xl p-3', stat.bg)}><Icon size={22} className={stat.color} /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/posts/new" className="card flex items-center gap-4 hover:shadow-card-md">
            <div className="rounded-xl p-3 text-brand-600 bg-brand-50 dark:bg-brand-950"><PenSquare size={20} /></div>
            <div><p className="font-medium text-slate-900 dark:text-white">New Post</p><p className="text-sm text-slate-500">Start writing a new draft</p></div>
          </Link>
          <Link href="/dashboard/posts" className="card flex items-center gap-4 hover:shadow-card-md">
            <div className="rounded-xl p-3 text-slate-600 bg-slate-50 dark:bg-slate-900"><FileText size={20} /></div>
            <div><p className="font-medium text-slate-900 dark:text-white">Manage Posts</p><p className="text-sm text-slate-500">View and edit all your posts</p></div>
          </Link>
          {hasRole('EDITOR') && (
            <Link href="/dashboard/posts?status=DRAFT" className="card flex items-center gap-4 hover:shadow-card-md">
              <div className="rounded-xl p-3 text-amber-600 bg-amber-50 dark:bg-amber-950"><Eye size={20} /></div>
              <div><p className="font-medium text-slate-900 dark:text-white">Review Drafts</p><p className="text-sm text-slate-500">Posts waiting for review</p></div>
            </Link>
          )}
        </div>
      </div>
      {hasRole('ADMIN') && (
        <div className="card border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30">
          <h3 className="font-semibold text-purple-900 dark:text-purple-200">Admin Panel</h3>
          <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">You have admin access. Manage users, settings, and all content.</p>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/users" className="btn-secondary text-sm">Manage Users</Link>
            <Link href="/dashboard/settings" className="btn-secondary text-sm">Settings</Link>
          </div>
        </div>
      )}
    </div>
  );
}
