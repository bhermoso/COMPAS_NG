/**
 * studyPanelUtils — utilidades compartidas de los paneles de instrumentos.
 *
 * Centraliza getSampleQualityVerdict para que los 11 paneles con umbrales
 * estándar (n≥100 / n≥30) importen desde aquí en lugar de definir la misma
 * función localmente. Los paneles con umbrales específicos (Fagerström)
 * mantienen su propia versión.
 *
 * Las claves "adecuada"/"moderada"/"insuficiente" son las etiquetas de
 * presentación; se corresponden con los niveles SAM "high"/"medium"/"low"
 * del dominio (src/domain/sam/SampleQualityAssessment.ts).
 */

export interface SampleQualityVerdict {
  label: string;
  key: "adecuada" | "moderada" | "insuficiente";
  note: string;
}

export function getSampleQualityVerdict(n: number): SampleQualityVerdict {
  if (n >= 100)
    return {
      label: "Adecuada",
      key: "adecuada",
      note: `El tamaño muestral (${n} registros válidos) permite una lectura descriptiva del ámbito.`,
    };
  if (n >= 30)
    return {
      label: "Moderada",
      key: "moderada",
      note: `El tamaño muestral (${n} registros válidos) es modesto. Los resultados son descriptivos de la muestra disponible.`,
    };
  return {
    label: "Insuficiente",
    key: "insuficiente",
    note: `La muestra es reducida (${n} registros). Interpretar con extrema precaución.`,
  };
}
