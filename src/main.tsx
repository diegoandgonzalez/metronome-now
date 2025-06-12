import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./i18n/index";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
