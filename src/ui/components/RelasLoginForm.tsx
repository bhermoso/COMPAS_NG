import {useState} from 'react';
import {readAccessProfile,type AccessProfile,type RelasClient} from '../../infrastructure/relas/RelasClient';
import {loginRelasWithGoogle,loginRelasWithPassword,logoutRelas} from '../../infrastructure/relas/BrowserRelasLogin';

export default function RelasLoginForm({client,adminEntry,appEntry,onProfile}:{client:RelasClient;adminEntry:boolean;appEntry:boolean;onProfile:(profile:AccessProfile)=>void}){
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 async function finish(){const next=await readAccessProfile(client);onProfile(next);setMessage(next.administrator?'':next.scopes.length?'Selecciona tu ámbito de trabajo.':'Tu cuenta está identificada, pero no tiene ámbitos activos. Contacta con el administrador.');}
 return <form onSubmit={async e=>{e.preventDefault();setBusy(true);setMessage('Comprobando acceso…');try{await loginRelasWithPassword(client,email,password);setPassword('');await finish();}catch{await logoutRelas(client).catch(()=>{});setMessage('No se pudo completar el acceso. Usa como usuario el correo de tu cuenta COMPAS y como contraseña la contraseña generada y entregada por el administrador.');}finally{setBusy(false);}}}>
  <p>Acceso territorial: usuario = correo de la cuenta; contraseña = la contraseña generada por COMPAS y entregada por el administrador. La administración general también puede identificarse con Google.</p>
  <label>Usuario (correo electrónico)<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
  <label>Contraseña entregada por el administrador<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
  <button disabled={busy}>Entrar</button>
  <button type="button" disabled={busy} onClick={async()=>{setBusy(true);setMessage('Abriendo identificación con Google…');try{await loginRelasWithGoogle(client);await finish();}catch{await logoutRelas(client).catch(()=>{});setMessage('No se pudo completar la identificación con Google.');}finally{setBusy(false);}}}>Identificarme con Google</button>
  {adminEntry&&<p>La identificación con Google solo concede administración si la cuenta está registrada como administradora en COMPAS.</p>}
  {appEntry&&<p>Tras identificarte como administrador, COMPAS abrirá la aplicación completa.</p>}
  {message&&<p role="status">{message}</p>}
 </form>;
}
