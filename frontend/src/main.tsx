import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme before React mounts to avoid flash
(() => {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") document.documentElement.classList.add("dark");
    if (stored === "light") document.documentElement.classList.remove("dark");
  } catch {}
})();

createRoot(document.getElementById("root")!).render(<App />);
