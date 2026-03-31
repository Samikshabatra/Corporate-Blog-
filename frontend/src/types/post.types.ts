import { BlockDocument } from './block.types';

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Post {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  status: PostStatus; metaTitle: string | null; metaDesc: string | null; canonicalUrl: string | null;
  ogTitle: string | null; ogDesc: string | null; ogImage: string | null;
  twitterTitle: string | null; twitterDesc: string | null; twitterImage: string | null;
  schemaType: string | null; publishedAt: string | null; readingTimeMin: number | null;
  viewCount: number;
  author: { id: string; name: string; slug: string; avatarUrl: string | null };
  categories: { id: string; name: string; slug: string }[];
  createdAt: string; updatedAt: string;
}

export interface PostWithDocument extends Omit<Post, 'content'> { document: BlockDocument; }

export interface CreatePostPayload {
  title: string; content: string; excerpt?: string; slug?: string; categoryIds?: string[];
  metaTitle?: string; metaDesc?: string; ogTitle?: string; ogDesc?: string; ogImage?: string;
  twitterTitle?: string; twitterDesc?: string; twitterImage?: string; schemaType?: 'Article' | 'BlogPosting';
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {
  status?: PostStatus; publishedAt?: string | null; canonicalUrl?: string;
}

export const CMS_FIELD_MAP = {
  title: 'title', document: 'content', excerpt: 'excerpt', slug: 'slug',
  categories: 'categoryIds', featuredImage: 'ogImage',
  metaTitle: 'metaTitle', metaDesc: 'metaDesc', ogTitle: 'ogTitle', ogDesc: 'ogDesc',
  ogImage: 'ogImage', twitterTitle: 'twitterTitle', twitterDesc: 'twitterDesc',
  twitterImage: 'twitterImage', schemaType: 'schemaType',
} as const;

export type CMSField = keyof typeof CMS_FIELD_MAP;
