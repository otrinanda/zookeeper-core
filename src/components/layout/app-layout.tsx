"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/sidebar-ui/app-sidebar"; // Import Sidebar Baru
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const disabledSidebarPaths = ["/login", "/signup", "/forgot-password", "/"];
  const isSidebarHidden = disabledSidebarPaths.includes(pathname);

  // Jika halaman Login
  if (isSidebarHidden) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  // Jika halaman Dashboard (Menggunakan New Sidebar Provider)
  return (
    <SidebarProvider>
      {/* 1. Sidebar Komponen */}
      <AppSidebar />
      
      {/* 2. Konten Utama (Inset) */}
      <SidebarInset>
        {/* Header Area */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" /> {/* Tombol Hamburger Bawaan */}
          <div className="h-4 w-px bg-slate-200 mx-2" />
          {/* Anda bisa menaruh Breadcrumb disini */}
          <span className="text-sm font-medium">Dashboard</span>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 bg-slate-50">
           {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}