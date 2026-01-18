import { z } from "zod";

// Form validation schema
export const zoneAreaFormSchema = z.object({
  name: z
    .string()
    .min(1, "Tolong isi nama area zona!")
    .min(2, "Nama minimal 2 karakter"),
  description: z
    .string()
    .min(1, "Tolong isi deskripsi!")
    .min(5, "Deskripsi minimal 5 karakter"),
  unit_id: z.string().min(1, "Tolong pilih unit area!"),
});

export type ZoneAreaFormValues = z.infer<typeof zoneAreaFormSchema>;
