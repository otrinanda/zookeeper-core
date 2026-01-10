import { z } from "zod";

export const animalFormSchema = z.object({
  // --- Identitas Utama ---
  animal_name: z.string().min(1, "Nama hewan wajib diisi"),
  identifier_code: z.string().optional(),
  marker_code: z.string().optional(),
  
  // --- Taksonomi (Select) ---
  // Menggunakan z.coerce.number() agar aman jika input HTML mengirim string "1"
  family_id: z.coerce.number().min(1, "Wajib pilih Family"),
  species_id: z.coerce.number().min(1, "Wajib pilih Spesies"),
  
  // Nama (Auto-populate / Edit manual)
  english_name: z.string().optional(),
  latin_name: z.string().optional(),
  local_name: z.string().optional(),

  // --- Kategori & Status (Select) ---
  animal_classification_id: z.coerce.number().optional(),
  animal_type_id: z.coerce.number().optional(),
  animal_entity_id: z.coerce.number().optional(), // Individu / Komunal
  animal_status_id: z.coerce.number().optional(),
  iucn_status: z.coerce.number().optional(),

  // --- Biologis ---
  animal_genders_id: z.coerce.number().optional(),
  animal_age_group_id: z.coerce.number().optional(),

  // --- Lokasi ---
  animal_area_id: z.coerce.number().optional(),

  // --- Fisik & Ukuran ---
  weight_length: z.coerce.number().optional(),
  weight_unit_id: z.coerce.number().optional(),
  body_length: z.coerce.number().optional(),
  unit_id: z.coerce.number().optional(), // Unit panjang (cm/m)

  // --- Tanggal Penting ---
  // Input type="date" menghasilkan string format "YYYY-MM-DD"
  hatching_date: z.string().optional(),
  arrival_date: z.string().optional(),

  // --- Silsilah (Parenting) ---
  // Parent ID biasanya string UUID
  father_id: z.string().optional().nullable(),
  mother_id: z.string().optional().nullable(),

  // --- Manajemen Pakan ---
  feed_percentage: z.coerce.number().min(0).max(100).default(0),

  // --- Kuantitas (Untuk Hewan Komunal) ---
  komunal_quantity: z.coerce.number().min(1).default(1),
  
  // --- Lainnya ---
  noted: z.string().optional(),
  show_detail: z.boolean().default(true),

  // --- Upload File ---
  // Kita gunakan z.any() atau z.union() karena nilainya bisa berupa:
  // 1. File Object (saat user upload baru)
  // 2. String URL (saat edit tapi tidak ganti foto)
  // 3. Null/Undefined
  animal_image: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  document_image: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
});

// Export Type untuk dipakai di React Hook Form
export type AnimalFormValues = z.infer<typeof animalFormSchema>;