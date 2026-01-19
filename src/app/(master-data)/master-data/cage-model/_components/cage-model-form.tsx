"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import {
  cageModelService,
  CageModelDetail,
} from "@/services/cage-model.service";
import {
  cageModelFormSchema,
  CageModelFormValues,
} from "@/types/schemas/cage-model.schema";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormTextarea } from "@/components/shared/form-field";
import { IconLoader2 } from "@tabler/icons-react";

interface CageModelFormProps {
  initialData?: CageModelDetail;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CageModelForm({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: CageModelFormProps) {
  // 1. SETUP FORM
  const form = useForm<CageModelFormValues>({
    resolver: zodResolver(cageModelFormSchema),
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
    mutationFn: (values: CageModelFormValues) =>
      isEditMode && initialData
        ? cageModelService.update(initialData.id, values)
        : cageModelService.create(values),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Data jenis kandang berhasil diperbarui"
          : "Data jenis kandang berhasil ditambahkan",
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
            label="Nama Jenis Kandang"
            placeholder="Masukkan nama jenis kandang..."
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
