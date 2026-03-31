import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post.types';
import { formatDate } from '@/lib/utils';

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-surface-border pt-12 dark:border-dark-border">
      <h2 className="mb-8 font-serif text-2xl font-bold text-slate-900 dark:text-white">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 rounded-lg border border-surface-border p-4 transition-shadow hover:shadow-card-md dark:border-dark-border"
          >
            {post.ogImage && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={post.ogImage}
                  alt={post.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2">
                {post.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span>{post.author.name}</span>
                {post.publishedAt && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </>
                )}
              </div>
              {post.categories.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {post.categories.slice(0, 2).map((cat) => (
                    <span key={cat.id} className="badge bg-brand-50 text-brand-700 text-[10px] dark:bg-brand-950 dark:text-brand-300">
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
