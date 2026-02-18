import { arrayMove } from "@dnd-kit/sortable";

import type { BoardState, Column, ColumnId } from "./types";

export function findColumnOfTask(board: BoardState, taskId: string): ColumnId | null {
  for (const colId of board.columnOrder) {
    if (board.columns[colId].taskIds.includes(taskId)) {
      return colId;
    }
  }

  return null;
}

export function getTaskTitle(board: BoardState, taskId: string) {
  return board.tasks[taskId]?.title ?? taskId;
}

export function moveTask(board: BoardState, activeId: string, overId: string): BoardState {
  const fromColId = findColumnOfTask(board, activeId);
  if (!fromColId) {
    return board;
  }

  const overIsColumn = board.columnOrder.includes(overId as ColumnId);
  const toColId: ColumnId | null = overIsColumn
    ? (overId as ColumnId)
    : findColumnOfTask(board, overId);

  if (!toColId) {
    return board;
  }

  const fromCol = board.columns[fromColId];
  const toCol = board.columns[toColId];

  const fromIndex = fromCol.taskIds.indexOf(activeId);
  if (fromIndex === -1) {
    return board;
  }

  const rawToIndex = overIsColumn ? toCol.taskIds.length : toCol.taskIds.indexOf(overId);
  const toIndex = rawToIndex === -1 ? toCol.taskIds.length : rawToIndex;

  if (fromColId === toColId) {
    if (fromIndex === toIndex) {
      return board;
    }

    const newTaskIds = arrayMove(fromCol.taskIds, fromIndex, toIndex);
    return {
      ...board,
      columns: {
        ...board.columns,
        [fromColId]: { ...fromCol, taskIds: newTaskIds },
      },
    };
  }

  const newFromTaskIds = fromCol.taskIds.filter((id) => id !== activeId);
  const newToTaskIds = [...toCol.taskIds];
  newToTaskIds.splice(toIndex, 0, activeId);

  return {
    ...board,
    columns: {
      ...board.columns,
      [fromColId]: { ...fromCol, taskIds: newFromTaskIds },
      [toColId]: { ...toCol, taskIds: newToTaskIds },
    },
  };
}

export function addTask(board: BoardState, columnId: ColumnId, title: string, id: string): BoardState {
  const newTasks = {
    ...board.tasks,
    [id]: { id, title },
  };

  const col = board.columns[columnId];
  const newCol: Column = {
    ...col,
    taskIds: [id, ...col.taskIds],
  };

  return {
    ...board,
    tasks: newTasks,
    columns: {
      ...board.columns,
      [columnId]: newCol,
    },
  };
}
