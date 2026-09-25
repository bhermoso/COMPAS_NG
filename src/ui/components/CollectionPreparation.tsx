import { useEffect, useState } from 'react';
import type { QuestionnaireProject } from '../../domain/questionnaire';
import { COLLECTION_USES, PLANNING_INSTRUMENTS } from '../../domain/action-plan-catalog/PlanningInstruments';
import { PlanningInstrumentCatalog } from './PlanningInstrumentCatalog';
export const COLLECTION_PREPARATION_KEY = 'compas.collection-preparation.v1';
interface Configuration { population:string; use:string; respondent:string; ids:string[]; notes:string }
const empty:Configuration = {population:'', use:COLLECTION_USES[0], respondent:'La propia persona',ids:[],notes:''};
function configuration(project:QuestionnaireProject):Configuration {
 const c = JSON.parse(project.metadata?.[COLLECTION_PREPARATION_KEY] ?? 'null');
 if(!c || !Array.isArray(c.ids) || !c.ids.every((id:unknown)=>typeof id==='string' && PLANNING_INSTRUMENTS.some(i=>i.id===id)) || !['population','use','respondent','notes'].every(k=>typeof c[k]==='string')) throw new Error('La configuración guardada requiere revisión.');
 return c;
}
export function CollectionPreparation({projects,onSave,onDirtyChange}:{projects:QuestionnaireProject[];onSave:(project:QuestionnaireProject)=>void;onDirtyChange?:(dirty:boolean)=>void}) {
 const [id,setId]=useState<string>(); const [name,setName]=useState(''); const [config,setConfig]=useState<Configuration>(empty);const [message,setMessage]=useState('');
 const snapshot=JSON.stringify({name,config});
 const [baseline,setBaseline]=useState(()=>JSON.stringify({name:'',config:empty}));
 const dirty=snapshot!==baseline;
 useEffect(()=>{onDirtyChange?.(dirty);return ()=>onDirtyChange?.(false);},[dirty,onDirtyChange]);
 useEffect(()=>{
  if(!dirty)return;
  const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
  window.addEventListener('beforeunload',warn);
  return ()=>window.removeEventListener('beforeunload',warn);
 },[dirty]);
 function canReplace(){return !dirty || window.confirm('Hay cambios sin guardar. ¿Quieres descartarlos y continuar?');}
 function open(project:QuestionnaireProject){
  if(!canReplace())return;
  try{
   const next=configuration(project);
   setConfig(next);setId(project.id);setName(project.name);
   setBaseline(JSON.stringify({name:project.name,config:next}));setMessage('Propuesta recuperada.');
  }catch(e){setMessage((e as Error).message);}
 }
 function duplicate(){
  setId(undefined);setName(name.trim()+' · Copia');
  setConfig({...config,ids:[...config.ids]});
  setBaseline(JSON.stringify({name:'',config:empty}));
  setMessage('Copia preparada. Modifica su nombre, población o finalidad y guárdala como una propuesta independiente.');
 }
 const selected=PLANNING_INSTRUMENTS.filter(i=>config.ids.includes(i.id));
 function save(){
  if(!name.trim() || !config.population.trim() || !selected.length){setMessage('Indica nombre y población y selecciona al menos un instrumento.');return;}
  const now=new Date().toISOString(); const existing=projects.find(p=>p.id===id);const projectId=id ?? crypto.randomUUID();
  const project:QuestionnaireProject={id:projectId,name:name.trim(),description:'Preparación metodológica. No administrable.',status:'draft',createdAt:existing?.createdAt ?? now,updatedAt:now,
   questionnaire:{id:existing?.questionnaire.id ?? crypto.randomUUID(),name:name.trim(),methodologicalModules:[],classificationBlocks:[],outputs:['json','documentation']},requestedOutputs:['json','documentation'],metadata:{[COLLECTION_PREPARATION_KEY]:JSON.stringify(config)}};
  onSave(project);setId(projectId);setName(project.name);setBaseline(JSON.stringify({name:project.name,config}));setMessage('Propuesta incorporada al expediente de este ámbito. Utiliza «Copias y recuperación del trabajo» para trasladarla junto al expediente a otro equipo.');
 }
 function download(){
  const text=JSON.stringify({title:name,purpose:'Preparación metodológica: no es un cuestionario administrable',configuration:config,instruments:selected},null,2);
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='COMPAS_propuesta_recogida.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <details className="planning-instruments"><summary>Preparar una encuesta o un registro por módulos</summary>
 <p><strong>Una propuesta por población y finalidad.</strong> Selecciona las alternativas que deseas estudiar. El contenido y la adecuación de los instrumentos siguen pendientes de revisión.</p>
 <p><strong>Propuestas guardadas:</strong> {projects.length}</p>
 {projects.map(p=><button type="button" key={p.id} onClick={()=>open(p)}>Abrir propuesta · {p.name}</button>)}
 <p role="status"><strong>{dirty ? 'Cambios sin guardar' : 'Sin cambios pendientes'}</strong>{dirty && ' · Guarda la propuesta antes de salir si deseas conservar la edición.'}</p>
 <div className="planning-instruments__filters">
 <label>Nombre de la propuesta<input value={name} onChange={e=>setName(e.target.value)}/></label>
 <label>Población destinataria<input value={config.population} placeholder="Por ejemplo: participantes mayores de 65 años" onChange={e=>setConfig({...config,population:e.target.value})}/></label>
 <label>Modalidad de recogida<select aria-label="Modalidad de recogida" value={config.use} onChange={e=>setConfig({...config,use:e.target.value})}>{COLLECTION_USES.map(u=><option key={u}>{u}</option>)}</select></label>
 <label>Quién responde<select aria-label="Quién responde" value={config.respondent} onChange={e=>setConfig({...config,respondent:e.target.value})}>{['La propia persona','La propia persona, con ayuda para registrar sus respuestas','Una persona informante','Un agente: valoración o registro profesional'].map(r=><option key={r}>{r}</option>)}</select></label>
 </div>
 <p>La modalidad elegida es una <strong>intención de uso</strong>; no acredita que todos los instrumentos sean adecuados para ella.</p>
 <PlanningInstrumentCatalog selectionLabel="Seleccionar para esta propuesta" onSelect={instrument=>setConfig({...config,ids:[...new Set([...config.ids,instrument.id])]})}/>
 <h4>Instrumentos seleccionados · {selected.length}</h4>
 {selected.map(i=><p key={i.id}><strong>{i.name}</strong> · {i.population} <button type="button" onClick={()=>setConfig({...config,ids:config.ids.filter(x=>x!==i.id)})}>Retirar · {i.name}</button></p>)}
 {config.ids.includes('til') && config.ids.includes('djg') && <p role="note"><strong>Posible duplicidad:</strong> TIL y De Jong Gierveld evalúan soledad. Justifica el uso conjunto o selecciona una alternativa.</p>}
 <label>Justificación, adaptación pendiente y calendario<textarea aria-label="Justificación, adaptación pendiente y calendario" value={config.notes} onChange={e=>setConfig({...config,notes:e.target.value})}/></label>
 <p><strong>Extensión y duración:</strong> pendientes de concretar las versiones. No se estiman sumando instrumentos aún sin preparar.</p>
 <button type="button" onClick={save}>Guardar propuesta de recogida</button> <button type="button" disabled={!selected.length} onClick={download}>Descargar especificación de trabajo</button>
 <button type="button" disabled={!name.trim() || !selected.length} onClick={duplicate}>Duplicar propuesta</button>
 <button type="button" onClick={()=>{if(!canReplace())return;setId(undefined);setName('');setConfig(empty);setBaseline(JSON.stringify({name:'',config:empty}));setMessage('Nueva propuesta.');}}>Nueva propuesta</button>
 <p role="status">{message}</p>
 </details>;
}
