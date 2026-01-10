// src/types/auth.ts

export interface Role {
  role_code: string;
  role_name: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role_user: Role[];
}

export interface LoginResponse {
  token: string;
  // Tambahkan field lain jika backend mereturn user info saat login
}