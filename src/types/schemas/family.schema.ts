import { z } from "zod";

// Form validation schema
export const familyFormSchema = z.object({
  family_name: z
    .string()
    .min(1, "Tolong isi nama family!")
    .min(2, "Nama family minimal 2 karakter"),
  description: z
    .string()
    .min(1, "Tolong isi deskripsi!")
    .min(5, "Deskripsi minimal 5 karakter"),
});

export type FamilyFormValues = z.infer<typeof familyFormSchema>;
