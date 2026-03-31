'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PostEditor } from '@/components/editor/PostEditor';
import { Post } from '@/types/post.types';
import { apiUrl } from '@/lib/utils';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function load() {
      try {
        const token = Cookies.get('accessToken');
        const res = await fetch(apiUrl(`/api/v1/posts/${id}`), { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data.data);
      } catch (e) { setError((e as Error).message); } finally { setLoading(false); }
    }
    void load();
  }, [id]);
  if (loading) return (<div className="flex h-96 items-center justify-center"><Loader2 size={32} className="animate-spin text-brand-600" /></div>);
  if (error) return (<div className="flex h-96 items-center justify-center text-red-500">{error}</div>);
  return <PostEditor initialPost={post ?? undefined} />;
}
