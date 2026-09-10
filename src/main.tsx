import {StrictMode,lazy,Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {BackupPanel} from './ui/components/BackupPanel'
const AccessPortal=lazy(()=>import('./ui/components/RelasAccess'))
const recovery=new URLSearchParams(window.location.search).get('vista')==='recuperacion'
createRoot(document.getElementById('root')!).render(
 <StrictMode>{recovery?<main className="backup-recovery"><BackupPanel recovery/></main>:<Suspense fallback={<p>Cargando acceso a COMPAS…</p>}><AccessPortal/></Suspense>}</StrictMode>,
)
