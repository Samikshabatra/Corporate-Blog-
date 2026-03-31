'use client';
import { QuoteBlock as T } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
export function QuoteBlock({ block, editor }: { block: T; editor: ReturnType<typeof useEditorWithLogging> }) {
  const { updateBlock } = editor;
  const text = block.content.map((n) => n.text).join('');
  return (
    <blockquote className="border-l-4 border-brand-400 pl-4">
      <textarea value={text} onChange={(e) => updateBlock(block.id, { content: [{ text: e.target.value }] })} placeholder="Write a quote..." rows={2} className="w-full resize-none bg-transparent text-lg italic text-slate-600 placeholder-slate-300 outline-none dark:text-slate-300" />
      <input type="text" value={block.attribution || ''} onChange={(e) => updateBlock(block.id, { attribution: e.target.value })} placeholder="— Attribution" className="mt-1 w-full bg-transparent text-sm text-slate-400 placeholder-slate-300 outline-none" />
    </blockquote>
  );
}
