import type { MunicipalDocumentRepository } from "../../domain/repository";

/**
 * Sustitución de marcos estratégicos en el repositorio documental.
 *
 * Los documentos strategic-framework son acumulables por kind, pero cargar dos
 * veces el mismo marco (mismo fichero o mismo título) no debe duplicarlo: la
 * carga nueva sustituye a la anterior. La equivalencia se decide por título o
 * nombre de fichero normalizados (sin tildes, sin signos, minúsculas), igual
 * que hace la reconstrucción reproducible del expediente demo.
 */

function normalizeKey(value: string): string {
  const decomposed = value.normalize("NFD").toLowerCase();
  let out = "";
  for (let i = 0; i < decomposed.length; i++) {
    const code = decomposed.charCodeAt(i);
    const isDigit = code >= 48 && code <= 57;
    const isLower = code >= 97 && code <= 122;
    if (isDigit || isLower) out += decomposed[i];
  }
  return out;
}

export interface RemoveEquivalentStrategicFrameworkResult {
  repository: MunicipalDocumentRepository;
  /** Ids de los documentos sustituidos (para purgar sus derivados). */
  removedDocumentIds: string[];
}

export function removeEquivalentStrategicFramework(
  repository: MunicipalDocumentRepository,
  match: { title: string; sourceFileName?: string }
): RemoveEquivalentStrategicFrameworkResult {
  const normTitle = normalizeKey(match.title);
  const normFile =
    match.sourceFileName !== undefined ? normalizeKey(match.sourceFileName) : undefined;

  const removedDocumentIds: string[] = [];
  const documents = repository.documents.filter((d) => {
    if (d.kind !== "strategic-framework") return true;
    const sameTitle = normalizeKey(d.title) === normTitle;
    const sameFile =
      normFile !== undefined &&
      d.sourceFileName !== undefined &&
      normalizeKey(d.sourceFileName) === normFile;
    if (sameTitle || sameFile) {
      removedDocumentIds.push(d.id);
      return false;
    }
    return true;
  });

  if (removedDocumentIds.length === 0) {
    return { repository, removedDocumentIds };
  }
  return {
    repository: { ...repository, documents },
    removedDocumentIds,
  };
}
