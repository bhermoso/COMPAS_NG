import type { ReactNode } from "react";
import type { ActionPlanCatalogModule, CatalogGeneralObjectiveTemplate, CatalogSpecificObjectiveTemplate } from "../../domain/action-plan-catalog/ActionPlanCatalog";
import { excludedByAncestor, plainProposalText, proposalBlocks, proposalObjectiveTexts, proposalStrategicText, ZAIDIN_PROPOSAL_VERSION, type PlanPreparationDraft } from "../../domain/action-plan-catalog/PlanPreparationDraft";

export function ProposalText({text}: {text: string}) {
  return <>{text.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith("**") ? <strong key={i}>{part.slice(2,-2)}</strong> : part)}</>;
}
export function PlanPreparationPanel({module, municipalityId, draft, onChange, renderWorksheet, persistenceMessage}: {
 persistenceMessage?: string;
 module: ActionPlanCatalogModule; municipalityId: string; draft?: PlanPreparationDraft;
 onChange: (draft: PlanPreparationDraft) => void;
 renderWorksheet: (module: ActionPlanCatalogModule, general: CatalogGeneralObjectiveTemplate, specific: CatalogSpecificObjectiveTemplate) => ReactNode;
}) {
 const revised = module.version === ZAIDIN_PROPOSAL_VERSION;
 // Recupera el énfasis editorial solo cuando coincide exactamente con la fuente.
 // Nunca sustituye una redacción guardada por la persona usuaria.
 const emphasized = (text: string) => [proposalStrategicText, ...Object.values(proposalObjectiveTexts), ...proposalBlocks.map(b => b.text)].find(candidate => plainProposalText(candidate) === text) ?? text;
 const textFor = (id: string, text: string) => draft?.decisions[id]?.status === "modified" ? draft.decisions[id].text ?? text : emphasized(text);
 function control(id: string, source: string, ancestors: string[]) {
  const decision = draft?.decisions[id];
  const excluded = excludedByAncestor(draft, ancestors);
  const stale = decision && (decision.sourceText !== source || draft?.version !== module.version);
  return <div className="pcm-decision">
   <label><span>Selección de borrador · {id}</span><select aria-label={`Selección de borrador ${id}`} value={decision?.status ?? "pending"} onChange={e => onChange({
    municipalityId, moduleId: module.id, version: module.version, updatedAt: new Date().toISOString(),
    decisions: {...draft?.decisions, [id]: {status: e.target.value as NonNullable<typeof decision>["status"], sourceText: source, text: decision?.text ?? source}}
   })}><option value="pending">Pendiente</option><option value="included">Incluir</option><option value="excluded">Excluir</option><option value="modified">Modificar</option></select></label>
   {decision?.status === "modified" && <label>Nueva redacción · {id}<textarea aria-label={`Nueva redacción · ${id}`} value={decision.text ?? source} rows={3} onChange={e => onChange({...draft!, decisions: {...draft!.decisions, [id]: {...decision, text: e.target.value}}, updatedAt: new Date().toISOString()})}/>{!decision.text?.trim() && <p role="alert">Completa la redacción; esta modificación está pendiente.</p>}</label>}
   {excluded && <p className="panel-note">Fuera del borrador porque un elemento superior está excluido. Se conservan la elección individual, la ficha y las actuaciones.</p>}
   {stale && <p role="status">La propuesta cambió. Se conserva tu decisión anterior; vuelve a revisarla.</p>}
  </div>;
 }
 return <article className="workspace-panel pcm-preparation">
  <header className="pcm-editorial-header">
   <p className="eyebrow">Preparación del Plan · borrador editable</p>
   <h2>{module.title}</h2>
   <p className="pcm-provenance">{module.sourceLabel}<br /><span>Versión de referencia · {module.sourceDate}</span></p>
  </header>
  <aside className="pcm-guidance" aria-label="Cómo revisar la propuesta">
   <p><strong>Cómo revisar la propuesta</strong></p>
   <p>Selecciona y modifica los elementos para preparar tu propuesta.</p>
   <p>Estas elecciones <strong>no constituyen aprobación del Grupo Motor</strong>.</p>
   <p>Las fichas y sus actuaciones <strong>se conservan aunque excluyas un elemento</strong>.</p>
  </aside>
  <section className="pcm-strategic" aria-label="Objetivo estratégico propuesto">
   <h3>Objetivo estratégico propuesto</h3>
   <p><ProposalText text={textFor(module.id, revised ? proposalStrategicText : module.strategicObjective)}/></p>
  </section>
  {control(module.id, module.strategicObjective, [])}
  {module.generalObjectives.map(general => {
   const block = proposalBlocks.find(b => b.code === general.code);
   return <details className="pcm-general" key={general.code} open>
    <summary>{block?.name ?? `${general.code} · ${textFor(general.code, general.title)}`}</summary>
    <p><ProposalText text={textFor(general.code, (revised ? block?.text : undefined) ?? general.title)}/></p>
    {control(general.code, general.title, [module.id])}
    {general.specificObjectives.map(specific => {
     const indicator = specific.indicator;
     const draftModule = {...module, strategicObjective: plainProposalText(textFor(module.id, module.strategicObjective))};
     const draftGeneral = {...general, title: plainProposalText(textFor(general.code, general.title))};
     const draftSpecific = {...specific, title: plainProposalText(textFor(specific.code, specific.title)), indicator: {...indicator, title: plainProposalText(textFor(indicator.code, indicator.title))}};
     return <section className="pcm-specific" key={specific.code}>
      <h3>{specific.code}</h3><p><ProposalText text={textFor(specific.code, revised ? proposalObjectiveTexts[specific.code] : specific.title)}/></p>
      {control(specific.code, specific.title, [module.id, general.code])}
      <details className="pcm-sheet"><summary>Indicador y ficha · {indicator.code}</summary>
       <p>{textFor(indicator.code, indicator.title)}</p>
       <p className="panel-note">Indicador de la propuesta original. Su cobertura de los conceptos del objetivo está pendiente de revisión.</p>
       {control(indicator.code, indicator.title, [module.id, general.code, specific.code])}
       <dl><dt>Definición operacional original</dt><dd>{indicator.operationalDefinition}</dd><dt>Método original</dt><dd>{indicator.calculationMethod}</dd><dt>Fuente propuesta</dt><dd>{indicator.suggestedSource}</dd></dl>
       {renderWorksheet(draftModule, draftGeneral, draftSpecific)}
      </details>
     </section>;
    })}
   </details>;
  })}
  <p role="status">{persistenceMessage ?? (draft ? "Borrador guardado en este navegador. Para cambiar de equipo, conserva y traslada el expediente." : "Sin elecciones guardadas. Los cambios se guardan en este navegador.")}</p>
 </article>;
}
