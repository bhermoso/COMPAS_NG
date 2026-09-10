import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
const RelasAccess = lazy(() => import('./ui/components/RelasAccess'))
import { BackupPanel } from './ui/components/BackupPanel'
import CoordinatorPreview from './ui/components/CoordinatorPreview.tsx'

const coordinatorPreview = new URLSearchParams(window.location.search).get('vista') === 'coordinacion-zaidin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {['relas-zaidin', 'administracion'].includes(new URLSearchParams(window.location.search).get('vista') ?? '') ? <Suspense fallback={<p>Cargando acceso del equipo…</p>}><RelasAccess /></Suspense> : new URLSearchParams(window.location.search).get('vista') === 'recuperacion' ? <main className="backup-recovery"><BackupPanel recovery /></main> : coordinatorPreview ? <CoordinatorPreview /> : <App />}
  </StrictMode>,
)
