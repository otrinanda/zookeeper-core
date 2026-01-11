// src/types/auth.ts

/**
 * Role interface - sesuai response API backend
 */
export interface Role {
  id: number;
  role_code: string;
  role_name: string;
  description: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Simplified role for permission checking
 */
export interface SimpleRole {
  role_code: string;
  role_name: string;
}

/**
 * User interface - sesuai response dari GET /user/profile
 * BUKAN dari /login! Login hanya return token.
 */
export interface User {
  id?: string;
  name: string;
  email: string;
  no_identity?: string;
  links?: string[];
  bio?: string;
  photo_profile?: string | null;
  roles?: any | null;
  menus?: any[];
  role_user: Role[];
  sub_role_user?: Role[];
  unit_ids?: number[];
}

/**
 * Login Response - HANYA TOKEN
 * Data user didapat dari endpoint /user/profile setelah login
 */
export interface LoginResponse {
  data: {
    token: string;
  }
  message: string;
  status: number;
}

/**
 * Profile API Response - Nested structure
 * Actual response: { data: { status, message, data: User } }
 */
export interface ProfileResponse {
  status: number;
  message: string;
  data: User;
}