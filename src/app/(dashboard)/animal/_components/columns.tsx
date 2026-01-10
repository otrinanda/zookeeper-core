"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AnimalHeader } from "@/services/animal.service"; // Pastikan type ini ada
import { Button } from "@/components/ui/button";
import { IconChevronRight, IconChevronDown, IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";

export const columns: ColumnDef<AnimalHeader>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 hover:bg-slate-200"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? (
            <IconChevronDown size={16} />
          ) : (
            <IconChevronRight size={16} />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <span className="text-slate-500">{row.index + 1}</span>,
  },
  {
    accessorKey: "family_name",
    header: "Family",
    cell: ({ row }) => <span className="font-semibold">{row.getValue("family_name")}</span>,
  },
  {
    accessorKey: "species_name",
    header: "Spesies",
  },
  {
    accessorKey: "local_name",
    header: "Nama Lokal",
  },
  {
    accessorKey: "iucn", // Sesuaikan dengan response API (iucn atau iucn_status)
    header: "Status IUCN",
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
        {row.getValue("iucn") || "NE"}
      </span>
    ),
  },
  {
    accessorKey: "total",
    header: "Total Satwa",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-bold text-emerald-600">{row.getValue("total")}</span>
        <span className="text-xs text-slate-400">ekor</span>
      </div>
    ),
  },

    {
    accessorKey: "id",
    header: "action",
    cell: ({ row }) =>  (
    // <span className="font-semibold">{row.getValue("id")}</span>,
    <Button variant="link" size="sm" asChild className="text-emerald-600 h-auto p-0">
        <Link href={`/animal/family/${row.getValue("id")}`}>
            <IconExternalLink size={14} className="ml-1" />
        </Link>
      </Button>
    )
  },
];