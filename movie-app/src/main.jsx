import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MovieContextProvider } from "./contexts/MovieContext";
import App from "./App.jsx";
import "./css/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MovieContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MovieContextProvider>
  </StrictMode>
);