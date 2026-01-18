import { z } from "zod";

// Form validation schema
export const cageTypeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama tipe kandang wajib diisi!")
    .min(2, "Nama minimal 2 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi wajib diisi!")
    .min(5, "Deskripsi minimal 5 karakter"),
});

export type CageTypeFormValues = z.infer<typeof cageTypeFormSchema>;
