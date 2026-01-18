"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import {
  feedCategoryService,
  FeedCategoryDetail,
} from "@/services/feed-category.service";
import {
  feedCategoryFormSchema,
  FeedCategoryFormValues,
} from "@/types/schemas/feed-category.schema";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormTextarea } from "@/components/shared/form-field";
import { IconLoader2 } from "@tabler/icons-react";

interface FeedCategoryFormProps {
  initialData?: FeedCategoryDetail;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FeedCategoryForm({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: FeedCategoryFormProps) {
  // 1. SETUP FORM
  const form = useForm<FeedCategoryFormValues>({
    resolver: zodResolver(feedCategoryFormSchema),
    defaultValues: {
      category_name: "",
      description: "",
    },
  });

  // 2. UPDATE FORM VALUES WHEN initialData CHANGES ⚠️ CRITICAL
  useEffect(() => {
    if (initialData && isEditMode) {
      form.reset({
        category_name: initialData.category_name,
        description: initialData.description,
      });
    } else {
      form.reset({
        category_name: "",
        description: "",
      });
    }
  }, [initialData, isEditMode, form]);

  // 3. SUBMIT
  const mutation = useMutation({
    mutationFn: (values: FeedCategoryFormValues) =>
      isEditMode && initialData
        ? feedCategoryService.update(initialData.id, values)
        : feedCategoryService.create(values),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Data kategori pakan berhasil diperbarui"
          : "Data kategori pakan berhasil ditambahkan",
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
            name="category_name"
            label="Nama Kategori Pakan"
            placeholder="Masukkan nama kategori pakan..."
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
