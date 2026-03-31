'use client';

import { useAuth, Role } from '@/context/AuthContext';

interface RoleGuardProps { children: React.ReactNode; role: Role; fallback?: React.ReactNode; }

export function RoleGuard({ children, role, fallback = null }: RoleGuardProps) {
  const { hasRole } = useAuth();
  return hasRole(role) ? <>{children}</> : <>{fallback}</>;
}

export function AdminOnly({ children, fallback }: Omit<RoleGuardProps, 'role'>) {
  return <RoleGuard role="ADMIN" fallback={fallback}>{children}</RoleGuard>;
}

export function EditorOnly({ children, fallback }: Omit<RoleGuardProps, 'role'>) {
  return <RoleGuard role="EDITOR" fallback={fallback}>{children}</RoleGuard>;
}

export function WriterOnly({ children, fallback }: Omit<RoleGuardProps, 'role'>) {
  return <RoleGuard role="WRITER" fallback={fallback}>{children}</RoleGuard>;
}
