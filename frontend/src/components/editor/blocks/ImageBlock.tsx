'use client';
import { useState } from 'react';
import { ImageBlock as T } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { cn, apiUrl } from '@/lib/utils';
import { Upload, Link } from 'lucide-react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
export function ImageBlock({ block, editor }: { block: T; editor: ReturnType<typeof useEditorWithLogging> }) {
  const { updateBlock } = editor;
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const form = new FormData(); form.append('image', file);
      const token = Cookies.get('accessToken');
      const res = await fetch(apiUrl('/api/v1/images'), { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      updateBlock(block.id, { url: data.data.url, publicId: data.data.publicId, width: data.data.width, height: data.data.height });
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  }
  if (!block.url) {
    return (
      <div className="rounded-xl border-2 border-dashed border-surface-border p-8 text-center dark:border-dark-border">
        {urlMode ? (
          <div className="flex gap-2">
            <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://example.com/image.jpg" className="input flex-1 text-sm" />
            <button onClick={() => { if (urlInput) { updateBlock(block.id, { url: urlInput, publicId: '' }); setUrlMode(false); } }} className="btn-primary text-sm">Add</button>
            <button onClick={() => setUrlMode(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Add an image</p>
            <div className="flex justify-center gap-3">
              <label className={cn('btn-secondary cursor-pointer text-sm', uploading && 'opacity-50')}><Upload size={14} />{uploading ? 'Uploading...' : 'Upload'}<input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} /></label>
              <button onClick={() => setUrlMode(true)} className="btn-secondary text-sm"><Link size={14} /> URL</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <figure className={cn('my-2', { 'text-left': block.alignment === 'left', 'text-center': block.alignment === 'center', 'text-right': block.alignment === 'right' })}>
      <div className="mb-2 flex gap-1">
        {(['left','center','right','full'] as const).map((a) => (<button key={a} onClick={() => updateBlock(block.id, { alignment: a })} className={cn('rounded px-2 py-0.5 text-xs', block.alignment === a ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:text-slate-600')}>{a}</button>))}
        <button onClick={() => updateBlock(block.id, { url: '', publicId: '' })} className="ml-auto text-xs text-slate-400 hover:text-red-500">Remove</button>
      </div>
      <img src={block.url} alt={block.altText || ''} className={cn('rounded-lg', block.alignment === 'full' ? 'w-full' : 'max-w-full')} />
      <input type="text" value={block.altText} onChange={(e) => updateBlock(block.id, { altText: e.target.value })} placeholder="Alt text (important for SEO)" className="mt-2 w-full bg-transparent text-center text-sm text-slate-400 outline-none placeholder-slate-300" />
      <input type="text" value={block.caption || ''} onChange={(e) => updateBlock(block.id, { caption: e.target.value })} placeholder="Caption (optional)" className="w-full bg-transparent text-center text-xs text-slate-400 outline-none placeholder-slate-300" />
    </figure>
  );
}
