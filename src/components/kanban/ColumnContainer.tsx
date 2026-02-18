import React from "react";

type ColumnContainerProps = {
  title: string;
  children: React.ReactNode;
};

export default function ColumnContainer({
  title,
  children,
}: ColumnContainerProps) {
  return (
    <div className="w-[320px] shrink-0 rounded-2xl bg-slate-900/70 border border-slate-700/50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-slate-100 font-semibold">{title}</h3>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
