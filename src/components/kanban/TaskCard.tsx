import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskCardProps = {
  id: string;
  title: string;
};

export default function TaskCard({ id, title }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-2xl border border-slate-700/50 bg-slate-800/70 p-3 text-slate-100 shadow-sm",
        "cursor-grab active:cursor-grabbing select-none",
        isDragging ? "opacity-40" : "opacity-100",
      ].join(" ")}
      {...attributes}
      {...listeners}
    >
      <p className="text-sm leading-snug">{title}</p>
      <p className="mt-2 text-xs text-slate-400">#{id}</p>
    </div>
  );
}
