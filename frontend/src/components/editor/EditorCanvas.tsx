'use client';

import { useRef, useMemo } from 'react';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { TitleField } from './fields/TitleField';
import { BlockRenderer } from './blocks/BlockRenderer';
import { BlockInsertMenu } from './BlockInsertMenu';
import { Plus } from 'lucide-react';
import { Block } from '@/types/block.types';

// Word count calculate karo blocks se
// Kyu: Plain text nikaalna padega blocks ki JSON se
function calculateWordCount(blocks: Block[]): number {
  return blocks.reduce((count, block) => {
    if ('content' in block && Array.isArray(block.content)) {
      const text = block.content.map((n: any) => n.text || '').join(' ');
      const words = text.trim().split(/\s+/).filter(Boolean);
      return count + words.length;
    }
    if ('items' in block && Array.isArray(block.items)) {
      const text = block.items.flat().map((n: any) => n.text || '').join(' ');
      const words = text.trim().split(/\s+/).filter(Boolean);
      return count + words.length;
    }
    return count;
  }, 0);
}

export function EditorCanvas({ editor }: { editor: ReturnType<typeof useEditorWithLogging> }) {
  const { state, dispatch, addBlock } = editor;
  const { document, insertMenu } = state;
  const canvasRef = useRef<HTMLDivElement>(null);

  // Live word count — memoized for performance
  const wordCount = useMemo(
    () => calculateWordCount(document.blocks),
    [document.blocks]
  );

  // Reading time — average 200 words per minute
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div ref={canvasRef} className="mx-auto w-full max-w-2xl px-6 py-12 xl:px-0">
      <TitleField editor={editor} />
      <div className="mt-8 space-y-1">
        {document.blocks.map((block, index) => (
          <BlockRenderer key={block.id} block={block} index={index} editor={editor} />
        ))}
      </div>
      <div className="relative mt-4">
        <button
          onClick={() => dispatch({ type: 'OPEN_INSERT_MENU', payload: { afterBlockId: document.blocks.at(-1)?.id ?? null } })}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <Plus size={16} /> Add block
        </button>
        {insertMenu.isOpen && insertMenu.afterBlockId === document.blocks.at(-1)?.id && (
          <BlockInsertMenu editor={editor} afterBlockId={insertMenu.afterBlockId} />
        )}
      </div>

      {/* Word count + Reading time */}
      <div className="mt-8 flex items-center gap-4 border-t border-surface-border pt-4 dark:border-dark-border">
        <span className="text-xs text-slate-400">
          {wordCount.toLocaleString()} words
        </span>
        <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
        <span className="text-xs text-slate-400">
          {readingTime} min read
        </span>
      </div>
    </div>
  );
}