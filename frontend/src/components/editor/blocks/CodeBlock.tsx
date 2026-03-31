'use client';
import { CodeBlock as T } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
const LANGUAGES = ['typescript','javascript','python','bash','json','html','css','sql','go','rust'];
export function CodeBlock({ block, editor }: { block: T; editor: ReturnType<typeof useEditorWithLogging> }) {
  const { updateBlock } = editor;
  return (
    <div className="overflow-hidden rounded-xl border border-surface-border bg-dark dark:border-dark-border">
      <div className="flex items-center justify-between border-b border-dark-border bg-dark-muted px-4 py-2">
        <select value={block.language} onChange={(e) => updateBlock(block.id, { language: e.target.value })} className="bg-transparent text-xs text-slate-400 outline-none">
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <input type="text" value={block.filename || ''} onChange={(e) => updateBlock(block.id, { filename: e.target.value })} placeholder="filename.ts" className="bg-transparent text-right text-xs text-slate-500 outline-none placeholder-slate-700" />
      </div>
      <textarea value={block.code} onChange={(e) => updateBlock(block.id, { code: e.target.value })} placeholder="// Write your code..." rows={6} spellCheck={false} className="w-full resize-y bg-transparent p-4 font-mono text-sm text-slate-100 placeholder-slate-700 outline-none" />
    </div>
  );
}
