'use client';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { cn } from '@/lib/utils';
import { Check, X, Loader2, ExternalLink } from 'lucide-react';
export function SlugField({ editor }: { editor: ReturnType<typeof useEditorWithLogging> }) {
  const { state, setSlug } = editor;
  const { slug } = state;
  return (
    <div className="space-y-2">
      <div className="relative">
        <input type="text" value={slug.value} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug"
          className={cn('input pr-8 font-mono text-xs', slug.error && 'border-red-400 focus:border-red-400', !slug.error && slug.isUnique && slug.value && 'border-green-400')} />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          {slug.isChecking && <Loader2 size={12} className="animate-spin text-slate-400" />}
          {!slug.isChecking && slug.value && slug.isUnique && !slug.error && <Check size={12} className="text-green-500" />}
          {!slug.isChecking && slug.error && <X size={12} className="text-red-500" />}
        </div>
      </div>
      {slug.error && <p className="text-xs text-red-500">{slug.error}</p>}
      {slug.preview && (<a href={slug.preview} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 truncate text-xs text-slate-400 hover:text-brand-600"><ExternalLink size={10} /><span className="truncate">{slug.preview}</span></a>)}
      {slug.isManual && <p className="text-[10px] text-amber-500">Custom slug — auto-sync off</p>}
    </div>
  );
}
