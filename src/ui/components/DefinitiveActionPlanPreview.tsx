import type { ActionPlanCatalogModule } from "../../domain/action-plan-catalog/ActionPlanCatalog";
import type { PlanPreparationDraft, PlanPreparationDecision } from "../../domain/action-plan-catalog/PlanPreparationDraft";

const selected = (decision: PlanPreparationDecision | undefined) => decision?.status === "included" || decision?.status === "modified";
const resolvedText = (decision: PlanPreparationDecision | undefined, source: string) =>
  decision?.status === "modified" && decision.text?.trim() ? decision.text.trim() : source;

function allIds(module: ActionPlanCatalogModule) {
  return [
    module.id,
    ...module.generalObjectives.flatMap(general => [
      general.code,
      ...general.specificObjectives.flatMap(specific => [specific.code, specific.indicator.code]),
    ]),
  ];
}

function moduleIsActive(module: ActionPlanCatalogModule, draft: PlanPreparationDraft | undefined) {
  if (!draft) return false;
  return allIds(module).some(id => {
    const status = draft.decisions[id]?.status;
    return status === "included" || status === "modified" || status === "excluded";
  });
}

function excluded(draft: PlanPreparationDraft | undefined, ids: string[]) {
  return ids.some(id => draft?.decisions[id]?.status === "excluded");
}

function pendingCount(module: ActionPlanCatalogModule, draft: PlanPreparationDraft | undefined) {
  if (!draft || !moduleIsActive(module, draft)) return 0;
  let count = draft.decisions[module.id]?.status === "pending" || !draft.decisions[module.id] ? 1 : 0;
  for (const general of module.generalObjectives) {
    if (excluded(draft, [module.id])) continue;
    if (!draft.decisions[general.code] || draft.decisions[general.code].status === "pending") count += 1;
    for (const specific of general.specificObjectives) {
      if (excluded(draft, [module.id, general.code])) continue;
      if (!draft.decisions[specific.code] || draft.decisions[specific.code].status === "pending") count += 1;
      if (excluded(draft, [module.id, general.code, specific.code])) continue;
      if (!draft.decisions[specific.indicator.code] || draft.decisions[specific.indicator.code].status === "pending") count += 1;
    }
  }
  return count;
}

export function DefinitiveActionPlanPreview({municipalityId, modules, drafts}: {
  municipalityId: string;
  modules: ActionPlanCatalogModule[];
  drafts?: PlanPreparationDraft[];
}) {
  const active = modules.map(module => ({
    module,
    draft: drafts?.find(draft => draft.municipalityId === municipalityId && draft.moduleId === module.id),
  })).filter(({module, draft}) => moduleIsActive(module, draft));

  const pending = active.reduce((total, item) => total + pendingCount(item.module, item.draft), 0);
  const selectedObjectives = active.reduce((total, {module, draft}) => total + module.generalObjectives.reduce((subtotal, general) =>
    subtotal + general.specificObjectives.filter(specific => !excluded(draft, [module.id, general.code]) && selected(draft?.decisions[specific.code])).length, 0), 0);
  const selectedIndicators = active.reduce((total, {module, draft}) => total + module.generalObjectives.reduce((subtotal, general) =>
    subtotal + general.specificObjectives.filter(specific => !excluded(draft, [module.id, general.code, specific.code]) && selected(draft?.decisions[specific.indicator.code])).length, 0), 0);

  return <section className="workspace-panel pcm-definitive-plan" aria-label="Plan de Acción resultante">
    <div className="pcm-module__header">
      <div>
        <p className="eyebrow">Plan de Acción resultante</p>
        <h2>{municipalityId === "granada-zaidin" ? "El Zaidín" : municipalityId}</h2>
      </div>
      <span className="status-pill">{pending === 0 && active.length > 0 ? "Listo para versión definitiva" : `${pending} pendientes`}</span>
    </div>
    <p className="panel-note">Esta vista utiliza únicamente los elementos marcados como <strong>Incluir</strong> o <strong>Modificar</strong>. Los modificados conservan su redacción territorial; los excluidos no se incorporan.</p>
    {active.length === 0 ? <p>No hay todavía líneas con decisiones territoriales. Selecciona o modifica elementos para construir el Plan de Acción.</p> : <>
      <p><strong>{selectedObjectives}</strong> objetivos específicos seleccionados · <strong>{selectedIndicators}</strong> indicadores seleccionados.</p>
      {pending > 0 && <div className="phase-blocked-notice"><strong>Versión todavía no cerrable</strong><p>Quedan {pending} elementos pendientes dentro de las líneas que ya estás trabajando. Puedes ver el resultado actual, pero conviene resolverlos antes de declarar el Plan definitivo.</p></div>}
      {active.map(({module, draft}) => {
        const moduleDecision = draft?.decisions[module.id];
        const lineSelected = selected(moduleDecision);
        const groups = module.generalObjectives.map(general => {
          if (excluded(draft, [module.id])) return null;
          const specifics = general.specificObjectives.filter(specific => !excluded(draft, [module.id, general.code]) && selected(draft?.decisions[specific.code]));
          const generalSelected = selected(draft?.decisions[general.code]);
          if (!generalSelected && specifics.length === 0) return null;
          return {general, specifics};
        }).filter(Boolean) as {general: ActionPlanCatalogModule["generalObjectives"][number]; specifics: ActionPlanCatalogModule["generalObjectives"][number]["specificObjectives"]}[];
        if (!lineSelected && groups.length === 0) return null;
        return <article key={module.id} className="pcm-module">
          <h3>{module.title}</h3>
          <p><strong>Objetivo estratégico:</strong> {resolvedText(moduleDecision, module.strategicObjective)} {moduleDecision?.status === "modified" && <span className="status-pill">Modificado</span>}</p>
          {groups.map(({general, specifics}) => <section key={general.code} className="pcm-general">
            <h4>{general.code} · {resolvedText(draft?.decisions[general.code], general.title)} {draft?.decisions[general.code]?.status === "modified" && <span className="status-pill">Modificado</span>}</h4>
            {specifics.map(specific => {
              const objectiveDecision = draft?.decisions[specific.code];
              const indicatorDecision = draft?.decisions[specific.indicator.code];
              return <div key={specific.code} className="pcm-specific">
                <p><strong>{specific.code}</strong> · {resolvedText(objectiveDecision, specific.title)} {objectiveDecision?.status === "modified" && <span className="status-pill">Modificado</span>}</p>
                {selected(indicatorDecision) ? <p className="pcm-preview-indicator"><strong>{specific.indicator.code}</strong> · {resolvedText(indicatorDecision, specific.indicator.title)} {indicatorDecision?.status === "modified" && <span className="status-pill">Modificado</span>}</p> : <p className="panel-note">Indicador todavía no seleccionado para este objetivo.</p>}
              </div>;
            })}
          </section>)}
        </article>;
      })}
      <div className="backup-panel__actions"><button type="button" onClick={() => window.print()}>Imprimir / guardar como PDF</button></div>
    </>}
  </section>;
}
