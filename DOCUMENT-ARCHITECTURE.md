# COMPÁS NG — Contrato de explotación documental

## Decisión aprobada

COMPÁS NG adopta un contrato documental basado en cinco niveles:

1. Preservación documental.
2. Representación estructurada regenerable.
3. Extracción controlada.
4. EvidenceStore.
5. Motores analíticos.

## Principios

- El documento original es la fuente de verdad.
- Toda representación derivada debe ser regenerable.
- Ningún motor escribe sobre la fuente documental.
- Toda evidencia debe tener provenance trazable.
- La validación humana forma parte del contrato.
- La interpretación no se confunde con la evidencia.
- Cada familia documental puede tener un pipeline distinto, pero debe respetar estos principios.

## Frontera crítica

Antes de la extracción: representación fiel del documento.

Después de la extracción: unidad analítica que requiere validación humana.

## Familias documentales

### Documentos narrativos

Ejemplos: Informe de Salud, memorias, diagnósticos.

Deben preservar texto íntegro y, cuando sea posible, secciones estructuradas.

### Listas estructuradas

Ejemplos: Activos Comunitarios, recursos, inventarios.

Deben preservar fuente o representación estructurada regenerable antes de generar átomos.

### Instrumentos cuantitativos

Ejemplos: IBSE, SF-12, DUKE, PREDIMED.

Deben preservar agregados metodológicamente válidos, sin almacenar registros individuales salvo decisión expresa.

## Prohibiciones

- No generar evidencia sin fuente preservada o regenerable.
- No persistir inferencias como datos fuente.
- No automatizar decisiones estratégicas.
- No alimentar motores desde documentos sin contrato explícito.

## Alcance de este documento

Este documento describe el contrato de explotación documental —desde la preservación documental hasta la alimentación del pipeline analítico—. Los niveles analítico, de decisión, planificación, seguimiento y exportación documental están regulados por los contratos específicos en `docs/contracts/`.
