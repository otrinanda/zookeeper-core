// src/config/menu-permissions.ts

import { ROLE_CODES, RoleCode } from "@/lib/permissions";

/**
 * Definisi permission untuk setiap menu item
 * Jika allowedRoles kosong atau undefined, maka semua role bisa akses
 */
export interface MenuPermission {
  url: string;
  allowedRoles?: RoleCode[];
}

/**
 * Mapping menu URL dengan role yang diizinkan
 * Berdasarkan struktur organisasi kebun binatang
 */
export const MENU_PERMISSIONS: Record<string, RoleCode[]> = {
  // ==================== DASHBOARD ====================
  "/dashboard": [
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.MANAGER,
    ROLE_CODES.KURATOR,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.STORE_MASTER,
    ROLE_CODES.VIEW,
  ],

  // ==================== MODUL SATWA (Animal Management) ====================
  "/animal": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/mutation": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/sick": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/dead": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],

  // ==================== MODUL KANDANG (Cage Management) ====================
  "/cage": [
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],

  // ==================== MODUL PAKAN (Feed Management) ====================
  "/feed": [
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KEEPER, // ⭐ Keeper has access
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],

  // ==================== MODUL TUGAS (Task Management) ====================
  "/task": [
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KEEPER, // ⭐ Keeper has access
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],

  // ==================== MODUL INVENTARIS (Inventory) ====================
  "/stock": [
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.MANAGER,
    ROLE_CODES.STORE_MASTER, // ⭐ Store master has access
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],

  // ==================== MASTER DATA ====================
  "/unit-area": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/zone-area": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/family": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/feed-category": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/cage-model": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/cage-type": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/feed-type": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/mix-feed": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/species": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
  
  "/unit": [
    ROLE_CODES.ANIMAL_REGISTER,
    ROLE_CODES.DIRECTOR_OPS,
    ROLE_CODES.DIRECTOR_UTAMA,
    ROLE_CODES.HEAD_KEEPER,
    ROLE_CODES.KESEHATAN,
    ROLE_CODES.KURATOR,
    ROLE_CODES.MANAGER,
    ROLE_CODES.SUPER_ADMIN,
    ROLE_CODES.VIEW,
  ],
};

/**
 * Helper function untuk check apakah user bisa akses menu tertentu
 * @param url - URL menu
 * @param userRoles - Array role codes user
 * @returns boolean
 */
export const canAccessMenu = (url: string, userRoles: string[]): boolean => {
  // Jika menu tidak ada di config, default allow
  const allowedRoles = MENU_PERMISSIONS[url];

  // Jika allowedRoles tidak didefinisikan atau kosong, semua bisa akses
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Check apakah user punya salah satu role yang diizinkan
  return allowedRoles.some((role) =>
    userRoles.includes(role.toLowerCase())
  );
};
