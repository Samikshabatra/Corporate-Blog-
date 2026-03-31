'use client';

import { useEffect, useRef } from 'react';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { BlockType } from '@/types/block.types';
import { AlignLeft, Heading, Image, Quote, Code2, Minus, AlertCircle, List, Video, HelpCircle } from 'lucide-react';

const BLOCK_OPTIONS: { type: BlockType; label: string; desc: string; icon: React.ElementType }[] = [
  { type: 'paragraph', label: 'Paragraph', desc: 'Plain text',           icon: AlignLeft   },
  { type: 'heading',   label: 'Heading',   desc: 'H1 – H4',              icon: Heading     },
  { type: 'image',     label: 'Image',     desc: 'Upload or URL',        icon: Image       },
  { type: 'quote',     label: 'Quote',     desc: 'Blockquote',           icon: Quote       },
  { type: 'code',      label: 'Code',      desc: 'Syntax highlighted',   icon: Code2       },
  { type: 'callout',   label: 'Callout',   desc: 'Info / warning box',   icon: AlertCircle },
  { type: 'list',      label: 'List',      desc: 'Bullet or numbered',   icon: List        },
  { type: 'divider',   label: 'Divider',   desc: 'Horizontal rule',      icon: Minus       },
  { type: 'embed',     label: 'Embed',     desc: 'YouTube, Twitter…',    icon: Video       },
  { type: 'faq', label: 'FAQ', desc: 'Frequently asked questions', icon: HelpCircle },
];

export function BlockInsertMenu({ editor, afterBlockId }: { editor: ReturnType<typeof useEditorWithLogging>; afterBlockId: string | null }) {
  const { state, dispatch, addBlock } = editor;
  const { insertMenu } = state;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) dispatch({ type: 'CLOSE_INSERT_MENU' });
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dispatch]);

  const filtered = BLOCK_OPTIONS.filter((o) => !insertMenu.query || o.label.toLowerCase().includes(insertMenu.query.toLowerCase()) || o.desc.toLowerCase().includes(insertMenu.query.toLowerCase()));

  return (
    <div ref={ref} className="absolute left-0 z-50 mt-1 w-64 rounded-xl border border-surface-border bg-surface shadow-card-lg dark:border-dark-border dark:bg-dark-muted">
      <div className="border-b border-surface-border p-2 dark:border-dark-border">
        <input autoFocus type="text" value={insertMenu.query} onChange={(e) => dispatch({ type: 'SET_INSERT_QUERY', payload: e.target.value })} placeholder="Search blocks..." className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder-slate-400" />
      </div>
      <div className="max-h-64 overflow-y-auto p-1">
        {filtered.length === 0 && <p className="px-3 py-4 text-center text-xs text-slate-400">No blocks found</p>}
        {filtered.map((opt) => {
          const Icon = opt.icon;
          return (
            <button key={opt.type} onClick={() => addBlock(afterBlockId, opt.type)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface-subtle dark:hover:bg-dark-subtle">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-surface dark:border-dark-border dark:bg-dark"><Icon size={15} className="text-slate-500" /></div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{opt.label}</p>
                <p className="text-xs text-slate-400">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
