import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import KanbanDnd from "./KanbanDnd.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KanbanDnd />
  </StrictMode>,
);
