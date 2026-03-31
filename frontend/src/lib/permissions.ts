import { Role } from '@/context/AuthContext';

export const PERMISSIONS = {
  post: {
    create: 'WRITER' as Role, editOwn: 'WRITER' as Role, editAny: 'EDITOR' as Role,
    deleteOwn: 'WRITER' as Role, deleteAny: 'ADMIN' as Role,
    publish: 'EDITOR' as Role, unpublish: 'EDITOR' as Role, archive: 'EDITOR' as Role,
    viewDrafts: 'WRITER' as Role, viewAll: 'EDITOR' as Role,
  },
  category: { view: 'WRITER' as Role, create: 'EDITOR' as Role, edit: 'EDITOR' as Role, delete: 'ADMIN' as Role },
  media: { upload: 'WRITER' as Role, deleteOwn: 'WRITER' as Role, deleteAny: 'ADMIN' as Role, viewAll: 'EDITOR' as Role },
  user: { viewList: 'ADMIN' as Role, create: 'ADMIN' as Role, editRole: 'ADMIN' as Role, deactivate: 'ADMIN' as Role },
  cms: { access: 'WRITER' as Role, accessEditor: 'EDITOR' as Role, accessAdmin: 'ADMIN' as Role, viewAuditLog: 'ADMIN' as Role, manageSettings: 'ADMIN' as Role },
} as const;

const HIERARCHY: Record<Role, number> = { ADMIN: 3, EDITOR: 2, WRITER: 1 };

export function hasPermission(userRole: Role | undefined, required: Role): boolean {
  if (!userRole) return false;
  return HIERARCHY[userRole] >= HIERARCHY[required];
}

export function canEditPost(userRole: Role | undefined, userId: string | undefined, postAuthorId: string): boolean {
  if (!userRole || !userId) return false;
  if (hasPermission(userRole, 'EDITOR')) return true;
  return userId === postAuthorId;
}

export function canDeletePost(userRole: Role | undefined, userId: string | undefined, postAuthorId: string): boolean {
  if (!userRole || !userId) return false;
  if (hasPermission(userRole, 'ADMIN')) return true;
  return userId === postAuthorId && hasPermission(userRole, 'WRITER');
}

export function canPublishPost(userRole: Role | undefined): boolean { return hasPermission(userRole, PERMISSIONS.post.publish); }
export function canUnpublishPost(userRole: Role | undefined): boolean { return hasPermission(userRole, PERMISSIONS.post.unpublish); }
export function canArchivePost(userRole: Role | undefined): boolean { return hasPermission(userRole, PERMISSIONS.post.archive); }

type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export function getAllowedTransitions(userRole: Role | undefined, currentStatus: PostStatus): PostStatus[] {
  if (!userRole) return [];
  const isWriter = userRole === 'WRITER';
  const isEditor = hasPermission(userRole, 'EDITOR');
  const transitions: Record<PostStatus, PostStatus[]> = {
    DRAFT: isWriter ? ['DRAFT'] : isEditor ? ['DRAFT', 'PUBLISHED', 'ARCHIVED'] : [],
    PUBLISHED: isEditor ? ['DRAFT', 'PUBLISHED', 'ARCHIVED'] : [],
    ARCHIVED: isEditor ? ['DRAFT', 'PUBLISHED'] : [],
  };
  return transitions[currentStatus] ?? [];
}
