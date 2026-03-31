import { buildMetadata } from '@/lib/seo.config';
export const metadata = buildMetadata({ title: 'Home', description: 'Insights, strategies, and stories from the world of business and technology.', path: '/' });
export default function HomePage() {
  return (
    <section className="container-blog py-24 text-center">
      <h1 className="font-serif text-5xl font-bold text-slate-900 dark:text-white text-balance">The Corporate Blog</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">Insights, strategies, and stories from the world of business and technology.</p>
      <div className="mt-10 flex justify-center gap-4">
        <a href="/blog" className="btn-primary px-6 py-3 text-base">Read the Blog</a>
        <a href="/auth/register" className="btn-secondary px-6 py-3 text-base">Start Writing</a>
      </div>
    </section>
  );
}
