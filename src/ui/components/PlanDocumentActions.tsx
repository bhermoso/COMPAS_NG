import { useState } from "react";
import type { DefinitiveActionPlanModuleProjection } from "../../domain/action-plan-catalog/DefinitiveActionPlanProjection";
import { buildPlanDocument, latestValidatedPlan, validatePlanDocument, type PlanDocument } from "../../domain/action-plan-catalog/PlanDocument";
export function PlanDocumentActions({municipalityId,active,versions=[],onValidate}:{
 municipalityId:string;active:DefinitiveActionPlanModuleProjection[];versions?:PlanDocument[];onValidate?:(document:PlanDocument)=>boolean;
}){
 const [name,setName]=useState("");const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
 const latest=latestValidatedPlan(versions,municipalityId);
 async function download(format:"docx"|"pdf"){
  setBusy(true);setMessage("");
  try{const {downloadPlanDocument}=await import("../../application/action-plan/exportPlanDocument");
   await downloadPlanDocument(latest??buildPlanDocument(municipalityId,active,new Date().toISOString()),format);
  }catch{setMessage("No se pudo descargar el documento. Inténtalo de nuevo.");}finally{setBusy(false);}
 }
 function validate(){
  try{const version=validatePlanDocument(municipalityId,active,name,new Date().toISOString());
   if(!onValidate?.(version))throw new Error("No se pudo guardar la versión validada. Conserva una copia del expediente y vuelve a intentarlo.");
   setMessage("Versión validada guardada en este expediente.");
  }catch(e){setMessage((e as Error).message);}
 }
 return <section className="workspace-panel" aria-label="Documento independiente del Plan">
 <h3>Documento independiente del Plan de Acción</h3>
 <p>{latest?"Las descargas contienen exclusivamente la última versión validada. Los cambios posteriores del borrador requieren una nueva validación.":"No existe una versión validada. Las descargas se identificarán como borrador."}</p>
 {latest&&<p>Última validación: {latest.generatedAt} · {latest.validatedBy}</p>}
 <label>Persona que valida técnicamente<input value={name} onChange={e=>setName(e.target.value)}/></label>
 <button type="button" disabled={busy||!onValidate} onClick={validate}>Validar y guardar versión actual</button>
 <div className="backup-panel__actions">
 <button type="button" disabled={busy||(!latest&&!active.some(x=>x.rows.length))} onClick={()=>download("docx")}>Descargar Word{latest?"":" (borrador)"}</button>
 <button type="button" disabled={busy||(!latest&&!active.some(x=>x.rows.length))} onClick={()=>download("pdf")}>Descargar PDF{latest?"":" (borrador)"}</button>
 </div><p role="status">{message}</p>
 </section>;
}
