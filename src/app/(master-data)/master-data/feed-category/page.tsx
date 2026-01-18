"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Services & Types
import { feedCategoryService } from "@/services/feed-category.service";
import { FeedCategoryColumns } from "./_components/columns";
import { FeedCategoryForm } from "./_components/feed-category-form";

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
import {
  IconPlus,
  IconSearch,
  IconLoader,
  IconLoader2,
} from "@tabler/icons-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function FeedCategoryPage() {
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
    queryKey: ["feed-categories", { page, keyword, limit }],
    queryFn: () => feedCategoryService.getList({ page, limit, keyword }),
  });

  const tableData = data?.data || [];
  const meta = data?.meta;

  // ========== FETCH DETAIL UNTUK EDIT ==========
  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["feed-category", selectedId],
    queryFn: () => feedCategoryService.getById(selectedId!),
    enabled: !!selectedId,
  });

  // ========== DELETE MUTATION ==========
  const deleteMutation = useMutation({
    mutationFn: (id: string) => feedCategoryService.delete(id),
    onSuccess: () => {
      toast.success("Data kategori pakan berhasil dihapus");
      setIsDeleteOpen(false);
      setSelectedId(null);
      setSelectedName(null);
      queryClient.invalidateQueries({ queryKey: ["feed-categories"] });
    },
    onError: (err: Error) => toast.error(err.message || "Gagal menghapus data"),
  });

  // ========== TABLE SETUP ==========
  const columns = useMemo(
    () =>
      FeedCategoryColumns(
        (id) => {
          setSelectedId(id);
          setIsFormOpen(true);
        },
        (id, name) => {
          setSelectedId(id);
          setSelectedName(name);
          setIsDeleteOpen(true);
        },
      ),
    [],
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
    queryClient.invalidateQueries({ queryKey: ["feed-categories"] });
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
    { label: "Kategori Pakan", href: "/master-data/feed-category" },
  ];

  return (
    <div className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm">
      {/* BREADCRUMB */}
      <PageBreadcrumb items={breadcrumbItems} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kategori Pakan</h2>
          <p className="text-muted-foreground text-sm">
            Kelola daftar kategori pakan untuk hewan.
          </p>
        </div>
      </div>

      {/* SEARCH & ACTION BAR */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kategori pakan..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
            onBlur={() => handleSearch(searchTerm)}
          />
        </div>

        <Can roles={[ROLE_CODES.SUPER_ADMIN]}>
          <Button
            onClick={() => {
              setSelectedId(null);
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/80"
          >
            <IconPlus className="mr-2 h-4 w-4" /> Tambah Kategori Pakan
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
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length > 0 ? (
              // RENDER DATA
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // EMPTY STATE
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <IconSearch className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Tidak ada data kategori pakan ditemukan
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
              {selectedId
                ? "Edit Kategori Pakan"
                : "Tambah Kategori Pakan Baru"}
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
            <FeedCategoryForm
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
            <AlertDialogTitle>Hapus Kategori Pakan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus &quot;
              <strong>{selectedName}</strong>
              &quot;? Tindakan ini tidak dapat dibatalkan.
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
                <IconLoader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
