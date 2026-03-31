import { PostCardSkeleton } from '@/components/blog/PostCard';

export default function AuthorLoading() {
  return (
    <section className="container-blog py-16 animate-pulse">
      <div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-6">
        <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-dark-subtle mb-4 md:mb-0" />
        <div>
          <div className="h-4 w-48 rounded bg-slate-200 dark:bg-dark-subtle mb-2" />
          <div className="h-8 w-64 rounded bg-slate-200 dark:bg-dark-subtle" />
          <div className="mt-2 h-4 w-96 rounded bg-slate-200 dark:bg-dark-subtle" />
          <div className="mt-2 h-3 w-24 rounded bg-slate-200 dark:bg-dark-subtle" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
