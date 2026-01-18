"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import { animalService, AnimalFullDetail } from "@/services/animal.service";
import { animalFormOptionsService } from "@/services/animal-form-options.service";
import { useAnimalOptions } from "@/hooks/features/animal/use-animal-options";
import {
  animalFormSchema,
  AnimalFormValues,
} from "@/types/schemas/animal.schema";
import {
  ParentOption,
  SpeciesNameOption,
  SpeciesOption,
} from "@/types/options";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"; // Form Wrapper tetap butuh ini
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IconLoader2, IconArrowLeft } from "@tabler/icons-react";

// IMPORT KOMPONEN BARU KITA
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/shared/form-field";

interface AnimalFormProps {
  initialData?: AnimalFullDetail;
  isEditMode?: boolean;
}

export function AnimalForm({
  initialData,
  isEditMode = false,
}: AnimalFormProps) {
  const router = useRouter();
  const options = useAnimalOptions();

  // 1. SETUP FORM
  const form = useForm({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      animal_name: initialData?.Details?.animal_name || "",
      identifier_code: initialData?.Details?.identifier_code || "",
      family_id: initialData?.Header?.family_id || undefined,
      species_id: initialData?.Header?.species_id || undefined,
      // ... default values lainnya
      animal_genders_id: initialData?.Details?.animal_genders_id,
      animal_age_group_id: initialData?.Details?.animal_age_group_id,
      animal_status_id: initialData?.Details?.animal_status_id,
      animal_entity_id: initialData?.Details?.animal_entity_id,
      weight_length: initialData?.Details?.weight_length,
      weight_unit_id: initialData?.Details?.weight_unit_id,
      body_length: initialData?.Details?.body_length,
      unit_id: initialData?.Details?.unit_id,
      hatching_date: initialData?.Details?.hatching_date?.split("T")[0] || "",
      arrival_date: initialData?.Details?.arrival_date?.split("T")[0] || "",
      father_id: initialData?.Details?.father_id || null,
      mother_id: initialData?.Details?.mother_id || null,
      komunal_quantity: initialData?.Details?.komunal_quantity || 1,
      noted: initialData?.Details?.noted || "",
      english_name: initialData?.Header?.english_name || "",
      latin_name: initialData?.Header?.latin_name || "",
      local_name: initialData?.Header?.local_name || "",
    } as any, // Casting any sementara untuk bypass strict type check defaultValues
  });

  // 2. LOGIC (Cascade & Auto Populate)
  const { family_id, species_id } = form.watch();

  const { data: speciesList, isLoading: loadingSpecies } = useQuery<
    SpeciesOption[]
  >({
    queryKey: ["species", family_id],
    queryFn: () => animalFormOptionsService.getSpeciesByFamily(family_id),
    enabled: !!family_id,
  });

  const { data: parentsList } = useQuery<ParentOption[]>({
    queryKey: ["parents", family_id, species_id],
    queryFn: () => animalFormOptionsService.getParents(family_id, species_id),
    enabled: !!(family_id && species_id),
  });

  const { data: speciesNames } = useQuery<SpeciesNameOption[]>({
    queryKey: ["species-names", species_id],
    queryFn: () => animalFormOptionsService.getSpeciesNames(species_id),
    enabled: !!species_id,
  });

  useEffect(() => {
    if (speciesNames?.length) {
      const en = speciesNames.find((x) => x.code === "en");
      const latin = speciesNames.find((x) => x.code === "latin");
      const id = speciesNames.find((x) => x.code === "id");

      form.setValue("english_name", en?.name);
      form.setValue("latin_name", latin?.name);
      form.setValue("local_name", id?.name);
    }
  }, [speciesNames, form]);

  // 3. SUBMIT
  const mutation = useMutation({
    mutationFn: (values: AnimalFormValues) =>
      isEditMode && initialData
        ? animalService.update(initialData.Details.id, values)
        : animalService.create(values),
    onSuccess: () => {
      toast.success("Data berhasil disimpan");
      router.push("/dashboard/animal");
    },
    onError: (err: Error) => toast.error(err.message || "Gagal menyimpan"),
  });

  if (options.isLoading) return <div>Loading master data...</div>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-8 pb-20"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center sticky top-16 backdrop-blur z-10 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => router.back()}
            >
              <IconArrowLeft />
            </Button>
            <h1 className="text-xl font-bold">
              {isEditMode ? "Edit Hewan" : "Registrasi Baru"}
            </h1>
          </div>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-emerald-600"
          >
            {mutation.isPending && (
              <IconLoader2 className="animate-spin mr-2" />
            )}{" "}
            Simpan
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* --- KOLOM KIRI (UTAMA) --- */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identitas & Taksonomi</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {/* PENGGUNAAN KOMPONEN REUSABLE */}
                <FormInput
                  control={form.control}
                  name="animal_name"
                  label="Nama Panggilan"
                  placeholder="Simba"
                  required
                />
                <FormInput
                  control={form.control}
                  name="identifier_code"
                  label="Kode Tag"
                  placeholder="LION-001"
                />

                <div className="col-span-2">
                  <Separator />
                </div>

                <FormSelect
                  control={form.control}
                  name="family_id"
                  label="Family"
                  options={options.families}
                  labelKey="family_name"
                  required
                />

                <FormSelect
                  control={form.control}
                  name="species_id"
                  label="Spesies"
                  options={speciesList || []}
                  labelKey="species_name"
                  disabled={!family_id || loadingSpecies}
                  placeholder={loadingSpecies ? "Memuat..." : "Pilih Spesies"}
                  required
                />

                {/* Info Auto-Fill */}
                <div className="col-span-2 bg-slate-50 p-3 rounded text-sm grid grid-cols-3 gap-4 border">
                  <div>
                    <span className="text-xs text-slate-400">Latin</span>
                    <p className="italic">{form.watch("latin_name") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Inggris</span>
                    <p>{form.watch("english_name") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Lokal</span>
                    <p>{form.watch("local_name") || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fisik & Karakteristik</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  name="animal_genders_id"
                  label="Gender"
                  options={options.genders}
                />
                <FormSelect
                  control={form.control}
                  name="animal_age_group_id"
                  label="Kelompok Umur"
                  options={options.ageGroups}
                />

                {/* Input Berat dengan Unit */}
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <FormInput
                      control={form.control}
                      name="weight_length"
                      label="Berat"
                      type="number"
                    />
                  </div>
                  <div className="w-25">
                    <FormSelect
                      control={form.control}
                      name="weight_unit_id"
                      label="Unit"
                      options={options.units}
                      labelKey="unit_name"
                    />
                  </div>
                </div>

                {/* Input Panjang dengan Unit */}
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <FormInput
                      control={form.control}
                      name="body_length"
                      label="Panjang"
                      type="number"
                    />
                  </div>
                  <div className="w-25">
                    <FormSelect
                      control={form.control}
                      name="unit_id"
                      label="Unit"
                      options={options.units}
                      labelKey="unit_name"
                    />
                  </div>
                </div>

                <FormInput
                  control={form.control}
                  name="hatching_date"
                  label="Tgl Lahir"
                  type="date"
                />
                <FormInput
                  control={form.control}
                  name="arrival_date"
                  label="Tgl Kedatangan"
                  type="date"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Silsilah (Opsional)</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  name="father_id"
                  label="Ayah (Sire)"
                  disabled={!species_id}
                  options={
                    parentsList?.filter((p) => p.gender === "Jantan") || []
                  }
                  labelKey="animal_name"
                />
                <FormSelect
                  control={form.control}
                  name="mother_id"
                  label="Ibu (Dam)"
                  disabled={!species_id}
                  options={
                    parentsList?.filter((p) => p.gender === "Betina") || []
                  }
                  labelKey="animal_name"
                />
              </CardContent>
            </Card>
          </div>

          {/* --- KOLOM KANAN (SIDEBAR) --- */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Foto Profil</CardTitle>
              </CardHeader>
              <CardContent>
                <FormInput
                  control={form.control}
                  name="animal_image"
                  label=""
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) form.setValue("animal_image", file);
                  }}
                />
                {/* Preview sederhana */}
                {form.watch("animal_image") instanceof File && (
                  <p className="text-xs text-emerald-600 mt-2">
                    File: {(form.watch("animal_image") as File).name}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status & Lainnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormSelect
                  control={form.control}
                  name="animal_status_id"
                  label="Kesehatan"
                  options={options.statuses}
                />
                <FormSelect
                  control={form.control}
                  name="animal_entity_id"
                  label="Entitas"
                  options={options.entities}
                />
                <FormInput
                  control={form.control}
                  name="komunal_quantity"
                  label="Jumlah (Ekor)"
                  type="number"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <FormTextarea
                  control={form.control}
                  name="noted"
                  label="Catatan Tambahan"
                  placeholder="Tulis sesuatu..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
