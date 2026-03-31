import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post.types';
import { formatDate, formatReadingTime } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="card group relative">
      {post.ogImage && (
        <div className="relative -mx-6 -mt-6 mb-4 aspect-[16/9] overflow-hidden rounded-t-xl">
          <Image
            src={post.ogImage}
            alt={post.ogTitle || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {post.categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog/category/${cat.slug}`}
            className="badge bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300 relative z-10"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Accessible heading — Link stretch via pseudo element */}
      <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
        <Link
          href={`/blog/${post.slug}`}
          className="after:absolute after:inset-0 after:z-0"
        >
          {post.title}
        </Link>
      </h2>

      {post.excerpt && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
        <Link
          href={`/blog/author/${post.author.slug}`}
          className="relative z-10 flex items-center gap-2 hover:text-slate-600 dark:hover:text-slate-300"
        >
          {post.author.avatarUrl && (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={24}
              height={24}
              sizes="24px"
              className="rounded-full"
              loading="lazy"
            />
          )}
          <span>{post.author.name}</span>
        </Link>
        <span aria-hidden="true">·</span>
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        )}
        {post.readingTimeMin && (
          <>
            <span aria-hidden="true">·</span>
            <span>{formatReadingTime(post.readingTimeMin)}</span>
          </>
        )}
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="-mx-6 -mt-6 mb-4 aspect-[16/9] rounded-t-xl bg-slate-200 dark:bg-dark-subtle" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-dark-subtle" />
        <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-dark-subtle" />
      </div>
      <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-dark-subtle" />
      <div className="mt-2 h-4 w-full rounded bg-slate-200 dark:bg-dark-subtle" />
      <div className="mt-1 h-4 w-2/3 rounded bg-slate-200 dark:bg-dark-subtle" />
      <div className="mt-4 flex items-center gap-3">
        <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-dark-subtle" />
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-dark-subtle" />
        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-dark-subtle" />
      </div>
    </div>
  );
}