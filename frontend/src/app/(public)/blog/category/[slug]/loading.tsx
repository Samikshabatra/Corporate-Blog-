import { PostCardSkeleton } from '@/components/blog/PostCard';

export default function CategoryLoading() {
  return (
    <section className="container-blog py-16 animate-pulse">
      <div className="mb-12">
        <div className="mb-4 flex gap-2">
          <div className="h-4 w-12 rounded bg-slate-200 dark:bg-dark-subtle" />
          <div className="h-4 w-4 rounded bg-slate-200 dark:bg-dark-subtle" />
          <div className="h-4 w-12 rounded bg-slate-200 dark:bg-dark-subtle" />
          <div className="h-4 w-4 rounded bg-slate-200 dark:bg-dark-subtle" />
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-dark-subtle" />
        </div>
        <div className="h-10 w-64 rounded bg-slate-200 dark:bg-dark-subtle" />
        <div className="mt-3 h-6 w-96 rounded bg-slate-200 dark:bg-dark-subtle" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
