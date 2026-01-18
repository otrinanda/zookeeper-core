"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Services & Types
import { unitAreaService } from "@/services/unit-area.service";
import { UnitAreaTableColumns } from "./_components/columns";
import { UnitAreaForm } from "./_components/unit-area-form";

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
import { IconPlus, IconSearch, IconLoader } from "@tabler/icons-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function UnitAreaPage() {
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
    queryKey: ["unit-areas", { page, keyword, limit }],
    queryFn: () => unitAreaService.getList({ page, limit, keyword }),
  });

  const tableData = data?.data || [];
  const meta = data?.meta;

  // ========== FETCH DETAIL UNTUK EDIT ==========
  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["unit-area", selectedId],
    queryFn: () => unitAreaService.getById(selectedId!),
    enabled: !!selectedId, // Hapus isFormOpen agar langsung fetch saat selectedId set
  });

  // ========== DELETE MUTATION ==========
  const deleteMutation = useMutation({
    mutationFn: (id: string) => unitAreaService.delete(id),
    onSuccess: () => {
      toast.success("Data area unit berhasil dihapus");
      setIsDeleteOpen(false);
      setSelectedId(null);
      setSelectedName(null);
      queryClient.invalidateQueries({ queryKey: ["unit-areas"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Gagal menghapus data area unit"),
  });

  // ========== TABLE SETUP ==========
  const columns = useMemo(
    () =>
      UnitAreaTableColumns(
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
    queryClient.invalidateQueries({ queryKey: ["unit-areas"] });
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
    { label: "Area Unit", href: "/master-data/unit-area" },
  ];

  return (
    <div className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm">
      {/* BREADCRUMB */}
      <PageBreadcrumb items={breadcrumbItems} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Area Unit</h2>
          <p className="text-muted-foreground text-sm">
            Kelola daftar area unit di taman satwa.
          </p>
        </div>
      </div>

      {/* SEARCH & ACTION BAR */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari area unit..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
            onBlur={() => handleSearch(searchTerm)}
          />
        </div>

        <Button
          onClick={() => {
            setSelectedId(null);
            setIsFormOpen(true);
          }}
          className="bg-primary hover:bg-primary/80"
        >
          <IconPlus className="mr-2 h-4 w-4" /> Tambah Area Unit
        </Button>
      </div>

      {/* TABLE */}
      <div className="rounded-md border border-border bg-background shadow-sm">
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
                      Tidak ada data area unit
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* PAGINATION */}
        {meta && (
          <div className="flex justify-between gap-4 p-4 border-t border-border">
            <PaginationControl
              currentPage={page}
              totalPages={meta ? Math.ceil(meta.total / limit) : 1}
              itemsPerPage={limit}
              totalItems={meta?.total || 0}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedId ? "Edit Area Unit" : "Tambah Area Unit Baru"}
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
            <UnitAreaForm
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
            <AlertDialogTitle>Hapus Area Unit?</AlertDialogTitle>
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
