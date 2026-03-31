'use client';

import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { SEOPanelState } from '@/types/editor.types';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

export function EditorSEOPanel({ editor }: { editor: ReturnType<typeof useEditorWithLogging> }) {
  const { state, setSeoField } = editor;
  const { seo } = state;

  function field(key: keyof SEOPanelState, label: string, max: number, rows = 1, hint?: string) {
    const val = String(seo[key] || '');
    const len = val.length;
    const ok = len > 0 && len <= max;
    if (rows > 1) {
      return (
        <div key={String(key)}>
          <div className="mb-1 flex items-center justify-between"><label className="label mb-0">{label}</label><span className={cn('text-xs', ok ? 'text-green-500' : len > max ? 'text-red-500' : 'text-slate-400')}>{len}/{max}</span></div>
          <textarea value={val} onChange={(e) => setSeoField({ field: key, value: e.target.value })} rows={rows} className={cn('input resize-none text-sm', len > max && 'border-red-400')} />
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
      );
    }
    return (
      <div key={String(key)}>
        <div className="mb-1 flex items-center justify-between"><label className="label mb-0">{label}</label><span className={cn('text-xs', ok ? 'text-green-500' : len > max ? 'text-red-500' : 'text-slate-400')}>{len}/{max}</span></div>
        <input type="text" value={val} onChange={(e) => setSeoField({ field: key, value: e.target.value })} className={cn('input text-sm', len > max && 'border-red-400')} />
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }

  const checks = [
    { label: 'Meta title', ok: seo.metaTitleLength >= 10 && seo.metaTitleLength <= 60 },
    { label: 'Meta desc',  ok: seo.metaDescLength >= 50 && seo.metaDescLength <= 160 },
    { label: 'OG image',   ok: !!seo.ogImage },
    { label: 'Schema type', ok: !!seo.schemaType },
    { label: 'Canonical',  ok: !!seo.canonicalUrl || !!state.slug.value },
  ];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">SEO Score</h3>
        <div className="mt-3 space-y-2">
          {checks.map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              {ok ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-slate-300 dark:text-slate-600" />}
              <span className={ok ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <hr className="border-surface-border dark:border-dark-border" />
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Meta</p>
        {field('metaTitle', 'Meta Title', 60, 1, 'Target: 50–60 characters')}
        {field('metaDesc', 'Meta Description', 160, 3, 'Target: 150–160 characters')}
      </div>
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Open Graph</p>
        {field('ogTitle', 'OG Title', 95)}
        {field('ogDesc', 'OG Desc', 200, 3)}
        {field('ogImage', 'OG Image URL', 500)}
      </div>
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Twitter</p>
        {field('twitterTitle', 'Twitter Title', 70)}
        {field('twitterDesc', 'Twitter Desc', 200, 3)}
        {field('twitterImage', 'Twitter Image', 500)}
      </div>
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Advanced</p>
        <div>
          <label className="label">Schema Type</label>
          <select value={seo.schemaType} onChange={(e) => setSeoField({ field: 'schemaType', value: e.target.value })} className="input text-sm">
            <option value="Article">Article</option>
            <option value="BlogPosting">BlogPosting</option>
          </select>
        </div>
        {field('canonicalUrl', 'Canonical URL', 500, 1, 'Leave blank to use default')}
      </div>
    </div>
  );
}
