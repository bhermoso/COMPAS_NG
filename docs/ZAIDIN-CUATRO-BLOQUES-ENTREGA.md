# Entrega de preparación del Plan — 2026-09-09

Base: 633dd69c299841d02f86f90ad96d78814e1d6550 (PR39). Rama de trabajo: codex/zaidin-cuatro-bloques.

Propuesta 92418, cuatro bloques, 18 objetivos, 18 indicadores conservados. Brecha digital en Participación. La propuesta local solo se muestra para granada-zaidin; otros municipios conservan catálogo 3.1. Los programas nombrados se muestran como parte del texto propuesto, no como actuaciones ejecutadas.

Las elecciones preparatorias usan una colección del expediente distinta de la revisión institucional. Las fichas mantienen su clave municipio/módulo/indicador y avisan si cambia su contexto; su contenido no se sobrescribe. El catálogo original queda plegado y explícitamente etiquetado, con sus decisiones anteriores. La aprobación formal de cuatro bloques queda pendiente de una fase posterior; no debe adoptarse mediante los controles del catálogo 3.1.

Guardado: navegador actual, mediante persistencia del expediente existente; GitHub no sincroniza los datos introducidos entre equipos. No se modifican Drive ni copias Windows en esta entrega.

Matriz metodológica: ZAIDIN-CONCEPTOS-INDICADORES-REVISION.md. Conceptos revisados frente a fichas originales; ningún instrumento, punto de corte, meta o responsable queda aprobado por esa matriz.

Validación: compilación de producción correcta; 10 pruebas dirigidas pasan (reagrupación, indicadores originales, aislamiento de revisión formal, serialización, exclusión reversible, controles renderizados y conservación de contexto de fichas). `git diff --check` sin incidencias. No se ha ejecutado la suite completa. La prueba visual está pendiente: Chromium falla al arrancar antes de abrir la página; no se ha verificado interacción real ni recarga del navegador en esta entrega. Pendiente de verificación visual antes de fusionar o desplegar. El 2026-09-09 Blas solicita incorporar el trabajo a los repositorios: se conserva como rama de trabajo, sin aprobación para producción.


Actualización de validación 2026-09-09: se identificó un ejecutable Chromium truncado (77 MB en lugar de 193617016 bytes). Tras reconstruirlo desde su archivo comprimido, la prueba real pasó: cuatro bloques y 41 controles, modificación de indicador, exclusión y recuperación de objetivo tras recarga, ficha y actuación conservadas, evidencia y revisiones formales intactas, sin errores JavaScript ni desbordamiento horizontal a 390 px. Captura de escritorio inspeccionada. Se estabilizó el nombre accesible del campo de nueva redacción. Prueba reproducible: tests/plan-preparation.smoke.mjs. Diez pruebas dirigidas pasan. APTO para incorporar la corrección y tramitar el PR; la publicación sigue pendiente de autorización. La limitación de validación visual descrita anteriormente queda resuelta.
