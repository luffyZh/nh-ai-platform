import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const Router = (import.meta as any).env.VITE_STATIC_BUILD === 'true' ? HashRouter : BrowserRouter
const routerProps = (import.meta as any).env.VITE_STATIC_BUILD === 'true' ? {} : { basename: '/nh-ai-platform' }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router {...routerProps}>
      <App />
    </Router>
  </StrictMode>,
)
