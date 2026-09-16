import type { DefinitiveActionPlanModuleProjection } from "./DefinitiveActionPlanProjection";
import { pendingPreparationDecisionCount, resolvedPlanDecisionText } from "./DefinitiveActionPlanProjection";
export interface PlanDocument {
 schemaVersion: 1;
 municipalityId: string;
 generatedAt: string;
 status: "draft" | "validated";
 validatedBy?: string;
 paragraphs: { text: string; heading?: boolean }[];
}
export function buildPlanDocument(municipalityId: string, active: DefinitiveActionPlanModuleProjection[], generatedAt: string): PlanDocument {
 const paragraphs: PlanDocument["paragraphs"] = [];
 for (const { module, moduleDecision, rows } of active) {
  if (!rows.length) continue;
  paragraphs.push({text:module.title,heading:true},{text:"Objetivo estratégico: "+resolvedPlanDecisionText(moduleDecision,module.strategicObjective)});
  for (const row of rows) {
   paragraphs.push({text:row.general.code+" · "+resolvedPlanDecisionText(row.generalDecision,row.general.title),heading:true},
    {text:row.specific.code+" · "+resolvedPlanDecisionText(row.objectiveDecision,row.specific.title)});
   paragraphs.push({text:row.indicatorIncluded ? row.specific.indicator.code+" · "+resolvedPlanDecisionText(row.indicatorDecision,row.specific.indicator.title) : "Indicador no incorporado."});
  }
 }
 return {schemaVersion:1,municipalityId,generatedAt,status:"draft",paragraphs};
}
export function validatePlanDocument(municipalityId: string, active: DefinitiveActionPlanModuleProjection[], name: string, date: string): PlanDocument {
 if (!name.trim()) throw new Error("Indica quién realiza la validación técnica.");
 if (active.some(x=>pendingPreparationDecisionCount(x.module,x.draft)>0)) throw new Error("Resuelve los elementos pendientes antes de validar.");
 for (const {module,draft} of active) {
  if (draft && draft.version !== module.version) throw new Error("La referencia del borrador ha cambiado. Revisa su versión antes de validar.");
  if (Object.values(draft?.decisions??{}).some(d=>d.status==="modified"&&!d.text?.trim())) throw new Error("Completa las redacciones modificadas vacías.");
 }
 const doc = buildPlanDocument(municipalityId,active,date);
 if (!doc.paragraphs.length) throw new Error("Incluye objetivos antes de validar.");
 return {...doc,status:"validated",validatedBy:name.trim()};
}
export function latestValidatedPlan(documents: PlanDocument[], municipalityId: string): PlanDocument | undefined {
 return documents.filter(d=>d.schemaVersion===1&&d.municipalityId===municipalityId&&d.status==="validated")
  .reduce<PlanDocument|undefined>((latest,d)=>!latest||d.generatedAt>=latest.generatedAt?d:latest,undefined);
}
