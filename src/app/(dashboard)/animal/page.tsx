"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { animalService } from "@/services/animal.service";
import { columns } from "./_components/columns";
import { AnimalSubList } from "./_components/animal-sub-list";
import { PaginationControl } from "@/components/shared/pagination-control"; // Import komponen baru

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
import { IconPlus, IconSearch } from "@tabler/icons-react";
import Link from "next/link";

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
    columns,
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
    <div className="space-y-6">
      {/* <div className="flex justify-between w-full">
        <div className="bg-amber-500 w-10">a</div>
        <div className="bg-amber-600 w-10">b</div>
      </div> */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Hewan</h2>
          <p className="text-muted-foreground">
            Data dikelompokkan berdasarkan Family dan Spesies.
          </p>
        </div>

      </div>

      <div className="flex items-center justify-between gap-2">
        
        <div className="relative ">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari family, spesies..."
            className="pl-9 bg-white w-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Eksekusi search saat Enter ditekan
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
            // Atau onBlur (saat keluar kolom input)
            onBlur={() => handleSearch(searchTerm)}
          />
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/animal/create">
            <IconPlus className="mr-2 h-4 w-4" /> Tambah Hewan
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && (
                    <TableRow  key={`${row.id}-expanded`}>
                      <TableCell colSpan={columns.length} className="p-0 bg-slate-50">
                        {/* ID row parent tetap aman */}
                        <AnimalSubList 
                            familyId={row.original.id} 
                            familyName={row.original.family_name} 
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>

        {/* 5. PASANG PAGINATION CONTROL TABEL UTAMA */}
        {/* Disini kita pass handlePageChange yang mengupdate URL */}
        <div className="p-4 border-t">
          <PaginationControl 
            currentPage={page}
            totalPages={meta ? Math.ceil(meta.total / limit) : 1}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default function AnimalPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manajemen Hewan</h2>
            <p className="text-muted-foreground">
              Data dikelompokkan berdasarkan Family dan Spesies.
            </p>
          </div>
        </div>
        <div className="rounded-md border bg-white shadow-sm p-24 text-center">
          Memuat data...
        </div>
      </div>
    }>
      <AnimalPageContent />
    </Suspense>
  );
}