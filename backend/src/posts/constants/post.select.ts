export const POST_SELECT = {
  id: true, title: true, slug: true, excerpt: true, content: true,
  status: true, metaTitle: true, metaDesc: true, canonicalUrl: true,
  ogTitle: true, ogDesc: true, ogImage: true,
  twitterTitle: true, twitterDesc: true, twitterImage: true,
  schemaType: true, publishedAt: true, scheduledAt: true,
  readingTimeMin: true, viewCount: true, createdAt: true, updatedAt: true,
  author: { select: { id: true, name: true, slug: true, avatarUrl: true, bio: true } },
  postCategories: { select: { category: { select: { id: true, name: true, slug: true } } } },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatPost(raw: any) {
  return {
    ...raw,
    categories: raw.postCategories?.map(
      (pc: { category: { id: string; name: string; slug: string } }) => pc.category,
    ) || [],
  };
}
