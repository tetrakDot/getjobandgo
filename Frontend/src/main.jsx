import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./styles.css";
import App from "./App";
import GASupport from "./utils/GASupport";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <GASupport />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
