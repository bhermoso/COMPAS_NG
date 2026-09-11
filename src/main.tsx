import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
const RelasAccess = lazy(() => import('./ui/components/RelasAccess'))
import { BackupPanel } from './ui/components/BackupPanel'
import CoordinatorPreview from './ui/components/CoordinatorPreview.tsx'

const params = new URLSearchParams(window.location.search)
const view = params.get('vista')
const coordinatorPreview = view === 'coordinacion-zaidin'
const publicApp = view === 'publica' || view === 'demo'
const relasEntry = ['relas-zaidin', 'administracion', 'acceso', 'app'].includes(view ?? '') || (!view && !publicApp)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {relasEntry ? <Suspense fallback={<p>Cargando acceso del equipo…</p>}><RelasAccess /></Suspense> : view === 'recuperacion' ? <main className="backup-recovery"><BackupPanel recovery /></main> : coordinatorPreview ? <CoordinatorPreview /> : <App />}
  </StrictMode>,
)
