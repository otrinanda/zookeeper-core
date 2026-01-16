"use client";

import { use } from "react"; // React 19 / Next 15+ feature untuk unwrap params
import { useQuery } from "@tanstack/react-query";
import { animalService } from "@/services/animal.service";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControl } from "@/components/shared/pagination-control";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowLeft, IconEdit, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

export default function FamilyDetailPage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  // 1. Unwrap Params (Next.js 15+ style)
  const { familyId } = use(params);

  const router = useRouter();
  const searchParams = useSearchParams();

  // 2. Ambil Page dari URL
  const page = Number(searchParams.get("page")) || 1;
  const limit = 20; // Kita bisa tampilkan lebih banyak data di full page

  // 3. Fetch Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["animals", "family", familyId, { page, limit }],
    queryFn: () => animalService.getDetailsByFamily(familyId, { page, limit }),
  });

  const animals = data?.data || [];
  const meta = data?.meta;

  // 4. Handle Page Change
  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams(searchParams);
    p.set("page", newPage.toString());
    router.push(`?${p.toString()}`);
  };
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Data Hewan", href: "/dashboard/animal" },
    {
      label: "Data Per Family",
      href: "/",
    },
  ];

  return (
    <div className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm">
      <PageBreadcrumb items={breadcrumbItems} />
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/animal">
            <IconArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Daftar Anggota Family
          </h2>
          <p className="text-muted-foreground text-sm">
            Menampilkan seluruh satwa dalam kelompok ini.
          </p>
        </div>
      </div>

      {/* Tabel */}
      <div className="rounded-md border border-border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="w-15">No</TableHead>
              <TableHead>Nama Satwa</TableHead>
              <TableHead>ID / Kode</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Klasifikasi</TableHead>
              <TableHead>Entitas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton Loading Row
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-red-500"
                >
                  Gagal memuat data. Silakan coba lagi.
                </TableCell>
              </TableRow>
            ) : animals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-slate-500"
                >
                  Tidak ada data hewan dalam family ini.
                </TableCell>
              </TableRow>
            ) : (
              animals.map((animal, index) => (
                <TableRow key={animal.id} className="hover:bg-card/80">
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell className="font-medium text-primary">
                    {animal.animal_name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
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
                        <Link href={`/dashboard/animal/${animal.id}`}>
                          <IconEye size={16} />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="link"
                        size="icon"
                        className="h-8 w-8 text-secondary"
                      >
                        <Link href={`/dashboard/animal/${animal.id}/edit`}>
                          <IconEdit size={16} />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-border">
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
