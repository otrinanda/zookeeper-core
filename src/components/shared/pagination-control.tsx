"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  itemsPerPage?: number;
  totalItems?: number;
}

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  itemsPerPage = 20,
  totalItems = 0,
}: PaginationControlProps) {
  // Hitung item range untuk teks info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const hasItems = totalItems > 0;

  // Fungsi helper untuk menghandle klik (mencegah refresh jika pakai href #)
  const handlePageChange = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (page > 0 && page <= totalPages && !isLoading) {
      onPageChange(page);
    }
  };

  // Logika untuk menampilkan ellipsis (...)
  // Contoh: [1, '...', 4, 5, 6, '...', 10]
  const renderPageNumbers = () => {
    const pages = [];
    const showMax = 5; // Jumlah angka maksimal yang tampil berurutan

    // Kasus 1: Halaman sedikit (kurang dari 7), tampilkan semua
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    // Kasus 2: Halaman banyak
    else {
      // Selalu tampilkan halaman 1
      pages.push(1);

      // Jika current page jauh dari awal, tambahkan '...'
      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      // Tampilkan halaman di sekitar current page
      // Range: current-1 sampai current+1
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i === 1 || i === totalPages) continue; // Hindari duplikasi ujung
        pages.push(i);
      }

      // Jika current page jauh dari akhir, tambahkan '...'
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Selalu tampilkan halaman terakhir
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "ellipsis-start" || page === "ellipsis-end") {
        return (
          <PaginationItem key={page}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const pageNumber = page as number;
      return (
        <PaginationItem key={pageNumber}>
          <PaginationLink
            href="#"
            isActive={currentPage === pageNumber}
            onClick={(e) => handlePageChange(pageNumber, e)}
            className="cursor-pointer"
          >
            {pageNumber}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Info Text */}
      {hasItems && (
        <div className="text-sm text-muted-foreground w-80">
          Menampilkan {startItem}-{endItem} dari {totalItems} data
        </div>
      )}

      {/* Pagination */}
      <Pagination className="justify-end my-0">
        <PaginationContent>
          {/* Tombol Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => handlePageChange(currentPage - 1, e)}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/* Angka Halaman */}
          {renderPageNumbers()}

          {/* Tombol Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => handlePageChange(currentPage + 1, e)}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
