export type ColumnId = "message" | "scheduling" | "visit";

export type Task = {
  id: string;
  title: string;
};

export type Column = {
  id: ColumnId;
  title: string;
  taskIds: string[];
};

export type BoardState = {
  tasks: Record<string, Task>;
  columns: Record<ColumnId, Column>;
  columnOrder: ColumnId[];
};

export type DraftByColumn = Record<ColumnId, string>;
