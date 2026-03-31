'use client';
import { useRef, useEffect } from 'react';
import { ParagraphBlock as T } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
export function ParagraphBlock({ block, editor }: { block: T; editor: ReturnType<typeof useEditorWithLogging> }) {
  const { updateBlock } = editor;
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }, [block.content]);
  const text = block.content.map((n) => n.text).join('');
  return (<textarea ref={ref} value={text} onChange={(e) => updateBlock(block.id, { content: [{ text: e.target.value }] })} placeholder="Start writing..." rows={1} className="w-full resize-none bg-transparent text-base leading-relaxed text-slate-800 placeholder-slate-300 outline-none dark:text-slate-200 dark:placeholder-slate-600" />);
}
