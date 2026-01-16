"use client";

import { useState } from "react"; // Import useState
import { useQuery } from "@tanstack/react-query";
import { animalService } from "@/services/animal.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconEdit, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PaginationControl } from "@/components/shared/pagination-control"; // Import komponen baru
import { AnimalDetailItem } from "@/services/animal.service";

interface AnimalSubListProps {
  familyId: string;
  familyName: string;
}

export function AnimalSubList({ familyId, familyName }: AnimalSubListProps) {
  // 1. GUNAKAN LOCAL STATE UNTUK PAGINATION SUB-TABLE
  const [page, setPage] = useState(1);
  const limit = 10; // Limit per halaman untuk sub-table (bisa disesuaikan)

  const { data, isLoading, isError } = useQuery({
    // Tambahkan 'page' ke queryKey agar data refresh saat page berubah
    queryKey: ["animals", "family", familyId, { page, limit }],
    queryFn: () => animalService.getDetailsByFamily(familyId, { page, limit }),
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-red-500 text-sm">Gagal memuat data anggota.</div>
    );
  }

  const animals = data.data || [];
  const meta = data.meta; // Ambil meta pagination dari backend

  if (animals.length === 0) {
    return (
      <div className="p-4 text-slate-500 text-sm italic">
        Tidak ada hewan terdaftar di family {familyName}.
      </div>
    );
  }

  return (
    <div className="p-4 bg-card shadow-inner">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
        Daftar Anggota: {familyName}
      </h4>
      <div className="rounded-md border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card/80 rounded-t-md">
              <TableHead className="w-12.5">No</TableHead>
              <TableHead>Nama Satwa</TableHead>
              <TableHead>ID / Kode</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Klasifikasi</TableHead>
              <TableHead>Entitas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animals.map((animal: AnimalDetailItem, index: number) => (
              <TableRow key={animal.id} className="hover:bg-card-50">
                {/* Hitung No urut berdasarkan halaman: (page - 1) * limit + index + 1 */}
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell className="font-medium text-primary">
                  {animal.animal_name}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {animal.identifier_code || "-"}
                </TableCell>
                <TableCell>{animal.animal_genders_name}</TableCell>
                <TableCell>{animal.animal_classification}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      animal.animal_entity === "Individu"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {animal.animal_entity}
                    {animal.komunal_quantity > 1 &&
                      ` (${animal.komunal_quantity})`}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      asChild
                      variant="link"
                      size="icon"
                      className="h-8 w-8 text-secondary"
                    >
                      <Link href={`/animal/${animal.id}`}>
                        <IconEye size={16} />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="link"
                      size="icon"
                      className="h-8 w-8 text-secondary"
                    >
                      <Link href={`/animal/${animal.id}/edit`}>
                        <IconEdit size={16} />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 2. PASANG PAGINATION CONTROL */}
      {/* Menggunakan setPage local state */}
      <PaginationControl
        currentPage={page}
        totalPages={meta?.total_pages || 1} // Pastikan backend kirim total_pages, atau hitung Math.ceil(meta.total / limit)
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
