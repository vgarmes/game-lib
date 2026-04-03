"use client";

import { Game } from "@/types/trpc";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "platform.name",
    header: "Platform",
  },
  {
    accessorKey: "edition",
    header: "Edition",
  },
];
