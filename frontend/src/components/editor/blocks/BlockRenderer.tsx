'use client';
import { useState } from 'react';
import { Block } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { cn } from '@/lib/utils';
import { ParagraphBlock } from './ParagraphBlock';
import { HeadingBlock } from './HeadingBlock';
import { ImageBlock } from './ImageBlock';
import { QuoteBlock } from './QuoteBlock';
import { CodeBlock } from './CodeBlock';
import { CalloutBlock } from './CalloutBlock';
import { ListBlock } from './ListBlock';
import { DividerBlock } from './DividerBlock';
import { FAQBlock } from './FAQBlock';
import { BlockToolbar } from './BlockToolbar';
import { BlockInsertMenu } from '../BlockInsertMenu';

function BlockContent({ block, editor }: { block: Block; editor: ReturnType<typeof useEditorWithLogging> }) {
  switch (block.type) {
    case 'faq':       return <FAQRenderer block={block as FAQBlockType} />;
    case 'paragraph': return <ParagraphBlock block={block} editor={editor} />;
    case 'heading':   return <HeadingBlock block={block} editor={editor} />;
    case 'image':     return <ImageBlock block={block} editor={editor} />;
    case 'quote':     return <QuoteBlock block={block} editor={editor} />;
    case 'code':      return <CodeBlock block={block} editor={editor} />;
    case 'callout':   return <CalloutBlock block={block} editor={editor} />;
    case 'list':      return <ListBlock block={block} editor={editor} />;
    case 'divider':   return <DividerBlock />;
    case 'faq':       return <FAQBlock block={block} editor={editor} />;
    default:          return null;
  }
}

export function BlockRenderer({ block, index, editor }: { block: Block; index: number; editor: ReturnType<typeof useEditorWithLogging> }) {
  const [hovered, setHovered] = useState(false);
  const { state, dispatch } = editor;
  const isSelected = state.selection.blockId === block.id;
  const isInsertOpen = state.insertMenu.isOpen && state.insertMenu.afterBlockId === block.id;
  return (
    <div className={cn('group relative rounded-lg transition-colors', (hovered || isSelected) && 'bg-surface-subtle/50 dark:bg-dark-subtle/30')} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {(hovered || isSelected) && <BlockToolbar block={block} index={index} editor={editor} onInsert={() => dispatch({ type: 'OPEN_INSERT_MENU', payload: { afterBlockId: block.id } })} />}
      <div className="px-4 py-1"><BlockContent block={block} editor={editor} /></div>
      {isInsertOpen && <BlockInsertMenu editor={editor} afterBlockId={block.id} />}
    </div>
  );
}