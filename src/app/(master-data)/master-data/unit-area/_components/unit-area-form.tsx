"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import { unitAreaService, UnitAreaDetail } from "@/services/unit-area.service";
import {
  unitAreaFormSchema,
  UnitAreaFormValues,
} from "@/types/schemas/unit-area.schema";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormTextarea } from "@/components/shared/form-field";
import { IconLoader2 } from "@tabler/icons-react";

interface UnitAreaFormProps {
  initialData?: UnitAreaDetail;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UnitAreaForm({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: UnitAreaFormProps) {
  // 1. SETUP FORM
  const form = useForm<UnitAreaFormValues>({
    resolver: zodResolver(unitAreaFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // 1b. UPDATE FORM VALUES KETIKA initialData BERUBAH
  useEffect(() => {
    if (initialData && isEditMode) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [initialData, isEditMode, form]);

  // 2. SUBMIT
  const mutation = useMutation({
    mutationFn: (values: UnitAreaFormValues) =>
      isEditMode && initialData
        ? unitAreaService.update(initialData.id, values)
        : unitAreaService.create(values),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Data area unit berhasil diperbarui"
          : "Data area unit berhasil ditambahkan",
      );
      onSuccess?.();
    },
    onError: (err: Error) =>
      toast.error(err.message || "Gagal menyimpan data area unit"),
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
            label="Nama Area Unit"
            placeholder="Contoh: Savana Utara"
            required
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Deskripsi"
            placeholder="Jelaskan tentang area unit ini..."
            required
            rows={4}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className=""
            variant="default"
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
