"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import { zoneAreaService, ZoneAreaDetail } from "@/services/zone-area.service";
import { unitAreaService } from "@/services/unit-area.service";
import {
  zoneAreaFormSchema,
  ZoneAreaFormValues,
} from "@/types/schemas/zone-area.schema";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/form-field";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLoader2 } from "@tabler/icons-react";

interface ZoneAreaFormProps {
  initialData?: ZoneAreaDetail;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ZoneAreaForm({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: ZoneAreaFormProps) {
  // 1. SETUP FORM
  const form = useForm<ZoneAreaFormValues>({
    resolver: zodResolver(zoneAreaFormSchema),
    defaultValues: {
      name: "",
      description: "",
      unit_id: "",
    },
  });

  // 2. FETCH UNIT AREA OPTIONS
  const { data: unitAreasData, isLoading: isLoadingUnitAreas } = useQuery({
    queryKey: ["unit-areas-all"],
    queryFn: () =>
      unitAreaService.getList({ page: 1, limit: 100, keyword: "" }),
    staleTime: 0, // Selalu refetch saat komponen di-mount
    gcTime: 0, // Jangan cache setelah unmount
  });

  const unitAreas = useMemo(() => unitAreasData?.data || [], [unitAreasData]);

  // 3. UPDATE FORM VALUES WHEN initialData CHANGES ⚠️ CRITICAL
  useEffect(() => {
    if (initialData && isEditMode) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        unit_id: initialData.unit_id,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        unit_id: "",
      });
    }
  }, [initialData, isEditMode, form, unitAreas]);

  // 4. SUBMIT
  const mutation = useMutation({
    mutationFn: (values: ZoneAreaFormValues) =>
      isEditMode && initialData
        ? zoneAreaService.update(initialData.id, values)
        : zoneAreaService.create(values),
    onSuccess: () => {
      toast.success(
        isEditMode ? "Data berhasil diperbarui" : "Data berhasil ditambahkan",
      );
      onSuccess?.();
    },
    onError: (err: Error) => toast.error(err.message || "Gagal menyimpan data"),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-6"
      >
        <div className="space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="Nama Area Zona"
            placeholder="Masukkan nama area zona..."
            required
          />

          <FormInput
            control={form.control}
            name="description"
            label="Deskripsi"
            placeholder="Masukkan deskripsi..."
            required
          />

          <FormField
            control={form.control}
            name="unit_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Unit Area <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoadingUnitAreas}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingUnitAreas
                            ? "Memuat..."
                            : "Pilih unit area..."
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitAreas.length > 0 ? (
                      unitAreas.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        Tidak ada unit area
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 justify-end border-t pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {mutation.isPending && (
              <IconLoader2 className="animate-spin mr-2 h-4 w-4" />
            )}
            {isEditMode ? "Perbarui" : "Tambah"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
