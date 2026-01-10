import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.services";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie"; // Import Cookies

export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (response) => {
      // DEBUG: Cek apakah token benar-benar ada di response backend
      console.log("Login Response:", response); 

      // Asumsi response backend bentuknya: 
      // { status: 200, message: "...", data: { token: "...", user: ... } } 
      // ATAU langsung { token: "..." }
      // Sesuaikan baris di bawah ini dengan struktur JSON response Anda:
      
      const token = response?.data.token ; 
      
      if (!token) {
        setErrorMessage("Login berhasil, tapi tidak menerima Token dari server.");
        return;
      }

      // 1. Simpan Token ke Cookie (PENTING untuk Axios Interceptor)
      Cookies.set("accessToken", token, { expires: 1 }); // 1 hari

      try {
        // 2. Coba ambil profile asli (Uncomment ini jika endpoint profile sudah fixed)
        // const userProfile = await authService.getProfile();
        // login(userProfile, token);

        // ATAU: Jika endpoint profile masih error, gunakan dummy user TAPI dengan TOKEN ASLI
        const dummyUser = {
          name: "Admin Dummy Token",
          email: "admindummy@jagatsatwa.id",
          role_user: [{ role_code: "admin", role_name: "Super Admin" }]
        };
        
        // Simpan ke Zustand Store
        login(dummyUser as any, token);
        
        router.push("/dashboard");
      } catch (err) {
        console.error("Profile Error:", err);
        // Tetap login meski gagal ambil profile, asalkan token ada
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
      const msg = error.response?.data?.message || "Email atau password salah.";
      setErrorMessage(msg);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    errorMessage,
  };
};