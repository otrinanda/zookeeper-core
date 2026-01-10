// src/types/options.ts

// Tipe Dasar (ID & Name) - Digunakan oleh Gender, Status, Area, dll
export interface BaseOption {
  id: number;
  name: string;
}

// Tipe Khusus Family (API return family_name)
export interface FamilyOption {
  id: number;
  family_name: string;
}

// Tipe Khusus Species (API return species_name)
export interface SpeciesOption {
  id: number;
  species_name: string;
  family_id: number;
}

// Tipe Khusus Nama Latin/Inggris/Lokal (API return code)
export interface SpeciesNameOption {
  id: number;
  name: string;
  code: string; // 'en' | 'latin' | 'id'
}

// Tipe Khusus Marker Code
export interface MarkerOption {
  id: number;
  code: string;
  name: string;
}

// Tipe Khusus Parent (Untuk Dropdown Ayah/Ibu)
export interface ParentOption {
  id: string; // UUID
  animal_name: string;
  identifier_code: string;
  gender: string; // 'Jantan' | 'Betina'
}