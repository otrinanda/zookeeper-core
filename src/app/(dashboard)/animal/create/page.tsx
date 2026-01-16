"use client";

import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { AnimalForm } from "../_components/animal-form";

export default function CreateAnimalPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Data Hewan", href: "/dashboard/animal" },
    { label: "Tambah Hewan", href: "/dashboard/animal/create" },
  ];
  return (
    <div className="max-w-7xl mx-auto py-6">
      <PageBreadcrumb items={breadcrumbItems} />
      <AnimalForm isEditMode={false} />
    </div>
  );
}
