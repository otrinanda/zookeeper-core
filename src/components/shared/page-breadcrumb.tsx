"use client";

import { useEffect } from "react";
import {
  useBreadcrumbStore,
  BreadcrumbItem,
} from "@/store/use-breadcrumb-store";

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    // Set breadcrumb saat komponen di-mount
    setBreadcrumbs(items);

    // Opsional: Reset saat unmount (agar tidak nyangkut ke halaman lain)
    // return () => setBreadcrumbs([]);
  }, [items, setBreadcrumbs]);

  return null; // Komponen ini tidak merender UI apa-apa, cuma logic
}
