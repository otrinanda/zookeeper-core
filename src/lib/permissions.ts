// src/lib/permissions.ts

import { User } from "@/types/auth";

/**
 * Helper function untuk check apakah user memiliki role tertentu
 * @param user - User object dari auth store
 * @param allowedRoles - Array role codes yang diizinkan
 * @returns boolean
 */
export const hasRole = (user: User | null, allowedRoles: string[]): boolean => {
  if (!user || !user.role_user || user.role_user.length === 0) {
    return false;
  }

  return user.role_user.some((role) =>
    allowedRoles.includes(role.role_code.toLowerCase())
  );
};

/**
 * Helper function untuk check apakah user memiliki salah satu dari role
 * @param user - User object dari auth store
 * @param allowedRoles - Array role codes yang diizinkan
 * @returns boolean
 */
export const hasAnyRole = (
  user: User | null,
  allowedRoles: string[]
): boolean => {
  return hasRole(user, allowedRoles);
};

/**
 * Helper function untuk check apakah user memiliki semua role yang dibutuhkan
 * @param user - User object dari auth store
 * @param requiredRoles - Array role codes yang harus dimiliki semua
 * @returns boolean
 */
export const hasAllRoles = (
  user: User | null,
  requiredRoles: string[]
): boolean => {
  if (!user || !user.role_user || user.role_user.length === 0) {
    return false;
  }

  const userRoleCodes = user.role_user.map((role) =>
    role.role_code.toLowerCase()
  );

  return requiredRoles.every((requiredRole) =>
    userRoleCodes.includes(requiredRole.toLowerCase())
  );
};

/**
 * Get user's role codes
 * @param user - User object dari auth store
 * @returns Array of role codes
 */
export const getUserRoles = (user: User | null): string[] => {
  if (!user || !user.role_user) {
    return [];
  }

  // Combine role_user and sub_role_user
  const mainRoles = user.role_user.map((role) => role.role_code.toLowerCase());
  const subRoles = user.sub_role_user 
    ? user.sub_role_user.map((role) => role.role_code.toLowerCase())
    : [];

  // Return unique roles
  return [...new Set([...mainRoles, ...subRoles])];
};

/**
 * Check apakah user adalah admin/executive level
 * @param user - User object dari auth store
 * @returns boolean
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, [
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.DIRECTOR_OPS,
  ]);
};

/**
 * Check apakah user adalah management level
 */
export const isManagement = (user: User | null): boolean => {
  return hasRole(user, [
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.MANAGER,
    ROLE_CODES.KURATOR,
    ROLE_CODES.HEAD_KEEPER,
  ]);
};

/**
 * Check apakah user punya full access (18 halaman)
 */
export const hasFullAccess = (user: User | null): boolean => {
  return hasRole(user, [
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.MANAGER,
    ROLE_CODES.VIEW,
  ]);
};

/**
 * Definisi role codes yang ada di sistem
 * Sesuai dengan struktur organisasi kebun binatang
 */
export const ROLE_CODES = {
  // Executive Level - Full Access
  SUPER_ADMIN: "super-admin",
  DIRECTOR_UTAMA: "director-utama",
  DIRECTOR_OPS: "director-ops",
  
  // Management Level
  MANAGER: "manager",
  KURATOR: "kurator",
  HEAD_KEEPER: "head-keeper",
  
  // Operational Level
  KEEPER: "keeper",                     // Limited: feed & task only
  KESEHATAN: "kesehatan",               // Health team
  ANIMAL_REGISTER: "animal-register",   // Animal registration
  STORE_MASTER: "store-master",         // Limited: stock only
  
  // View Only
  VIEW: "view",                         // Read-only access
} as const;

/**
 * Type untuk role codes
 */
export type RoleCode = (typeof ROLE_CODES)[keyof typeof ROLE_CODES];

/**
 * Get default landing page based on role
 */
export const getDefaultLandingPage = (roleCode: string): string => {
  const normalizedRole = roleCode.toLowerCase();
  
  switch (normalizedRole) {
    case ROLE_CODES.KEEPER:
      return "/feed"; // Keeper starts at feed page
    case ROLE_CODES.STORE_MASTER:
      return "/stock"; // Store master starts at stock page
    default:
      return "/animal"; // Default for all other roles
  }
};
