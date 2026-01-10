import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/auth";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Action saat Login Sukses
      login: (userData, token) => {
        // Simpan token ke Cookie (agar aman & bisa dibaca middleware)
        Cookies.set("accessToken", token, { expires: 1 }); // 1 hari
        
        // Simpan data user ke State (dan otomatis ke localStorage via persist)
        set({ user: userData, isAuthenticated: true });
      },

      // Action saat Logout
      logout: () => {
        Cookies.remove("accessToken");
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "zookeeper-auth-storage", // Nama key di LocalStorage
      storage: createJSONStorage(() => localStorage), // Driver penyimpanan
    }
  )
);