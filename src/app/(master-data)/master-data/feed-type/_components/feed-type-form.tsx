"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import { feedTypeService, FeedTypeDetail } from "@/services/feed-type.service";
import {
  feedTypeFormSchema,
  FeedTypeFormValues,
} from "@/types/schemas/feed-type.schema";
import { feedCategoryService } from "@/services/feed-category.service";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormNumber,
  FormTextarea,
  FormSelect,
} from "@/components/shared/form-field";
import { IconLoader2 } from "@tabler/icons-react";

interface FeedTypeFormProps {
  initialData?: FeedTypeDetail;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FeedTypeForm({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: FeedTypeFormProps) {
  // 1. SETUP FORM
  const form = useForm<FeedTypeFormValues>({
    resolver: zodResolver(feedTypeFormSchema),
    defaultValues: {
      feed_type_name: "",
      description: "",
      feed_category_id: undefined,
      unit_id: undefined,
      minimum_stock: "",
      warning_stock: "",
      waste_ratio: "",
    },
  });

  // 2. FETCH DEPENDENCIES
  const { data: feedCategoriesData } = useQuery({
    queryKey: ["feed-categories-all"],
    queryFn: () => feedCategoryService.getList({ page: 1, limit: 1000 }),
    staleTime: 0,
    gcTime: 0,
  });

  const feedCategories = useMemo(
    () => feedCategoriesData?.data || [],
    [feedCategoriesData],
  );

  // TODO: Fetch units dari service yang akan dibuat
  // Untuk sekarang, gunakan mock data
  const units = [
    { id: "1", name: "Kg" },
    { id: "2", name: "Gram" },
    { id: "3", name: "Liter" },
    { id: "4", name: "Mililiter" },
  ];

  // 3. UPDATE FORM VALUES WHEN initialData CHANGES ⚠️ CRITICAL
  useEffect(() => {
    if (initialData && isEditMode) {
      form.reset({
        feed_type_name: initialData.feed_type_name,
        description: initialData.description,
        feed_category_id: initialData.feed_category_id,
        unit_id: initialData.unit_id,
        minimum_stock: initialData.minimum_stock,
        warning_stock: initialData.warning_stock,
        waste_ratio: initialData.waste_ratio,
      });
    } else {
      form.reset({
        feed_type_name: "",
        description: "",
        feed_category_id: undefined,
        unit_id: undefined,
        minimum_stock: "",
        warning_stock: "",
        waste_ratio: "",
      });
    }
  }, [initialData, isEditMode, form, feedCategories]);

  // 4. SUBMIT
  const mutation = useMutation({
    mutationFn: (values: FeedTypeFormValues) =>
      isEditMode && initialData
        ? feedTypeService.update(initialData.id, values)
        : feedTypeService.create(values),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Data jenis pakan berhasil diperbarui"
          : "Data jenis pakan berhasil ditambahkan",
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
          <FormSelect
            control={form.control}
            name="feed_category_id"
            label="Kategori Pakan"
            placeholder="Pilih kategori pakan..."
            required
            options={feedCategories}
            labelKey="category_name"
            valueKey="id"
          />

          <FormInput
            control={form.control}
            name="feed_type_name"
            label="Nama Jenis Pakan"
            placeholder="Masukkan nama jenis pakan..."
            required
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Deskripsi"
            placeholder="Masukkan deskripsi..."
            required
            rows={3}
          />

          <FormSelect
            control={form.control}
            name="unit_id"
            label="Satuan"
            placeholder="Pilih satuan..."
            required
            options={units}
            labelKey="name"
            valueKey="id"
          />

          {/* Numeric Fields dengan Increment/Decrement */}
          <FormNumber
            label="Stok Minimum"
            control={form.control}
            name="minimum_stock"
            placeholder="0"
            required
            withButtons={true}
          />

          <FormNumber
            label="Stok Peringatan"
            control={form.control}
            name="warning_stock"
            placeholder="0"
            required
            withButtons={true}
          />

          <FormNumber
            label="Rasio Limbah"
            control={form.control}
            name="waste_ratio"
            placeholder="0"
            step="0.01"
            required
            withButtons={true}
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
