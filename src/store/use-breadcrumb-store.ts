import { create } from "zustand";

export interface BreadcrumbItem {
  label: string;
  href?: string; // Opsional, jika tidak ada href berarti teks biasa (bukan link)
}

interface BreadcrumbState {
  items: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  items: [], // Default kosong
  setBreadcrumbs: (items) => set({ items }),
}));
