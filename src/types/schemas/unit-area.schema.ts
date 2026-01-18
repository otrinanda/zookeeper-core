import { z } from "zod";

// Form validation schema
export const unitAreaFormSchema = z.object({
  name: z
    .string()
    .min(1, "Tolong isi nama area unit!")
    .min(2, "Nama minimal 2 karakter"),
  description: z
    .string()
    .min(1, "Tolong isi deskripsi!")
    .min(5, "Deskripsi minimal 5 karakter"),
});

export type UnitAreaFormValues = z.infer<typeof unitAreaFormSchema>;
