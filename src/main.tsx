import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BackupPanel } from './ui/components/BackupPanel'
import CoordinatorPreview from './ui/components/CoordinatorPreview.tsx'
import BrowserRelasAccess from './ui/components/BrowserRelasAccess.tsx'

const params = new URLSearchParams(window.location.search)
const view = params.get('vista')
const recovery = view === 'recuperacion'
const coordinatorPreview = view === 'coordinacion-zaidin'
// La entrada histórica ?vista=acceso vuelve a la aplicación ordinaria.
// No se exige una cuenta que no haya sido creada ni acordada con la persona usuaria.
const authenticatedEntry = view === 'administracion' || view === 'app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {recovery
      ? <main className="backup-recovery"><BackupPanel recovery /></main>
      : coordinatorPreview
        ? <CoordinatorPreview />
        : authenticatedEntry
          ? <BrowserRelasAccess />
          : <App />}
  </StrictMode>,
)
