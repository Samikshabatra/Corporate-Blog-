'use client';
import { CalloutBlock as T } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
const VARIANTS = {
  info:    { icon: Info,          bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800',    text: 'text-blue-800 dark:text-blue-200'    },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800', text: 'text-amber-800 dark:text-amber-200'   },
  success: { icon: CheckCircle2,  bg: 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800', text: 'text-green-800 dark:text-green-200'   },
  danger:  { icon: XCircle,       bg: 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800',         text: 'text-red-800 dark:text-red-200'       },
};
export function CalloutBlock({ block, editor }: { block: T; editor: ReturnType<typeof useEditorWithLogging> }) {
  const { updateBlock } = editor;
  const v = VARIANTS[block.variant];
  const Icon = v.icon;
  const text = block.content.map((n) => n.text).join('');
  return (
    <div className={cn('flex gap-3 rounded-xl border p-4', v.bg)}>
      <div className="flex items-start gap-2">
        <select value={block.variant} onChange={(e) => updateBlock(block.id, { variant: e.target.value as T['variant'] })} className="bg-transparent text-xs outline-none">
          {Object.keys(VARIANTS).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <Icon size={18} className={cn('mt-0.5 shrink-0', v.text)} />
      </div>
      <textarea value={text} onChange={(e) => updateBlock(block.id, { content: [{ text: e.target.value }] })} placeholder="Write a callout note..." rows={2} className={cn('w-full resize-none bg-transparent text-sm outline-none', v.text)} />
    </div>
  );
}
