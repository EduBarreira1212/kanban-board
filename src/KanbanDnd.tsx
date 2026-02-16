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

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import ColumnContainer from "./components/kanban/ColumnContainer";
import ColumnDropZone from "./components/kanban/ColumnDropZone";
import OverlayCard from "./components/kanban/OverlayCard";
import TaskCard from "./components/kanban/TaskCard";
import createLeadId from "./helpers/create-id";

type ColumnId = "message" | "scheduling" | "visit";

type Task = {
  id: string;
  title: string;
};

type Column = {
  id: ColumnId;
  title: string;
  taskIds: string[];
};

type BoardState = {
  tasks: Record<string, Task>;
  columns: Record<ColumnId, Column>;
  columnOrder: ColumnId[];
};

const initialState: BoardState = {
  tasks: {
    t1: { id: "t1", title: "Criar layout" },
    t2: { id: "t2", title: "Integrar API" },
    t3: { id: "t3", title: "Escrever testes" },
    t4: { id: "t4", title: "Refinar UI" },
  },
  columns: {
    message: { id: "message", title: "Message", taskIds: ["t1", "t4"] },
    scheduling: { id: "scheduling", title: "Scheduling", taskIds: ["t2"] },
    visit: { id: "visit", title: "Visit", taskIds: ["t3"] },
  },
  columnOrder: ["message", "scheduling", "visit"],
};

function findColumnOfTask(board: BoardState, taskId: string): ColumnId | null {
  for (const colId of board.columnOrder) {
    if (board.columns[colId].taskIds.includes(taskId)) return colId;
  }
  return null;
}

function getTaskTitle(board: BoardState, taskId: string) {
  return board.tasks[taskId]?.title ?? taskId;
}

export default function KanbanDnd() {
  const [board, setBoard] = useState<BoardState>(initialState);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [draftByColumn, setDraftByColumn] = useState<Record<ColumnId, string>>({
    message: "",
    scheduling: "",
    visit: "",
  });

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

    setBoard((prev) => {
      const fromColId = findColumnOfTask(prev, activeId);
      if (!fromColId) return prev;

      const overIsColumn = prev.columnOrder.includes(overId as ColumnId);
      const toColId: ColumnId | null = overIsColumn
        ? (overId as ColumnId)
        : findColumnOfTask(prev, overId);

      if (!toColId) return prev;

      const fromCol = prev.columns[fromColId];
      const toCol = prev.columns[toColId];

      const fromIndex = fromCol.taskIds.indexOf(activeId);

      const toIndex = overIsColumn
        ? toCol.taskIds.length
        : toCol.taskIds.indexOf(overId);

      if (fromColId === toColId) {
        const newTaskIds = arrayMove(fromCol.taskIds, fromIndex, toIndex);
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [fromColId]: { ...fromCol, taskIds: newTaskIds },
          },
        };
      }

      const newFromTaskIds = fromCol.taskIds.filter((id) => id !== activeId);

      const newToTaskIds = [...toCol.taskIds];
      newToTaskIds.splice(toIndex, 0, activeId);

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [fromColId]: { ...fromCol, taskIds: newFromTaskIds },
          [toColId]: { ...toCol, taskIds: newToTaskIds },
        },
      };
    });
  }

  function addTask(columnId: ColumnId, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = createLeadId();

    setBoard((prev) => {
      const newTasks = {
        ...prev.tasks,
        [id]: { id, title: trimmed },
      };

      const col = prev.columns[columnId];
      const newCol: Column = {
        ...col,
        taskIds: [id, ...col.taskIds],
      };

      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          [columnId]: newCol,
        },
      };
    });
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
              <ColumnContainer key={col.id} title={col.title}>
                <form
                  className="mb-3 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addTask(col.id, draftByColumn[col.id]);
                    setDraftByColumn((prev) => ({ ...prev, [col.id]: "" }));
                  }}
                >
                  <input
                    value={draftByColumn[col.id]}
                    onChange={(e) =>
                      setDraftByColumn((prev) => ({
                        ...prev,
                        [col.id]: e.target.value,
                      }))
                    }
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
                  items={col.taskIds}
                  strategy={verticalListSortingStrategy}
                >
                  <ColumnDropZone id={col.id}>
                    {col.taskIds.map((taskId) => (
                      <TaskCard
                        key={taskId}
                        id={taskId}
                        title={board.tasks[taskId].title}
                      />
                    ))}
                  </ColumnDropZone>
                </SortableContext>
              </ColumnContainer>
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
