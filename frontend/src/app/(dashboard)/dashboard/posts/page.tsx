import { buildMetadata } from '@/lib/seo.config';
import { PostsList } from '@/components/dashboard/PostsList';
import { CMSAccessGate } from '@/components/editor/CMSAccessGate';
export const metadata = buildMetadata({ title: 'Posts', description: 'Manage your posts', path: '/dashboard/posts', noIndex: true });
export default function PostsPage() {
  return (<CMSAccessGate requiredRole="WRITER" action="manage posts"><PostsList /></CMSAccessGate>);
}
