// src/services/animal-form-options.service.ts

import { api } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { 
  BaseOption, 
  FamilyOption, 
  MarkerOption, 
  ParentOption, 
  SpeciesNameOption, 
  SpeciesOption 
} from "@/types/options";

// Helper Generic: T secara default adalah BaseOption, tapi bisa di-override
const getList = async <T = BaseOption>(endpoint: string) => {
  const res = await api.get<ApiResponse<T[]>>(endpoint);
  return res.data.data;
};

export const animalFormOptionsService = {
  // Master Data (Parallel Fetch)
  // Kita tentukan tipe return spesifik untuk masing-masing
  getAgeGroups: () => getList<BaseOption>("/animal/age-group"),
  getAreas: () => getList<BaseOption>("/animal/area"),
  getClassifications: () => getList<BaseOption>("/animal/classification"),
  getEntities: () => getList<BaseOption>("/animal/entity"),
  getGenders: () => getList<BaseOption>("/animal/gender"),
  getIUCNStatuses: () => getList<BaseOption>("/animal/iucn-status"),
  getMarkerCodes: () => getList<MarkerOption>("/animal/marker-code"), // Pakai MarkerOption
  getStatuses: () => getList<BaseOption>("/animal/status"),
  getTypes: () => getList<BaseOption>("/animal/type"),
  getUnits: () => getList<{ id: number; unit_name: string }>("/unit"), // Unit return unit_name

  getFamilies: () => api.get<ApiResponse<FamilyOption[]>>("/animal/family?all=true")
    .then(res => res.data.data),
  
  // Cascade 1: Family -> Species
  getSpeciesByFamily: (familyId: number | string) => 
    api.get<ApiResponse<SpeciesOption[]>>(`/animal/species/family/${familyId}`)
      .then(res => res.data.data),

  // Cascade 2: Species -> Names
  getSpeciesNames: (speciesId: number | string) =>
    api.get<ApiResponse<SpeciesNameOption[]>>(`/animal/species-name/species/${speciesId}`)
      .then(res => res.data.data),
    
  // Cascade 3: Parents
  getParents: (familyId: number | string, speciesId: number | string) =>
    api.get<ApiResponse<ParentOption[]>>(`/animal/detail-list`, { 
      params: { family_id: familyId, species_id: speciesId } 
    }).then(res => res.data.data),
};