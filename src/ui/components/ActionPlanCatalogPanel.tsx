import { useState } from "react";
import type {
  CatalogDecisionStatus,
  CatalogElementDecision,
  EligibleActionPlanModule,
  MunicipalActionPlanModuleReview,
} from "../../domain/action-plan-catalog";
import { createPendingModuleReview, isModuleReviewStale } from "../../domain/action-plan-catalog";
import { ACTION_PLAN_CATALOG, type ActionPlanCatalogModule } from "../../domain/action-plan-catalog";
import type { DeliberativePrioritySelection } from "../../domain/deliberative-prioritisation";
import type { LecturaEstrategicaLocal } from "../../domain/strategic-scenario";

interface ActionPlanCatalogPanelProps {
  municipalityId: string;
  lectura: LecturaEstrategicaLocal;
  selection?: DeliberativePrioritySelection;
  eligibleModules: EligibleActionPlanModule[];
  reviews: MunicipalActionPlanModuleReview[];
  onSave: (review: MunicipalActionPlanModuleReview) => readonly string[];
}

const decisionLabels: Record<CatalogDecisionStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptar",
  adapted: "Adaptar",
  rejected: "Rechazar",
};

function ModuleReview({
  municipalityId,
  lectura,
  selection,
  eligible,
  savedReview,
  onSave,
}: Omit<ActionPlanCatalogPanelProps, "eligibleModules" | "reviews" | "selection"> & {
  selection: DeliberativePrioritySelection;
  eligible: EligibleActionPlanModule;
  savedReview?: MunicipalActionPlanModuleReview;
}) {
  const savedIsStale = savedReview != null && isModuleReviewStale(savedReview, eligible, lectura, selection);
  const [initial] = useState(() =>
    savedIsStale || savedReview == null
      ? createPendingModuleReview(municipalityId, eligible, lectura, selection)
      : savedReview
  );
  const [decisions, setDecisions] = useState<CatalogElementDecision[]>(initial.decisions);
  const [reviewedBy, setReviewedBy] = useState(initial.reviewedBy);
  const [violations, setViolations] = useState<readonly string[]>([]);
  const byId = new Map(decisions.map((decision) => [decision.elementId, decision]));

  function updateDecision(elementId: string, status: CatalogDecisionStatus, adaptedText?: string) {
    setDecisions((current) => current.map((decision) =>
      decision.elementId === elementId
        ? { elementId, status, ...(status === "adapted" ? { adaptedText: adaptedText ?? decision.adaptedText ?? "" } : {}) }
        : decision
    ));
  }

  function setAll(status: "pending" | "accepted" | "rejected") {
    setDecisions((current) => current.map(({ elementId }) => ({ elementId, status })));
  }

  function decisionControl(elementId: string, originalText: string) {
    const decision = byId.get(elementId) ?? { elementId, status: "pending" as const };
    return (
      <div className="pcm-decision">
        <label>
          <span className="pcm-decision__label">Decisión del Grupo Motor</span>
          <select
            value={decision.status}
            onChange={(event) => updateDecision(elementId, event.target.value as CatalogDecisionStatus)}
          >
            {Object.entries(decisionLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        {decision.status === "adapted" && (
          <label>
            <span className="pcm-decision__label">Redacción municipal</span>
            <textarea
              rows={3}
              value={decision.adaptedText ?? ""}
              placeholder={originalText}
              onChange={(event) => updateDecision(elementId, "adapted", event.target.value)}
            />
          </label>
        )}
      </div>
    );
  }

  function save() {
    const review: MunicipalActionPlanModuleReview = {
      ...initial,
      decisions,
      reviewedBy: reviewedBy.trim(),
      reviewedAt: new Date().toISOString(),
    };
    setViolations(onSave(review));
  }

  const resolved = decisions.filter((decision) => decision.status !== "pending").length;
  return (
    <article className="workspace-panel pcm-module">
      <div className="pcm-module__header">
        <div>
          <p className="eyebrow">Módulo propuesto · versión {eligible.module.version}</p>
          <h2>{eligible.module.title}</h2>
        </div>
        <span className="status-pill">{resolved}/{decisions.length} revisados</span>
      </div>
      <p className="panel-note">{eligible.module.strategicObjective}</p>
      <p className="pcm-trace">
        Propuesto porque el Grupo Motor seleccionó la prioridad: {eligible.sourceScenarioIds.map((id) => lectura.escenarios.find((scenario) => scenario.id === id)?.tema ?? id).join(", ")}.
      </p>
      <p className="pcm-source">Fuente de la propuesta: {eligible.module.sourceLabel} ({eligible.module.sourceDate}).</p>
      {savedIsStale && (
        <div className="phase-blocked-notice">
          <strong>Revisión anterior obsoleta</strong>
          <p>La selección deliberativa, la lectura estratégica o la versión del módulo han cambiado. Debe registrarse una nueva revisión.</p>
        </div>
      )}
      <div className="pcm-bulk-actions" aria-label="Decisión sobre el módulo completo">
        <span>Aplicar al módulo completo:</span>
        <button type="button" onClick={() => setAll("accepted")}>Aceptar todo</button>
        <button type="button" onClick={() => setAll("rejected")}>Rechazar todo</button>
        <button type="button" onClick={() => setAll("pending")}>Dejar todo pendiente</button>
      </div>

      <div className="pcm-objectives">
        {eligible.module.generalObjectives.map((general) => (
          <details key={general.code} className="pcm-general">
            <summary><span>{general.code}</span> {general.title}</summary>
            {decisionControl(general.code, general.title)}
            <div className="pcm-specifics">
              {general.specificObjectives.map((specific) => (
                <section key={specific.code} className="pcm-specific">
                  <h3><span>{specific.code}</span> {specific.title}</h3>
                  {decisionControl(specific.code, specific.title)}
                  <div className="pcm-indicator">
                    <p><strong>{specific.indicator.code}</strong> {specific.indicator.title}</p>
                    <dl>
                      <div><dt>Fuente propuesta</dt><dd>{specific.indicator.suggestedSource}</dd></div>
                      <div><dt>Unidad</dt><dd>{specific.indicator.unit}</dd></div>
                      <div><dt>Periodicidad</dt><dd>{specific.indicator.periodicity}</dd></div>
                      <div><dt>Sentido</dt><dd>{specific.indicator.direction === "ascending" ? "Ascendente" : "Descendente"}</dd></div>
                    </dl>
                    <details className="pcm-sheet">
                      <summary>Ver ficha técnica propuesta</summary>
                      <dl>
                        <div><dt>Definición operacional</dt><dd>{specific.indicator.operationalDefinition}</dd></div>
                        <div><dt>Método de cálculo</dt><dd>{specific.indicator.calculationMethod}</dd></div>
                        <div><dt>Desagregación</dt><dd>{specific.indicator.disaggregation}</dd></div>
                        <div><dt>Línea base</dt><dd>{specific.indicator.baseline}</dd></div>
                        <div><dt>Meta</dt><dd>{specific.indicator.target}</dd></div>
                        <div><dt>Responsable del dato</dt><dd>{specific.indicator.dataOwner}</dd></div>
                        <div><dt>Criterio de calidad</dt><dd>{specific.indicator.qualityCriterion}</dd></div>
                        <div><dt>Limitación</dt><dd>{specific.indicator.limitation}</dd></div>
                      </dl>
                    </details>
                    {decisionControl(specific.indicator.code, specific.indicator.title)}
                  </div>
                </section>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="pcm-review-footer">
        <label>
          <span className="pcm-decision__label">Equipo o Grupo Motor que registra la revisión</span>
          <input value={reviewedBy} onChange={(event) => setReviewedBy(event.target.value)} />
        </label>
        {violations.length > 0 && <ul className="deliberative-selection__violations">{violations.map((v) => <li key={v}>{v}</li>)}</ul>}
        <button type="button" className="tp-panel__open-btn" onClick={save}>Guardar revisión del módulo</button>
      </div>

      <div className="pcm-cautions">
        <strong>Límites de la propuesta</strong>
        <ul>{eligible.module.cautions.map((caution) => <li key={caution}>{caution}</li>)}</ul>
      </div>
    </article>
  );
}

function AvailableModule({ module }: { module: ActionPlanCatalogModule }) {
  const specifics = module.generalObjectives.flatMap((general) => general.specificObjectives);
  return (
    <article className="workspace-panel pcm-module pcm-module--available">
      <div className="pcm-module__header">
        <div>
          <p className="eyebrow">Línea disponible · versión {module.version}</p>
          <h2>{module.title}</h2>
        </div>
        <span className="status-pill">Consulta</span>
      </div>
      <p className="panel-note">{module.strategicObjective}</p>
      <p className="pcm-locked-note">
        Puedes examinar su arquitectura. Para aceptar, adaptar o rechazar sus elementos,
        el Grupo Motor debe relacionar expresamente esta línea con una prioridad seleccionada.
      </p>
      <p className="pcm-source">Fuente de la propuesta: {module.sourceLabel} ({module.sourceDate}).</p>
      <p className="pcm-counts">{module.generalObjectives.length} objetivos generales · {specifics.length} objetivos específicos · {specifics.length} indicadores</p>
      <div className="pcm-objectives">
        {module.generalObjectives.map((general) => (
          <details key={general.code} className="pcm-general">
            <summary><span>{general.code}</span> {general.title}</summary>
            <div className="pcm-specifics pcm-specifics--preview">
              {general.specificObjectives.map((specific) => (
                <section key={specific.code} className="pcm-specific">
                  <h3><span>{specific.code}</span> {specific.title}</h3>
                  <p className="pcm-preview-indicator"><strong>{specific.indicator.code}</strong> {specific.indicator.title}</p>
                </section>
              ))}
            </div>
          </details>
        ))}
      </div>
    </article>
  );
}

export function ActionPlanCatalogPanel(props: ActionPlanCatalogPanelProps) {
  return (
    <div className="pcm-root">
      <section className="workspace-panel pcm-catalog-header">
        <p className="eyebrow">Catálogo RELAS de Plan de Acción</p>
        <h2>Líneas estratégicas disponibles</h2>
        <p className="panel-note">
          Consulta las líneas, objetivos e indicadores documentados. Verlos no los incorpora al Plan:
          la revisión se habilita solo cuando el Grupo Motor relaciona una línea con una prioridad seleccionada.
        </p>
      </section>
      {ACTION_PLAN_CATALOG.map((module) => {
        const eligible = props.eligibleModules.find((candidate) => candidate.module.id === module.id);
        return eligible != null && props.selection != null ? (
          <ModuleReview
            key={`${module.id}-${props.selection.id}`}
            municipalityId={props.municipalityId}
            lectura={props.lectura}
            selection={props.selection}
            onSave={props.onSave}
            eligible={eligible}
            savedReview={props.reviews.find((review) => review.moduleId === module.id)}
          />
        ) : <AvailableModule key={module.id} module={module} />;
      })}
    </div>
  );
}
