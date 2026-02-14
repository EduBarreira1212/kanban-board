import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import ColumnContainer from "./ColumnContainer";
import ColumnDropZone from "./ColumnDropZone";
import TaskCard from "./TaskCard";
import type { Column, Task } from "../../features/kanban/types";

type KanbanColumnProps = {
  column: Column;
  tasks: Record<string, Task>;
  draftValue: string;
  onDraftChange: (value: string) => void;
  onAddTask: () => void;
};

export default function KanbanColumn({
  column,
  tasks,
  draftValue,
  onDraftChange,
  onAddTask,
}: KanbanColumnProps) {
  return (
    <ColumnContainer title={column.title}>
      <form
        className="mb-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onAddTask();
        }}
      >
        <input
          value={draftValue}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="New lead..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white"
        >
          Add
        </button>
      </form>

      <SortableContext
        items={column.taskIds}
        strategy={verticalListSortingStrategy}
      >
        <ColumnDropZone id={column.id}>
          {column.taskIds.map((taskId) => (
            <TaskCard
              key={taskId}
              id={taskId}
              title={tasks[taskId]?.title ?? taskId}
            />
          ))}
        </ColumnDropZone>
      </SortableContext>
    </ColumnContainer>
  );
}
