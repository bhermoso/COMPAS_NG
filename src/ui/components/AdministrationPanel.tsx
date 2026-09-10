import {useState} from 'react';
const scopes=['granada-zaidin','atarfe','alfacar','churriana','zagra'];
const project='https://console.firebase.google.com/project/compas-98dd7';
export default function AdministrationPanel({onOpenApp,onOpenScope}:{onOpenApp:()=>void;onOpenScope:(scope:string)=>void}) {
 const [selectedScope,setSelectedScope]=useState('granada-zaidin');
 return <>
  <div className="admin-banner"><strong>Administración general</strong><p>Tu cuenta conserva acceso a todos los ámbitos. Los accesos territoriales no pueden modificar tu cuenta ni tus permisos.</p></div>
  <section className="admin-section"><h2>Trabajo de COMPAS</h2><p>Abre el espacio completo para trabajar con perfiles, documentos, indicadores y planes.</p>
   <button onClick={onOpenApp}>Abrir COMPAS completo</button>
   <div className="admin-scope"><label>Ámbito compartido<input list="admin-scopes" value={selectedScope} onChange={e=>setSelectedScope(e.target.value)}/></label><datalist id="admin-scopes">{scopes.map(s=><option key={s} value={s}/>)}</datalist><button disabled={!/^[a-z0-9][a-z0-9-]{0,79}$/.test(selectedScope)} onClick={()=>onOpenScope(selectedScope)}>Abrir ámbito</button></div>
  </section>
  <section className="admin-section"><h2>Cuentas y claves</h2><p>La creación de cuentas y el cambio de sus contraseñas se realizan en la consola de Firebase, con tu cuenta propietaria del proyecto.</p>
   <a href={`${project}/authentication/users`} target="_blank" rel="noopener noreferrer">Gestionar cuentas en Firebase</a>
  </section>
  <section className="admin-section"><h2>Permisos territoriales</h2><p>Asigna a cada cuenta sus ámbitos y el permiso de coordinación o consulta. Suspende un acceso cambiando su campo active a false. Tu administración general es independiente de esas asignaciones.</p>
   <a href={`${project}/firestore/databases/-default-/data/~2Frelas_memberships`} target="_blank" rel="noopener noreferrer">Gestionar asignaciones en Firebase</a>
  </section>
 </>;
}
