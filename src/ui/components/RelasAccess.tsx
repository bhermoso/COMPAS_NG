import {GoogleAuthProvider,onAuthStateChanged,signInWithEmailAndPassword,signInWithPopup,signOut} from 'firebase/auth';
import {lazy,Suspense,useEffect,useMemo,useState} from 'react';
import {createRelasClient,readAccessProfile,type AccessProfile} from '../../infrastructure/relas/RelasClient';
import AdministrationPanel from './AdministrationPanel';
import TerritorialWorkspace from './TerritorialWorkspace';
import './BackupPanel.css';
import './RelasAccess.css';
const FullApp=lazy(()=>import('../../App'));
export default function RelasAccess(){
 const adminEntry=new URLSearchParams(window.location.search).get('vista')==='administracion';
 const client=useMemo(()=>createRelasClient(),[]);
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [profile,setProfile]=useState<AccessProfile>();
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [scope,setScope]=useState<string>();const [fullApp,setFullApp]=useState(false);
 const clear=()=>{setProfile(undefined);setScope(undefined);setFullApp(false);setPassword('');};
 useEffect(()=>onAuthStateChanged(client.auth,user=>{if(!user)clear();}),[client]);
 async function logout(){setBusy(true);try{await signOut(client.auth);clear();setMessage('Sesión cerrada.');}catch{setMessage('No se pudo cerrar la sesión.');}finally{setBusy(false);}}
 if(profile?.administrator&&fullApp)return <><nav className="admin-full-nav"><strong>Administración general · COMPAS completo</strong><button onClick={()=>setFullApp(false)}>Volver al panel de administración</button></nav><Suspense fallback={<p>Cargando COMPAS…</p>}><FullApp/></Suspense></>;
 return <main className="backup-recovery relas-access"><section className="backup-panel">
  <a href={import.meta.env.BASE_URL}>Volver a COMPAS</a>
  <h1>COMPAS · {profile?.administrator?'Panel de administración':adminEntry?'Administración general':'Acceso'}</h1>
  {!profile&&adminEntry&&<p>Desde aquí crearás usuarios y contraseñas para cada plan. Identifícate con tu cuenta de administrador para gestionar los accesos. Esta comprobación no limita tu acceso a ningún plan.</p>}
  {!profile?<form onSubmit={async e=>{
   e.preventDefault();setBusy(true);setMessage('Comprobando acceso…');
   try{await signInWithEmailAndPassword(client.auth,email.trim(),password);setPassword('');const next=await readAccessProfile(client);setProfile(next);setMessage(next.administrator?'':next.scopes.length?'Selecciona tu ámbito de trabajo.':'Tu cuenta está identificada, pero no tiene ámbitos activos. Contacta con el administrador.');}
   catch(e){clear();await signOut(client.auth).catch(()=>{});const code=(e as {code?:string}).code;setMessage(code==='permission-denied'?'La configuración de permisos del servidor necesita actualizarse. No se han modificado tus datos.':'No se pudo completar el acceso. Usa el correo y la contraseña de tu cuenta de COMPAS. Si accedes con tu cuenta de Google, pulsa Identificarme con Google.');}finally{setBusy(false);}
  }}><p>Inicia sesión con tu cuenta. El administrador general conserva el control de COMPAS; cada acceso territorial recibe únicamente los ámbitos asignados.</p>
   <label>Correo electrónico<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <label>Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
   <button disabled={busy}>Entrar</button>
   <button type="button" disabled={busy} onClick={async()=>{setBusy(true);setMessage('Comprobando identidad…');try{await signInWithPopup(client.auth,new GoogleAuthProvider());const next=await readAccessProfile(client);setProfile(next);setMessage(adminEntry&&!next.administrator?'Esta cuenta de Google no está registrada como administrador general. Usa la cuenta vinculada a tu registro de administrador.':'');}catch(e){clear();await signOut(client.auth).catch(()=>{});setMessage((e as {code?:string}).code==='auth/popup-closed-by-user'?'Has cerrado la identificación.':'No se pudo verificar la cuenta de Google. Puedes entrar con el correo y la contraseña de tu cuenta de COMPAS.');}finally{setBusy(false);}}}>Identificarme con Google</button>
  </form>:scope?<TerritorialWorkspace key={scope} client={client} scope={scope} role={profile.administrator?'administrator':profile.scopes.find(s=>s.id===scope)?.role??'reader'} onBack={()=>setScope(undefined)}/>:<>
   <p>Sesión: {client.auth.currentUser?.email}</p>
   {profile.administrator?<AdministrationPanel client={client} onOpenApp={()=>setFullApp(true)} onOpenScope={setScope}/>:<section><h2>Mis ámbitos</h2>{profile.scopes.map(s=><p key={s.id}><button onClick={()=>setScope(s.id)}>Abrir {s.id}</button> · {s.role==='reader'?'Consulta':'Coordinación'}</p>)}</section>}
   <button disabled={busy} onClick={()=>void logout()}>Cerrar sesión</button>
  </>}
  {message&&<p role="status">{message}</p>}
 </section></main>;
}
