import { Block, BlockDocument } from '@/types/block.types';

export interface BlockError { blockId: string; field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: BlockError[]; warnings: BlockError[]; }

export function validateBlock(block: Block): { errors: BlockError[]; warnings: BlockError[] } {
  const errors: BlockError[] = [];
  const warnings: BlockError[] = [];
  switch (block.type) {
    case 'paragraph': {
      const text = block.content.map((n) => n.text).join('').trim();
      if (!text) warnings.push({ blockId: block.id, field: 'content', message: 'Empty paragraph' });
      break;
    }
    case 'heading': {
      const text = block.content.map((n) => n.text).join('').trim();
      if (!text) errors.push({ blockId: block.id, field: 'content', message: 'Heading cannot be empty' });
      break;
    }
    case 'image': {
      if (!block.url) errors.push({ blockId: block.id, field: 'url', message: 'Image URL is required' });
      if (!block.altText) warnings.push({ blockId: block.id, field: 'altText', message: 'Alt text missing — bad for SEO & accessibility' });
      break;
    }
    case 'quote': {
      const text = block.content.map((n) => n.text).join('').trim();
      if (!text) errors.push({ blockId: block.id, field: 'content', message: 'Quote cannot be empty' });
      break;
    }
    case 'code': {
      if (!block.code.trim()) errors.push({ blockId: block.id, field: 'code', message: 'Code block is empty' });
      break;
    }
    case 'callout': {
      const text = block.content.map((n) => n.text).join('').trim();
      if (!text) errors.push({ blockId: block.id, field: 'content', message: 'Callout cannot be empty' });
      break;
    }
    case 'list': {
      const empty = block.items.filter((i) => !i.map((n) => n.text).join('').trim());
      if (empty.length > 0) warnings.push({ blockId: block.id, field: 'items', message: `${empty.length} empty list item(s)` });
      break;
    }
    case 'embed': {
      if (!block.url) errors.push({ blockId: block.id, field: 'url', message: 'Embed URL is required' });
      break;
    }
  }
  return { errors, warnings };
}

export function validateDocument(doc: BlockDocument, title: string): ValidationResult {
  const errors: BlockError[] = [];
  const warnings: BlockError[] = [];
  if (!title.trim()) errors.push({ blockId: 'title', field: 'title', message: 'Title is required' });
  else if (title.length > 110) warnings.push({ blockId: 'title', field: 'title', message: 'Title is very long (> 110 chars)' });
  for (const block of doc.blocks) {
    const result = validateBlock(block);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }
  const hasContent = doc.blocks.some((b) => {
    if (b.type === 'paragraph') return b.content.some((n) => n.text.trim());
    if (b.type === 'heading') return b.content.some((n) => n.text.trim());
    return b.type !== 'divider';
  });
  if (!hasContent) errors.push({ blockId: 'document', field: 'blocks', message: 'Post has no content' });
  return { valid: errors.length === 0, errors, warnings };
}
