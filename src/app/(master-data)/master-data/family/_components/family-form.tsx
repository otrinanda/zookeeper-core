"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import { familyService, FamilyDetail } from "@/services/family.service";
import {
  familyFormSchema,
  FamilyFormValues,
} from "@/types/schemas/family.schema";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormTextarea } from "@/components/shared/form-field";
import { IconLoader2 } from "@tabler/icons-react";

interface FamilyFormProps {
  initialData?: FamilyDetail;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FamilyForm({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: FamilyFormProps) {
  // 1. SETUP FORM
  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(familyFormSchema),
    defaultValues: {
      family_name: "",
      description: "",
    },
  });

  // 2. UPDATE FORM VALUES WHEN initialData CHANGES ⚠️ CRITICAL
  useEffect(() => {
    if (initialData && isEditMode) {
      form.reset({
        family_name: initialData.family_name,
        description: initialData.description,
      });
    } else {
      form.reset({
        family_name: "",
        description: "",
      });
    }
  }, [initialData, isEditMode, form]);

  // 3. SUBMIT
  const mutation = useMutation({
    mutationFn: (values: FamilyFormValues) =>
      isEditMode && initialData
        ? familyService.update(initialData.id, values)
        : familyService.create(values),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Data family berhasil diperbarui"
          : "Data family berhasil ditambahkan",
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
            name="family_name"
            label="Nama Family"
            placeholder="Masukkan nama family..."
            required
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Deskripsi"
            placeholder="Masukkan deskripsi family..."
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
