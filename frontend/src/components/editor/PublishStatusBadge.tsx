'use client';

import { Globe, Lock, Archive, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface PublishStatusBadgeProps {
  status: PostStatus;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  className?: string;
}

export function PublishStatusBadge({
  status,
  scheduledAt,
  publishedAt,
  className,
}: PublishStatusBadgeProps) {
  const isScheduled = status === 'DRAFT' && scheduledAt;
  const wasPreviouslyPublished = status === 'DRAFT' && publishedAt;

  if (isScheduled) {
    return (
      <span className={cn('badge bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 gap-1', className)}>
        <Calendar size={12} />
        Scheduled
      </span>
    );
  }

  if (status === 'PUBLISHED') {
    return (
      <span className={cn('badge bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 gap-1', className)}>
        <Globe size={12} />
        Published
      </span>
    );
  }

  if (status === 'ARCHIVED') {
    return (
      <span className={cn('badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 gap-1', className)}>
        <Archive size={12} />
        Archived
      </span>
    );
  }

  // DRAFT
  return (
    <span className={cn('badge bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 gap-1', className)}>
      {wasPreviouslyPublished ? <Clock size={12} /> : <Lock size={12} />}
      {wasPreviouslyPublished ? 'Draft (was live)' : 'Draft'}
    </span>
  );
}
