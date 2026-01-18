"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ZoneAreaListItem } from "@/services/zone-area.service";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export interface ZoneAreaActionsProps {
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export const ZoneAreaTableColumns = (
  onEdit?: (id: string) => void,
  onDelete?: (id: string, name: string) => void,
): ColumnDef<ZoneAreaListItem>[] => [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-medium">{row.index + 1}</span>
    ),
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Nama Area Zona",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "unit_name",
    header: "Unit Area",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("unit_name") || "-"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const id = row.original.id;
      const name = row.original.name;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(id)}
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-50"
          >
            <IconEdit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(id, name)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <IconTrash size={16} />
          </Button>
        </div>
      );
    },
    size: 100,
  },
];
