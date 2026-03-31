export default function BlogPostLoading() {
  return (
    <article className="container-content py-16 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex gap-2">
        <div className="h-4 w-12 rounded bg-slate-200 dark:bg-dark-subtle" />
        <div className="h-4 w-4 rounded bg-slate-200 dark:bg-dark-subtle" />
        <div className="h-4 w-12 rounded bg-slate-200 dark:bg-dark-subtle" />
        <div className="h-4 w-4 rounded bg-slate-200 dark:bg-dark-subtle" />
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-dark-subtle" />
      </div>

      {/* Category badges */}
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-dark-subtle" />
      </div>

      {/* Title */}
      <div className="h-12 w-3/4 rounded bg-slate-200 dark:bg-dark-subtle" />
      <div className="mt-2 h-12 w-1/2 rounded bg-slate-200 dark:bg-dark-subtle" />

      {/* Excerpt */}
      <div className="mt-4 h-6 w-full rounded bg-slate-200 dark:bg-dark-subtle" />
      <div className="mt-2 h-6 w-2/3 rounded bg-slate-200 dark:bg-dark-subtle" />

      {/* Author meta */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-dark-subtle" />
        <div>
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-dark-subtle" />
          <div className="mt-1 h-3 w-48 rounded bg-slate-200 dark:bg-dark-subtle" />
        </div>
      </div>

      {/* Featured image */}
      <div className="mt-10 aspect-[16/9] rounded-xl bg-slate-200 dark:bg-dark-subtle" />

      {/* Content lines */}
      <div className="mt-10 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-slate-200 dark:bg-dark-subtle" style={{ width: `${70 + Math.random() * 30}%` }} />
        ))}
      </div>
    </article>
  );
}
