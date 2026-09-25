import { useState } from 'react';
import type { MunicipalityWorkspace } from '../../domain/workspace';
import { createBackup, inspectBackup, restoreBackup, type CheckedBackup } from '../../infrastructure/recovery/browserRecovery';
import { bundledDocuments } from './documentAccess';
import './BackupPanel.css';

export function BackupPanel({workspace, ready = true, recovery = false}: {workspace?: MunicipalityWorkspace; ready?: boolean; recovery?: boolean}) {
 const [busy,setBusy] = useState(false); const [message,setMessage] = useState('');
 const [notices,setNotices] = useState<string[]>([]); const [checked,setChecked] = useState<CheckedBackup>(); const [source,setSource] = useState(''); const [done,setDone] = useState(false);
 async function download() {
  setBusy(true); setMessage('Reuniendo expedientes y originales…'); setNotices([]);
  try {
   const backup = await createBackup(workspace,bundledDocuments);
   const blob = new Blob([JSON.stringify(backup)],{type:'application/json'}); const url = URL.createObjectURL(blob);
   const a = document.createElement('a'); a.href=url; a.download='COMPAS_copia_'+backup.payload.createdAt.slice(0,10)+'.compas.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
   setNotices(backup.payload.notices);
   setMessage(`Copia preparada: ${backup.payload.storage.filter(s=>s.key.startsWith('compas-ng:workspace:')).length} ámbitos y ${backup.payload.files.length} originales. Comprueba que la descarga ha terminado. ${backup.payload.notices.length ? 'Hay documentos sin original incluido; consulta el detalle.' : ''}`);
  } catch(error) {setMessage((error as Error).message);} finally {setBusy(false);}
 }
 return <section className="backup-panel" aria-label="Copias y recuperación">
  <h2>Conservar y recuperar el trabajo</h2>
  <p>Descarga una copia de <strong>todos los ámbitos guardados en este navegador</strong>, sus fichas, decisiones, borradores y originales disponibles. Incluye los cambios incorporados al expediente actual.</p>
  <p>Antes de copiar, incorpora los formularios que tengas pendientes. La copia puede contener información personal: guárdala en un lugar de acceso restringido.</p>
  <div className="backup-panel__actions"><button type="button" disabled={busy || !ready} onClick={download}>Descargar copia con originales</button>
   {!recovery && <a href="?vista=recuperacion">Comprobar o recuperar una copia</a>}
  </div>
  {!ready && <p>Espera a que termine la carga del expediente para crear la copia.</p>}
  {recovery && <>
   <p><strong>La comprobación no modifica datos.</strong> La recuperación incorpora lo que falta y conserva las versiones existentes. Si hay diferencias, utiliza este mismo enlace en un perfil de navegador vacío; no es necesario borrar el trabajo actual.</p>
   <label>Seleccionar copia de COMPÁS <input type="file" accept=".json,application/json" disabled={busy} onChange={async e=>{
    const file=e.currentTarget.files?.[0]; e.currentTarget.value=''; if(!file)return;
    setBusy(true);setChecked(undefined);setDone(false);setMessage('Comprobando integridad…');setNotices([]);setSource('');
    try{const text=await file.text();const result=await inspectBackup(text);setSource(text);setChecked(result);setNotices(result.backup.payload.notices);setMessage('Copia comprobada. Revisa su contenido antes de recuperar.');}
    catch(error){setMessage((error as Error).message);}finally{setBusy(false);}
   }}/></label>
   {checked && <div>
    <p><strong>{checked.workspaces.length} ámbitos · {checked.originals.length} originales</strong> · Copia del {new Date(checked.backup.payload.createdAt).toLocaleString('es-ES')}</p>
    <ul>{checked.workspaces.map((name,i)=><li key={i}>{name}</li>)}</ul>
    {checked.conflicts.length > 0 && <><p><strong>Versiones diferentes: no se sobrescribirán.</strong></p><ul>{checked.conflicts.map(c=><li key={c}>{c}</li>)}</ul></>}
    <button type="button" disabled={busy || done || checked.conflicts.length > 0} onClick={async()=>{
     setBusy(true);try{await restoreBackup(source);setDone(true);setMessage('Recuperación terminada. Los datos anteriores se han conservado. Puedes abrir COMPÁS y seleccionar el ámbito recuperado.');}catch(error){setMessage((error as Error).message);}finally{setBusy(false);}
    }}>Recuperar sin sobrescribir</button>
   </div>}
   <p><a href="?">Abrir COMPÁS</a></p>
  </>}
  {message && <p role="status">{message}</p>}
  {notices.length > 0 && <details><summary>Documentos y limitaciones de la copia · {notices.length}</summary><ul>{notices.map((n,i)=><li key={i}>{n}</li>)}</ul></details>}
  <p className="backup-panel__note">Esta copia no incluye archivos de otros equipos ni documentos que nunca se conservaron. El borrador de demostración se guarda separado del plan municipal. Los campos ya descartados por versiones anteriores no se pueden reconstruir.</p>
 </section>;
}
