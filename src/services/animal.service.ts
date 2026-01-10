import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { AnimalFormValues } from "@/types/schemas/animal.schema";

// --- Types untuk Response Data ---

// Tipe data untuk Tabel Utama (Header Row)
// Endpoint: /animal/headers
export interface AnimalHeader {
  id: string; // Ini biasanya Family ID atau Group ID
  no: number;
  family_name: string;
  species_name: string;
  local_name: string;
  latin_name: string;
  english_name: string;
  iucn: string;
  total: number;
}

// Tipe data untuk Sub-Table (Expandable Row)
// Endpoint: /animal/details/{familyId}
export interface AnimalDetailItem {
  id: string; // ID unik hewan
  animal_name: string;
  animal_genders_name: string;
  identifier_code: string;
  animal_classification: string;
  animal_area: string;
  animal_entity: string; // Individu / Komunal
  komunal_quantity: number;
}

export interface AnimalHeaderData {
  id: string;
  family_id: number;
  family_name: string;
  species_id: number;
  species_name: string;
  english_name: string;
  latin_name: string;
  local_name: string;
  iucn_status: number;
  iucn_name: string;
}
// Tipe data untuk Sub-Table (Expandable Row)
// Endpoint: /animal/details/{familyId}
export interface AnimalDetailData {
  id: string;
  animal_name: string;
  identifier_code: string;
  marker_code: string;
  
  // Kategori & ID (Untuk keperluan edit/logic)
  animal_classification_id: number;
  animal_type_id: number;
  animal_entity_id: number;
  animal_status_id: number;
  animal_genders_id: number;
  animal_age_group_id: number;
  animal_area_id: number;
  weight_unit_id: number;
  unit_id: number;

  // Nama Display (Untuk ditampilkan di UI Read-only)
  animal_classification: string;
  animal_type_name: string;
  animal_entity: string; // "Individu" | "Komunal"
  animal_status_name: string; // "Alive" | "Dead"
  animal_genders_name: string; // "Male" | "Female"
  animal_age_group_name: string;
  animal_area: string;
  weight_unit_name: string;
  unit_name: string; // "cm" | "m"

  // Fisik & Tanggal
  weight_length: number;
  body_length: number;
  hatching_date: string; // ISO String
  arrival_date: string;  // ISO String
  
  // Orang Tua
  father_id?: string;
  father_name?: string;
  mother_id?: string;
  mother_name?: string;

  // Lainnya
  feed_percentage: number;
  komunal_quantity: number;
  animal_image_url?: string;
  document_url?: string;
  noted: string;
  show_detail: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface AnimalCageData {
  id: string;
  code_number: string;
  container: string;
}
// Tipe data untuk Single Detail (Full Data untuk Edit)
// Endpoint: /animal/detail/{id}
export interface AnimalFullDetail {
  Header: AnimalHeaderData;
  Details: AnimalDetailData; // <--- SEKARANG SUDAH TIDAK 'any' LAGI
  Cage?: AnimalCageData;     // Opsional karena bisa jadi belum masuk kandang
}
// --- Service Definition ---

export const animalService = {
  // 1. GET Headers (Tabel Utama)
  getHeaders: async (params: { page: number; limit: number; keyword?: string }) => {
    // Mapping params: limit -> page_size sesuai backend lama
    const queryParams = {
      page: params.page,
      page_size: params.limit,
      keyword: params.keyword,
    };
    
    const response = await api.get<PaginatedResponse<AnimalHeader>>("/animal/headers", { 
      params: queryParams 
    });
    return response.data;
  },

  // 2. GET Details by Family (Untuk Expand Row)
  getDetailsByFamily: async (familyId: string, params: { page: number; limit: number }) => {
    const queryParams = {
      page: params.page,
      page_size: params.limit,
      // name: params.search // Jika nanti butuh search di dalam sub-list
    };

    const response = await api.get<PaginatedResponse<AnimalDetailItem>>(`/animal/details/${familyId}`, { 
      params: queryParams 
    });
    return response.data;
  },

  // 3. GET Single Detail (Untuk Halaman Edit / Detail View)
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<AnimalFullDetail>>(`/animal/detail/${id}`);
    return response.data.data;
  },

  // 4. CREATE Animal (Multipart Form Data)
  create: async (data: AnimalFormValues) => {
    const formData = new FormData();
    
    // Helper: Append data ke FormData
    Object.entries(data).forEach(([key, value]) => {
      // Filter undefined/null agar tidak terkirim sebagai string "undefined"
      if (value !== undefined && value !== null && value !== "") {
        // Khusus File
        if (key === "animal_image" || key === "document_image") {
          if (value instanceof File) {
             formData.append(key, value);
          }
        } else {
          // Data primitif (string/number/boolean) ubah ke string
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.post<ApiResponse>("/animal", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Axios biasanya otomatis, tapi eksplisit lebih aman
    });
    return response.data;
  },

  // 5. UPDATE Animal
  update: async (id: string, data: Partial<AnimalFormValues>) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "animal_image" || key === "document_image") {
          // Hanya append jika user mengupload file baru (File object)
          // Jika masih string (URL lama), biasanya backend tidak butuh dikirim ulang, atau sesuaikan logic backend Anda
          if (value instanceof File) {
             formData.append(key, value);
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Method PUT biasanya support FormData juga di backend modern (Laravel/Node)
    // Jika backend strict tidak bisa PUT FormData, kadang perlu method spoofing (_method: PUT) di POST
    const response = await api.put<ApiResponse>(`/animal/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 6. DELETE Animal
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/animal/${id}`);
    return response.data;
  },

  // 7. EXPORT EXCEL
  exportExcel: async (params: { keyword?: string }) => {
    const response = await api.get("/animal/excel", {
      params,
      responseType: "blob", // PENTING: Agar diterima sebagai File Binary
    });
    return response.data; // Return Blob
  }
};