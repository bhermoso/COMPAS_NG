/**
 * Genera fixtures/predimed-eas-granada.csv desde los microdatos EAS.
 *
 * Extrae las columnas PREDIMED de los microdatos oficiales de la Encuesta
 * Andaluza de Salud (EAS) filtrando por la provincia de Granada (PROV = 18).
 *
 * Columnas exportadas:
 *   Predimed              Campo canónico: índice PREDIMED-14 ya calculado por la EAS.
 *   Predimed_R            Nivel de adherencia (categórico EAS).
 *   Predimed_R2           Variante dicotómica EAS.
 *   Predimed_R3           Variante adicional EAS.
 *   P36BPD01_2023 …
 *   P36BPD14_2023         Ítems brutos (solo trazabilidad; no usar para recalcular).
 *
 * Fuente esperada:
 *   EAS_microdatos_adulto_READY.csv  (en el directorio raíz del proyecto)
 *
 * Uso:
 *   node scripts/export-predimed-granada.mjs
 *
 * AVISO: los 14 ítems P36BPD usan códigos 1–4, no valores binarios 0/1.
 * La suma directa de ítems NO reproduce el índice Predimed oficial.
 * El campo canónico `Predimed` incorpora la recodificación per-ítem de la EAS.
 *
 * @see fixtures/README.md — documentación completa del fixture y la decisión de diseño.
 */
