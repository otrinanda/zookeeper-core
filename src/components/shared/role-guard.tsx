// src/components/shared/role-guard.tsx

"use client";

import { usePermissions } from "@/hooks/use-permissions";

interface RoleGuardProps {
  /**
   * Array of role codes that are allowed
   */
  allowedRoles: string[];

  /**
   * Component to render when user has permission
   */
  children: React.ReactNode;

  /**
   * Component to render when user doesn't have permission
   */
  fallback?: React.ReactNode;

  /**
   * Show nothing if user doesn't have permission (default behavior)
   */
  hideOnDenied?: boolean;
}

/**
 * Component wrapper untuk role-based access control
 * Mirip dengan <Can> tapi dengan nama yang lebih explicit
 * 
 * Usage:
 * ```tsx
 * <RoleGuard allowedRoles={["admin", "manager"]}>
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * <RoleGuard 
 *   allowedRoles={["admin"]} 
 *   fallback={<AccessDenied />}
 * >
 *   <DeleteButton />
 * </RoleGuard>
 * ```
 */
export const RoleGuard = ({
  allowedRoles,
  children,
  fallback = null,
  hideOnDenied = true,
}: RoleGuardProps) => {
  const { hasRole } = usePermissions();

  const hasPermission = hasRole(allowedRoles);

  if (!hasPermission) {
    return hideOnDenied ? null : <>{fallback}</>;
  }

  return <>{children}</>;
};
