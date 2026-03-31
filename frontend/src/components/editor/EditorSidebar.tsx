'use client';

import { useState } from 'react';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { SlugField } from './fields/SlugField';
import { CategoryPicker } from './fields/CategoryPicker';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export function EditorSidebar({ editor }: { editor: ReturnType<typeof useEditorWithLogging> }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ slug: true, categories: true, publish: true });
  const toggle = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));
  const { state, setStatus, save } = editor;
  const { status, publishedAt } = state;

  const sections = [
    { id: 'slug', label: 'Slug', children: <SlugField editor={editor} /> },
    { id: 'categories', label: 'Categories', children: <CategoryPicker editor={editor} /> },
    {
      id: 'publish', label: 'Publish', children: (
        <div className="space-y-3">
          <div>
            <p className="label">Status</p>
            <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); void save(); }} className="input text-sm">
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          {publishedAt && (
            <div><p className="label">Published</p><p className="text-xs text-slate-500">{new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p></div>
          )}
        </div>
      )
    },
  ];

  return (
    <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-surface-border bg-surface dark:border-dark-border dark:bg-dark-muted lg:block xl:w-64">
      <div className="divide-y divide-surface-border dark:divide-dark-border">
        {sections.map(({ id, label, children }) => (
          <div key={id}>
            <button onClick={() => toggle(id)} className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              {label}<ChevronDown size={14} className={cn('transition-transform', open[id] && 'rotate-180')} />
            </button>
            {open[id] && <div className="px-4 pb-4">{children}</div>}
          </div>
        ))}
      </div>
    </aside>
  );
}
