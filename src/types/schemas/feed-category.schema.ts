import { z } from "zod";

// Form validation schema
export const feedCategoryFormSchema = z.object({
  category_name: z
    .string()
    .min(1, "Nama kategori pakan wajib diisi!")
    .min(2, "Nama minimal 2 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi wajib diisi!")
    .min(5, "Deskripsi minimal 5 karakter"),
});

export type FeedCategoryFormValues = z.infer<typeof feedCategoryFormSchema>;
