// ─────────────────────────────────────────────
// Block Content Sanitizer
// Validates and sanitizes block document content
// to prevent XSS and inline script injection.
//
// The ContentRenderer uses React's JSX rendering
// (not dangerouslySetInnerHTML) which inherently
// escapes HTML entities. This module adds an extra
// layer of defense-in-depth validation.
// ─────────────────────────────────────────────

import { Block, BlockDocument, InlineNode, InlineMark } from '@/types/block.types';

// ── Dangerous patterns to strip ──────────────

const DANGEROUS_URL_PROTOCOLS = [
  'javascript:',
  'data:text/html',
  'vbscript:',
  'data:application',
];

const DANGEROUS_CONTENT_PATTERNS = [
  /<script\b/i,
  /on\w+\s*=/i,        // event handlers: onclick=, onerror=, etc.
  /javascript\s*:/i,
  /expression\s*\(/i,   // CSS expression()
  /url\s*\(\s*['"]?\s*javascript/i,
];

// ── URL sanitizer ────────────────────────────

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim().toLowerCase();

  for (const protocol of DANGEROUS_URL_PROTOCOLS) {
    if (trimmed.startsWith(protocol)) return '';
  }

  // Only allow http(s), mailto, tel, and relative URLs
  if (
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('mailto:') &&
    !trimmed.startsWith('tel:') &&
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('#')
  ) {
    // If it doesn't match known safe protocols, prefix with https
    if (trimmed.includes('://')) return '';
  }

  return url;
}

// ── Text content sanitizer ───────────────────

export function sanitizeText(text: string): string {
  if (!text) return '';

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_CONTENT_PATTERNS) {
    if (pattern.test(text)) {
      // Strip the dangerous content
      return text.replace(pattern, '');
    }
  }

  return text;
}

// ── Inline node sanitizer ────────────────────

export function sanitizeInlineNode(node: InlineNode): InlineNode {
  const sanitized: InlineNode = {
    text: sanitizeText(node.text),
  };

  if (node.marks) {
    sanitized.marks = node.marks.map((mark) => sanitizeMark(mark));
  }

  return sanitized;
}

function sanitizeMark(mark: InlineMark): InlineMark {
  const sanitized: InlineMark = { ...mark };

  if (mark.type === 'link' && mark.href) {
    sanitized.href = sanitizeUrl(mark.href);
  }

  return sanitized;
}

// ── Block sanitizer ──────────────────────────

export function sanitizeBlock(block: Block): Block {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
    case 'quote':
    case 'callout':
      return {
        ...block,
        content: block.content.map(sanitizeInlineNode),
      };

    case 'image':
      return {
        ...block,
        url: sanitizeUrl(block.url),
        altText: sanitizeText(block.altText || ''),
        caption: block.caption ? sanitizeText(block.caption) : undefined,
      };

    case 'code':
      // Code blocks: keep content as-is (it's rendered in <code> tags, not executed)
      return block;

    case 'list':
      return {
        ...block,
        items: block.items.map((item) => item.map(sanitizeInlineNode)),
      };

    case 'embed':
      return {
        ...block,
        url: sanitizeUrl(block.url),
        caption: block.caption ? sanitizeText(block.caption) : undefined,
      };

    case 'table':
      return {
        ...block,
        headers: block.headers.map(sanitizeText),
        rows: block.rows.map((row) => row.map(sanitizeText)),
      };

    case 'divider':
      return block;

    default:
      return block;
  }
}

// ── Document sanitizer ───────────────────────

export function sanitizeDocument(doc: BlockDocument): BlockDocument {
  return {
    ...doc,
    blocks: doc.blocks.map(sanitizeBlock),
  };
}

// ── Validation: check if document is safe ────

export function validateDocumentSafety(doc: BlockDocument): { safe: boolean; issues: string[] } {
  const issues: string[] = [];

  for (const block of doc.blocks) {
    if ('content' in block && Array.isArray(block.content)) {
      for (const node of block.content) {
        for (const pattern of DANGEROUS_CONTENT_PATTERNS) {
          if (pattern.test(node.text)) {
            issues.push(`Block ${block.id}: dangerous pattern in text content`);
          }
        }
        if (node.marks) {
          for (const mark of node.marks) {
            if (mark.type === 'link' && mark.href) {
              const lower = mark.href.trim().toLowerCase();
              if (DANGEROUS_URL_PROTOCOLS.some((p) => lower.startsWith(p))) {
                issues.push(`Block ${block.id}: dangerous URL protocol in link`);
              }
            }
          }
        }
      }
    }

    if (block.type === 'image' && block.url) {
      const lower = block.url.trim().toLowerCase();
      if (DANGEROUS_URL_PROTOCOLS.some((p) => lower.startsWith(p))) {
        issues.push(`Block ${block.id}: dangerous URL protocol in image`);
      }
    }
  }

  return { safe: issues.length === 0, issues };
}
