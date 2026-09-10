import {useEffect,useState} from 'react';
import {readRelasDraft,saveRelasDraft,type RelasClient} from '../../infrastructure/relas/RelasClient';
import {ZAIDIN_AGING_PROPOSAL,type PlanPreparationDraft} from '../../domain/action-plan-catalog/PlanPreparationDraft';
import {HEALTHY_AGING_MODULE} from '../../domain/action-plan-catalog/ActionPlanCatalog';
import {PlanPreparationPanel} from './PlanPreparationPanel';
export default function TerritorialWorkspace({client,scope,role,onBack}:{client:RelasClient;scope:string;role:string;onBack:()=>void}) {
 const module=scope==='granada-zaidin'?ZAIDIN_AGING_PROPOSAL:HEALTHY_AGING_MODULE;
 const [draft,setDraft]=useState<PlanPreparationDraft>();const [version,setVersion]=useState<number|null>(null);
 const [dirty,setDirty]=useState(false);const [ready,setReady]=useState(false);const [busy,setBusy]=useState(true);const [message,setMessage]=useState('Recuperando borrador…');
 async function load(){
  const row=await readRelasDraft(client,scope,module.id);
  if(row&&(row.payload.municipalityId!==scope||row.payload.moduleId!==module.id||row.payload.version!==module.version||!row.payload.decisions))throw new Error('El borrador guardado requiere revisión de compatibilidad. No se ha modificado.');
  setDraft(row?.payload);setVersion(row?.version??null);setDirty(false);setReady(true);setMessage(row?'Borrador recuperado.':'Todavía no hay un borrador compartido.');
 }
 useEffect(()=>{let cancelled=false;readRelasDraft(client,scope,module.id).then(row=>{
  if(cancelled)return;
  if(row&&(row.payload.municipalityId!==scope||row.payload.moduleId!==module.id||row.payload.version!==module.version||!row.payload.decisions))throw new Error('El borrador guardado requiere revisión.');
  setDraft(row?.payload);setVersion(row?.version??null);setReady(true);setMessage(row?'Borrador recuperado.':'Todavía no hay un borrador compartido.');
 }).catch(e=>{if(!cancelled)setMessage(e.message);}).finally(()=>{if(!cancelled)setBusy(false);});return()=>{cancelled=true;};},[client,scope,module.id,module.version]);
 useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 return <section><button onClick={()=>{if(!dirty||window.confirm('Hay cambios sin guardar. ¿Volver y descartarlos?'))onBack();}}>Volver al panel</button>
  <h2>Ámbito: {scope}</h2><p>Preparación del Plan. Guardar una propuesta no constituye aprobación.</p>
  {ready&&<fieldset disabled={busy||role==='reader'} style={{border:0,padding:0}}><PlanPreparationPanel module={module} municipalityId={scope} draft={draft} onChange={d=>{setDraft(d);setDirty(true);}} renderWorksheet={()=><p>Las fichas y sus documentos aún se gestionan en el espacio de trabajo completo.</p>} persistenceMessage={dirty?'Cambios pendientes de guardar.':'Sin cambios pendientes.'}/></fieldset>}
  <div className="backup-panel__actions"><button disabled={!ready||busy||!dirty||!draft||role==='reader'} onClick={async()=>{if(!draft)return;setBusy(true);try{const row=await saveRelasDraft(client,draft,version);setVersion(row.version);setDraft(row.payload);setDirty(false);setMessage('Borrador guardado. Pendiente de revisión.');}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}>Guardar borrador compartido</button>
  <button disabled={busy} onClick={async()=>{if(dirty&&!window.confirm('¿Descartar cambios y recuperar el servidor?'))return;setBusy(true);try{await load();}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}>Recuperar versión del servidor</button></div>
  <p role="status">{message}</p>
 </section>;
}
