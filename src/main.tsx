import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CoordinatorPreview from './ui/components/CoordinatorPreview.tsx'

const coordinatorPreview = new URLSearchParams(window.location.search).get('vista') === 'coordinacion-zaidin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {coordinatorPreview ? <CoordinatorPreview /> : <App />}
  </StrictMode>,
)
