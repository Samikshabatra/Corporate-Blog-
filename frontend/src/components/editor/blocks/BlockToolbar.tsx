'use client';
import { Block } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
export function BlockToolbar({ block, index, editor, onInsert }: { block: Block; index: number; editor: ReturnType<typeof useEditorWithLogging>; onInsert: () => void }) {
  const { deleteBlock, duplicateBlock, moveBlockUp, moveBlockDown, state } = editor;
  const isFirst = index === 0;
  const isLast = index === state.document.blocks.length - 1;
  return (
    <div className="absolute -left-20 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
      <button className="cursor-grab p-1 text-slate-300 hover:text-slate-500"><GripVertical size={14} /></button>
      <button onClick={onInsert} className="rounded p-1 text-slate-300 hover:bg-surface-subtle hover:text-brand-600" title="Add block below"><Plus size={14} /></button>
      <button onClick={() => moveBlockUp(block.id)} disabled={isFirst} className={cn('rounded p-1 text-slate-300 hover:bg-surface-subtle hover:text-slate-600', isFirst && 'opacity-30 cursor-not-allowed')} title="Move up"><ChevronUp size={14} /></button>
      <button onClick={() => moveBlockDown(block.id)} disabled={isLast} className={cn('rounded p-1 text-slate-300 hover:bg-surface-subtle hover:text-slate-600', isLast && 'opacity-30 cursor-not-allowed')} title="Move down"><ChevronDown size={14} /></button>
      <button onClick={() => duplicateBlock(block.id)} className="rounded p-1 text-slate-300 hover:bg-surface-subtle hover:text-slate-600" title="Duplicate"><Copy size={14} /></button>
      <button onClick={() => deleteBlock(block.id)} className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950" title="Delete"><Trash2 size={14} /></button>
    </div>
  );
}
