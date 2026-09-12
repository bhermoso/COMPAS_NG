import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BackupPanel } from './ui/components/BackupPanel'
import CoordinatorPreview from './ui/components/CoordinatorPreview.tsx'

const params = new URLSearchParams(window.location.search)
const view = params.get('vista')
const recovery = view === 'recuperacion'
const coordinatorPreview = view === 'coordinacion-zaidin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {recovery
      ? <main className="backup-recovery"><BackupPanel recovery /></main>
      : coordinatorPreview
        ? <CoordinatorPreview />
        : <App />}
  </StrictMode>,
)
