
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AuthProvider from './context/AuthContext.tsx'
import { fetchThemeSettings, applyThemeSettings } from './services/themeSettings.service'

// Load and apply theme settings on app startup
const loadThemeSettings = async () => {
  try {
    const settings = await fetchThemeSettings();
    if (settings) {
      console.log('Applying theme settings on startup:', settings);
      applyThemeSettings(settings);
    }
  } catch (error) {
    console.error('Failed to load theme settings on startup:', error);
  }
};

// Load theme settings before rendering the app
loadThemeSettings().then(() => {
  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
});
