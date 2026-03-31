import Link from 'next/link';
import Image from 'next/image';

interface TrendingPost {
  id: string;
  title: string;
  slug: string;
  ogImage?: string;
  viewCount: number;
  publishedAt: string;
  readingTimeMin?: number;
  author: {
    name: string;
    slug: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
}

async function fetchTrendingPosts(): Promise<TrendingPost[]> {
  try {
    // ISR 15 min — popular posts baar baar nahi badlenge
    // Kyu: Har request pe DB hit avoid karna hai
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/popular`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || data.data || [];
  } catch {
    return [];
  }
}

export async function TrendingPosts() {
  const posts = await fetchTrendingPosts();
  if (!posts.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold font-serif text-slate-900 dark:text-white">
        Trending Now
      </h2>
      <div className="space-y-4">
        {posts.slice(0, 5).map((post, index) => (
          <article key={post.id} className="flex gap-3">
            {/* Rank number */}
            <span className="text-2xl font-bold text-surface-border dark:text-dark-border w-8 shrink-0">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              {post.categories[0] && (
                <Link
                  href={`/blog/category/${post.categories[0].slug}`}
                  className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {post.categories[0].name}
                </Link>
              )}
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {post.viewCount.toLocaleString()} views
                {post.readingTimeMin && ` · ${post.readingTimeMin} min read`}
              </p>
            </div>
            {post.ogImage && (
              <div className="shrink-0">
                <Image
                  src={post.ogImage}
                  alt={post.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-md object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

// Shimmer skeleton
export function TrendingPostsSkeleton() {
  return (
    <section>
      <div className="mb-4 h-6 w-32 animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-8 w-8 animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
              <div className="h-3 w-20 animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
            </div>
            <div className="h-16 w-16 animate-pulse rounded-md bg-surface-subtle dark:bg-dark-subtle shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}