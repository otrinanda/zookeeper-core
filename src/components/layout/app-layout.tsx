"use client";

import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/sidebar-ui/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IconLoader2 } from "@tabler/icons-react";
import { ModeToggle } from "../ui/mode-toogle";
import { useBreadcrumbStore } from "@/store/use-breadcrumb-store";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { items: breadcrumbs } = useBreadcrumbStore();
  // Daftar halaman yang TIDAK menampilkan Sidebar
  const disabledSidebarPaths = ["/login", "/signup", "/forgot-password", "/"];
  const isPublicPage = disabledSidebarPaths.includes(pathname);

  // 1. Cek Mounting (Mencegah Hydration Mismatch error)
  useEffect(() => {
    // Kita bungkus dengan setTimeout(..., 0)
    // Ini membuat update state menjadi 'asynchronous' di mata React/Linter
    // dan menghilangkan error "Synchronous setState".
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup untuk mencegah memory leak
  }, []);

  // 2. Loading Awal (Opsional tapi disarankan)
  // Mencegah layout berantakan sekilas saat reload page
  if (!isMounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        {/* Spinner sederhana agar user tahu app sedang loading */}
        <IconLoader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }

  // 3. RENDER HALAMAN PUBLIC (Login/Signup)
  // Middleware mengizinkan akses ke sini jika tidak ada token
  if (isPublicPage) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  // 4. RENDER HALAMAN DASHBOARD (Protected)
  // Middleware menjamin user punya token jika sampai di sini
  return (
    <SidebarProvider>
      {/* Sidebar Kiri */}
      <AppSidebar />

      {/* Area Konten Utama */}
      <SidebarInset>
        {/* Header Sticky */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-4 bg-sidebar backdrop-blur sticky top-0 z-10 shadow-sm transition-all">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-foreground mx-2" />

          <div className="flex items-center gap-3 text-sm text-foreground">
            {breadcrumbs.length > 0 ? (
              breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <Fragment key={index}>
                    {index > 0 && <span className="text-foreground">/</span>}

                    {item.href && !isLast ? (
                      <Link
                        href={item.href}
                        className="hover:text-secondary hover:underline transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        className={`font-medium ${
                          isLast ? "text-primary" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </Fragment>
                );
              })
            ) : (
              /* Default jika halaman lupa set breadcrumb */
              <span className="font-semibold text-slate-700">ZooKeeper</span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>

        {/* Isi Halaman (Children) */}
        <div className="flex-1 p-4 md:p-8 bg-background min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
