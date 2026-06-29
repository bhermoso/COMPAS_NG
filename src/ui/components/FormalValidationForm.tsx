import { useState } from "react";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface FormalValidationStatus {
  validatedAt: string;
  validatedBy: string;
  isStale: boolean;
}

interface FormalValidationFormProps {
  formalValidation?: FormalValidationStatus;
  onFormalValidate: (
    validatedBy: string,
    role: "coordination" | "group-motor",
    externalReference?: string,
  ) => void;
}

// ── Utilidad ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// ── Componente ────────────────────────────────────────────────────────────────

export function FormalValidationForm({ formalValidation, onFormalValidate }: FormalValidationFormProps) {
  const [validatedBy, setValidatedBy]           = useState("");
  const [role, setRole]                          = useState<"coordination" | "group-motor">("group-motor");
  const [externalReference, setExternalReference] = useState("");

  const canValidate = validatedBy.trim().length > 0;

  if (formalValidation && !formalValidation.isStale) {
    return (
      <div className="fval-status">
        <span className="fval-status__chip">Validado formalmente</span>
        <span className="fval-status__meta">
          {formatDate(formalValidation.validatedAt)} · {formalValidation.validatedBy}
        </span>
      </div>
    );
  }

  return (
    <div className="fval-form">
      {formalValidation?.isStale && (
        <p className="fval-form__stale">
          La validación formal ha quedado obsoleta porque el PSL ha cambiado.
          Debe revalidarse antes de compilar el Plan Local de Salud.
        </p>
      )}
      <p className="fval-form__text">
        La validación formal registra la adopción de este borrador por el Grupo Motor
        o la Coordinación como base del Plan Local de Salud.
        Requiere evidencia externa documentada (acta o acuerdo).
      </p>
      <div className="fval-form__fields">
        <label className="fval-form__label" htmlFor="fval-validated-by">
          Validado por (nombre y cargo)
        </label>
        <input
          id="fval-validated-by"
          className="fval-form__input"
          type="text"
          value={validatedBy}
          onChange={(e) => setValidatedBy(e.target.value)}
          maxLength={120}
          placeholder="Nombre y cargo del responsable"
        />
        <label className="fval-form__label" htmlFor="fval-role">
          Rol institucional
        </label>
        <select
          id="fval-role"
          className="fval-form__select"
          value={role}
          onChange={(e) => setRole(e.target.value as "coordination" | "group-motor")}
        >
          <option value="group-motor">Grupo Motor</option>
          <option value="coordination">Coordinación del proceso</option>
        </select>
        <label className="fval-form__label" htmlFor="fval-ext-ref">
          Referencia externa (opcional)
        </label>
        <input
          id="fval-ext-ref"
          className="fval-form__input"
          type="text"
          value={externalReference}
          onChange={(e) => setExternalReference(e.target.value)}
          maxLength={200}
          placeholder="Acta, acuerdo u otro documento externo al sistema"
        />
        <button
          className="fval-form__btn"
          onClick={() =>
            onFormalValidate(
              validatedBy.trim(),
              role,
              externalReference.trim() || undefined,
            )
          }
          disabled={!canValidate}
        >
          Validar formalmente
        </button>
      </div>
    </div>
  );
}
