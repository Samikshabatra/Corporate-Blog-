import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function formatReadingTime(minutes: number): string { return `${minutes} min read`; }

export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${base}${path}`;
}

export function countWordsInDocument(document: import('@/types/block.types').BlockDocument): number {
  let words = 0;
  for (const block of document.blocks) {
    if ('content' in block && Array.isArray(block.content)) {
      const text = block.content.map((n: { text: string }) => n.text).join(' ');
      words += text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (block.type === 'code') { words += block.code.trim().split(/\s+/).filter(Boolean).length; }
    if (block.type === 'list') {
      for (const item of block.items) {
        const text = item.map((n: { text: string }) => n.text).join(' ');
        words += text.trim().split(/\s+/).filter(Boolean).length;
      }
    }
    if (block.type === 'faq') {
      for (const faq of block.items) {
        words += faq.question.trim().split(/\s+/).filter(Boolean).length;
        words += faq.answer.trim().split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return words;
}

export function calculateReadingTimeFromWords(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 225));
}
