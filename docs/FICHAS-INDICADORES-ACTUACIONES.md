# Fichas de recogida de datos dentro del Plan de Acción

Implementación sobre `73ffd26d219d9eda8de01a5b055bbaf6dd9fa315`, rama
`codex/zaidin-evidencia-real`. Desarrollo solicitado por el usuario para
preparar la recogida de datos por las personas responsables de indicadores y
actuaciones del Plan Local/Distrital de Salud.

## Recorrido

1. Seleccionar el ámbito. La aplicación arranca actualmente en Atarfe; para
   trabajar con El Zaidín, usar «Cambiar ámbito».
2. Entrar en Plan de Acción, abrir un objetivo general de una de las dos líneas
   y pulsar «Cumplimentar ficha» bajo el indicador.
3. Completar responsable de consolidación, definición, instrumento, cálculo,
   periodicidad, calidad, línea base y meta cuando estén disponibles.
4. Añadir actuaciones, responsables, datos solicitados, fuente y plazos.
5. Descargar desde la aplicación la ficha completa o la de una actuación en Word.
6. Transcribir las entregas recibidas, separadas por periodo, y documentar la
   consolidación y su revisión. El Word no se reimporta automáticamente.

Los campos persisten con el expediente municipal en el mismo navegador y origen
web. Un cambio de navegador, puerto u origen no comparte automáticamente ese
expediente. La descarga Word facilita el reparto de las fichas.

## Frontera institucional y procedencia

Las 30 fichas utilizan la arquitectura del catálogo existente (18 indicadores de
envejecimiento y 12 de adicciones). Esta herramienta amplía la preparación de
formularios: no modifica el catálogo fuente, el diagnóstico ni las compuertas
de aprobación. Preparar un borrador antes de la selección deliberativa no
incorpora objetivos o actuaciones al Plan.

Las adaptaciones guardadas y vigentes del Grupo Motor se usan al iniciar una
ficha. La ficha conserva su referencia inicial; si cambia la versión o redacción,
se advierte de la diferencia sin reescribir los datos recogidos. El rechazo o
la ausencia de revisión vigente también se muestra al editar y exportar.

No se precargan responsables, actuaciones, valores observados, línea base ni
metas. Los resultados son aportaciones humanas. No se agregan automáticamente
programas que puedan contener personas duplicadas ni se promedian porcentajes.
El estado «revisado» corresponde a la revisión del dato por su responsable,
no a una validación institucional del Plan.

## Persistencia y pruebas

`MunicipalityWorkspace.indicatorWorksheets` conserva la ficha, actuaciones,
entregas y consolidaciones. No genera EvidenceAtoms ni aprobaciones. Se incluye
en la guardia de persistencia; expedientes anteriores sin fichas siguen siendo
compatibles. La pantalla y el Word usan las mismas definiciones de campos y
valores guardados.

- `npm run build`: compilación de producción.
- `npm test -- tests/indicator-worksheet.test.ts tests/pa-relas-02-ui.test.ts tests/workspace-persistence-guard.test.ts`:
  integridad de valores vacíos/cero, exportación individual, procedencia y persistencia.
- `node tests/indicator-worksheet.smoke.mjs`: navegador aislado, edición, Word,
  recarga, aislamiento municipal, cancelación de borrado y pantalla estrecha.
  Requiere Chromium de Playwright o `COMPAS_TEST_CHROMIUM` con una ruta instalada.

La suite completa de esta copia mantiene cuatro fallos por tres DOCX fuente
ausentes en `docs/source-material/territorial-cases/granada-zaidin/`, además
del bloqueo de la suite de reconstrucción por la misma ausencia. No se
reemplazaron esas fuentes por datos fabricados.
