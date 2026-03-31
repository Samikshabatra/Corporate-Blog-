'use client';
import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/lib/permissions';
import { ShieldOff } from 'lucide-react';
import Link from 'next/link';
import type { Role } from '@/context/AuthContext';

export function CMSAccessGate({ children, requiredRole = 'WRITER', action }: { children: React.ReactNode; requiredRole?: Role; action?: string }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user || !hasPermission(user.role, requiredRole)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
          <ShieldOff size={40} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">Access Denied</h2>
          <p className="mt-2 max-w-xs text-sm text-red-500 dark:text-red-400">
            {action ? `You don't have permission to ${action}.` : `You need ${requiredRole} access or higher.`}
          </p>
          <div className="mt-6 flex justify-center gap-3"><Link href="/dashboard" className="btn-secondary text-sm">Back to Dashboard</Link></div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
