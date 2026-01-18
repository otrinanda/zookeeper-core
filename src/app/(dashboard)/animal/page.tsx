"use client";

import { useState, Suspense, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { animalService } from "@/services/animal.service";
import { FamilyTableColumns } from "./_components/columns";
import { AnimalSubList } from "./_components/animal-sub-list";
import { PaginationControl } from "@/components/shared/pagination-control";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
// Import hooks untuk URL Params
import { useRouter, useSearchParams } from "next/navigation";

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  ExpandedState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { Can } from "@/components/shared/can";
import { ROLE_CODES } from "@/lib/permissions";

function AnimalPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // 1. AMBIL PAGE & KEYWORD DARI URL
  // Default ke 1 jika tidak ada di URL
  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const limit = 10;

  // 2. Fetch Data (QueryKey menyertakan params dari URL)
  const { data, isLoading } = useQuery({
    queryKey: ["animals", "headers", { page, keyword }],
    queryFn: () => animalService.getHeaders({ page, limit, keyword }),
  });

  const tableData = data?.data || [];
  const meta = data?.meta;

  const table = useReactTable({
    data: tableData,
    columns: FamilyTableColumns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  // 3. FUNGSI UPDATE URL SAAT GANTI HALAMAN
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    // Pertahankan keyword jika ada
    if (keyword) params.set("keyword", keyword);

    router.push(`?${params.toString()}`);
  };

  // 4. FUNGSI UPDATE URL SAAT SEARCHING
  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set("keyword", val);
      params.set("page", "1"); // Reset ke halaman 1 saat search baru
    } else {
      params.delete("keyword");
    }
    router.push(`?${params.toString()}`);
  };

  // State local sementara untuk input search agar tidak trigger request tiap ketik
  const [searchTerm, setSearchTerm] = useState(keyword);

  return (
    <div className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Hewan</h2>
          <p className="text-muted-foreground">
            Data dikelompokkan berdasarkan Family dan Spesies.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari family, spesies..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Eksekusi search saat Enter ditekan
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
            // Atau onBlur (saat keluar kolom input)
            onBlur={() => handleSearch(searchTerm)}
          />
        </div>

        {/* Only admin, manager, and certain roles can add new animal */}
        <Can
          roles={[
            ROLE_CODES.SUPER_ADMIN,
            ROLE_CODES.DIRECTOR_UTAMA,
            ROLE_CODES.DIRECTOR_OPS,
            ROLE_CODES.MANAGER,
            ROLE_CODES.KURATOR,
            ROLE_CODES.HEAD_KEEPER,
          ]}
        >
          <Button asChild className="bg-primary hover:bg-primary/80">
            <Link href="/animal/create">
              <IconPlus className="mr-2 h-4 w-4" /> Tambah Hewan
            </Link>
          </Button>
        </Can>
      </div>

      <div className="rounded-md border border-border bg-background shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {FamilyTableColumns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={FamilyTableColumns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <IconSearch className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Tidak ada data ditemukan
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell
                        colSpan={FamilyTableColumns.length}
                        className="p-0 bg-background"
                      >
                        {/* ID row parent tetap aman */}
                        <AnimalSubList
                          familyId={row.original.id}
                          familyName={row.original.family_name}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>

        {/* 5. PASANG PAGINATION CONTROL TABEL UTAMA */}
        {/* Disini kita pass handlePageChange yang mengupdate URL */}
        <div className="p-4 border-t border-border">
          <PaginationControl
            currentPage={page}
            totalPages={meta ? Math.ceil(meta.total / limit) : 1}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            itemsPerPage={limit}
            totalItems={meta?.total || 0}
          />
        </div>
      </div>
    </div>
  );
}

export default function AnimalPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Data Hewan", href: "/dashboard/animal" },
  ];
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Manajemen Hewan
              </h2>
              <p className="text-muted-foreground">
                Data dikelompokkan berdasarkan Family dan Spesies.
              </p>
            </div>
          </div>
          <div className="rounded-md border border-border bg-background shadow-sm p-24 text-center">
            Memuat data...
          </div>
        </div>
      }
    >
      <PageBreadcrumb items={breadcrumbItems} />
      <AnimalPageContent />
    </Suspense>
  );
}
