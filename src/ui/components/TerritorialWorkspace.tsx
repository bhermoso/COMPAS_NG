import {useEffect,useState} from 'react';
import {readRelasDraft,readRelasReview,saveRelasDraft,saveRelasReview,type RelasClient} from '../../infrastructure/relas/RelasClient';
import {ZAIDIN_AGING_PROPOSAL,type PlanPreparationDraft,type PlanPreparationReview} from '../../domain/action-plan-catalog/PlanPreparationDraft';
import {HEALTHY_AGING_MODULE} from '../../domain/action-plan-catalog/ActionPlanCatalog';
import {PlanPreparationPanel} from './PlanPreparationPanel';

export default function TerritorialWorkspace({client,scope,role,onBack}:{client:RelasClient;scope:string;role:string;onBack:()=>void}) {
 const module=scope==='granada-zaidin'?ZAIDIN_AGING_PROPOSAL:HEALTHY_AGING_MODULE;
 const [draft,setDraft]=useState<PlanPreparationDraft>();
 const [version,setVersion]=useState<number|null>(null);
 const [dirty,setDirty]=useState(false);
 const [review,setReview]=useState<PlanPreparationReview>();
 const [reviewVersion,setReviewVersion]=useState<number|null>(null);
 const [reviewDirty,setReviewDirty]=useState(false);
 const [ready,setReady]=useState(false);
 const [busy,setBusy]=useState(true);
 const [message,setMessage]=useState('Recuperando borrador…');
 const isAdministrator=role==='administrator';
 const isCoordinator=role==='coordinator';
 const currentDraftVersion=version??0;
 const reviewIsCurrent=Boolean(review&&review.sourceDraftVersion===currentDraftVersion&&review.sourceVersion===module.version);

 async function load(){
  const [row,reviewRow]=await Promise.all([readRelasDraft(client,scope,module.id),readRelasReview(client,scope,module.id)]);
  if(row&&(row.payload.municipalityId!==scope||row.payload.moduleId!==module.id||row.payload.version!==module.version||!row.payload.decisions))throw new Error('El borrador guardado requiere revisión de compatibilidad. No se ha modificado.');
  setDraft(row?.payload);setVersion(row?.version??null);setDirty(false);
  setReview(reviewRow?.payload);setReviewVersion(reviewRow?.version??null);setReviewDirty(false);
  setReady(true);
  if(isAdministrator&&reviewRow&&reviewRow.payload.sourceDraftVersion!==(row?.version??0))setMessage('Estado recuperado. La revisión administrativa existente corresponde a otra versión territorial y debe revisarse de nuevo.');
  else setMessage(row?'Borrador recuperado.':'No hay propuesta territorial guardada. La administración puede editar directamente el texto consolidado.');
 }
 useEffect(()=>{let cancelled=false;Promise.all([readRelasDraft(client,scope,module.id),readRelasReview(client,scope,module.id)]).then(([row,reviewRow])=>{
  if(cancelled)return;
  if(row&&(row.payload.municipalityId!==scope||row.payload.moduleId!==module.id||row.payload.version!==module.version||!row.payload.decisions))throw new Error('El borrador guardado requiere revisión.');
  setDraft(row?.payload);setVersion(row?.version??null);setReview(reviewRow?.payload);setReviewVersion(reviewRow?.version??null);setReady(true);
  if(isAdministrator&&reviewRow&&reviewRow.payload.sourceDraftVersion!==(row?.version??0))setMessage('Estado recuperado. La revisión administrativa debe repetirse porque la propuesta territorial ha cambiado.');
  else setMessage(row?'Borrador recuperado.':'No hay propuesta territorial guardada.');
 }).catch(e=>{if(!cancelled)setMessage(e.message);}).finally(()=>{if(!cancelled)setBusy(false);});return()=>{cancelled=true;};},[client,scope,module.id,module.version,isAdministrator]);
 useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty||reviewDirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty,reviewDirty]);
 const hasUnsaved=dirty||reviewDirty;
 return <section><button onClick={()=>{if(!hasUnsaved||window.confirm('Hay cambios sin guardar. ¿Volver y descartarlos?'))onBack();}}>Volver al panel</button>
  <h2>Ámbito: {scope}</h2>
  <p>{isAdministrator?'Edición administrativa del Plan. Puedes modificar directamente objetivos e indicadores o revisar propuestas territoriales.':'Preparación del Plan. Guardar una modificación crea una propuesta territorial y no cambia por sí sola el texto consolidado.'}</p>
  {ready&&<fieldset disabled={busy||role==='reader'} style={{border:0,padding:0}}><PlanPreparationPanel
   module={module}
   municipalityId={scope}
   draft={draft}
   onChange={d=>{if(!isCoordinator)return;setDraft(d);setDirty(true);}}
   review={review}
   onReviewChange={r=>{if(!isAdministrator)return;setReview({...r,sourceDraftVersion:currentDraftVersion});setReviewDirty(true);}}
   canEditProposal={isCoordinator}
   canReview={isAdministrator}
   reviewIsCurrent={reviewIsCurrent||reviewDirty}
   renderWorksheet={()=><p>Las fichas y sus documentos aún se gestionan en el espacio de trabajo completo.</p>}
   persistenceMessage={isAdministrator?(reviewDirty?'Cambio administrativo pendiente de guardar.':reviewIsCurrent?'Texto administrativo consolidado para el estado territorial actual.':'Sin cambios administrativos guardados para el estado territorial actual.'):(dirty?'Propuesta territorial pendiente de guardar.':'Sin cambios territoriales pendientes.')}
  /></fieldset>}
  <div className="backup-panel__actions">
   {isCoordinator&&<button disabled={!ready||busy||!dirty||!draft} onClick={async()=>{if(!draft)return;setBusy(true);try{const row=await saveRelasDraft(client,draft,version);setVersion(row.version);setDraft(row.payload);setDirty(false);setMessage('Propuesta territorial guardada. Pendiente de revisión administrativa.');}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}>Guardar propuesta territorial</button>}
   {isAdministrator&&<button disabled={!ready||busy||!reviewDirty||!review} onClick={async()=>{if(!review)return;setBusy(true);try{const current={...review,sourceDraftVersion:currentDraftVersion,sourceVersion:module.version,updatedAt:new Date().toISOString()};const row=await saveRelasReview(client,current,reviewVersion);setReviewVersion(row.version);setReview(row.payload);setReviewDirty(false);setMessage('Cambio administrativo guardado. El texto consolidado se conserva separado de cualquier propuesta territorial.');}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}>Guardar cambio administrativo</button>}
   <button disabled={busy} onClick={async()=>{if(hasUnsaved&&!window.confirm('¿Descartar cambios y recuperar el servidor?'))return;setBusy(true);try{await load();}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}>Recuperar versión del servidor</button>
  </div>
  <p role="status">{message}</p>
 </section>;
}
