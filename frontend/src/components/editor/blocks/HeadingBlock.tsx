'use client';
import { HeadingBlock as T } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { cn } from '@/lib/utils';
const HEADING_STYLES: Record<number, string> = { 1: 'text-4xl font-bold', 2: 'text-3xl font-bold', 3: 'text-2xl font-semibold', 4: 'text-xl font-semibold' };
export function HeadingBlock({ block, editor }: { block: T; editor: ReturnType<typeof useEditorWithLogging> }) {
  const { updateBlock } = editor;
  const text = block.content.map((n) => n.text).join('');
  return (
    <div className="flex items-baseline gap-2">
      <select value={block.level} onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) as T['level'] })} className="shrink-0 rounded bg-transparent text-xs text-slate-300 outline-none hover:text-slate-500 dark:text-slate-600">
        {[1,2,3,4].map((l) => <option key={l} value={l}>H{l}</option>)}
      </select>
      <input type="text" value={text} onChange={(e) => updateBlock(block.id, { content: [{ text: e.target.value }] })} placeholder={`Heading ${block.level}`} className={cn('w-full bg-transparent font-serif text-slate-900 placeholder-slate-300 outline-none dark:text-white dark:placeholder-slate-600', HEADING_STYLES[block.level])} />
    </div>
  );
}
