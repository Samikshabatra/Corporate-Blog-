import { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/api';
import { buildMetadata, SEO_CONFIG } from '@/lib/seo.config';
import { PostCard } from '@/components/blog/PostCard';
import { Pagination } from '@/components/blog/Pagination';
import { BreadcrumbJsonLd, WebSiteJsonLd } from '@/components/blog/JsonLd';
import { Post } from '@/types/post.types';

export const revalidate = 900; // ISR 15 min

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description: 'Latest articles on business, technology, and corporate strategy.',
  path: '/blog',
});

interface BlogHomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogHomePage({ searchParams }: BlogHomeProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const data = (await getPublishedPosts(page, 12)) || {
  posts: [],
  page: 1,
  totalPages: 1,
};

  // Keep typings strict
  const posts = data?.posts ?? [];

  const breadcrumbs = [
    { name: 'Home', url: SEO_CONFIG.siteUrl },
    { name: 'Blog', url: `${SEO_CONFIG.siteUrl}/blog` },
  ];

  return (
    <>
      <WebSiteJsonLd />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <section className="container-blog py-16">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-white text-balance">
            Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Insights, strategies, and stories from the world of business and technology.
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination
              currentPage={data?.page || 1}
              totalPages={data?.totalPages || 1}
              basePath="/blog"
            />
          </>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No articles published yet. Check back soon!
          </p>
        )}
      </section>
    </>
  );
}