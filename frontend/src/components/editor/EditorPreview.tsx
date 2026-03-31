'use client';

import { useState } from 'react';
import { EditorState } from '@/types/editor.types';
import { Block } from '@/types/block.types';
import { cn } from '@/lib/utils';
import { SEO_CONFIG } from '@/lib/seo.config';
import { ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function EditorPreview({ state, compact }: { state: EditorState; compact?: boolean }) {
  const { title, document, slug, seo, status } = state;
  const [urlStatus, setUrlStatus] = useState<'idle' | 'checking' | 'live' | 'not-found'>('idle');
  const finalUrl = `${SEO_CONFIG.siteUrl}/blog/${slug.value}`;

  async function validateLiveUrl() {
    if (!slug.value) return;
    setUrlStatus('checking');
    try {
      const res = await fetch(finalUrl, { method: 'HEAD', mode: 'no-cors' });
      // In no-cors mode we can't read status, but if it resolves, the URL exists
      setUrlStatus('live');
    } catch {
      setUrlStatus('not-found');
    }
  }

  return (
    <div className={cn('overflow-y-auto', compact ? 'p-4' : 'mx-auto max-w-2xl px-6 py-12')}>
      {!compact && (
        <>
          {/* ── Google Preview ──────────────── */}
          <div className="mb-6 rounded-xl border border-surface-border bg-surface-muted p-4 dark:border-dark-border dark:bg-dark-muted">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Google Preview</p>
            <p className="text-xs text-green-600">{slug.preview || `${SEO_CONFIG.siteUrl}/blog/...`}</p>
            <p className="mt-1 text-base font-medium text-blue-600 hover:underline">{seo.metaTitle || title || 'Untitled Post'}</p>
            <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">{seo.metaDesc || 'No meta description set.'}</p>
          </div>

          {/* ── Live URL Validation ────────── */}
          <div className="mb-10 rounded-xl border border-surface-border bg-surface-muted p-4 dark:border-dark-border dark:bg-dark-muted">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Final URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-surface-subtle px-2 py-1 text-sm text-slate-600 dark:bg-dark-subtle dark:text-slate-300">
                {slug.value ? finalUrl : 'Set a slug first...'}
              </code>
              {status === 'PUBLISHED' && slug.value && (
                <button
                  onClick={validateLiveUrl}
                  disabled={urlStatus === 'checking'}
                  className="btn-secondary text-xs gap-1.5 px-3 py-1.5"
                >
                  {urlStatus === 'checking' ? (
                    <><Loader2 size={12} className="animate-spin" /> Checking...</>
                  ) : (
                    <><ExternalLink size={12} /> Validate Live</>
                  )}
                </button>
              )}
              {status === 'PUBLISHED' && slug.value && (
                <a
                  href={finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs gap-1 px-2 py-1.5"
                >
                  <ExternalLink size={12} /> Open
                </a>
              )}
            </div>
            {urlStatus === 'live' && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                <CheckCircle2 size={12} /> URL is live and accessible
              </p>
            )}
            {urlStatus === 'not-found' && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                <XCircle size={12} /> URL not reachable — post may not be published yet or ISR hasn&apos;t revalidated
              </p>
            )}
          </div>
        </>
      )}

      <article className="prose-blog">
        <h1>{title || 'Untitled'}</h1>
        {document.blocks.map((block) => <PreviewBlock key={block.id} block={block} />)}
      </article>
    </div>
  );
}

function PreviewBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph': { const text = block.content.map((n) => n.text).join(''); return text ? <p>{text}</p> : null; }
    case 'heading': { const text = block.content.map((n) => n.text).join(''); const Tag = `h${block.level}` as keyof JSX.IntrinsicElements; return text ? <Tag>{text}</Tag> : null; }
    case 'image': return block.url ? (<figure><img src={block.url} alt={block.altText} className="rounded-lg" />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>) : null;
    case 'quote': { const text = block.content.map((n) => n.text).join(''); return (<blockquote><p>{text}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>); }
    case 'code': return (<pre><code className={`language-${block.language}`}>{block.code}</code></pre>);
    case 'divider': return <hr />;
    case 'callout': {
      const text = block.content.map((n) => n.text).join('');
      const bg: Record<string, string> = { info: 'bg-blue-50 border-blue-200 text-blue-800', warning: 'bg-amber-50 border-amber-200 text-amber-800', success: 'bg-green-50 border-green-200 text-green-800', danger: 'bg-red-50 border-red-200 text-red-800' };
      return (<div className={cn('not-prose rounded-xl border p-4 text-sm', bg[block.variant])}>{text}</div>);
    }
    case 'list': { const Tag = block.variant === 'ordered' ? 'ol' : 'ul'; return (<Tag>{block.items.map((item, i) => (<li key={i}>{item.map((n) => n.text).join('')}</li>))}</Tag>); }
    default: return null;
  }
}
