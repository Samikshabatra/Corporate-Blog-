import Link from 'next/link';
import Image from 'next/image';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  ogImage?: string;
  author: {
    name: string;
    slug: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
  score?: number;
}

interface RelatedArticlesProps {
  postId: string;
  className?: string;
}

async function fetchRelatedArticles(postId: string): Promise<RelatedPost[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/internal-suggestions`,
      {
        next: { revalidate: 900 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || data.data || [];
  } catch {
    return [];
  }
}

export async function RelatedArticles({ postId, className }: RelatedArticlesProps) {
  const posts = await fetchRelatedArticles(postId);
  if (!posts.length) return null;

  return (
    <section className={className}>
      <h2 className="mb-6 text-xl font-bold font-serif text-slate-900 dark:text-white">
        Related Articles
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <article
            key={post.id}
            className="group rounded-lg border border-surface-border bg-white p-4 transition-shadow hover:shadow-card-md dark:border-dark-border dark:bg-dark-muted"
          >
            {post.ogImage && (
              <div className="mb-3 overflow-hidden rounded-md">
                <Image
                  src={post.ogImage}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="h-36 w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1 mb-2">
              {post.categories.slice(0, 2).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog/category/${cat.slug}`}
                  className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <h3 className="mb-1 text-sm font-semibold leading-snug text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
              <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                {post.title}
              </Link>
            </h3>
            {post.excerpt && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              By {post.author.name}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

// Shimmer placeholder
export function RelatedArticlesSkeleton() {
  return (
    <section>
      <div className="mb-6 h-7 w-40 animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-surface-border bg-white p-4 dark:border-dark-border dark:bg-dark-muted"
          >
            <div className="mb-3 h-36 animate-pulse rounded-md bg-surface-subtle dark:bg-dark-subtle" />
            <div className="mb-2 h-3 w-16 animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
            <div className="h-4 w-full animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
            <div className="mt-1 h-3 w-3/4 animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-surface-subtle dark:bg-dark-subtle" />
          </div>
        ))}
      </div>
    </section>
  );
}