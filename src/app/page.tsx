"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconLoader2 } from "@tabler/icons-react";

export default function RootPage() {
  const router = useRouter();
  const authState = useAuthStore();

  useEffect(() => {
    // Jika punya token, lempar ke dashboard
    if (authState.isAuthenticated) {
      router.replace("/dashboard");
    } else {
      // Jika tidak, lempar ke login
      router.replace("/login");
    }
  }, [authState.isAuthenticated, router]);

  // Tampilkan loader sementara menunggu redirect
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <IconLoader2 className="animate-spin text-primary" />
    </div>
  );
}
