import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RoleProvider>
      <App />
    </RoleProvider>
  </BrowserRouter>
);
