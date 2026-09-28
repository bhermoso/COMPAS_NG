import type { MunicipalityWorkspace } from "../../domain/workspace";
import { latestValidatedPlan } from "../../domain/action-plan-catalog/PlanDocument";
import { computePSLHash } from "../health-profile-compiler/LocalHealthProfileCompiler";
import { readSealedCanonicalDocument } from "../psl-c-canonical";
import { buildPSLCDocumentModel, type PSLCDocumentModel, type PSLCDocumentSection } from "../psl-c-export";
import { planDocumentParagraphs } from "../action-plan/exportPlanDocument";

export type InitialPlanCompilation =
 | { ok: true; document: PSLCDocumentModel }
 | { ok: false; issues: string[] };

/** Initial working document only. Never changes or approves the source snapshots. */
export function compileInitialLocalHealthPlan(
 workspace: MunicipalityWorkspace,
 pslIsStale: boolean,
 generatedAt = new Date().toISOString()
): InitialPlanCompilation {
 const municipalityId = workspace.municipality.identity.id;
 const psl = workspace.validatedPSL;
 const issues: string[] = [];
 if (!psl || psl.municipalityId !== municipalityId || !["validated", "approved"].includes(psl.status)) {
  issues.push("Valida técnicamente el Perfil de Salud Local.");
 }
 if (pslIsStale) issues.push("Revisa y vuelve a validar el Perfil: sus fuentes han cambiado.");
 // Approval may follow compilation without changing the validated diagnostic content.
 const hashes = psl ? [computePSLHash(psl), ...(psl.status === "approved" ? [computePSLHash({...psl, status: "validated"})] : [])] : [];
 const profile = (workspace.compiledProfiles ?? [])
  .filter(p => p.municipalityId === municipalityId && p.sourcePSLId === psl?.id
   && p.sourcePSLVersion === psl?.version && p.sourcePSLEvidenceStoreVersion === psl?.evidenceStoreVersion
   && hashes.includes(p.sourceHash))
  .reduce<(NonNullable<MunicipalityWorkspace["compiledProfiles"]>)[number] | undefined>(
   (latest, p) => !latest || p.compiledAt >= latest.compiledAt ? p : latest, undefined);
 if (!profile) issues.push("Compila el Perfil vigente en la sección Perfil de Salud Local.");
 else if (!profile.canonicalDocument || !readSealedCanonicalDocument(profile.canonicalDocument)) {
  issues.push("Vuelve a compilar el Perfil para incorporar su documento completo y sellado.");
 }
 const plan = latestValidatedPlan(workspace.validatedActionPlans ?? [], municipalityId);
 if (!plan?.paragraphs.length) issues.push("Valida y guarda la versión actual del Plan de Acción.");
 if (issues.length || !profile || !plan) return {ok: false, issues};

 const profileModel = buildPSLCDocumentModel(profile);
 const actionSections: PSLCDocumentSection[] = [];
 for (const paragraph of planDocumentParagraphs(plan)) {
  if (paragraph.heading || !actionSections.length) {
   actionSections.push({title: paragraph.heading ? paragraph.text : "Versión del Plan de Acción", level: 2, paragraphs: paragraph.heading ? [] : [paragraph.text]});
  } else actionSections[actionSections.length - 1].paragraphs.push(paragraph.text);
 }
 const priorities = profile.priorizacion.tematicasSeleccionadasLabels;
 const name = workspace.municipality.identity.name;
 const sections: PSLCDocumentSection[] = [
  {title: "1. Identidad y alcance", level: 1, paragraphs: [
   "Compilación inicial del Plan Local de Salud de " + name + ".",
   "Documento de trabajo para revisión por el grupo. Integra el Perfil compilado vigente y la última versión validada del Plan de Acción.",
   "Las fichas de actuaciones, responsables, calendario, recursos y aprobación institucional se incorporarán en una fase posterior."
  ]},
  {title: "2. Perfil de Salud Local", level: 1, paragraphs: profileModel.portada},
  ...profileModel.sections,
  {title: "3. Prioridades validadas en el Perfil", level: 1, paragraphs: [
   ...(priorities.length ? priorities : ["No constan prioridades seleccionadas en esta versión del Perfil; pendiente de incorporar."]),
   ...(profile.priorizacion.deliberacionNota ? [profile.priorizacion.deliberacionNota] : [])
  ]},
  {title: "4. Plan de Acción validado", level: 1, paragraphs: []},
  ...actionSections,
  {title: "5. Actuaciones y agenda de implementación", level: 1, paragraphs: [
   "Pendiente de incorporar y validar las fichas de actuaciones, su vinculación con objetivos e indicadores, responsables, calendario, recursos y agenda anual."
  ]},
  {title: "6. Seguimiento, evaluación y aprobación", level: 1, paragraphs: [
   plan.evaluationFramework
    ? "El marco de evaluación disponible se recoge en el Plan de Acción. Queda pendiente completar su aplicación a las actuaciones y a la agenda."
    : "Pendiente de definir el marco de seguimiento y evaluación.",
   ...(!plan.unaddressedNeeds?.length ? ["Pendiente de documentar las necesidades no priorizadas o declarar que todas están incluidas."] : []),
   "Pendiente de cierre y aprobación institucional. Esta compilación no acredita la aprobación del Plan Local de Salud."
  ]},
  {title: "7. Versiones utilizadas", level: 1, paragraphs: [
   "Fecha de compilación inicial: " + generatedAt,
   "Perfil: " + profile.artifactVersion + " · " + profile.id + " · compilado: " + profile.compiledAt,
   "Huella del Perfil: " + profile.sourceHash,
   "Plan de Acción: " + plan.generatedAt + " · validación técnica: " + (plan.validatedBy ?? "no registrada"),
   "Los cambios posteriores sin validar no se incorporan. Para actualizar el documento, valida las nuevas versiones y genera otra compilación."
  ]}
 ];
 return {ok: true, document: JSON.parse(JSON.stringify({
  title: "Plan Local de Salud de " + name,
  subtitle: "BORRADOR · Compilación inicial",
  portada: [
   "Generado el " + generatedAt.slice(0, 10) + ".",
   "Pendiente de completar actuaciones y aprobación institucional.",
   "Perfil " + profile.artifactVersion + " · Plan de Acción validado el " + plan.generatedAt.slice(0, 10)
  ],
  sections,
  fileName: "plan-local-salud-" + municipalityId.replace(/[^a-z0-9-]/gi, "-") + "-borrador-" + generatedAt.slice(0,10) + ".docx"
 })) as PSLCDocumentModel};
}
