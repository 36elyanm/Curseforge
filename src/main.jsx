import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Show a message immediately so we know JS is executing
const root = document.getElementById('root')
root.innerHTML = '<div style="background:#1a1b2e;color:#f97316;min-height:100vh;display:flex;align-items:center;justify-content:center;font:20px sans-serif">Loading...</div>'

try {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (e) {
  root.innerHTML = '<div style="background:#1a1b2e;color:#f43f5e;padding:40px;font:16px monospace;white-space:pre-wrap">STARTUP ERROR:\n' + e.stack + '</div>'
}
