import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ParksContextProvider } from "./context/ParksContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ParksContextProvider>
      <App />
    </ParksContextProvider>
  </React.StrictMode>
);
