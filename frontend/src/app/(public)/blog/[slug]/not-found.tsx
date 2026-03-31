import Link from 'next/link';

export default function BlogPostNotFound() {
  return (
    <section className="container-content py-24 text-center">
      <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">
        Post Not Found
      </h1>
      <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
        This post may have been unpublished, moved, or doesn&apos;t exist.
      </p>
      <Link href="/blog" className="btn-primary mt-8 inline-flex px-6 py-3 text-base">
        Back to Blog
      </Link>
    </section>
  );
}
