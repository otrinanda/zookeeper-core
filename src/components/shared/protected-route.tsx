// src/components/shared/protected-route.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Component untuk protect route berdasarkan role
 * Akan redirect ke halaman lain jika user tidak punya permission
 */
export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
  fallback = null,
}: ProtectedRouteProps) => {
  const router = useRouter();
  const { hasRole } = usePermissions();

  const hasPermission = hasRole(allowedRoles);

  useEffect(() => {
    if (!hasPermission) {
      router.push(redirectTo);
    }
  }, [hasPermission, router, redirectTo]);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
