import { api } from "@/lib/api-client";
import { LoginResponse, User } from "@/types/auth";

// Kita definisikan payload login disini (atau di types terpisah)
interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  // 1. Fungsi Login
  login: async (payload: LoginPayload) => {
    // api.post otomatis inject baseURL
    const response = await api.post<LoginResponse>("/login", payload);
    return response.data; // Mengembalikan { token, ... }
  },

  // 2. Fungsi Get Profile
  getProfile: async () => {
    const response = await api.get<User>("/user/profile");
    return response.data; // Mengembalikan object User
  },

  // 3. Fungsi Logout (Optional, jika backend butuh hit logout)
  logout: async () => {
    return api.post("/logout");
  },
};