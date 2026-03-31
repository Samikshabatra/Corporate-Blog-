'use client';

import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { canEditPost, canDeletePost, canPublishPost, canUnpublishPost, canArchivePost, hasPermission, PERMISSIONS } from '@/lib/permissions';

export function usePostAccess({ postAuthorId = '' }: { postAuthorId?: string } = {}) {
  const { user } = useAuth();
  return useMemo(() => ({
    canView:      hasPermission(user?.role, PERMISSIONS.cms.access),
    canCreate:    hasPermission(user?.role, PERMISSIONS.post.create),
    canEdit:      canEditPost(user?.role, user?.sub, postAuthorId),
    canDelete:    canDeletePost(user?.role, user?.sub, postAuthorId),
    canPublish:   canPublishPost(user?.role),
    canUnpublish: canUnpublishPost(user?.role),
    canArchive:   canArchivePost(user?.role),
    isAdmin:      hasPermission(user?.role, 'ADMIN'),
    isEditor:     hasPermission(user?.role, 'EDITOR'),
    isWriter:     user?.role === 'WRITER',
    userId:       user?.sub,
    userRole:     user?.role,
  }), [user, postAuthorId]);
}
