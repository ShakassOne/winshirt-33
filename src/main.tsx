
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { OptimizedAuthProvider } from './context/OptimizedAuthContext.tsx'

createRoot(document.getElementById("root")!).render(
  <OptimizedAuthProvider>
    <App />
  </OptimizedAuthProvider>
);
