import { describe,it,expect } from "vitest";
import { Packer } from "docx";
import { ZAIDIN_AGING_PROPOSAL as module, type PlanPreparationDraft } from "../src/domain/action-plan-catalog/PlanPreparationDraft";
import { buildDefinitiveActionPlanProjection } from "../src/domain/action-plan-catalog/DefinitiveActionPlanProjection";
import { validatePlanDocument,latestValidatedPlan,buildPlanDocument } from "../src/domain/action-plan-catalog/PlanDocument";
import { buildPlanWord,buildPlanPdf,planDocumentParagraphs } from "../src/application/action-plan/exportPlanDocument";
function fixture(){
 const draft:PlanPreparationDraft={municipalityId:"granada-zaidin",moduleId:module.id,version:module.version,updatedAt:"2026-09-16",decisions:{}};
 const put=(id:string,text:string)=>{draft.decisions[id]={status:"included",sourceText:text};};
 put(module.id,module.strategicObjective);
 for(const g of module.generalObjectives){put(g.code,g.title);for(const s of g.specificObjectives){put(s.code,s.title);put(s.indicator.code,s.indicator.title);}}
 return draft;
}
describe("Versiones documentales del Plan",()=>{
 it("agrupa todos los objetivos bajo un único encabezado por bloque",()=>{
  const draft=fixture();
  const doc=buildPlanDocument(draft.municipalityId,buildDefinitiveActionPlanProjection(draft.municipalityId,[module],[draft]),"2026-09-17");
  expect(doc.paragraphs.filter(p=>p.heading).slice(1).map(p=>p.text.split(" · ")[0])).toEqual(module.generalObjectives.map(g=>g.code));
  for(const general of module.generalObjectives){
   expect(doc.paragraphs.filter(p=>p.heading&&p.text.startsWith(general.code+" ·"))).toHaveLength(1);
   const heading=doc.paragraphs.findIndex(p=>p.heading&&p.text.startsWith(general.code+" ·"));
   const next=doc.paragraphs.findIndex((p,i)=>i>heading&&!!p.heading);
   const group=doc.paragraphs.slice(heading,next<0?undefined:next);
   for(const objective of general.specificObjectives) expect(group.some(p=>p.text.startsWith(objective.code+" ·"))).toBe(true);
  }
 });
 it("congela las redacciones, no incorpora cambios posteriores y aísla ámbitos",()=>{
  const draft=fixture();const id=module.generalObjectives[0].specificObjectives[0].code;
  draft.decisions[id]={...draft.decisions[id],status:"modified",text:"Redacción validada vigente"};
  const active=buildDefinitiveActionPlanProjection(draft.municipalityId,[module],[draft]);
  const saved=validatePlanDocument(draft.municipalityId,active,"Equipo técnico","2026-09-16T10:00:00Z");
  draft.decisions[id].text="Cambio posterior sin validar";
  expect(JSON.stringify(saved)).toContain("Redacción validada vigente");
  expect(JSON.stringify(saved)).not.toContain("Cambio posterior sin validar");
  expect(latestValidatedPlan([saved],"atarfe")).toBeUndefined();
  const restored=JSON.parse(JSON.stringify(saved));
  expect(latestValidatedPlan([restored],draft.municipalityId)).toEqual(saved);
 });
 it("rechaza pendientes y nunca convierte un borrador en validado por exportarlo",()=>{
  const draft=fixture();draft.decisions[module.id].status="pending";
  const active=buildDefinitiveActionPlanProjection(draft.municipalityId,[module],[draft]);
  expect(()=>validatePlanDocument(draft.municipalityId,active,"Equipo","2026-09-16")).toThrow();
  expect(buildPlanDocument(draft.municipalityId,active,"2026-09-16").status).toBe("draft");
 });
 it("excluye objetivos descartados y elige la última validación",()=>{
  const draft=fixture();const objective=module.generalObjectives[0].specificObjectives[0];
  draft.decisions[objective.code].status="excluded";
  const doc=validatePlanDocument(draft.municipalityId,buildDefinitiveActionPlanProjection(draft.municipalityId,[module],[draft]),"Equipo","2026-09-16");
  expect(doc.paragraphs.some(p=>p.text.startsWith(objective.code+" ·"))).toBe(false);
  expect(doc.paragraphs.some(p=>p.text.startsWith(objective.indicator.code+" ·"))).toBe(false);
  const later={...doc,generatedAt:"2026-09-17"};
  expect(latestValidatedPlan([later,doc],draft.municipalityId)).toBe(later);
 });
 it("genera archivos Word y PDF desde la misma versión",async()=>{
  const draft=fixture();const doc=validatePlanDocument(draft.municipalityId,buildDefinitiveActionPlanProjection(draft.municipalityId,[module],[draft]),"Equipo","2026-09-16");
  const word=await Packer.toBuffer(buildPlanWord(doc));
  expect(word.subarray(0,2).toString()).toBe("PK");
  const pdf=buildPlanPdf(doc);
  expect(pdf.output()).toContain("%PDF");
  expect(pdf.getNumberOfPages()).toBeGreaterThan(1);
  expect(planDocumentParagraphs(doc).map(p=>p.text)).toContain("Versión validada técnicamente");
 });
});
