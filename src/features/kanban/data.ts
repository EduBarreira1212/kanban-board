import type { BoardState, DraftByColumn } from "./types";

export const initialBoardState: BoardState = {
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

export const initialDraftByColumn: DraftByColumn = {
  message: "",
  scheduling: "",
  visit: "",
};
