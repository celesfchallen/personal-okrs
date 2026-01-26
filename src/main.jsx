import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OkrProvider } from './contexts/OkrContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OkrProvider>
      <App />
    </OkrProvider>
  </StrictMode>,
)
