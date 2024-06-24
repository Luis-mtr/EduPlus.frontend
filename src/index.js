import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./tailwind.css";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
