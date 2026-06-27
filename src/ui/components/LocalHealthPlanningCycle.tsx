import type { LocalHealthProfileStatus } from "../../domain/health-profile";

// ── Tipos ─────────────────────────────────────────────────────────────────────

type PhaseStatus =
  | "completed"
  | "current"
  | "pending"
  | "blocked"
  | "requires-validation";

// La vista destino al hacer clic en una fase (coincide con AppView de App.tsx).
// Se define como string genérico para no crear dependencia circular con App.tsx.
type AppViewId = string;

interface CyclePhase {
  id: string;
  num: number;
  label: string;
  status: PhaseStatus;
  note?: string;
  navigateTo?: AppViewId;
}

export interface LocalHealthPlanningCycleProps {
  healthReportLoaded: boolean;
  pslHasEvidence: boolean;
  pslStatus: LocalHealthProfileStatus;
  pslIsStale: boolean;
  thematicPrioritisationDone: boolean;
  onNavigate?: (view: AppViewId) => void;
}

// ── Etiquetas de estado ───────────────────────────────────────────────────────

const STATUS_LABEL: Record<PhaseStatus, string> = {
  completed:              "Completada",
  current:                "En curso",
  pending:                "Pendiente",
  blocked:                "No disponible",
  "requires-validation":  "Revisar",
};

// ── Derivación de fases ───────────────────────────────────────────────────────
// Inferencia prudente: solo usa señales disponibles en el workspace.
// Nunca inventa validaciones que el sistema no puede verificar.

function derivePhases({
  healthReportLoaded,
  pslHasEvidence,
  pslStatus,
  pslIsStale,
  thematicPrioritisationDone,
}: LocalHealthPlanningCycleProps): CyclePhase[] {
  const pslValidated  = pslStatus === "validated" && !pslIsStale;
  const pslStaleNote  = pslIsStale ? "La evidencia ha cambiado" : undefined;

  // 3 — Perfil de Salud Local
  let pslPhase: PhaseStatus;
  if (pslStatus === "validated" && pslIsStale) {
    pslPhase = "requires-validation";
  } else if (pslValidated) {
    pslPhase = "completed";
  } else if (pslHasEvidence) {
    pslPhase = "current";
  } else {
    pslPhase = "pending";
  }

  // 4 — Priorización (formal = participación + PSL validado + deliberación)
  // La participación ciudadana puede realizarse antes de validar el PSL.
  // Mientras el PSL no está validado, la priorización formal permanece pendiente,
  // no bloqueada, para reflejar el progreso real del expediente.
  let prioPhase: PhaseStatus;
  let prioNote: string | undefined;
  if (pslValidated && thematicPrioritisationDone) {
    prioPhase = "completed";
  } else if (pslValidated && !thematicPrioritisationDone) {
    prioPhase = "current";
  } else if (!pslValidated && thematicPrioritisationDone) {
    prioPhase = "pending";
    prioNote  = "Participación ciudadana recibida";
  } else {
    prioPhase = "blocked";
  }

  // 5 — Plan de Acción
  let planPhase: PhaseStatus;
  if (!pslValidated) {
    planPhase = "blocked";
  } else if (thematicPrioritisationDone) {
    planPhase = "current";
  } else {
    planPhase = "pending";
  }

  return [
    {
      id:          "relas",
      num:         1,
      label:       "Adhesión a RELAS",
      status:      "pending",
      note:        "Sin datos de seguimiento",
    },
    {
      id:          "informe",
      num:         2,
      label:       "Informe de Salud",
      status:      healthReportLoaded ? "completed" : "current",
      navigateTo:  "repositorio",
    },
    {
      id:          "psl",
      num:         3,
      label:       "Perfil de Salud Local",
      status:      pslPhase,
      note:        pslStaleNote,
      navigateTo:  "psl",
    },
    {
      id:          "priorizacion",
      num:         4,
      label:       "Priorización",
      status:      prioPhase,
      note:        prioNote,
      navigateTo:  prioPhase !== "blocked" ? "priorizacion" : undefined,
    },
    {
      id:          "plan-accion",
      num:         5,
      label:       "Plan de Acción",
      status:      planPhase,
      navigateTo:  planPhase !== "blocked" ? "plan" : undefined,
    },
    {
      id:          "agendas",
      num:         6,
      label:       "Agendas anuales",
      status:      pslValidated ? "pending" : "blocked",
      navigateTo:  pslValidated ? "plan" : undefined,
    },
    {
      id:          "plan-local",
      num:         7,
      label:       "Plan Local de Salud",
      status:      "blocked",
    },
  ];
}

// ── Componente ────────────────────────────────────────────────────────────────

export function LocalHealthPlanningCycle(props: LocalHealthPlanningCycleProps) {
  const { onNavigate } = props;
  const phases = derivePhases(props);

  return (
    <div className="lhpc" role="navigation" aria-label="Ciclo de planificación local de salud">
      <div className="lhpc__inner">
        <p className="lhpc__heading">Ciclo de Planificación Local</p>
        <ol className="lhpc__phases" role="list">
          {phases.map((phase) => {
            const isClickable = onNavigate !== undefined && phase.navigateTo !== undefined;
            const content = (
              <>
                <span className="lhpc__phase-num" aria-hidden="true">
                  {phase.num}
                </span>
                <span className="lhpc__phase-label">{phase.label}</span>
                <span className="lhpc__phase-status" aria-label={`Estado: ${STATUS_LABEL[phase.status]}`}>
                  {STATUS_LABEL[phase.status]}
                  {phase.note && (
                    <span className="lhpc__phase-note">{phase.note}</span>
                  )}
                </span>
              </>
            );

            return (
              <li
                key={phase.id}
                className={`lhpc__phase lhpc__phase--${phase.status}${isClickable ? " lhpc__phase--nav" : ""}`}
              >
                {isClickable ? (
                  <button
                    type="button"
                    className="lhpc__phase-btn"
                    onClick={() => onNavigate!(phase.navigateTo!)}
                    title={`Ir a: ${phase.label}`}
                  >
                    {content}
                  </button>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
