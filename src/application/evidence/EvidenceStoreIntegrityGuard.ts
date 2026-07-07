/**
 * EvidenceStoreIntegrityGuard
 *
 * Validates and sanitizes an EvidenceStore before it enters the runtime
 * pipeline. Returns a sanitized copy of the store and a structured report.
 * It does NOT mutate the original store.
 *
 * Design note on origin names:
 * The task spec listed "citizen-prioritisation" and "manual" as governed
 * origins. The actual EvidenceOrigin type uses "citizen-participation" and
 * "manual-entry" respectively. This file uses the type-correct values.
 */

import {
  stableAssetKey,
  type EvidenceAtom,
  type EvidenceAtomKind,
  type EvidenceOrigin,
  type EvidenceStore,
} from "../../domain/evidence";

// All structurally valid origins. Must be kept in sync with EvidenceOrigin.
// Origins with entries in KIND_CONSTRAINTS below are "governed" — their atom
// kinds are enforced. All other valid origins pass through without kind checks.
const ALL_VALID_ORIGINS: ReadonlySet<string> = new Set<EvidenceOrigin>([
  "health-report",
  "complementary-study",
  "eas",
  "cmi",
  "ibse",
  "sam",
  "redcap",
  "localiza-salud",
  "community-assets",
  "citizen-participation",
  "longi",
  "manual-entry",
  "legacy-compas",
  "territorial-documentation",
  "qualitative-material",
  "other",
]);

// All structurally valid kinds. Must be kept in sync with EvidenceAtomKind.
const ALL_VALID_KINDS: ReadonlySet<string> = new Set<EvidenceAtomKind>([
  "indicator",
  "determinant",
  "asset",
  "participation",
  "qualitative-observation",
  "territorial-context",
  "sample-quality",
  "longitudinal-snapshot",
  "strategic-priority",
  "methodological-caution",
  "other",
]);

// ── Rule B: Kind constraints for governed origins ──────────────────────────

const KIND_CONSTRAINTS: Partial<Record<EvidenceOrigin, ReadonlySet<EvidenceAtomKind>>> = {
  // ibse produces two atom types:
  //   IBSE_FACTORES → kind "indicator"   (5 atoms: meanTotal + 4 factors)
  //   IBSE_RESUMEN  → kind "qualitative-observation" (1 atom: structural interpretation)
  ibse: new Set(["indicator", "qualitative-observation"]),
  "health-report": new Set([
    "indicator",
    "qualitative-observation",
    "methodological-caution",
    "territorial-context",
  ]),
  "citizen-participation": new Set(["strategic-priority"]),
  // manual-entry: unconstrained — any valid kind is allowed
};

// ── Rule D: IBSE completeness ─────────────────────────────────────────────
// Counts IBSE_FACTORES only (kind: "indicator") — the primary quantitative layer.
// IBSE_RESUMEN (kind: "qualitative-observation") is excluded by design:
//   it is a derived synthesis and does not contribute to instrument completeness.
// Integrity rules are based exclusively on quantitative indicators.

const IBSE_EXPECTED_INDICATOR_COUNT = 5;

// ── Output contract ────────────────────────────────────────────────────────

export interface IntegrityStats {
  totalAtoms: number;
  byOrigin: Record<string, number>;
  byKind: Record<string, number>;
}

export interface IntegrityGuardResult {
  valid: boolean;
  sanitizedStore: EvidenceStore;
  errors: string[];
  warnings: string[];
  stats: IntegrityStats;
}

// ── Public entry point ─────────────────────────────────────────────────────

export function runEvidenceStoreIntegrityGuard(
  store: EvidenceStore
): IntegrityGuardResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const accepted: EvidenceAtom[] = [];

  // duplicate-detection map: stableKey → first-seen atom id
  const seenKeys = new Map<string, string>();

  for (const atom of store.atoms) {
    const atomErrors = validateAtomStructure(atom);

    if (atomErrors.length > 0) {
      for (const msg of atomErrors) {
        errors.push(`[${atom.id ?? "id-missing"}] ${msg}`);
      }
      continue; // reject atom
    }

    // Rule E — duplicate detection
    const dupeKey = stableAssetKey(
      atom.municipalityId,
      atom.provenance.origin as EvidenceOrigin,
      atom.title
    );

    if (seenKeys.has(dupeKey)) {
      warnings.push(
        `Átomo duplicado omitido: "${atom.title}" (origin="${atom.provenance.origin}", id="${atom.id}"). ` +
          `Se conserva el registrado anteriormente (id="${seenKeys.get(dupeKey)}").`
      );
      continue;
    }

    seenKeys.set(dupeKey, atom.id);
    accepted.push(atom);
  }

  // Rule D — IBSE completeness (post-filter check over accepted atoms)
  const ibseIndicators = accepted.filter(
    (a) => a.provenance.origin === "ibse" && a.kind === "indicator"
  );
  if (ibseIndicators.length > 0 && ibseIndicators.length !== IBSE_EXPECTED_INDICATOR_COUNT) {
    warnings.push(
      `IBSE incompleto: se esperan ${IBSE_EXPECTED_INDICATOR_COUNT} indicadores ` +
        `(índice total + 4 factores), se encontraron ${ibseIndicators.length}. ` +
        `Los resultados del análisis IBSE pueden ser parciales.`
    );
  }

  const sanitizedStore: EvidenceStore = {
    ...store,
    atoms: accepted,
  };

  return {
    valid: errors.length === 0,
    sanitizedStore,
    errors,
    warnings,
    stats: buildStats(accepted),
  };
}

// ── Per-atom validation ────────────────────────────────────────────────────

function validateAtomStructure(atom: EvidenceAtom): string[] {
  const errs: string[] = [];

  // Rule C — structural integrity
  if (!atom.id) {
    errs.push("Campo id ausente.");
  }
  if (!atom.provenance?.origin) {
    errs.push("Campo provenance.origin ausente.");
    return errs; // cannot continue without origin
  }
  if (!atom.kind) {
    errs.push("Campo kind ausente.");
    return errs; // cannot continue without kind
  }

  // Rule A — origin must be a recognised EvidenceOrigin value
  if (!ALL_VALID_ORIGINS.has(atom.provenance.origin)) {
    errs.push(
      `Origin desconocido: "${atom.provenance.origin}". ` +
        `Orígenes válidos: ${[...ALL_VALID_ORIGINS].sort().join(", ")}.`
    );
    return errs;
  }

  // kind must be a recognised EvidenceAtomKind value
  if (!ALL_VALID_KINDS.has(atom.kind)) {
    errs.push(
      `Kind desconocido: "${atom.kind}". ` +
        `Kinds válidos: ${[...ALL_VALID_KINDS].sort().join(", ")}.`
    );
    return errs;
  }

  // Rule B — kind consistency for governed origins
  const origin = atom.provenance.origin as EvidenceOrigin;
  const allowedKinds = KIND_CONSTRAINTS[origin];

  if (allowedKinds !== undefined && !allowedKinds.has(atom.kind as EvidenceAtomKind)) {
    errs.push(
      `Kind "${atom.kind}" no está permitido para origin "${origin}". ` +
        `Kinds esperados: [${[...allowedKinds].join(", ")}].`
    );
  }

  // Non-governed origins: emit a warning externally (not here — caller does it)
  return errs;
}

// ── Stats ─────────────────────────────────────────────────────────────────

function buildStats(atoms: EvidenceAtom[]): IntegrityStats {
  const byOrigin: Record<string, number> = {};
  const byKind: Record<string, number> = {};

  for (const atom of atoms) {
    const o = atom.provenance.origin;
    byOrigin[o] = (byOrigin[o] ?? 0) + 1;
    byKind[atom.kind] = (byKind[atom.kind] ?? 0) + 1;
  }

  return { totalAtoms: atoms.length, byOrigin, byKind };
}
