import type { ReactNode } from "react";
import type { ActionPlanCatalogModule, CatalogGeneralObjectiveTemplate, CatalogSpecificObjectiveTemplate } from "../../domain/action-plan-catalog/ActionPlanCatalog";
import {
  consolidatedTextFor,
  excludedByAncestor,
  plainProposalText,
  proposalBlocks,
  proposalObjectiveTexts,
  proposalStrategicText,
  proposedTextFor,
  ZAIDIN_PROPOSAL_VERSION,
  type PlanPreparationDraft,
  type PlanPreparationReview,
  type PlanPreparationReviewDecision,
  type PlanPreparationReviewStatus,
} from "../../domain/action-plan-catalog/PlanPreparationDraft";

export function ProposalText({text}: {text: string}) {
  return <>{text.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith("**") ? <strong key={i}>{part.slice(2,-2)}</strong> : part)}</>;
}

export function PlanPreparationPanel({module, municipalityId, draft, onChange, review, onReviewChange, canEditProposal=true, canReview=false, reviewIsCurrent=true, renderWorksheet, persistenceMessage}: {
 persistenceMessage?: string;
 module: ActionPlanCatalogModule;
 municipalityId: string;
 draft?: PlanPreparationDraft;
 onChange: (draft: PlanPreparationDraft) => void;
 review?: PlanPreparationReview;
 onReviewChange?: (review: PlanPreparationReview) => void;
 canEditProposal?: boolean;
 canReview?: boolean;
 reviewIsCurrent?: boolean;
 renderWorksheet: (module: ActionPlanCatalogModule, general: CatalogGeneralObjectiveTemplate, specific: CatalogSpecificObjectiveTemplate) => ReactNode;
}) {
 const revised = module.version === ZAIDIN_PROPOSAL_VERSION;
 const emphasized = (text: string) => [proposalStrategicText, ...Object.values(proposalObjectiveTexts), ...proposalBlocks.map(b => b.text)].find(candidate => plainProposalText(candidate) === text) ?? text;
 const proposalText = (id: string, text: string) => draft?.decisions[id]?.status === "modified" ? draft.decisions[id].text ?? text : emphasized(text);
 const consolidatedText = (id: string, text: string) => consolidatedTextFor(text, draft?.decisions[id], reviewIsCurrent ? review?.decisions[id] : undefined);

 function updateReview(id: string, source: string, patch: Partial<PlanPreparationReviewDecision>) {
  if (!canReview || !onReviewChange || !draft) return;
  const proposal = proposedTextFor(draft.decisions[id], source);
  const previous = review?.decisions[id];
  const next: PlanPreparationReviewDecision = {
   status: patch.status ?? previous?.status ?? "accepted",
   sourceText: source,
   proposedText: proposal,
   consolidatedText: patch.consolidatedText ?? previous?.consolidatedText,
   reviewedAt: new Date().toISOString(),
  };
  onReviewChange({
   municipalityId,
   moduleId: module.id,
   sourceVersion: module.version,
   sourceDraftVersion: review?.sourceDraftVersion ?? 0,
   updatedAt: new Date().toISOString(),
   decisions: {...review?.decisions, [id]: next},
  });
 }

 function reviewControl(id: string, source: string) {
  const proposal = draft?.decisions[id];
  if (!canReview || proposal?.status !== "modified") return null;
  const reviewed = reviewIsCurrent ? review?.decisions[id] : undefined;
  const status = reviewed?.status ?? "";
  const effective = consolidatedTextFor(source, proposal, reviewed);
  return <fieldset className="pcm-admin-review">
   <legend>Revisión administrativa · {id}</legend>
   {!reviewIsCurrent && review && <p role="alert">La revisión guardada corresponde a una versión anterior del borrador territorial. Debe revisarse de nuevo.</p>}
   <p><strong>Texto vigente:</strong> {source}</p>
   <p><strong>Propuesta territorial:</strong> {proposedTextFor(proposal, source)}</p>
   <label>Decisión administrativa
    <select aria-label={`Revisión administrativa ${id}`} value={status} onChange={e => {
     const value=e.target.value as PlanPreparationReviewStatus | "";
     if (!value) return;
     updateReview(id, source, {status:value, consolidatedText:value === "reformulated" ? (reviewed?.consolidatedText ?? proposedTextFor(proposal, source)) : undefined});
    }}>
     <option value="">Pendiente de revisión</option>
     <option value="accepted">Aceptar propuesta</option>
     <option value="rejected">Rechazar y mantener texto vigente</option>
     <option value="reformulated">Reformular</option>
    </select>
   </label>
   {status === "reformulated" && <label>Redacción administrativa consolidada
    <textarea aria-label={`Redacción administrativa consolidada ${id}`} rows={3} value={reviewed?.consolidatedText ?? ""} onChange={e=>updateReview(id,source,{status:"reformulated",consolidatedText:e.target.value})}/>
   </label>}
   {status && <p><strong>Texto resultante:</strong> {effective}</p>}
  </fieldset>;
 }

 function control(id: string, source: string, ancestors: string[]) {
  const decision = draft?.decisions[id];
  const excluded = excludedByAncestor(draft, ancestors);
  const stale = decision && (decision.sourceText !== source || draft?.version !== module.version);
  return <div className="pcm-decision">
   <label><span>Selección de borrador · {id}</span><select disabled={!canEditProposal} aria-label={`Selección de borrador ${id}`} value={decision?.status ?? "pending"} onChange={e => onChange({
    municipalityId, moduleId: module.id, version: module.version, updatedAt: new Date().toISOString(),
    decisions: {...draft?.decisions, [id]: {status: e.target.value as NonNullable<typeof decision>["status"], sourceText: source, text: decision?.text ?? source}}
   })}><option value="pending">Pendiente</option><option value="included">Incluir</option><option value="excluded">Excluir</option><option value="modified">Modificar</option></select></label>
   {decision?.status === "modified" && canEditProposal && <label>Propuesta de nueva redacción · {id}<textarea aria-label={`Propuesta de nueva redacción · ${id}`} value={decision.text ?? source} rows={3} onChange={e => onChange({...draft!, decisions: {...draft!.decisions, [id]: {...decision, text: e.target.value}}, updatedAt: new Date().toISOString()})}/>{!decision.text?.trim() && <p role="alert">Completa la redacción; esta propuesta está pendiente.</p>}<span className="panel-note">La redacción se guarda como propuesta territorial. No modifica el texto consolidado de COMPAS.</span></label>}
   {decision?.status === "modified" && !canEditProposal && <p className="panel-note"><strong>Propuesta territorial:</strong> {proposedTextFor(decision, source)}</p>}
   {excluded && <p className="panel-note">Fuera del borrador porque un elemento superior está excluido. Se conservan la elección individual, la ficha y las actuaciones.</p>}
   {stale && <p role="status">La propuesta cambió. Se conserva la decisión anterior; vuelve a revisarla.</p>}
   {reviewControl(id, source)}
  </div>;
 }

 return <article className="workspace-panel pcm-preparation">
  <header className="pcm-editorial-header">
   <p className="eyebrow">Preparación del Plan · borrador editable</p>
   <h2>{module.title}</h2>
   <p className="pcm-provenance">{module.sourceLabel}<br /><span>Versión de referencia · {module.sourceDate}</span></p>
  </header>
  <aside className="pcm-guidance" aria-label="Cómo revisar la propuesta">
   <p><strong>{canReview ? "Revisión administrativa" : "Cómo revisar la propuesta"}</strong></p>
   {canReview ? <><p>El responsable territorial propone. La administración general acepta, rechaza o reformula antes de consolidar.</p><p>La consolidación administrativa <strong>no constituye aprobación del Grupo Motor</strong>.</p></> : <><p>Selecciona y modifica los elementos para preparar tu propuesta.</p><p>Estas elecciones <strong>no constituyen aprobación del Grupo Motor</strong>.</p><p>Las modificaciones se envían como <strong>propuestas territoriales pendientes de revisión administrativa</strong>.</p></>}
  </aside>
  <section className="pcm-strategic" aria-label="Objetivo estratégico propuesto">
   <h3>Objetivo estratégico propuesto</h3>
   <p><ProposalText text={canReview ? consolidatedText(module.id, revised ? plainProposalText(proposalStrategicText) : module.strategicObjective) : proposalText(module.id, revised ? proposalStrategicText : module.strategicObjective)}/></p>
  </section>
  {control(module.id, module.strategicObjective, [])}
  {module.generalObjectives.map(general => {
   const block = proposalBlocks.find(b => b.code === general.code);
   const sourceGeneral = general.title;
   const visibleGeneral = canReview ? consolidatedText(general.code, sourceGeneral) : proposalText(general.code, (revised ? block?.text : undefined) ?? sourceGeneral);
   return <details className="pcm-general" key={general.code} open>
    <summary>{block?.name ?? `${general.code} · ${visibleGeneral}`}</summary>
    <p><ProposalText text={visibleGeneral}/></p>
    {control(general.code, sourceGeneral, [module.id])}
    {general.specificObjectives.map(specific => {
     const indicator = specific.indicator;
     const sourceSpecific = specific.title;
     const sourceIndicator = indicator.title;
     const visibleSpecific = canReview ? consolidatedText(specific.code, sourceSpecific) : proposalText(specific.code, revised ? proposalObjectiveTexts[specific.code] : sourceSpecific);
     const visibleIndicator = canReview ? consolidatedText(indicator.code, sourceIndicator) : proposalText(indicator.code, sourceIndicator);
     const draftModule = {...module, strategicObjective: plainProposalText(canReview ? consolidatedText(module.id,module.strategicObjective) : proposalText(module.id,module.strategicObjective))};
     const draftGeneral = {...general, title: plainProposalText(visibleGeneral)};
     const draftSpecific = {...specific, title: plainProposalText(visibleSpecific), indicator: {...indicator, title: plainProposalText(visibleIndicator)}};
     return <section className="pcm-specific" key={specific.code}>
      <h3>{specific.code}</h3><p><ProposalText text={visibleSpecific}/></p>
      {control(specific.code, sourceSpecific, [module.id, general.code])}
      <details className="pcm-sheet"><summary>Indicador y ficha · {indicator.code}</summary>
       <p>{visibleIndicator}</p>
       <p className="panel-note">Indicador de la propuesta original. Su cobertura de los conceptos del objetivo está pendiente de revisión.</p>
       {control(indicator.code, sourceIndicator, [module.id, general.code, specific.code])}
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
