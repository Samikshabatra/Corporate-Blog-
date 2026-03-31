'use client';

import Link from 'next/link';
import { ArrowLeft, Eye, Columns2, Search, Save, Loader2, CheckCircle2, AlertCircle, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { EditorMode } from '@/types/editor.types';
import toast from 'react-hot-toast';
import { formatDate, countWordsInDocument, calculateReadingTimeFromWords } from '@/lib/utils';

interface EditorTopBarProps {
  editor: ReturnType<typeof useEditorWithLogging>;
  canPublish: boolean;
  isAdmin: boolean;
  publishControls?: React.ReactNode;
}

const MODES: { key: EditorMode; label: string }[] = [
  { key: 'write', label: 'Write' }, { key: 'preview', label: 'Preview' },
  { key: 'split', label: 'Split' }, { key: 'seo', label: 'SEO' },
];

export function EditorTopBar({ editor, publishControls }: EditorTopBarProps) {
  const { state, setMode, save } = editor;
  const { autoSave, status, mode } = state;
  const wordCount = countWordsInDocument(state.document);
  const readingTime = calculateReadingTimeFromWords(wordCount);

  async function handleSave() {
    try { await save(); toast.success('Saved!'); } catch { toast.error('Save failed.'); }
  }

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border bg-surface px-4 dark:border-dark-border dark:bg-dark-muted">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/posts" className="btn-ghost gap-1.5 text-sm"><ArrowLeft size={16} /> Posts</Link>
        <span className={status === 'DRAFT' ? 'badge-draft' : status === 'PUBLISHED' ? 'badge-published' : 'badge-archived'}>{status}</span>
      </div>
      <div className="hidden items-center gap-0.5 rounded-lg border border-surface-border bg-surface-subtle p-0.5 dark:border-dark-border dark:bg-dark-subtle sm:flex">
        {MODES.map(({ key, label }) => (
          <button key={key} onClick={() => setMode(key)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-all', mode === key ? 'bg-white text-slate-900 shadow-sm dark:bg-dark dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200')}>
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-3 text-xs text-slate-400 md:flex"><span>{wordCount.toLocaleString()} words</span><span aria-hidden="true">·</span><span className="flex items-center gap-1"><BookOpen size={12} />{readingTime} min read</span></div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {autoSave.status === 'saving' && <><Loader2 size={12} className="animate-spin" /> Saving...</>}
          {autoSave.status === 'saved' && autoSave.lastSaved && <><CheckCircle2 size={12} className="text-green-500" /> Saved {formatDate(autoSave.lastSaved)}</>}
          {autoSave.status === 'unsaved' && <><Clock size={12} className="text-amber-400" /> Unsaved changes</>}
          {autoSave.status === 'error' && <><AlertCircle size={12} className="text-red-500" /> {autoSave.errorMessage || 'Save failed'}</>}
        </div>
        <button onClick={handleSave} disabled={autoSave.status === 'saving'} className="btn-secondary hidden text-sm sm:flex">
          {autoSave.status === 'saving' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
        </button>
        {publishControls}
      </div>
    </div>
  );
}
