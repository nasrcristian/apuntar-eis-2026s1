import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./utils/axiosConfig";

const theme = createTheme({
  palette: {
    primary: { main: '#ab4516' , contrastText: 'rgb(255, 232, 232)'},
    text: {
      primary: "#ab4516",
      secondary: "#ab4516",
    },
  },
});

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
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>,
);
