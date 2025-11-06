// --------------------------------------------------------------------------
// AutoGenesis: Phase 4 (Frontend), Task 3b - Wrap App with Auth Provider
//
// This update wraps the main App component with the AuthProvider, making
// the authentication context available globally.
// --------------------------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// --- IMPORT THE AUTH PROVIDER ---
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* --- WRAP APP WITH AUTH PROVIDER --- */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);