import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import OverlayCard from "./components/kanban/OverlayCard";
import KanbanColumn from "./components/kanban/KanbanColumn";
import { addTask, getTaskTitle, moveTask } from "./features/kanban/board-utils";
import {
  initialBoardState,
  initialDraftByColumn,
} from "./features/kanban/data";
import type {
  BoardState,
  ColumnId,
  DraftByColumn,
} from "./features/kanban/types";
import createLeadId from "./helpers/create-id";

export default function KanbanDnd() {
  const [board, setBoard] = useState<BoardState>(initialBoardState);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [draftByColumn, setDraftByColumn] =
    useState<DraftByColumn>(initialDraftByColumn);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const columns = useMemo(
    () => board.columnOrder.map((id) => board.columns[id]),
    [board],
  );

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    setActiveTaskId(id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;
    setBoard((prev) => moveTask(prev, activeId, overId));
  }

  function addTaskToColumn(columnId: ColumnId, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = createLeadId();
    setBoard((prev) => addTask(prev, columnId, trimmed, id));
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-275">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              Kanban (LEADS)
            </h1>
            <p className="text-sm text-slate-400">
              Drag cards to reorder and move them between columns.
            </p>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-2">
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={board.tasks}
                draftValue={draftByColumn[col.id]}
                onDraftChange={(value) =>
                  setDraftByColumn((prev) => ({
                    ...prev,
                    [col.id]: value,
                  }))
                }
                onAddTask={() => {
                  addTaskToColumn(col.id, draftByColumn[col.id]);
                  setDraftByColumn((prev) => ({ ...prev, [col.id]: "" }));
                }}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTaskId ? (
              <OverlayCard title={getTaskTitle(board, activeTaskId)} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
