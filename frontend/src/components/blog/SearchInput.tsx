'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  initialQuery?: string;
  className?: string;
  variant?: 'default' | 'hero';
}

export function SearchInput({ initialQuery = '', className, variant = 'default' }: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = query.trim();
      if (trimmed.length < 2) return;
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [query, router],
  );

  const handleClear = () => {
    setQuery('');
  };

  const isHero = variant === 'hero';

  return (
    <div className={cn('relative', className)} role="search">
      <div className="relative">
        <Search
          size={isHero ? 20 : 16}
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400',
            isHero && 'left-4',
          )}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Search articles..."
          aria-label="Search articles"
          className={cn(
            'input pl-10 pr-10',
            isHero && 'h-14 rounded-xl pl-12 pr-12 text-base shadow-card-md',
          )}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Clear search"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
