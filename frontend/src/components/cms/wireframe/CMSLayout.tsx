'use client';

import { cn } from '@/lib/utils';

export function CMSWireframe() {
  return (
    <div className="flex h-screen flex-col bg-surface-muted font-mono text-xs dark:bg-dark-muted">
      <div className="flex h-14 items-center justify-between border-b border-surface-border bg-surface px-6 dark:border-dark-border dark:bg-dark">
        <div className="flex items-center gap-4">
          <WireBox w="w-24" h="h-6" label="← Back" />
          <WireBox w="w-16" h="h-5" label="DRAFT" muted />
        </div>
        <div className="flex items-center gap-2">
          <WireBox w="w-20" h="h-6" label="Auto-saved" muted />
          <WireBox w="w-16" h="h-8" label="Preview" />
          <WireBox w="w-20" h="h-8" label="Publish" dark />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-56 flex-col border-r border-surface-border bg-surface px-4 py-6 dark:border-dark-border dark:bg-dark">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Post Settings</p>
          <div className="space-y-5">
            <div><p className="mb-1.5 text-[10px] font-medium uppercase text-slate-400">Slug</p><WireBox w="w-full" h="h-8" label="/blog/my-post-slug" /><WireBox w="w-full" h="h-4" label="✓ Unique" muted /></div>
            <div><p className="mb-1.5 text-[10px] font-medium uppercase text-slate-400">Categories</p><WireBox w="w-full" h="h-5" label="☑ Technology" /><WireBox w="w-full" h="h-5" label="☐ Business" /></div>
            <div><p className="mb-1.5 text-[10px] font-medium uppercase text-slate-400">Featured Image</p><WireBox w="w-full" h="h-24" label="Upload / URL" /></div>
          </div>
        </aside>
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex border-b border-surface-border bg-surface dark:border-dark-border dark:bg-dark">
            {['Write','Preview','Split','SEO'].map((tab, i) => (
              <div key={tab} className={cn('cursor-pointer border-b-2 px-6 py-3 text-xs', i === 0 ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400')}>{tab}</div>
            ))}
          </div>
          <div className="mx-auto w-full max-w-2xl flex-1 px-8 py-12">
            <WireBox w="w-full" h="h-12" label="Post title (H1)" className="mb-6 text-base" />
            {[['¶ Paragraph','h-12'],['H2 Heading','h-12'],['🖼 Image','h-40'],['</> Code','h-28'],['❝ Quote','h-12']].map(([type, h]) => (
              <div key={type} className="group relative mb-3 flex items-center gap-2">
                <div className="invisible flex flex-col gap-0.5 group-hover:visible"><div className="h-1 w-4 rounded bg-slate-300" /><div className="h-1 w-4 rounded bg-slate-300" /><div className="h-1 w-4 rounded bg-slate-300" /></div>
                <div className={cn('flex-1 rounded border border-dashed border-slate-300 bg-surface-subtle flex items-center px-4 dark:border-dark-subtle dark:bg-dark-subtle', h)}><span className="text-slate-400">{type}</span></div>
              </div>
            ))}
            <div className="mt-6 flex items-center gap-2"><div className="h-px flex-1 bg-surface-border dark:bg-dark-border" /><WireBox w="w-32" h="h-8" label="+ Add Block" /><div className="h-px flex-1 bg-surface-border dark:bg-dark-border" /></div>
          </div>
        </main>
        <aside className="flex w-64 flex-col border-l border-surface-border bg-surface px-4 py-6 dark:border-dark-border dark:bg-dark">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">SEO & Meta</p>
          <div className="space-y-4">
            <div><p className="mb-1.5 text-[10px] font-medium uppercase text-slate-400">Meta Title (0/60)</p><WireBox w="w-full" h="h-8" label="Enter meta title..." /></div>
            <div><p className="mb-1.5 text-[10px] font-medium uppercase text-slate-400">Meta Description (0/160)</p><WireBox w="w-full" h="h-20" label="Enter meta description..." /></div>
            <div><p className="mb-1.5 text-[10px] font-medium uppercase text-slate-400">OG Image</p><WireBox w="w-full" h="h-20" label="1200×630px" /></div>
            <div><p className="mb-1.5 text-[10px] font-medium uppercase text-slate-400">SEO Score</p><div className="grid grid-cols-3 gap-1"><WireBox w="w-full" h="h-12" label="Title ✓" /><WireBox w="w-full" h="h-12" label="Desc ✗" /><WireBox w="w-full" h="h-12" label="OG ✗" /></div></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function WireBox({ w, h, label, muted, dark, className }: { w: string; h: string; label: string; muted?: boolean; dark?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center rounded border text-center', w, h, muted ? 'border-dashed border-slate-200 text-slate-400 dark:border-dark-subtle dark:text-slate-500' : dark ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-surface-subtle text-slate-500 dark:border-dark-subtle dark:bg-dark-subtle dark:text-slate-400', className)}>
      <span className="truncate px-2">{label}</span>
    </div>
  );
}
