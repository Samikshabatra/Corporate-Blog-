import { PostCardSkeleton } from '@/components/blog/PostCard';

export default function SearchLoading() {
  return (
    <section className="container-blog py-16 animate-pulse">
      <div className="mb-12 text-center">
        <div className="mx-auto h-10 w-32 rounded bg-slate-200 dark:bg-dark-subtle" />
        <div className="mx-auto mt-4 h-6 w-80 rounded bg-slate-200 dark:bg-dark-subtle" />
        <div className="mx-auto mt-8 h-14 max-w-xl rounded-xl bg-slate-200 dark:bg-dark-subtle" />
      </div>
      <div className="mb-8 h-4 w-48 rounded bg-slate-200 dark:bg-dark-subtle" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
