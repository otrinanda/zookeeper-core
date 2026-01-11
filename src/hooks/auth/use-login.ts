import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.services";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { getDefaultLandingPage } from "@/lib/permissions";

export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (response) => {
      // ============================================================
      // STEP 1: Login berhasil - Dapat TOKEN saja (tanpa user data)
      // ============================================================
      console.log("✅ Login successful, token received");
      
      const token = response?.data.token ; 
      
      if (!token) {
        setErrorMessage("Login berhasil, tapi tidak menerima Token dari server.");
        return;
      }

      // STEP 2: Simpan Token ke Cookie (untuk Axios Interceptor)
      Cookies.set("accessToken", token, { expires: 1 });
      console.log("💾 Token saved to cookie");

      try {
        // ============================================================
        // STEP 3: Ambil User Profile (DATA USER + ROLES dari sini!)
        // ============================================================
        console.log("📡 Fetching user profile from /user/profile...");
        const userProfile = await authService.getProfile();
        
        // DEBUG: Log user profile untuk verifikasi
        console.log("✅ User Profile Retrieved from /user/profile:");
        console.log("📧 Email:", userProfile.email);
        console.log("👤 Name:", userProfile.name);
        console.log("🎭 Main Roles:", userProfile.role_user?.map(r => ({
          code: r.role_code,
          name: r.role_name
        })));
        if (userProfile.sub_role_user && userProfile.sub_role_user.length > 0) {
          console.log("🎭 Sub Roles:", userProfile.sub_role_user?.map(r => ({
            code: r.role_code,
            name: r.role_name
          })));
        }
        console.log("🏢 Unit IDs:", userProfile.unit_ids);
        
        // STEP 4: Save user data to Zustand Store
        login(userProfile, token);
        
        // STEP 5: Get default landing page based on user's first role
        const userRole = userProfile.role_user?.[0]?.role_code || '';
        const landingPage = getDefaultLandingPage(userRole);
        
        console.log("🚀 Redirecting to:", landingPage);
        
        router.push(landingPage);
      } catch (err) {
        console.error("❌ Profile Error:", err);
        console.error("Failed to fetch user profile from /user/profile");
        // Tetap login meski gagal ambil profile, asalkan token ada
        router.push("/animal"); // Default fallback
      }
    },
    onError: (error: unknown) => {
      console.error("Login Error:", error);
      const msg = 
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Email atau password salah."
          : "Email atau password salah.";
      setErrorMessage(msg);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    errorMessage,
  };
};