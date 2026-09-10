import {onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {lazy,Suspense,useEffect,useMemo,useState} from 'react';
import {createRelasClient,readAccessProfile,type AccessProfile} from '../../infrastructure/relas/RelasClient';
import AdministrationPanel from './AdministrationPanel';
import TerritorialWorkspace from './TerritorialWorkspace';
import './BackupPanel.css';
import './RelasAccess.css';
const FullApp=lazy(()=>import('../../App'));
export default function RelasAccess(){
 const client=useMemo(()=>createRelasClient(),[]);
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [profile,setProfile]=useState<AccessProfile>();
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [scope,setScope]=useState<string>();const [fullApp,setFullApp]=useState(false);
 const clear=()=>{setProfile(undefined);setScope(undefined);setFullApp(false);setPassword('');};
 useEffect(()=>onAuthStateChanged(client.auth,user=>{if(!user)clear();}),[client]);
 async function logout(){setBusy(true);try{await signOut(client.auth);clear();setMessage('Sesión cerrada.');}catch{setMessage('No se pudo cerrar la sesión.');}finally{setBusy(false);}}
 if(profile?.administrator&&fullApp)return <><nav className="admin-full-nav"><strong>Administración general · COMPAS completo</strong><button onClick={()=>setFullApp(false)}>Volver al panel de administración</button></nav><Suspense fallback={<p>Cargando COMPAS…</p>}><FullApp/></Suspense></>;
 return <main className="backup-recovery relas-access"><section className="backup-panel">
  <h1>COMPAS · {profile?.administrator?'Panel de administración':'Acceso'}</h1>
  {!profile?<form onSubmit={async e=>{
   e.preventDefault();setBusy(true);setMessage('Comprobando acceso…');
   try{await signInWithEmailAndPassword(client.auth,email.trim(),password);setPassword('');const next=await readAccessProfile(client);setProfile(next);setMessage(next.administrator?'':next.scopes.length?'Selecciona tu ámbito de trabajo.':'Tu cuenta está identificada, pero no tiene ámbitos activos. Contacta con el administrador.');}
   catch(e){clear();await signOut(client.auth).catch(()=>{});const code=(e as {code?:string}).code;setMessage(code==='permission-denied'?'La configuración de permisos del servidor necesita actualizarse. No se han modificado tus datos.':'No se pudo completar el acceso. Comprueba el correo y la contraseña o la configuración de tu cuenta.');}finally{setBusy(false);}
  }}><p>Inicia sesión con tu cuenta. El administrador general conserva el control de COMPAS; cada acceso territorial recibe únicamente los ámbitos asignados.</p>
   <label>Correo electrónico<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <label>Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
   <button disabled={busy}>Entrar</button>
  </form>:scope?<TerritorialWorkspace key={scope} client={client} scope={scope} role={profile.administrator?'administrator':profile.scopes.find(s=>s.id===scope)?.role??'reader'} onBack={()=>setScope(undefined)}/>:<>
   <p>Sesión: {client.auth.currentUser?.email}</p>
   {profile.administrator?<AdministrationPanel onOpenApp={()=>setFullApp(true)} onOpenScope={setScope}/>:<section><h2>Mis ámbitos</h2>{profile.scopes.map(s=><p key={s.id}><button onClick={()=>setScope(s.id)}>Abrir {s.id}</button> · {s.role==='reader'?'Consulta':'Coordinación'}</p>)}</section>}
   <button disabled={busy} onClick={()=>void logout()}>Cerrar sesión</button>
  </>}
  {message&&<p role="status">{message}</p>}
 </section></main>;
}
