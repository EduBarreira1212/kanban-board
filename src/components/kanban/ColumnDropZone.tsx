import React from "react";
import { useSortable } from "@dnd-kit/sortable";

type ColumnDropZoneProps = {
  id: string;
  children: React.ReactNode;
};

export default function ColumnDropZone({ id, children }: ColumnDropZoneProps) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div ref={setNodeRef} className="flex flex-col gap-2 min-h-10">
      {children}
    </div>
  );
}
