// src/components/shared/can.tsx

"use client";

import { usePermissions } from "@/hooks/use-permissions";

interface CanProps {
  /**
   * Array of role codes that are allowed to see this component
   */
  roles?: string[];

  /**
   * Custom permission check function
   */
  permission?: () => boolean;

  /**
   * Component to render if user doesn't have permission
   */
  fallback?: React.ReactNode;

  /**
   * Children to render if user has permission
   */
  children: React.ReactNode;
}

/**
 * Component untuk conditional rendering berdasarkan role
 * 
 * Usage:
 * ```tsx
 * <Can roles={["admin"]}>
 *   <AdminButton />
 * </Can>
 * 
 * <Can roles={["admin", "staff"]} fallback={<p>No access</p>}>
 *   <EditButton />
 * </Can>
 * 
 * <Can permission={() => user.id === post.authorId}>
 *   <DeleteButton />
 * </Can>
 * ```
 */
export const Can = ({ roles, permission, fallback = null, children }: CanProps) => {
  const { hasRole } = usePermissions();

  // Jika ada custom permission function, gunakan itu
  if (permission) {
    return permission() ? <>{children}</> : <>{fallback}</>;
  }

  // Jika tidak ada roles yang ditentukan, default show
  if (!roles || roles.length === 0) {
    return <>{children}</>;
  }

  // Check apakah user punya role yang diizinkan
  const hasPermission = hasRole(roles);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
