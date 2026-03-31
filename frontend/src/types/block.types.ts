export type BlockType = 'paragraph' | 'heading' | 'image' | 'quote' | 'code' | 'divider' | 'callout' | 'list' | 'embed' | 'table' | 'faq';

export interface InlineMark { type: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link'; href?: string; }
export interface InlineNode { text: string; marks?: InlineMark[]; }

export interface ParagraphBlock { id: string; type: 'paragraph'; content: InlineNode[]; }
export interface HeadingBlock { id: string; type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; content: InlineNode[]; }
export interface ImageBlock { id: string; type: 'image'; url: string; publicId: string; altText: string; caption?: string; width?: number; height?: number; alignment: 'left' | 'center' | 'right' | 'full'; }
export interface QuoteBlock { id: string; type: 'quote'; content: InlineNode[]; attribution?: string; }
export interface CodeBlock { id: string; type: 'code'; code: string; language: string; filename?: string; showLineNumbers: boolean; }
export interface DividerBlock { id: string; type: 'divider'; }
export interface CalloutBlock { id: string; type: 'callout'; variant: 'info' | 'warning' | 'success' | 'danger'; content: InlineNode[]; icon?: string; }
export interface ListBlock { id: string; type: 'list'; variant: 'ordered' | 'unordered'; items: InlineNode[][]; }
export interface EmbedBlock { id: string; type: 'embed'; url: string; provider: 'youtube' | 'twitter' | 'codepen' | 'figma' | 'generic'; caption?: string; }
export interface TableBlock { id: string; type: 'table'; headers: string[]; rows: string[][]; hasHeader: boolean; }

// FAQ Block — Google rich results ke liye FAQPage schema ready
export interface FAQItem { question: string; answer: string; }
export interface FAQBlock { id: string; type: 'faq'; items: FAQItem[]; }

export type Block = ParagraphBlock | HeadingBlock | ImageBlock | QuoteBlock | CodeBlock | DividerBlock | CalloutBlock | ListBlock | EmbedBlock | TableBlock | FAQBlock;

export interface BlockDocument { version: number; blocks: Block[]; createdAt: string; updatedAt: string; }

export function createEmptyDocument(): BlockDocument {
  return { version: 1, blocks: [createBlock('paragraph')], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

export function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case 'paragraph': return { id, type: 'paragraph', content: [{ text: '' }] };
    case 'heading':   return { id, type: 'heading', level: 2, content: [{ text: '' }] };
    case 'image':     return { id, type: 'image', url: '', publicId: '', altText: '', alignment: 'center' };
    case 'quote':     return { id, type: 'quote', content: [{ text: '' }] };
    case 'code':      return { id, type: 'code', code: '', language: 'typescript', showLineNumbers: true };
    case 'divider':   return { id, type: 'divider' };
    case 'callout':   return { id, type: 'callout', variant: 'info', content: [{ text: '' }] };
    case 'list':      return { id, type: 'list', variant: 'unordered', items: [[{ text: '' }]] };
    case 'embed':     return { id, type: 'embed', url: '', provider: 'youtube' };
    case 'table':     return { id, type: 'table', headers: ['Column 1', 'Column 2'], rows: [['', '']], hasHeader: true };
    case 'faq':       return { id, type: 'faq', items: [{ question: '', answer: '' }] };
  }
}