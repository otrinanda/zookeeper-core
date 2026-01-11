import { api } from "@/lib/api-client";
import { LoginResponse, User, ProfileResponse } from "@/types/auth";

// Kita definisikan payload login disini (atau di types terpisah)
interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  /**
   * 1. Login - Mendapatkan TOKEN saja
   * Response hanya berisi token, TIDAK ada data user
   */
  login: async (payload: LoginPayload) => {
    const response = await api.post<LoginResponse>("/login", payload);
    return response.data; // Return: { data: { token: "..." } }
  },

  /**
   * 2. Get Profile - Mendapatkan DATA USER + ROLES
   * Endpoint ini yang mengembalikan user data lengkap
   * Harus dipanggil SETELAH login untuk mendapat role_user
   * 
   * Response structure: 
   * {
   *   data: {
   *     status: 200,
   *     message: "Profile fetched successfully",
   *     data: { name, email, role_user, ... } <- User data di sini
   *   }
   * }
   */
  getProfile: async () => {
    const response = await api.get<ProfileResponse>("/user/profile");
    console.log("🔍 Full API Response:", response.data);
    console.log("👤 User Data:", response.data.data);
    
    // Return nested data (response.data.data)
    return response.data.data;
  },

  /**
   * 3. Logout (Optional, jika backend butuh hit logout)
   */
  logout: async () => {
    return api.post("/logout");
  },
};