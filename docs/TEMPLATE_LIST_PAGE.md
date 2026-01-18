# 📋 TEMPLATE: Membuat List Page Baru

## Copy-Paste Template untuk Konsistensi UI/UX

Gunakan template ini saat membuat halaman list/master-data baru. Ikuti struktur dan styling yang sudah terbukti di Animal dan Unit-Area pages.

---

## 📁 File Structure

Buat struktur folder berikut:

```
src/app/(master-data)/master-data/
├── resource-name/
│   ├── _components/
│   │   ├── columns.tsx          (Table columns definition)
│   │   └── resource-form.tsx    (Form component untuk create/edit)
│   └── page.tsx                 (Main list page)
```

---

## 1️⃣ SERVICE FILE

### `src/services/resource-name.service.ts`

```typescript
import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { ResourceFormValues } from "@/types/schemas/resource-name.schema";

// --- Types untuk Response Data ---
export interface ResourceListItem {
  id: string;
  name: string;
  description: string;
  // Add more fields as needed
  created_at: string;
  updated_at: string;
}

export interface ResourceDetail extends ResourceListItem {
  // Add more details if needed
}

// --- Service Class ---
class ResourceService {
  /**
   * Fetch daftar resource dengan pagination dan search
   */
  async getList(params: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<PaginatedResponse<ResourceListItem>> {
    const { page = 1, limit = 20, keyword = "" } = params;

    const response = await api.get<PaginatedResponse<ResourceListItem>>(
      "/resource-endpoint/all", // ← GANTI endpoint
      {
        params: {
          page,
          page_size: limit,
          keyword: keyword || undefined,
        },
      },
    );

    return response.data;
  }

  /**
   * Fetch detail by ID
   */
  async getById(id: string): Promise<ApiResponse<ResourceDetail>> {
    const response = await api.get<ApiResponse<ResourceDetail>>(
      `/resource-endpoint/${id}`, // ← GANTI endpoint
    );
    return response.data;
  }

  /**
   * Create baru
   */
  async create(data: ResourceFormValues): Promise<ApiResponse<ResourceDetail>> {
    const response = await api.post<ApiResponse<ResourceDetail>>(
      "/resource-endpoint", // ← GANTI endpoint
      data,
    );
    return response.data;
  }

  /**
   * Update
   */
  async update(
    id: string,
    data: ResourceFormValues,
  ): Promise<ApiResponse<ResourceDetail>> {
    const response = await api.put<ApiResponse<ResourceDetail>>(
      `/resource-endpoint/${id}`, // ← GANTI endpoint
      data,
    );
    return response.data;
  }

  /**
   * Delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(
      `/resource-endpoint/${id}`, // ← GANTI endpoint
    );
    return response.data;
  }
}

export const resourceService = new ResourceService();
```

---

## 2️⃣ SCHEMA FILE

### `src/types/schemas/resource-name.schema.ts`

```typescript
import { z } from "zod";

// Form validation schema
export const resourceFormSchema = z.object({
  name: z.string().min(1, "Tolong isi nama!").min(2, "Nama minimal 2 karakter"),
  description: z
    .string()
    .min(1, "Tolong isi deskripsi!")
    .min(5, "Deskripsi minimal 5 karakter"),
  // Add more fields as needed
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
```

---

## 3️⃣ COLUMNS FILE

### `src/app/(master-data)/master-data/resource-name/_components/columns.tsx`

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResourceListItem } from "@/services/resource-name.service";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export interface ResourceActionsProps {
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export const ResourceTableColumns = (
  onEdit?: (id: string) => void,
  onDelete?: (id: string, name: string) => void
): ColumnDef<ResourceListItem>[] => [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-medium">
        {row.index + 1}
      </span>
    ),
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const id = row.original.id;
      const name = row.original.name;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(id)}
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-50"
          >
            <IconEdit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(id, name)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <IconTrash size={16} />
          </Button>
        </div>
      );
    },
    size: 100,
  },
];
```

---

## 4️⃣ FORM COMPONENT

### `src/app/(master-data)/master-data/resource-name/_components/resource-form.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Services & Types
import { resourceService, ResourceDetail } from "@/services/resource-name.service";
import {
  resourceFormSchema,
  ResourceFormValues,
} from "@/types/schemas/resource-name.schema";

// Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormTextarea } from "@/components/shared/form-field";
import { IconLoader2 } from "@tabler/icons-react";

interface ResourceFormProps {
  initialData?: ResourceDetail;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ResourceForm({
  initialData,
  isEditMode = false,
  onSuccess,
  onCancel,
}: ResourceFormProps) {
  // 1. SETUP FORM
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
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
    mutationFn: (values: ResourceFormValues) =>
      isEditMode && initialData
        ? resourceService.update(initialData.id, values)
        : resourceService.create(values),
    onSuccess: () => {
      toast.success(
        isEditMode ? "Data berhasil diperbarui" : "Data berhasil ditambahkan"
      );
      onSuccess?.();
    },
    onError: (err: any) =>
      toast.error(err.message || "Gagal menyimpan data"),
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
            label="Nama"
            placeholder="Masukkan nama..."
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
```

---

## 5️⃣ MAIN PAGE COMPONENT

### `src/app/(master-data)/master-data/resource-name/page.tsx`

```typescript
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Services & Types
import { resourceService } from "@/services/resource-name.service";
import { ResourceTableColumns } from "./_components/columns";
import { ResourceForm } from "./_components/resource-form";

// Components
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PaginationControl } from "@/components/shared/pagination-control";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Can } from "@/components/shared/can";
import { ROLE_CODES } from "@/lib/permissions";
import { IconPlus, IconSearch, IconLoader } from "@tabler/icons-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function ResourcePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // ========== STATE ==========
  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const limit = 20;

  const [searchTerm, setSearchTerm] = useState(keyword);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  // ========== FETCH DATA ==========
  const { data, isLoading } = useQuery({
    queryKey: ["resources", { page, keyword, limit }],
    queryFn: () => resourceService.getList({ page, limit, keyword }),
  });

  const tableData = data?.data || [];
  const meta = data?.meta;

  // ========== FETCH DETAIL UNTUK EDIT ==========
  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["resource", selectedId],
    queryFn: () => resourceService.getById(selectedId!),
    enabled: !!selectedId,
  });

  // ========== DELETE MUTATION ==========
  const deleteMutation = useMutation({
    mutationFn: (id: string) => resourceService.delete(id),
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      setIsDeleteOpen(false);
      setSelectedId(null);
      setSelectedName(null);
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Gagal menghapus data"),
  });

  // ========== TABLE SETUP ==========
  const columns = useMemo(
    () =>
      ResourceTableColumns(
        (id) => {
          setSelectedId(id);
          setIsFormOpen(true);
        },
        (id, name) => {
          setSelectedId(id);
          setSelectedName(name);
          setIsDeleteOpen(true);
        }
      ),
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ========== HANDLERS ==========
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    if (keyword) params.set("keyword", keyword);
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set("keyword", val);
      params.set("page", "1");
    } else {
      params.delete("keyword");
    }
    router.push(`?${params.toString()}`);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedId(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    queryClient.invalidateQueries({ queryKey: ["resources"] });
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteMutation.mutate(selectedId);
    }
  };

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Master Data", href: "#" },
    { label: "Resource", href: "/master-data/resource-name" },
  ];

  return (
    <div className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm">
      {/* BREADCRUMB */}
      <PageBreadcrumb items={breadcrumbItems} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resource Name</h2>
          <p className="text-muted-foreground text-sm">
            Kelola daftar resource Anda.
          </p>
        </div>
      </div>

      {/* SEARCH & ACTION BAR */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari resource..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
            onBlur={() => handleSearch(searchTerm)}
          />
        </div>

        <Can roles={[ROLE_CODES.SUPER_ADMIN, ROLE_CODES.MANAGER]}>
          <Button
            onClick={() => {
              setSelectedId(null);
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/80"
          >
            <IconPlus className="mr-2 h-4 w-4" /> Tambah Resource
          </Button>
        </Can>
      </div>

      {/* TABLE */}
      <div className="rounded-md border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // SKELETON LOADING
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length > 0 ? (
              // RENDER DATA
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // EMPTY STATE
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <IconSearch className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Tidak ada data resource
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        {meta && (
          <PaginationControl
            currentPage={meta.page}
            totalPages={meta.total_pages || Math.ceil(meta.total / limit)}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            itemsPerPage={limit}
            totalItems={meta.total}
          />
        )}
      </div>

      {/* MODAL FORM */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedId ? "Edit Resource" : "Tambah Resource Baru"}
            </DialogTitle>
          </DialogHeader>

          {selectedId && isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <IconLoader className="animate-spin h-5 w-5 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading data...
              </span>
            </div>
          ) : (
            <ResourceForm
              initialData={detailData?.data}
              isEditMode={!!selectedId}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Resource?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus "<strong>{selectedName}</strong>"?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && (
                <IconLoader className="animate-spin mr-2 h-4 w-4" />
              )}
              Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

---

## ✅ CHECKLIST SEBELUM DEPLOY

Saat menggunakan template ini, pastikan:

- [ ] Ganti semua `resource-name` dengan nama resource Anda
- [ ] Update API endpoints di service file
- [ ] Update form fields sesuai kebutuhan
- [ ] Update columns sesuai kebutuhan
- [ ] Update breadcrumb items
- [ ] Add permission check dengan role yang sesuai
- [ ] Test loading state (coba dengan debounce)
- [ ] Test empty state (coba delete semua atau search yang tidak ada)
- [ ] Test search functionality (Enter + blur)
- [ ] Test pagination
- [ ] Test create/edit/delete actions
- [ ] Check form validation
- [ ] Check toast notifications
- [ ] Test responsive design di mobile
- [ ] Verify URL params working (page & keyword)

---

## 📌 IMPORTANT NOTES

1. **useEffect di Form:** Jangan lupa untuk reset form initialData! Ini critical untuk edit mode.

```typescript
useEffect(() => {
  if (initialData && isEditMode) {
    form.reset({ field1: initialData.field1, ... });
  }
}, [initialData, isEditMode, form]);
```

2. **useEffect dengan Dropdown Dependencies:** Jika form memiliki field dropdown/select yang ambil data dari API, tambahkan dependency options ke useEffect!

```typescript
// ⚠️ CRITICAL untuk form dengan dropdown/select
const { data: optionsData } = useQuery({
  queryKey: ["dropdown-options"],
  queryFn: () => optionService.getList({ ... }),
  staleTime: 0,  // Selalu refetch, jangan cache
  gcTime: 0,     // Jangan cache setelah unmount
});

const options = useMemo(() => optionsData?.data || [], [optionsData]);

useEffect(() => {
  if (initialData && isEditMode) {
    form.reset({
      dropdown_field: initialData.dropdown_field_id,
      // ... other fields
    });
  }
}, [initialData, isEditMode, form, options]); // ← Tambah options!
```

**Mengapa?** Mencegah race condition antara options loading dan form populate. Lihat [UI_UX_CONSISTENCY_GUIDELINE.md - Troubleshooting Section](UI_UX_CONSISTENCY_GUIDELINE.md#form-dropdown-value-tidak-terpilih-saat-edit-row-berbeda) untuk penjelasan detail.

3. **Permission Check:** Selalu wrap action button dengan `<Can>` component untuk security.

```typescript
<Can roles={[ROLE_CODES.SUPER_ADMIN, ROLE_CODES.MANAGER]}>
  <Button>Tambah</Button>
</Can>
```

4. **Query Invalidation:** Selalu invalidate query setelah successful mutation.

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["resources"] });
};
```

5. **Loading State:** Gunakan Skeleton, bukan text "Memuat..."

6. **Empty State:** Gunakan Icon + Text, bukan text sederhana

---

**Happy coding! 🚀**

Untuk referensi lengkap, lihat [UI_UX_CONSISTENCY_GUIDELINE.md](UI_UX_CONSISTENCY_GUIDELINE.md)
