# Fichas de actuación y seguimiento de indicadores

## Relación entre los elementos

La ficha pertenece a una **actuación**. Cada actuación aporta datos a un
indicador, y el indicador permite comprobar el avance de un objetivo específico.
El objetivo general agrupa los objetivos específicos, pero no tiene una ficha de
recogida propia.

La interfaz mantiene un espacio de seguimiento por indicador para reunir:

- el marco común de medición y consolidación del indicador;
- las fichas de las distintas actuaciones que le aportan datos;
- las entregas periódicas de cada actuación;
- la consolidación revisada del resultado.

Esta agrupación técnica evita duplicar la definición del indicador. No convierte
el indicador ni los objetivos en fichas.

## Recorrido

1. Seleccionar el ámbito y entrar en Plan de Acción.
2. Abrir el objetivo general y el objetivo específico donde aparece el indicador.
3. Pulsar «Gestionar actuaciones» bajo el indicador.
4. Revisar o completar el marco de medición del indicador.
5. Crear una ficha por cada actuación que vaya a alimentar el indicador.
6. Completar en cada ficha su responsable, contribución, población, calendario,
   datos solicitados, fuente, custodia y entrega.
7. Registrar las entregas de cada actuación y consolidar después el indicador.
8. Descargar una ficha de actuación para su responsable o el dossier completo
   del indicador. El Word no se reimporta automáticamente.

Los campos persisten con el expediente municipal en el mismo navegador y origen
web. Un cambio de navegador, puerto u origen no comparte automáticamente ese
expediente.

## Frontera institucional y procedencia

La herramienta ofrece espacios de seguimiento para los 30 indicadores del
catálogo (18 de envejecimiento y 12 de adicciones). No modifica el catálogo
fuente, el diagnóstico ni las compuertas de aprobación. Crear una ficha de
actuación antes de la selección deliberativa no incorpora ni aprueba esa
actuación en el Plan.

Las adaptaciones guardadas y vigentes del Grupo Motor se usan como referencia.
Si cambia la versión o redacción del indicador, se advierte de la diferencia sin
reescribir las fichas y datos ya recogidos.

No se precargan responsables, valores observados, líneas base ni metas. Como
piloto, `ENV-I5.1` y `ENV-I5.2` muestran una propuesta de actuación para
Edadismo. La propuesta solo se convierte en ficha de actuación mediante una
acción explícita y queda pendiente de revisión y acuerdo. Los acuerdos,
calendario, custodia y entrega continúan señalados como pendientes.

No se agregan automáticamente programas que puedan contener personas duplicadas
ni se promedian porcentajes. El estado «revisado» corresponde a la revisión del
dato por su responsable, no a una validación institucional del Plan.

## Persistencia y pruebas

Por compatibilidad con expedientes existentes,
`MunicipalityWorkspace.indicatorWorksheets` conserva internamente el marco del
indicador, sus fichas de actuación, entregas y consolidaciones. No genera
EvidenceAtoms ni aprobaciones. La pantalla y el Word usan las mismas
definiciones de campos y valores guardados.

- `npm run build`: compilación de producción.
- `npm test -- tests/indicator-worksheet.test.ts tests/pa-relas-02-ui.test.ts tests/workspace-persistence-guard.test.ts`:
  integridad, procedencia, exportación y persistencia.
- `node tests/indicator-worksheet.smoke.mjs`: navegador aislado, fichas de
  actuación, entregas, Word, recarga, aislamiento municipal y pantalla estrecha.
