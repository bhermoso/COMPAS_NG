import { PlanDocumentActions } from "./PlanDocumentActions";
import { useMemo, useRef, useState } from "react";
import type { ActionPlanCatalogModule } from "../../domain/action-plan-catalog/ActionPlanCatalog";
import {
  buildDefinitiveActionPlanProjection,
  pendingPreparationDecisionCount,
  resolvedPlanDecisionText,
} from "../../domain/action-plan-catalog/DefinitiveActionPlanProjection";
import type { PlanPreparationDraft } from "../../domain/action-plan-catalog/PlanPreparationDraft";

export function DefinitiveActionPlanPreview({municipalityId, modules, drafts, validatedActionPlans, onValidatePlan}: {
  validatedActionPlans?: import("../../domain/action-plan-catalog/PlanDocument").PlanDocument[];
  onValidatePlan?: (document: import("../../domain/action-plan-catalog/PlanDocument").PlanDocument) => boolean;
  municipalityId: string;
  modules: ActionPlanCatalogModule[];
  drafts?: PlanPreparationDraft[];
}) {
  const municipalityName = municipalityId === "granada-zaidin" ? "El Zaidín" : municipalityId;
  const active = useMemo(() => buildDefinitiveActionPlanProjection(municipalityId, modules, drafts), [municipalityId, modules, drafts]);

  const pending = active.reduce((total, item) => total + pendingPreparationDecisionCount(item.module, item.draft), 0);
  const selectedObjectives = active.reduce((total, item) => total + item.rows.length, 0);
  const selectedIndicators = active.reduce((total, item) => total + item.rows.filter(row => row.indicatorIncluded).length, 0);
  const generationSignature = JSON.stringify(active.map(({ module, draft, rows }) => ({
    moduleId: module.id,
    version: module.version,
    updatedAt: draft?.updatedAt,
    rows: rows.map(row => ({
      objective: row.specific.code,
      objectiveText: resolvedPlanDecisionText(row.objectiveDecision, row.specific.title),
      indicator: row.specific.indicator.code,
      indicatorIncluded: row.indicatorIncluded,
      indicatorText: resolvedPlanDecisionText(row.indicatorDecision, row.specific.indicator.title),
    })),
  })));
  const [generatedSignature, setGeneratedSignature] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const hasSelectableContent = selectedObjectives > 0 || selectedIndicators > 0;
  const generated = hasSelectableContent && generatedSignature === generationSignature;

  function generatePlan() {
    setGeneratedSignature(generationSignature);
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return <section className="workspace-panel pcm-definitive-plan" aria-label={`Plan de Acción resultante · ${municipalityName}`}>
    <PlanDocumentActions key={municipalityId} municipalityId={municipalityId} active={active} versions={validatedActionPlans} onValidate={onValidatePlan}/>
    <div className="pcm-module__header">
      <div>
        <p className="eyebrow">Vista consolidada del borrador territorial</p>
        <h2>Plan de Acción resultante · {municipalityName}</h2>
      </div>
      <span className="status-pill">{pending === 0 && active.length > 0 ? "Listo para versión definitiva" : `${pending} pendientes`}</span>
    </div>
    <p className="panel-note">Esta vista utiliza únicamente los elementos marcados como <strong>Incluir</strong> o <strong>Modificar</strong>. Los modificados conservan su redacción territorial; los excluidos no se incorporan.</p>
    {active.length === 0 ? <p>No hay todavía líneas con decisiones territoriales. Selecciona o modifica elementos para construir el Plan de Acción.</p> : <>
      <p><strong>{selectedObjectives}</strong> objetivos específicos seleccionados · <strong>{selectedIndicators}</strong> indicadores seleccionados.</p>
      {pending > 0 && <div className="phase-blocked-notice"><strong>Versión todavía no cerrable</strong><p>Quedan {pending} elementos pendientes dentro de las líneas que ya estás trabajando. Puedes ver el resultado actual, pero conviene resolverlos antes de declarar el Plan definitivo.</p></div>}
      <div className="backup-panel__actions pcm-generation-actions">
        <button type="button" disabled={!hasSelectableContent} onClick={generatePlan}>Generar Plan de Acción</button>


      </div>
      {!hasSelectableContent ? (
        <p className="panel-note">Selecciona o modifica al menos un objetivo específico o indicador para generar el Plan de Acción.</p>
      ) : !generated ? (
        <div className="pcm-generation-prompt">
          <strong>Selección preparada</strong>
          <p>Pulsa “Generar Plan de Acción” para componer la versión de trabajo con los objetivos e indicadores incluidos.</p>
        </div>
      ) : (
        <div className="pcm-generated-plan" ref={resultRef} aria-live="polite">
          <p role="status">Plan generado con la selección actual.</p>
          {active.map(({module, moduleDecision, rows}) => rows.length > 0 && <article key={module.id} className="pcm-module">
            <h3>{module.title}</h3>
            <p><strong>Objetivo estratégico:</strong> {resolvedPlanDecisionText(moduleDecision, module.strategicObjective)} {moduleDecision?.status === "modified" && <span className="status-pill">Modificado</span>}</p>
            <ol className="pcm-generated-objectives">
              {rows.map(row => {
                const objectiveText = resolvedPlanDecisionText(row.objectiveDecision, row.specific.title);
                const generalText = resolvedPlanDecisionText(row.generalDecision, row.general.title);
                const indicatorText = resolvedPlanDecisionText(row.indicatorDecision, row.specific.indicator.title);
                return <li key={`${row.specific.code}-${row.specific.indicator.code}`} className="pcm-specific">
                  <p><strong>{row.specific.code}</strong> · {objectiveText} {row.objectiveDecision?.status === "modified" && <span className="status-pill">Modificado</span>}</p>
                  <p className="panel-note">Bloque: {row.general.code} · {generalText}</p>
                  {row.indicatorIncluded ? <p className="pcm-preview-indicator"><strong>{row.specific.indicator.code}</strong> · {indicatorText} {row.indicatorDecision?.status === "modified" && <span className="status-pill">Modificado</span>}</p> : <p className="panel-note">Indicador todavía no seleccionado para este objetivo.</p>}
                </li>;
              })}
            </ol>
          </article>)}
        </div>
      )}
    </>}
  </section>;
}
