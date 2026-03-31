import { Metadata } from 'next';
import { searchPosts } from '@/lib/api';
import { SEO_CONFIG } from '@/lib/seo.config';
import { PostCard, PostCardSkeleton } from '@/components/blog/PostCard';
import { Pagination } from '@/components/blog/Pagination';
import { SearchInput } from '@/components/blog/SearchInput';
import { BreadcrumbJsonLd } from '@/components/blog/JsonLd';
import { Search } from 'lucide-react';

// ── Search pages are noindex ─────────────────
export const metadata: Metadata = {
  title: `Search | ${SEO_CONFIG.siteName}`,
  description: 'Search articles on The Corporate Blog',
  robots: { index: false, follow: false },
};

// Force dynamic rendering — never SSG
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const page = parseInt(params.page || '1', 10);

  const results = query.length >= 2 ? await searchPosts(query, page, 12) : null;

  const breadcrumbs = [
    { name: 'Home', url: SEO_CONFIG.siteUrl },
    { name: 'Search', url: `${SEO_CONFIG.siteUrl}/search` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <section className="container-blog py-16">
        {/* ── Search header ───────────────────── */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">
            Search
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Find articles across all categories and topics.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchInput initialQuery={query} variant="hero" />
          </div>
        </div>

        {/* ── Results ─────────────────────────── */}
        {query && results ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {results.total > 0 ? (
                  <>
                    Found <span className="font-medium text-slate-700 dark:text-slate-200">{results.total}</span> result{results.total !== 1 ? 's' : ''} for{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-200">&ldquo;{results.query}&rdquo;</span>
                  </>
                ) : (
                  <>No results found for &ldquo;{results.query}&rdquo;</>
                )}
              </p>
              {results.durationMs > 0 && (
                <span className="text-xs text-slate-400">
                  {results.durationMs}ms
                </span>
              )}
            </div>

            {results.posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {results.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
                <Pagination
                  currentPage={results.page}
                  totalPages={results.totalPages}
                  basePath={`/search?q=${encodeURIComponent(query)}`}
                />
              </>
            ) : (
              <div className="text-center py-16">
                <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-lg text-slate-500 dark:text-slate-400">
                  No articles match your search. Try different keywords.
                </p>
              </div>
            )}
          </>
        ) : query && query.length < 2 ? (
          <p className="text-center text-slate-500 dark:text-slate-400">
            Enter at least 2 characters to search.
          </p>
        ) : !query ? (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Start typing to search articles.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
