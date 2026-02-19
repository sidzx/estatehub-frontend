  import { Buffer } from "buffer";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  (window as any).global = window;
  (window as any).Buffer = Buffer;
  import { createRoot } from "react-dom/client";
  import App from "./app/App.jsx";
  import "./styles/index.css";
import { AuthDialog } from "./app/components/AuthDialog.jsx";

  createRoot(document.getElementById("root")!).render(
  
  <BrowserRouter>
  <App/>
</BrowserRouter>
);
  