
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createOptimizedQueryClient } from "@/lib/optimizedQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Créer le client optimisé
const queryClient = createOptimizedQueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
