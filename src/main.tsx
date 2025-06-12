import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import setup from "use-indexeddb";

setup({
  databaseName: "coursDuSoir",
  version: 1,
  stores: [
    {
      name: "students",
      id: { keyPath: "id", autoIncrement: false },
      indices: [
        { name: "lastName", keyPath: "lastName", options: { unique: false } },
      ],
    },
  ],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
