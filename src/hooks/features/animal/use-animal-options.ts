import { useQueries } from "@tanstack/react-query";
import { animalFormOptionsService } from "@/services/animal-form-options.service";
import { BaseOption, FamilyOption } from "@/types/options";

export const useAnimalOptions = () => {
  const results = useQueries({
    queries: [
      { queryKey: ["opt", "age"], queryFn: animalFormOptionsService.getAgeGroups, staleTime: Infinity },
      { queryKey: ["opt", "area"], queryFn: animalFormOptionsService.getAreas, staleTime: Infinity },
      { queryKey: ["opt", "class"], queryFn: animalFormOptionsService.getClassifications, staleTime: Infinity },
      { queryKey: ["opt", "entity"], queryFn: animalFormOptionsService.getEntities, staleTime: Infinity },
      { queryKey: ["opt", "gender"], queryFn: animalFormOptionsService.getGenders, staleTime: Infinity },
      { queryKey: ["opt", "iucn"], queryFn: animalFormOptionsService.getIUCNStatuses, staleTime: Infinity },
      { queryKey: ["opt", "status"], queryFn: animalFormOptionsService.getStatuses, staleTime: Infinity },
      { queryKey: ["opt", "type"], queryFn: animalFormOptionsService.getTypes, staleTime: Infinity },
      { queryKey: ["opt", "unit"], queryFn: animalFormOptionsService.getUnits, staleTime: Infinity },
      { queryKey: ["opt", "family"], queryFn: animalFormOptionsService.getFamilies, staleTime: Infinity },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);

  // Casting data dengan tipe yang benar, bukan default any
  return {
    isLoading,
    ageGroups: (results[0].data as BaseOption[]) || [],
    areas: (results[1].data as BaseOption[]) || [],
    classifications: (results[2].data as BaseOption[]) || [],
    entities: (results[3].data as BaseOption[]) || [],
    genders: (results[4].data as BaseOption[]) || [],
    iucnStatuses: (results[5].data as BaseOption[]) || [],
    statuses: (results[6].data as BaseOption[]) || [],
    types: (results[7].data as BaseOption[]) || [],
    units: (results[8].data as { id: number; unit_name: string }[]) || [],
    families: (results[9].data as FamilyOption[]) || [],
  };
};