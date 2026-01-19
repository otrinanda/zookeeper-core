"use client";

import { useRouter } from "next/navigation";
import { FeedTypeForm } from "../_components/feed-type-form";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";

export default function CreateFeedTypePage() {
  const router = useRouter();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Master Data", href: "#" },
    { label: "Jenis Pakan", href: "/master-data/feed-type" },
    { label: "Tambah Jenis Pakan", href: "/master-data/feed-type/create" },
  ];

  return (
    <div className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm">
      {/* BREADCRUMB */}
      <PageBreadcrumb items={breadcrumbItems} />

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-8 w-8 p-0"
        >
          <IconChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Tambah Jenis Pakan
          </h2>
          <p className="text-muted-foreground text-sm">
            Tambahkan jenis pakan baru ke sistem.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-2xl">
        <FeedTypeForm
          isEditMode={false}
          onSuccess={() => {
            router.push("/master-data/feed-type");
          }}
          onCancel={() => {
            router.back();
          }}
        />
      </div>
    </div>
  );
}
