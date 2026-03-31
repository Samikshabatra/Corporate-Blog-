import { buildMetadata } from '@/lib/seo.config';
import { PostEditor } from '@/components/editor/PostEditor';
export const metadata = buildMetadata({ title: 'New Post', description: 'Create a new post', path: '/dashboard/posts/new', noIndex: true });
export default function NewPostPage() { return <PostEditor />; }
