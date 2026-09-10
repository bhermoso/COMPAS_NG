import {onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {useEffect,useMemo,useState} from 'react';
import {createRelasClient,readMembership,readRelasDraft,saveRelasDraft} from '../../infrastructure/relas/RelasClient';
import {ZAIDIN_AGING_PROPOSAL,type PlanPreparationDraft} from '../../domain/action-plan-catalog/PlanPreparationDraft';
import {PlanPreparationPanel} from './PlanPreparationPanel';
import './BackupPanel.css';
import './RelasAccess.css';
const scope='granada-zaidin';
export default function RelasAccess(){
 const client=useMemo(()=>createRelasClient(),[]);
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');
 const [role,setRole]=useState<string>();const [draft,setDraft]=useState<PlanPreparationDraft>();
 const [version,setVersion]=useState<number|null>(null);const [dirty,setDirty]=useState(false);
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 const clear=()=>{setRole(undefined);setDraft(undefined);setVersion(null);setDirty(false);setPassword('');};
 useEffect(()=>{
  if(!client)return;
  return onAuthStateChanged(client.auth,user=>{if(!user)clear();});
 },[client]);
 useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 async function load(){
  if(!client)return;
  const membershipRole=await readMembership(client,scope);
  const row=await readRelasDraft(client,scope,ZAIDIN_AGING_PROPOSAL.id);
  if(row && (row.payload.municipalityId!==scope||row.payload.moduleId!==ZAIDIN_AGING_PROPOSAL.id||row.payload.version!==ZAIDIN_AGING_PROPOSAL.version||!row.payload.decisions))throw new Error('El borrador tiene una versión no compatible. Se conserva en el servidor para su revisión.');
  setRole(membershipRole);setDraft(row?.payload);setVersion(row?.version??null);setDirty(false);setMessage(row?'Borrador recuperado del servidor.':'Todavía no hay un borrador compartido para esta línea.');
 }
 return <main className="backup-recovery relas-access"><section className="backup-panel">
  <h1>RELAS Zaidín · Acceso del equipo</h1>
  {!client ? <p role="status"><strong>Acceso pendiente de activación.</strong> Todavía no se ha conectado el servicio de cuentas. La demostración de coordinación sigue disponible, pero no es un acceso privado.</p> : !role ? <form onSubmit={async e=>{
   e.preventDefault();setBusy(true);setMessage('Comprobando acceso…');
   try{try{await signInWithEmailAndPassword(client.auth,email,password);}catch{throw new Error('No se ha podido iniciar sesión. Comprueba el correo y la contraseña; el acceso también puede estar pendiente de activación.');}setPassword('');await load();}
   catch(e){clear();await signOut(client.auth);setMessage((e as Error).message);}finally{setBusy(false);}
  }}>
   <p>Utiliza tu cuenta personal autorizada para este ámbito. La sesión no se conserva al recargar o cerrar la página.</p>
   <label>Correo electrónico<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <label>Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
   <button disabled={busy} type="submit">Entrar</button>
  </form> : <>
   <p><strong>Ámbito: Zaidín.</strong> Las propuestas de coordinación requieren revisión; guardar un borrador no aprueba el Plan.</p>
   <fieldset disabled={busy||role==='reader'} style={{border:0,padding:0}}><PlanPreparationPanel module={ZAIDIN_AGING_PROPOSAL} renderWorksheet={() => <p>Las fichas de indicadores todavía no están conectadas al almacenamiento compartido.</p>} municipalityId={scope} draft={draft} onChange={next=>{setDraft(next);setDirty(true);}} persistenceMessage={dirty?'Cambios pendientes de guardar en el servidor.':'Versión compartida recuperada; sin cambios locales pendientes.'}/></fieldset>
   <div className="backup-panel__actions">
    <button disabled={busy||!dirty||!draft||role==='reader'} onClick={async()=>{
     if(!client||!draft)return;setBusy(true);
     try{const row=await saveRelasDraft(client,draft,version);setDraft(row.payload);setVersion(row.version);setDirty(false);setMessage('Borrador guardado en el servidor. Pendiente de revisión y aprobación por su procedimiento.');}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}
    }}>Guardar borrador compartido</button>
    <button disabled={busy} onClick={async()=>{if(dirty&&!window.confirm('Hay cambios sin guardar. ¿Recuperar la versión del servidor y descartarlos?'))return;setBusy(true);try{await load();}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}>Recuperar versión del servidor</button>
    <button disabled={busy} onClick={async()=>{if(dirty&&!window.confirm('Hay cambios sin guardar. ¿Cerrar la sesión y descartarlos?'))return;setBusy(true);try{await signOut(client.auth);clear();setMessage('Sesión cerrada.');}catch{setMessage('No se pudo cerrar la sesión. Vuelve a intentarlo.');}finally{setBusy(false);}}}>Cerrar sesión</button>
   </div>
  </>}
  {message&&<p role="status">{message}</p>}
  <p><a href="?vista=coordinacion-zaidin">Ver demostración de coordinación</a></p>
 </section></main>;
}
