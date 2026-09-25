import type { QuestionnaireProject, QuestionnaireArtifact } from "../../domain/questionnaire";
import { getMethodologicalModule } from "../../domain/methodology";
import { EAS_SOCIODEMOGRAPHIC_FIELDS, SOCIODEMOGRAPHIC_FORM_NAME } from "./redcap";

// ── Estimaciones de tiempo por instrumento (minutos: [mín, máx]) ──────────────
// Derivadas de la experiencia de administración. No forman parte del dominio
// metodológico — son orientaciones prácticas para el técnico municipal.

const TIME_ESTIMATES: Readonly<Record<string, [number, number]>> = {
  "ibse":         [5, 8],
  "duke-eas":     [4, 6],
  "predimed-eas": [5, 7],
  "sf12-eas":     [3, 5],
  "sueno-eas":    [1, 2],
  "cage-eas":     [1, 2],
  "auditc":        [1, 2],
  "ipaq-eas":      [0, 0],
  "ghq12":         [4, 6],
  "phq9":          [3, 5],
  "psqi":          [3, 5],
  "fagerstrom":    [2, 3],
  "sbq":           [3, 5],
};

const SD_TIME: [number, number] = [2, 3];

function moduleTime(moduleId: string, itemCount: number): [number, number] {
  if (TIME_ESTIMATES[moduleId]) return TIME_ESTIMATES[moduleId];
  const base = Math.max(1, Math.ceil(itemCount * 0.5));
  return [base, base + 2];
}

// ── Helpers de formato ────────────────────────────────────────────────────────

const WIDTH = 60;

function divider(ch: string): string {
  return ch.repeat(WIDTH);
}

function labelRow(label: string, value: string): string {
  return `${label.padEnd(22)} ${value}`;
}

// ── Generador ─────────────────────────────────────────────────────────────────

export function generateMethodologicalSpecArtifact(
  project: QuestionnaireProject,
): QuestionnaireArtifact {
  const { questionnaire } = project;
  const now = new Date().toISOString();

  const hasSocio = questionnaire.classificationBlocks.includes("eas-sociodemographic");

  const modules = questionnaire.methodologicalModules.map((id) => {
    const mod = getMethodologicalModule(id);
    if (!mod) throw new Error(`Módulo no registrado: ${id}`);
    return mod;
  });

  // ── Cálculo de totales ──────────────────────────────────────────────────────

  const sdItemCount     = hasSocio ? EAS_SOCIODEMOGRAPHIC_FIELDS.length : 0;
  const modItemCount    = modules.reduce((s, m) => s + m.items.length, 0);
  const totalItems      = sdItemCount + modItemCount;
  const blockCount      = (hasSocio ? 1 : 0) + modules.length;

  let totalMin = hasSocio ? SD_TIME[0] : 0;
  let totalMax = hasSocio ? SD_TIME[1] : 0;
  for (const mod of modules) {
    const [a, b] = moduleTime(mod.identity.id, mod.items.length);
    totalMin += a;
    totalMax += b;
  }

  const draftModules = modules.filter((m) => m.identity.status === "draft");

  // ── Construcción del texto ──────────────────────────────────────────────────

  const lines: string[] = [];
  const push  = (...rows: string[]) => lines.push(...rows);
  const blank = () => lines.push("");

  // Cabecera
  push(divider("═"));
  push("ESPECIFICACIÓN METODOLÓGICA — COMPÁS NG");
  push(divider("═"));
  blank();
  push(labelRow("Encuesta:", project.name));
  push(labelRow("Generada:", now.slice(0, 10)));
  if (project.description) {
    push(labelRow("Descripción:", project.description));
  }

  // Resumen
  blank();
  push(divider("─"));
  push("RESUMEN");
  push(divider("─"));
  push(labelRow("Bloques incluidos:", String(blockCount)));
  push(labelRow("Total de ítems:", String(totalItems)));
  push(labelRow("Tiempo estimado:", `${totalMin}–${totalMax} minutos`));
  push(labelRow("Outputs:", questionnaire.outputs.join(", ")));

  // Bloque de Identificación y Clasificación
  if (hasSocio) {
    blank();
    push(divider("─"));
    push("BLOQUE DE IDENTIFICACIÓN Y CLASIFICACIÓN");
    push(divider("─"));
    push(labelRow("Formulario REDCap:", SOCIODEMOGRAPHIC_FORM_NAME));
    push(labelRow("Variables:", EAS_SOCIODEMOGRAPHIC_FIELDS.map((f) => f.fieldName).join(", ")));
    push(labelRow("Ítems:", String(sdItemCount)));
    push(labelRow("Tiempo estimado:", `${SD_TIME[0]}–${SD_TIME[1]} minutos`));
    push("Compatibilidad EAS: parcial · pending-verification");
    push("Referencia: CONTRACT-GES-EAS-COMPATIBILITY");
  }

  // Instrumentos metodológicos
  if (modules.length > 0) {
    blank();
    push(divider("─"));
    push("INSTRUMENTOS METODOLÓGICOS");
    push(divider("─"));

    modules.forEach((mod, idx) => {
      const [tMin, tMax] = moduleTime(mod.identity.id, mod.items.length);
      blank();
      push(`[${idx + 1}] ${mod.identity.name} (${mod.identity.shortName})`);
      push(labelRow("    Versión:", mod.identity.version));
      push(labelRow("    Estado:", mod.identity.status));
      push(labelRow("    Categoría:", mod.identity.category));
      if (mod.identity.targetPopulation) {
        push(labelRow("    Población:", mod.identity.targetPopulation));
      }
      push(labelRow("    Ítems:", String(mod.items.length)));
      push(labelRow("    Tiempo estimado:", `${tMin}–${tMax} minutos`));
      // Solo la primera oración del constructo para mantener el documento conciso
      const purpose = mod.identity.purpose.split(".")[0].trim();
      push(`    Constructo: ${purpose}.`);
    });
  }

  // Advertencias metodológicas
  if (draftModules.length > 0) {
    blank();
    push(divider("─"));
    push("ADVERTENCIAS METODOLÓGICAS");
    push(divider("─"));
    push(`${draftModules.length} módulo(s) en estado "draft" — pendientes de validación definitiva:`);
    for (const mod of draftModules) {
      // Primera limitación como referencia de qué está pendiente
      const note = mod.limitations.length > 0 ? mod.limitations[0] : "Revisión pendiente.";
      push(`  · ${mod.identity.shortName}: ${note}`);
    }
  }

  // Bibliografía
  if (modules.length > 0) {
    blank();
    push(divider("─"));
    push("BIBLIOGRAFÍA");
    push(divider("─"));
    modules.forEach((mod, idx) => {
      const ref = mod.bibliography[0];
      if (!ref) return;
      const year   = ref.year   ? ` (${ref.year})`  : "";
      const title  = ref.title  ? `. ${ref.title}`  : "";
      const source = ref.source ? `. ${ref.source}` : "";
      push(`[${idx + 1}] ${mod.identity.shortName}: ${ref.authors}${year}${title}${source}.`);
    });
  }

  // Compatibilidad con COMPÁS NG
  blank();
  push(divider("─"));
  push("COMPATIBILIDAD CON COMPÁS NG");
  push(divider("─"));
  push("Pipeline: EvidenceAtoms → EvidenceStore → MIT → PSL");
  push("Los Estudios Complementarios son independientes del origen de los datos.");
  push("Los parsers existentes admiten tanto microdatos EAS como datos de encuesta propia.");

  // Pie
  blank();
  push(divider("─"));
  push("Generado con COMPÁS NG — Gestor de Encuestas de Salud (GES)");
  push(divider("─"));

  const content = lines.join("\n");

  return {
    id: crypto.randomUUID(),
    questionnaireId: questionnaire.id,
    kind: "methodological-spec",
    name: `${project.name} — Especificación Metodológica.txt`,
    mimeType: "text/plain",
    content,
    createdAt: now,
    metadata: {
      totalItems:        String(totalItems),
      estimatedTimeMin:  String(totalMin),
      estimatedTimeMax:  String(totalMax),
      draftModuleCount:  String(draftModules.length),
      blockCount:        String(blockCount),
    },
  };
}
