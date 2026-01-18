"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FeedTypeForm } from "../../_components/feed-type-form";
import { feedTypeService } from "@/services/feed-type.service";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconLoader } from "@tabler/icons-react";

export default function EditFeedTypePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // ========== FETCH DETAIL DATA ==========
  const { data: detailData, isLoading } = useQuery({
    queryKey: ["feed-type", id],
    queryFn: () => feedTypeService.getById(id),
    enabled: !!id,
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Master Data", href: "#" },
    { label: "Jenis Pakan", href: "/master-data/feed-type" },
    { label: "Edit Jenis Pakan", href: `/master-data/feed-type/${id}/edit` },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 bg-card p-6 rounded-md border border-border shadow-sm">
        <PageBreadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center py-12">
          <IconLoader className="animate-spin h-6 w-6 text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Loading data...</span>
        </div>
      </div>
    );
  }

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
            Edit Jenis Pakan
          </h2>
          <p className="text-muted-foreground text-sm">
            Perbarui data jenis pakan.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-2xl">
        <FeedTypeForm
          initialData={detailData?.data}
          isEditMode={true}
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
