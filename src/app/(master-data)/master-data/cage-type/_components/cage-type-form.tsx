"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import { cageTypeService, CageTypeDetail } from "@/services/cage-type.service";
import {
  cageTypeFormSchema,
  CageTypeFormValues,
} from "@/types/schemas/cage-type.schema";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormTextarea } from "@/components/shared/form-field";
import { IconLoader2 } from "@tabler/icons-react";

interface CageTypeFormProps {
  initialData?: CageTypeDetail;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CageTypeForm({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: CageTypeFormProps) {
  // 1. SETUP FORM
  const form = useForm<CageTypeFormValues>({
    resolver: zodResolver(cageTypeFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // 2. UPDATE FORM VALUES WHEN initialData CHANGES ⚠️ CRITICAL
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

  // 3. SUBMIT
  const mutation = useMutation({
    mutationFn: (values: CageTypeFormValues) =>
      isEditMode && initialData
        ? cageTypeService.update(initialData.id, values)
        : cageTypeService.create(values),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Data tipe kandang berhasil diperbarui"
          : "Data tipe kandang berhasil ditambahkan",
      );
      onSuccess?.();
    },
    onError: (err: any) => toast.error(err.message || "Gagal menyimpan data"),
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
            label="Nama Tipe Kandang"
            placeholder="Masukkan nama tipe kandang..."
            required
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Deskripsi"
            placeholder="Masukkan deskripsi..."
            required
            rows={4}
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
