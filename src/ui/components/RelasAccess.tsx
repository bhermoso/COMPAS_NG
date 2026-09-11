import {GoogleAuthProvider,browserPopupRedirectResolver,onAuthStateChanged,signInWithEmailAndPassword,signInWithPopup,signOut} from 'firebase/auth';
import {lazy,Suspense,useEffect,useMemo,useState} from 'react';
import {createRelasClient,readAccessProfile,type AccessProfile} from '../../infrastructure/relas/RelasClient';
import AdministrationPanel from './AdministrationPanel';
import TerritorialWorkspace from './TerritorialWorkspace';
import './BackupPanel.css';
import './RelasAccess.css';
const FullApp=lazy(()=>import('../../App'));
export default function RelasAccess(){
 const view=new URLSearchParams(window.location.search).get('vista');
 const adminEntry=view==='administracion';
 const appEntry=view==='app';
 const client=useMemo(()=>createRelasClient(),[]);
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [profile,setProfile]=useState<AccessProfile>();
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [scope,setScope]=useState<string>();const [fullApp,setFullApp]=useState(appEntry);
 const clear=()=>{setProfile(undefined);setScope(undefined);setFullApp(false);setPassword('');};
 useEffect(()=>onAuthStateChanged(client.auth,user=>{
  if(!user){clear();return;}
  setBusy(true);
  readAccessProfile(client).then(next=>{
   setProfile(next);
   if(next.administrator&&appEntry)setFullApp(true);
   if(!next.administrator&&!next.scopes.length)setMessage('Tu cuenta está identificada, pero no tiene ámbitos activos. Contacta con el administrador.');
  }).catch(()=>setMessage('La sesión existe, pero COMPAS no ha podido recuperar tus permisos.')).finally(()=>setBusy(false));
 }),[client,appEntry]);
 async function logout(){setBusy(true);try{await signOut(client.auth);clear();setMessage('Sesión cerrada.');}catch{setMessage('No se pudo cerrar la sesión.');}finally{setBusy(false);}}
 function openFullApp(){window.history.replaceState(null,'',`${import.meta.env.BASE_URL}?vista=app`);setFullApp(true);}
 function openAdministration(){window.history.replaceState(null,'',`${import.meta.env.BASE_URL}?vista=administracion`);setFullApp(false);}
 if(profile?.administrator&&fullApp)return <><nav className="admin-full-nav"><strong>Administración general · COMPAS completo</strong><button onClick={openAdministration}>Volver al panel de administración</button></nav><Suspense fallback={<p>Cargando COMPAS…</p>}><FullApp/></Suspense></>;
 return <main className="backup-recovery relas-access"><section className="backup-panel">
  <a href={`${import.meta.env.BASE_URL}?vista=app`}>Abrir COMPAS completo</a>
  <h1>COMPAS · {profile?.administrator?'Panel de administración':adminEntry?'Administración general':'Acceso'}</h1>
  {!profile&&adminEntry&&<p>Desde aquí crearás usuarios y contraseñas para cada plan. Identifícate con tu cuenta de administrador para gestionar los accesos. Esta comprobación no limita tu acceso a ningún plan.</p>}
  {!profile?<form onSubmit={async e=>{
   e.preventDefault();setBusy(true);setMessage('Comprobando acceso…');
   try{await signInWithEmailAndPassword(client.auth,email.trim(),password);setPassword('');const next=await readAccessProfile(client);setProfile(next);if(next.administrator&&appEntry)setFullApp(true);setMessage(next.administrator?'':next.scopes.length?'Selecciona tu ámbito de trabajo.':'Tu cuenta está identificada, pero no tiene ámbitos activos. Contacta con el administrador.');}
   catch(e){clear();await signOut(client.auth).catch(()=>{});const code=(e as {code?:string}).code;setMessage(code==='permission-denied'?'La configuración de permisos del servidor necesita actualizarse. No se han modificado tus datos.':'No se pudo completar el acceso. Usa el correo y la contraseña de tu cuenta de COMPAS. Si accedes con tu cuenta de Google, pulsa Identificarme con Google.');}finally{setBusy(false);}
  }}><p>Inicia sesión con tu cuenta. El administrador general conserva el control de COMPAS; cada acceso territorial recibe únicamente los ámbitos asignados.</p>
   <label>Correo electrónico<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <label>Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
   <button disabled={busy}>Entrar</button>
   <button type="button" disabled={busy} onClick={async()=>{
    setBusy(true);setMessage('Abriendo identificación con Google…');
    let identified=false;
    try {
     const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
     await signInWithPopup(client.auth,provider,browserPopupRedirectResolver);
     identified=true;setMessage('Identidad comprobada. Consultando permisos de COMPAS…');
     const next=await readAccessProfile(client);setProfile(next);if(next.administrator&&appEntry)setFullApp(true);
     setMessage(adminEntry&&!next.administrator?'Google ha identificado tu cuenta, pero todavía no tiene administración general en COMPAS. Comprueba el registro compas_admins con el identificador que aparece debajo.':'');
    } catch(e) {
     clear();
     const code=(e as {code?:string}).code??'sin-codigo';
     if(identified){setMessage(`Google ha identificado tu cuenta, pero COMPAS no ha podido consultar sus permisos (${code}). Revisa las reglas publicadas en Firestore.`);}
     else {
      await signOut(client.auth).catch(()=>{});
      const errors:Record<string,string>={
       'auth/popup-blocked':'El navegador ha bloqueado la ventana de Google. Permite las ventanas emergentes para esta página y vuelve a pulsar el botón.',
       'auth/popup-closed-by-user':'La ventana de Google se ha cerrado antes de terminar. Vuelve a pulsar el botón y completa la selección de cuenta.',
       'auth/unauthorized-domain':'Firebase no tiene autorizado el dominio de esta web. Añade bhermoso.github.io en Authentication → Configuración → Dominios autorizados.',
       'auth/operation-not-allowed':'El acceso con Google no está habilitado en este proyecto Firebase. Revisa Authentication → Proveedores de acceso.',
       'auth/account-exists-with-different-credential':'Ese correo ya tiene una cuenta con otro método de entrada. No se han cambiado sus permisos ni su contraseña.',
       'auth/network-request-failed':'No se ha podido conectar con Google o Firebase. Comprueba la conexión y los bloqueos del navegador.',
       'auth/cancelled-popup-request':'Se ha interrumpido una identificación anterior. Vuelve a intentarlo con una sola ventana.'
      };
      setMessage(`${errors[code]??'No se pudo completar la identificación con Google.'} Código: ${code}.`);
     }
    } finally {setBusy(false);}
   }}>Identificarme con Google</button>
  </form>:scope?<TerritorialWorkspace key={scope} client={client} scope={scope} role={profile.administrator?'administrator':profile.scopes.find(s=>s.id===scope)?.role??'reader'} onBack={()=>setScope(undefined)}/>:<>
   <p>Sesión: {client.auth.currentUser?.email}</p>
   {profile.administrator?<AdministrationPanel client={client} onOpenApp={openFullApp} onOpenScope={setScope}/>:<section><h2>Mis ámbitos</h2>{profile.scopes.map(s=><p key={s.id}><button onClick={()=>setScope(s.id)}>Abrir {s.id}</button> · {s.role==='reader'?'Consulta':'Coordinación'}</p>)}</section>}
   <button disabled={busy} onClick={()=>void logout()}>Cerrar sesión</button>
  </>}
  {message&&<p role="status">{message}</p>}
  {adminEntry&&client.auth.currentUser&&!profile?.administrator&&<section aria-label="Cuenta identificada"><p>Cuenta identificada: <strong>{client.auth.currentUser.email}</strong></p><p>Identificador de cuenta (UID): <code>{client.auth.currentUser.uid}</code></p><p>Este identificador debe corresponder al registro de administrador general en Firebase. Identificarte con Google no concede permisos por sí solo.</p></section>}
 </section></main>;
}
