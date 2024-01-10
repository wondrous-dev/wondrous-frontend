// import { Buffer } from "buffer";
declare global {
  interface Window {
    global: any;
  }
}

if (typeof window !== "undefined") {
  window.global = window;
  window.Buffer = Buffer;
}
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
