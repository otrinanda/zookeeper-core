"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FamilyListItem } from "@/services/family.service";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export interface FamilyActionsProps {
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export const FamilyTableColumns = (
  onEdit?: (id: string) => void,
  onDelete?: (id: string, name: string) => void,
): ColumnDef<FamilyListItem>[] => [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-medium">{row.index + 1}</span>
    ),
    size: 60,
  },
  {
    accessorKey: "family_name",
    header: "Family",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.getValue("family_name")}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => (
      <div className=" min-w-200 text-wrap">
        <span className="text-muted-foreground line-clamp-2 text-sm">
          {row.getValue("description")}
        </span>
      </div>
    ),
    // size: 600,
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const id = row.original.id;
      const family_name = row.original.family_name;

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
            onClick={() => onDelete?.(id, family_name)}
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
