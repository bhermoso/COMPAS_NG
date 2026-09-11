# Continuación de COMPAS NG

Referencia técnica comprobada el 11 de septiembre de 2026: master `e1475705ce9e20a6b0750816774f73b84364985e`, anterior a este documento. Las revisiones locales no deben considerarse pendientes solo por tener un hash diferente: comparar también los árboles de archivos.

## Leer antes de continuar

1. [Inventario funcional y hoja de ruta](planning/INVENTARIO-Y-HOJA-DE-RUTA-COMPAS.md).
2. [Administración y espacios territoriales](ADMINISTRACION-GENERAL-COMPAS.md).
3. [Fuentes y perfil de Zaidín](ZAIDIN-INFORME-ORIGINAL-Y-PERFIL.md).

Los pasos 1 y 2 de la hoja de ruta están documentados. El siguiente recorrido es fuente → revisión del perfil → borrador compartido → ficha. No confundir una entrega documental con nuevas funcionalidades de la aplicación.

## Bases de Zaidín disponibles en el repositorio

- `public/seeds/compas-ng-workspace-granada-zaidin.json`: ocho documentos, 56 evidencias de activos, sin campos de estudios de escalas ni fichas o borradores rellenados. Incluye el informe PDF principal y conserva la conversión histórica.
- `municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json` y `compas-ng-workspace-granada-zaidin-MANUAL-56-92.json`: siete documentos y 56 activos.
- `municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin-reproducible-minimo.json`: siete documentos y 15 activos; no es la versión más completa.
- Propuesta codificada: `src/domain/action-plan-catalog/PlanPreparationDraft.ts`.
- Informe original: `docs/source-material/health-reports/informe-salud-zaidin-abril-2023.pdf`.

Estas fuentes están confirmadas en Git; no son copias pendientes de commit. No utilizar `fixtures/workspaces/granada-zaidin-synthetic-test.json` como expediente real. La propuesta codificada no acredita la existencia de decisiones privadas del usuario.

## Condiciones para continuar

- Examinar diferencias históricas antes de fusionarlas. «Diferente de master» no significa «más nuevo».
- Separar código, expediente del navegador y datos de Firebase. Un bundle Git no contiene automáticamente los otros dos.
- No reemplazar expedientes por datos iniciales sin comparar y conservar las versiones existentes.
- Crear un ámbito en Firebase no migra el expediente completo. El espacio territorial comparte actualmente decisiones de borrador e historial.
- La autenticación y la administración general son funciones distintas. No conceder permisos por un correo escrito en una conversación.
- No presentar instrumentos disponibles como estudios realizados ni atribuir aprobación institucional a un borrador.
- No introducir suscripciones ni requisitos de ampliación del plan.

## Próximo trabajo acotado

1. Resolver INV-01 del inventario: comprobar identidad de fuentes y ausencia de observaciones no acreditadas, en vez de exigir ciegamente siete documentos.
2. Contrastar las versiones disponibles del informe y el perfil, manteniendo las conclusiones anteriores hasta revisión humana.
3. Preparar el intercambio entre borrador local y compartido con vista previa, comparación de versiones y tratamiento de conflictos.
4. Conectar fichas, actuaciones y entregas al ámbito territorial, con aislamiento y revisión probados.

Los detalles privados de recuperación se conservan fuera del repositorio público. Pedir únicamente la información que falte después de leer las referencias anteriores. Registrar resultados y limitaciones de cada paso para poder continuar sin depender de una conversación.
