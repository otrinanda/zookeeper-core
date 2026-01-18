import { z } from "zod";

// Form validation schema
export const feedTypeFormSchema = z.object({
  feed_type_name: z
    .string()
    .min(1, "Nama jenis pakan wajib diisi!")
    .min(2, "Nama minimal 2 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi wajib diisi!")
    .min(5, "Deskripsi minimal 5 karakter"),
  feed_category_id: z.number().min(1, "Kategori pakan wajib dipilih!"),
  unit_id: z.number().min(1, "Satuan wajib dipilih!"),
  minimum_stock: z
    .number()
    .min(0, "Stok minimum harus 0 atau lebih")
    .or(z.string()),
  warning_stock: z
    .number()
    .min(0, "Stok peringatan harus 0 atau lebih")
    .or(z.string()),
  waste_ratio: z
    .number()
    .min(0, "Rasio limbah harus 0 atau lebih")
    .or(z.string()),
});

export type FeedTypeFormValues = z.infer<typeof feedTypeFormSchema>;
