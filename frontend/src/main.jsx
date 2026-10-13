// ==============================================================================
// File: frontend/src/main.jsx
// Description: Root entry point mounting the EconoCausal React Application
// ==============================================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)