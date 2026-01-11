// src/hooks/use-permissions.ts

import { useAuthStore } from "@/store/use-auth-store";
import { hasRole, hasAnyRole, hasAllRoles, isAdmin, getUserRoles } from "@/lib/permissions";
import { canAccessMenu } from "@/config/menu-permissions";

/**
 * Custom hook untuk permission checking
 * Provides convenient methods to check user permissions
 */
export const usePermissions = () => {
  const { user } = useAuthStore();

  return {
    /**
     * Check if user has specific role(s)
     */
    hasRole: (allowedRoles: string[]) => hasRole(user, allowedRoles),

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole: (allowedRoles: string[]) => hasAnyRole(user, allowedRoles),

    /**
     * Check if user has all of the specified roles
     */
    hasAllRoles: (requiredRoles: string[]) => hasAllRoles(user, requiredRoles),

    /**
     * Check if user is admin
     */
    isAdmin: () => isAdmin(user),

    /**
     * Get user's role codes
     */
    getUserRoles: () => getUserRoles(user),

    /**
     * Check if user can access a specific menu
     */
    canAccessMenu: (url: string) => {
      const userRoles = getUserRoles(user);
      return canAccessMenu(url, userRoles);
    },

    /**
     * Get the current user
     */
    user,
  };
};
