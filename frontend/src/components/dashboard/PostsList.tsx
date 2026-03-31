'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePostAccess } from '@/hooks/usePostAccess';
import { AdminOnly, EditorOnly } from '@/components/ui/RoleGuard';
import { Post } from '@/types/post.types';
import { apiUrl, cn } from '@/lib/utils';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { PenSquare, Trash2, Plus, Loader2, Search } from 'lucide-react';

type FilterStatus = 'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { DRAFT: 'badge-draft', PUBLISHED: 'badge-published', ARCHIVED: 'badge-archived' };
  return <span className={styles[status] || 'badge'}>{status}</span>;
}

export function PostsList() {
  const { user } = useAuth();
  const access = usePostAccess();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get('accessToken');
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.set('status', filter);
      if (user?.role === 'WRITER') params.set('authorId', user.sub);
      const res = await fetch(apiUrl(`/api/v1/posts?${params}`), { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPosts(data.data?.posts || []);
    } catch { toast.error('Failed to load posts'); } finally { setLoading(false); }
  }, [filter, user]);

  useEffect(() => { void load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this post permanently?')) return;
    try {
      const token = Cookies.get('accessToken');
      await fetch(apiUrl(`/api/v1/posts/${id}`), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      toast.success('Post deleted'); void load();
    } catch { toast.error('Delete failed'); }
  }

  const filtered = posts.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Posts</h1>
          <p className="mt-1 text-sm text-slate-500">{access.isEditor ? 'All posts' : 'Your posts'}</p>
        </div>
        <Link href="/dashboard/posts/new" className="btn-primary text-sm"><Plus size={16} /> New Post</Link>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="input pl-9 text-sm" />
        </div>
        <div className="flex rounded-lg border border-surface-border bg-surface-subtle p-0.5 dark:border-dark-border dark:bg-dark-subtle">
          {(['ALL','DRAFT','PUBLISHED','ARCHIVED'] as FilterStatus[]).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-all', filter === s ? 'bg-white text-slate-900 shadow-sm dark:bg-dark dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400')}>{s}</button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex h-48 items-center justify-center"><Loader2 size={24} className="animate-spin text-brand-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-surface-border dark:border-dark-border">
          <p className="text-sm text-slate-400">No posts found</p>
          <Link href="/dashboard/posts/new" className="btn-primary text-sm"><Plus size={14} /> Create your first post</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-surface-border dark:border-dark-border">
          <table className="w-full text-sm">
            <thead className="border-b border-surface-border bg-surface-muted dark:border-dark-border dark:bg-dark-subtle">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Title</th>
                <th className="hidden px-4 py-3 text-left font-medium text-slate-500 md:table-cell">Status</th>
                <EditorOnly><th className="hidden px-4 py-3 text-left font-medium text-slate-500 lg:table-cell">Author</th></EditorOnly>
                <th className="hidden px-4 py-3 text-left font-medium text-slate-500 md:table-cell">Views</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-dark-border">
              {filtered.map((post) => {
                const canEdit = access.isEditor || post.author.id === user?.sub;
                const canDelete = access.isAdmin || post.author.id === user?.sub;
                return (
                  <tr key={post.id} className="bg-surface hover:bg-surface-subtle dark:bg-dark-muted dark:hover:bg-dark-subtle">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{post.title || 'Untitled'}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-400">/{post.slug}</p>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell"><StatusBadge status={post.status} /></td>
                    <EditorOnly><td className="hidden px-4 py-3 text-sm text-slate-500 lg:table-cell">{post.author.name}</td></EditorOnly>
                    <td className="hidden px-4 py-3 text-sm text-slate-500 md:table-cell">{post.viewCount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <Link href={`/dashboard/posts/${post.id}/edit`} className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-subtle hover:text-brand-600 dark:hover:bg-dark-subtle" title="Edit"><PenSquare size={15} /></Link>
                        )}
                        <AdminOnly>
                          {canDelete && (
                            <button onClick={() => handleDelete(post.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950" title="Delete"><Trash2 size={15} /></button>
                          )}
                        </AdminOnly>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
