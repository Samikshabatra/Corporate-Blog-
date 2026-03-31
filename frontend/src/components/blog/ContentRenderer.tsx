import Image from 'next/image';
import {
  Block,
  InlineNode,
  InlineMark,
  ParagraphBlock,
  HeadingBlock,
  ImageBlock,
  QuoteBlock,
  CodeBlock,
  DividerBlock,
  CalloutBlock,
  ListBlock,
  TableBlock,
  FAQBlock as FAQBlockType,
  BlockDocument,
} from '@/types/block.types';
import { cn } from '@/lib/utils';

function cloudinaryUrl(url: string, width?: number): string {
  if (!url.includes('res.cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
}

function renderInlineNode(node: InlineNode, index: number): React.ReactNode {
  let element: React.ReactNode = node.text;
  if (!node.marks || node.marks.length === 0) {
    return <span key={index}>{element}</span>;
  }
  for (const mark of node.marks) {
    element = applyMark(element, mark, index);
  }
  return <span key={index}>{element}</span>;
}

function applyMark(content: React.ReactNode, mark: InlineMark, key: number): React.ReactNode {
  switch (mark.type) {
    case 'bold': return <strong key={`b-${key}`}>{content}</strong>;
    case 'italic': return <em key={`i-${key}`}>{content}</em>;
    case 'underline': return <u key={`u-${key}`}>{content}</u>;
    case 'strikethrough': return <s key={`s-${key}`}>{content}</s>;
    case 'code': return <code key={`c-${key}`} className="rounded bg-surface-subtle px-1.5 py-0.5 text-sm font-mono dark:bg-dark-subtle">{content}</code>;
    case 'link': return <a key={`l-${key}`} href={mark.href || '#'} className="text-brand-600 hover:underline dark:text-brand-400" rel="noopener noreferrer">{content}</a>;
    default: return content;
  }
}

function renderInlineNodes(nodes: InlineNode[]): React.ReactNode {
  return nodes.map((node, i) => renderInlineNode(node, i));
}

function ParagraphRenderer({ block }: { block: ParagraphBlock }) {
  const text = block.content.map((n) => n.text).join('');
  if (!text.trim()) return null;
  return <p className="mb-4 leading-relaxed">{renderInlineNodes(block.content)}</p>;
}

function HeadingRenderer({ block }: { block: HeadingBlock }) {
  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
  const classes: Record<number, string> = {
    1: 'text-3xl font-bold font-serif mt-8 mb-4',
    2: 'text-2xl font-bold font-serif mt-8 mb-3',
    3: 'text-xl font-semibold font-serif mt-6 mb-3',
    4: 'text-lg font-semibold mt-4 mb-2',
    5: 'text-base font-semibold mt-4 mb-2',
    6: 'text-sm font-semibold uppercase tracking-wide mt-4 mb-2',
  };
  const id = block.content.map((n) => n.text).join('').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (
    <Tag id={id} className={cn(classes[block.level], 'text-slate-900 dark:text-white scroll-mt-20')}>
      {renderInlineNodes(block.content)}
    </Tag>
  );
}

function ImageRenderer({ block }: { block: ImageBlock }) {
  if (!block.url) return null;
  const alignClass: Record<string, string> = { left: 'mr-auto', center: 'mx-auto', right: 'ml-auto', full: 'w-full' };
  return (
    <figure className={cn('my-6', alignClass[block.alignment] || 'mx-auto')}>
      <Image src={cloudinaryUrl(block.url, block.width || 800)} alt={block.altText || ''} title={block.caption || undefined} width={block.width || 800} height={block.height || 450} sizes="(max-width: 680px) 100vw, 680px" className="rounded-lg" loading="lazy" />
      {block.caption && <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{block.caption}</figcaption>}
    </figure>
  );
}

function QuoteRenderer({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className="my-6 border-l-4 border-brand-500 pl-4 italic text-slate-600 dark:text-slate-300">
      <p>{renderInlineNodes(block.content)}</p>
      {block.attribution && <footer className="mt-2 text-sm text-slate-400 not-italic">— {block.attribution}</footer>}
    </blockquote>
  );
}

function CodeRenderer({ block }: { block: CodeBlock }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg bg-slate-900 dark:bg-dark-muted">
      {block.filename && <div className="border-b border-slate-700 px-4 py-2 text-xs text-slate-400 font-mono">{block.filename}</div>}
      <pre className="overflow-x-auto p-4">
        <code className={cn('text-sm font-mono text-slate-100', block.showLineNumbers && 'leading-relaxed')}>
          {block.showLineNumbers
            ? block.code.split('\n').map((line, i) => (
                <span key={i} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-slate-500 w-8">{i + 1}</span>
                  <span className="table-cell">{line}</span>
                  {'\n'}
                </span>
              ))
            : block.code}
        </code>
      </pre>
    </div>
  );
}

function DividerRenderer({ block: _block }: { block: DividerBlock }) {
  return <hr className="my-8 border-surface-border dark:border-dark-border" />;
}

function CalloutRenderer({ block }: { block: CalloutBlock }) {
  const variants: Record<string, { bg: string; border: string; icon: string }> = {
    info:    { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-300 dark:border-blue-700', icon: 'ℹ️' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-700', icon: '⚠️' },
    success: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-300 dark:border-green-700', icon: '✅' },
    danger:  { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-300 dark:border-red-700', icon: '🚨' },
  };
  const v = variants[block.variant] || variants.info;
  return (
    <div className={cn('my-6 rounded-lg border p-4', v.bg, v.border)}>
      <div className="flex gap-3">
        <span className="text-lg" role="img" aria-hidden="true">{block.icon || v.icon}</span>
        <div className="flex-1">{renderInlineNodes(block.content)}</div>
      </div>
    </div>
  );
}

function ListRenderer({ block }: { block: ListBlock }) {
  const Tag = block.variant === 'ordered' ? 'ol' : 'ul';
  const listClass = block.variant === 'ordered' ? 'list-decimal pl-6 my-4 space-y-1' : 'list-disc pl-6 my-4 space-y-1';
  return (
    <Tag className={listClass}>
      {block.items.map((item, i) => (
        <li key={i} className="leading-relaxed">{renderInlineNodes(item)}</li>
      ))}
    </Tag>
  );
}

function TableRenderer({ block }: { block: TableBlock }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-surface-border dark:divide-dark-border">
        {block.hasHeader && block.headers.length > 0 && (
          <thead className="bg-surface-subtle dark:bg-dark-subtle">
            <tr>
              {block.headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-surface-border dark:divide-dark-border">
          {block.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FAQ Renderer — Google FAQPage schema ke liye
function FAQRenderer({ block }: { block: FAQBlockType }) {
  return (
    <div className="my-6">
      <dl className="space-y-4">
        {block.items.map((item, i) => (
          <div key={i} className="rounded-lg border border-surface-border p-4 dark:border-dark-border">
            <dt className="font-semibold text-slate-900 dark:text-white">{item.question}</dt>
            <dd className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ── Main block renderer ──────────────────────

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || null;
}

function EmbedRenderer({ block }: { block: import('@/types/block.types').EmbedBlock }) {
  if (!block.url) return null;

  if (block.provider === 'youtube' || block.url.includes('youtube.com') || block.url.includes('youtu.be')) {
    const videoId = getYouTubeId(block.url);
    if (!videoId) return null;
    return (
      <figure className="my-6">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={block.caption || 'YouTube video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" loading="lazy" />
        </div>
        {block.caption && <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{block.caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className="my-6">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-surface-border dark:border-dark-border">
        <iframe src={block.url} title={block.caption || 'Embedded content'} className="absolute inset-0 h-full w-full" loading="lazy" sandbox="allow-scripts allow-same-origin" />
      </div>
      {block.caption && <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{block.caption}</figcaption>}
    </figure>
  );
}

  switch (block.type) {
    case 'paragraph': return <ParagraphRenderer block={block} />;
    case 'heading':   return <HeadingRenderer block={block} />;
    case 'image':     return <ImageRenderer block={block} />;
    case 'quote':     return <QuoteRenderer block={block} />;
    case 'code':      return <CodeRenderer block={block} />;
    case 'divider':   return <DividerRenderer block={block} />;
    case 'callout':   return <CalloutRenderer block={block} />;
    case 'list':      return <ListRenderer block={block} />;
    case 'table':     return <TableRenderer block={block} />;
    case 'faq':       return <FAQRenderer block={block} />;
    case 'embed':     return <EmbedRenderer block={block} />;
    default:          return null;
  }
}

// ── Document renderer ────────────────────────

interface DocumentRendererProps {
  document: BlockDocument;
  className?: string;
}

export function DocumentRenderer({ document, className }: DocumentRendererProps) {
  return (
    <div className={cn('prose-blog', className)}>
      {document.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

// ── Table of Contents ────────────────────────

export interface TocItem { id: string; text: string; level: 2 | 3; }

export function generateTableOfContents(document: BlockDocument): TocItem[] {
  return document.blocks
    .filter((b): b is HeadingBlock => b.type === 'heading' && (b.level === 2 || b.level === 3))
    .map((block) => {
      const text = block.content.map((n) => n.text).join('');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return { id, text, level: block.level as 2 | 3 };
    });
}

interface TableOfContentsProps { items: TocItem[]; className?: string; }

export function TableOfContents({ items, className }: TableOfContentsProps) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="Table of Contents" className={cn('my-8 rounded-lg border border-surface-border bg-surface-muted p-6 dark:border-dark-border dark:bg-dark-muted', className)}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Table of Contents</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && 'ml-4')}>
            <a href={`#${item.id}`} className="text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}