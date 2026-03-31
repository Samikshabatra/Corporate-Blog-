import { buildMetadata } from '@/lib/seo.config';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
export const metadata = buildMetadata({ title: 'Dashboard', description: 'Your content dashboard', path: '/dashboard', noIndex: true });
export default function DashboardPage() { return <DashboardOverview />; }
