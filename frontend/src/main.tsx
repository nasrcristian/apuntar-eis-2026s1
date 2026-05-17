import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { SnackbarProvider } from "notistack";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SnackbarProvider
        autoHideDuration={5000}
        preventDuplicate
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>,
);
