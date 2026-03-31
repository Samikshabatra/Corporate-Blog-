import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  function pageUrl(page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  }

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link href={pageUrl(currentPage - 1)} className="btn-secondary text-sm px-3 py-1.5">
          ← Previous
        </Link>
      )}

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-slate-400">…</span>
        ) : (
          <Link
            key={p}
            href={pageUrl(p)}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              p === currentPage
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 hover:bg-surface-subtle dark:text-slate-400 dark:hover:bg-dark-subtle',
            )}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link href={pageUrl(currentPage + 1)} className="btn-secondary text-sm px-3 py-1.5">
          Next →
        </Link>
      )}
    </nav>
  );
}
