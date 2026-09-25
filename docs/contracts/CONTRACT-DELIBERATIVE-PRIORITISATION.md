# CONTRATO DE SELECCIÓN DELIBERATIVA

> PA-RELAS-01 · Versión 1.1 — 2026-09-13
> Estado: VIGENTE

## 1. Cadena canónica

La ruta canónica para generar automáticamente un borrador técnico del Plan de
Acción es:

`PSL validado → Lectura Estratégica Local → selección del Grupo Motor → borrador del Plan de Acción`

Los motores históricos `PrioritizationEngine`, `EPVSATranslator`,
`ActionPlanEngine`, `AgendaEngine` y `MonitoringEngine` no son una segunda
fuente de verdad y no se muestran en el espacio Plan de Acción.

### 1.1 Edición directa del Plan de Acción

La edición territorial directa del catálogo del Plan de Acción es una operación
manual sobre el expediente local, no una generación automática.

Cuando el usuario selecciona `Modificar` y edita el texto de un objetivo,
indicador o bloque del catálogo:

- se crea o actualiza inmediatamente un `PlanPreparationDraft` del ámbito;
- el texto modificado pasa a ser la redacción vigente del expediente local;
- no se exige una `PlanPreparationReview` ni una fase administrativa intermedia;
- el cambio no acredita por sí solo una decisión deliberativa del Grupo Motor ni
  un compromiso institucional municipal.

Esta ruta permite trabajar el contenido del Plan de Acción sin bloquear la
edición por falta de PSL aprobado, MTE o selección deliberativa. Esas compuertas
siguen aplicando a la generación automática de propuestas y a la futura
compilación institucional del Plan Local de Salud.

## 2. Separación de aportaciones y decisión

La selección deliberativa conserva sin confundir:

1. Las candidaturas técnicas procedentes de la Lectura Estratégica Local.
2. Las temáticas documentadas por la priorización ciudadana.
3. Las prioridades seleccionadas por el Grupo Motor.
4. La motivación de la decisión.
5. La explicación de cómo influyó el conocimiento ciudadano o, si no estaba
   disponible, constancia expresa de esa ausencia.

No existe correspondencia automática entre temáticas ciudadanas y escenarios.
COMPÁS NG no puntúa, ordena ni selecciona prioridades.

## 3. Compuerta humana

El borrador automático del Plan de Acción permanece bloqueado mientras no exista
una `DeliberativePrioritySelection` explícita y vigente. La decisión debe:

- seleccionar al menos una candidatura existente;
- identificar al Grupo Motor que la adopta;
- incluir motivación deliberativa;
- documentar la influencia del conocimiento ciudadano;
- quedar ligada al municipio, PSL, versión del PSL, Lectura Estratégica y
  versión disponible de la priorización ciudadana.

Si cambia cualquiera de esas fuentes, la selección queda obsoleta y debe
renovarse antes de volver a producir el borrador.

## 4. Límite institucional

La selección habilita una propuesta técnica, no un compromiso municipal. El
sistema no asigna responsables nominados, plazos, recursos ni presupuestos.
La concreción de objetivos y actuaciones y la adopción de compromisos son
decisiones humanas posteriores.
