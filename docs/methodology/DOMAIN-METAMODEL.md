# COMPÁS NG — Metamodelo Metodológico del Dominio

> Este documento describe el modelo metodológico del dominio de la planificación
> local en salud. No describe software, clases, bases de datos ni implementaciones.
>
> Es la referencia conceptual desde la que se derivan los contratos arquitectónicos
> del Sprint 2. Si COMPÁS NG se reescribiera en otro lenguaje o lo implementara
> otro equipo, este documento debería permanecer esencialmente inalterado.
>
> Convenciones de evidencia:
> [D] = Demostrado documentalmente en fuentes auditadas
> [I] = Inferido razonablemente de evidencia documentada (no afirmado explícitamente)
> Ninguna relación sin marca de evidencia forma parte del metamodelo.
>
> Fuentes auditadas: contratos existentes, ESCA Plan Operativo, METHODOLOGICAL-FOUNDATIONS,
> MODEL-OF-INSTITUTIONAL-ARTICULATION, INSTRUMENT-TAXONOMY, datos reales de Zagra (COMPÁS
> histórico), BENCHMARK-INSTITUTIONAL-PRODUCTS.
>
> Fecha de emisión: 2026-06-28

---

## I. Propósito

Un metamodelo metodológico es una representación formal de las entidades de un dominio
y de las relaciones que existen entre ellas, independiente de cualquier implementación
tecnológica concreta.

Este metamodelo responde a una única pregunta:

> **¿Cómo se articulan metodológicamente los distintos instrumentos de la planificación
> local en salud?**

No responde a: ¿cómo se implementan?, ¿cómo se almacenan?, ¿cómo se programan?

### Por qué este metamodelo es necesario

La taxonomía de instrumentos (`INSTRUMENT-TAXONOMY.md`) define qué es cada instrumento.
Los fundamentos metodológicos (`METHODOLOGICAL-FOUNDATIONS-LOCAL-HEALTH-PLANNING.md`)
definen el proceso de planificación.
El modelo de articulación (`MODEL-OF-INSTITUTIONAL-ARTICULATION.md`) define cómo las
instituciones co-producen el plan.

Lo que falta es la representación formal de cómo estos instrumentos se relacionan entre sí,
con qué tipo de relación, con qué restricciones y con qué consecuencias para el sistema.

Sin este metamodelo, los contratos del Sprint 2 podrían ser internamente coherentes pero
mutuamente inconsistentes. Con él, cada contrato puede verificarse contra una referencia
común que garantiza la coherencia del conjunto.

---

## II. Principios generales del metamodelo

Estos principios no son reglas de implementación. Son restricciones del dominio que deben
respetarse en cualquier representación del sistema, técnica o no.

### P-M1 — Separación entre conocimiento y acción [D]

El diagnóstico (evidencia + interpretación) y la planificación (objetivos + compromisos)
son fases distintas que no pueden colapsar en una sola.
La evidencia precede a la interpretación. La interpretación precede a la priorización.
La priorización precede al plan.

*Fuente:* METHODOLOGICAL-FOUNDATIONS PM-1, PM-2; CONTRACT-INTERPRETATION §1.1.

### P-M2 — Preservación de la naturaleza de cada instrumento [D]

Una estrategia no puede tratarse como un plan. Un plan no puede tratarse como un programa.
Un programa no puede tratarse como un activo comunitario. Cada instrumento tiene propiedades,
funciones y restricciones que no son transferibles a otra categoría.

*Fuente:* INSTRUMENT-TAXONOMY preámbulo; Continuidad Maestra descubrimiento 8.

### P-M3 — La decisión pertenece siempre a personas [D]

Ningún instrumento metodológico, ningún motor analítico y ningún sistema automatizado puede
adoptar compromisos institucionales. La decisión (priorización, aprobación del plan,
asignación de responsabilidades) pertenece siempre a actores humanos con autoridad.

*Fuente:* ARCHITECTURE-CONSTITUTION Art. 5, 6; CONTRACT-INTERPRETATION I-INT invariantes;
METHODOLOGICAL-FOUNDATIONS PM-7.

### P-M4 — Trazabilidad completa en ambas direcciones [D]

Desde cualquier compromiso del Plan Local de Salud debe poder trazarse la cadena completa
hasta la evidencia que lo fundamenta. Desde cualquier evidencia debe poder identificarse
si fue incorporada al plan o por qué no lo fue.

*Fuente:* OPERATING-CONSTITUTION §9 (T-1 a T-5); METHODOLOGICAL-FOUNDATIONS PM-19.

### P-M5 — El conocimiento metodológico se incorpora incrementalmente [D]

El sistema debe poder enriquecerse con nuevo conocimiento (programas, instrumentos,
marcos estratégicos, activos) sin romper la coherencia del modelo existente y sin
requerir cambios estructurales.

*Fuente:* Continuidad Maestra descubrimiento 9; ARCHITECTURE-CONSTITUTION Art. 7, 8.

### P-M6 — La articulación preserva la identidad de cada contribución [D]

Cuando múltiples instituciones contribuyen al Plan Local de Salud, cada contribución
mantiene su atribución, su naturaleza y su trazabilidad. La articulación no funde
las contribuciones en un todo homogéneo; crea relaciones entre ellas que son visibles
y auditables.

*Fuente:* MODEL-OF-INSTITUTIONAL-ARTICULATION §VI.1.

---

## III. Entidades metodológicas

Las entidades del metamodelo son las trece categorías definidas en la taxonomía.
No se redefinen aquí; se referencian como nodos del modelo de relaciones.

| Código | Entidad | Definida en |
|---|---|---|
| `E` | Evidencia | INSTRUMENT-TAXONOMY §I (implícito); CONTRACT-EVIDENCE |
| `EST` | Estrategia | INSTRUMENT-TAXONOMY §I.1 |
| `PL` | Plan (operativo o sectorial) | INSTRUMENT-TAXONOMY §I.2 |
| `PRG` | Programa | INSTRUMENT-TAXONOMY §I.3 |
| `PROT` | Protocolo | INSTRUMENT-TAXONOMY §I.4 |
| `AC` | Activo comunitario | INSTRUMENT-TAXONOMY §I.5 |
| `AT` | Actuación tipo | INSTRUMENT-TAXONOMY §I.6 |
| `OBJ` | Objetivo | INSTRUMENT-TAXONOMY §I.7 |
| `IND` | Indicador | INSTRUMENT-TAXONOMY §I.8 |
| `PSL` | Perfil de Salud Local | CONTRACT-MIT-PSL |
| `PAI` | Propuesta de Articulación Institucional | MODEL-OF-INSTITUTIONAL-ARTICULATION; Auditoría de coherencia |
| `PA` | Plan de Acción | CONTRACT-ACTION-PLAN |
| `PLS` | Plan Local de Salud | METHODOLOGICAL-FOUNDATIONS; INSTITUTIONAL-PRODUCTS-ARCHITECTURE |

Adicionalmente se referencian dos objetos compuestos del proceso:

| Código | Objeto | Descripción |
|---|---|---|
| `DF` | Documento Fuente | Fuente primaria en el Repositorio Documental |
| `ES` | EvidenceStore | Colección de átomos de evidencia del municipio |

---

## IV. Relaciones metodológicas

Este es el núcleo del metamodelo. Las relaciones se presentan por tipo para facilitar
la lectura transversal.

### IV.1 Relaciones de composición (CONTIENE)

Una relación de composición indica que una entidad incluye a otra como parte constitutiva.
La entidad contenida no tiene existencia independiente del contexto de la contenedora.

| Entidad A | Relación | Entidad B | Evidencia |
|---|---|---|---|
| `EST` (Estrategia) | CONTIENE | Líneas estratégicas | [D] EPVSA tiene 4 LE; ESCA tiene 5 objetivos estratégicos y 13 líneas de acción |
| `EST` (Estrategia) | CONTIENE | Objetivos estratégicos | [D] ESCA Plan Operativo estructura: línea → objetivo específico |
| `PL` (Plan Operativo) | CONTIENE | `AT` Actuaciones tipo | [D] ESCA Plan Operativo: columna "Actuaciones" por línea de acción |
| `PL` (Plan Operativo) | CONTIENE | `IND` Indicadores (con forma de cálculo, meta, tiempo cero) | [D] ESCA Plan Operativo: columna Indicador + Forma de cálculo + Meta + Tiempo cero |
| `PL` (Plan Operativo) | CONTIENE | Responsables por actuación | [D] ESCA Plan Operativo: columna Responsable por indicador |
| `PA` (Plan de Acción) | CONTIENE | `OBJ` Objetivos validados | [D] METHODOLOGICAL-FOUNDATIONS §II gramática |
| `PA` (Plan de Acción) | CONTIENE | Actuaciones adoptadas (contextualizadas de `AT`) | [D] METHODOLOGICAL-FOUNDATIONS §II gramática |
| `PA` (Plan de Acción) | CONTIENE | `IND` Indicadores (proceso + resultado) | [D] METHODOLOGICAL-FOUNDATIONS §II gramática |
| `PA` (Plan de Acción) | CONTIENE | Responsables nominados | [D] METHODOLOGICAL-FOUNDATIONS PM-8 |
| `PA` (Plan de Acción) | CONTIENE | Cronograma | [D] METHODOLOGICAL-FOUNDATIONS §II gramática |
| `PLS` (Plan Local de Salud) | CONTIENE | `PSL`-C compilado (como capítulo de diagnóstico) | [D] INSTITUTIONAL-PRODUCTS-ARCHITECTURE §5.2; DM-1 |
| `PLS` (Plan Local de Salud) | CONTIENE | `PA` validado | [D] METHODOLOGICAL-FOUNDATIONS §V transición 7 |
| `PLS` (Plan Local de Salud) | CONTIENE | Marco de gobernanza | [D] METHODOLOGICAL-FOUNDATIONS §II.1 (Gobernanza) |
| `PLS` (Plan Local de Salud) | CONTIENE | Resumen Ejecutivo | [D] INSTITUTIONAL-PRODUCTS-ARCHITECTURE DM-4 |
| `PSL` | CONTIENE | 7 capítulos (I-IV sistema; V-VII humanos) | [D] CONTRACT-MIT-PSL §6.2 |
| `PAI` | CONTIENE | Capacidades garantizadas identificadas | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §VIII.3 |
| `PAI` | CONTIENE | Correspondencias con marcos estratégicos | [D] CONTRACT-STRATEGIC-TRANSLATION §Responsabilidades |
| `PAI` | CONTIENE | Vacíos de capacidad | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §VIII.3 |
| `PAI` | CONTIENE | `AT` Actuaciones tipo propuestas | [D] CONTRACT-STRATEGIC-TRANSLATION §Contrato de salida |

### IV.2 Relaciones de derivación (DERIVA_DE)

Una relación de derivación indica que B es producido a partir de A mediante un proceso.
La derivación implica transformación: el resultado tiene propiedades distintas al origen.

| Entidad A | Proceso | Entidad B | Evidencia |
|---|---|---|---|
| `DF` Documentos Fuente | Parsers (extracción con metodología definida) | `E` Evidencia (EvidenceAtom[]) | [D] CONTRACT-EVIDENCE; OPERATING-CONSTITUTION §9 |
| `E` + IntegrityGuard | Motor de Interpretación Territorial (MIT) | `PSL` (chapters I-IV, generated) | [D] CONTRACT-MIT-PSL §4; OPERATING-CONSTITUTION §2 |
| `PSL` (generated) + deliberación humana | Equipo técnico (chapters V-VII) | `PSL` (validated) | [D] CONTRACT-MIT-PSL §6.3; METHODOLOGICAL-FOUNDATIONS §V transición 4 |
| `PSL` (validated) + StrategicRepository | Motor de Traducción Estratégica (MTE) | `PAI` | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §VIII; CONTRACT-STRATEGIC-TRANSLATION |
| `PAI` + deliberación | Grupo Motor | `PA` Plan de Acción (validated) | [D] METHODOLOGICAL-FOUNDATIONS §VI.6; MODEL-OF-INSTITUTIONAL-ARTICULATION §VI.4 |
| `PA` + `PSL`-C + proceso participativo | Corporación municipal + Grupo Motor | `PLS` | [D] METHODOLOGICAL-FOUNDATIONS §V transición 7 |
| `EST` Estrategia | Proceso de planificación institucional | `PL` Plan Operativo | [D] ESCA deriva del EPVSA; ESCA genera Plan Operativo Territorial |
| `PL` / `EST` | Diseño e implementación | `PRG` Programa | [I] Los programas habitualmente derivan de planes o estrategias |
| `PRG` Programa implantado | Implementación en municipio | `AC` Activo comunitario | [D] GRUSE de mujeres Zagra: el programa genera el activo al implantarse |

### IV.3 Relaciones de orientación (ORIENTA)

Una relación de orientación indica que A guía el desarrollo de B sin prescribir sus
contenidos específicos. La orientación es una referencia, no un mandato.

| Entidad A | Orienta | Entidad B | Evidencia |
|---|---|---|---|
| `EST` EPVSA | (líneas LE1-LE4) | Prioridades locales del PLS | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §III.1; CONTRACT-STRATEGIC-REPOSITORY |
| `EST` ESCA | (5 objetivos estratégicos) | Plan Operativo Territorial del Distrito | [D] ESCA Plan Operativo |
| `EST` RELAS | (metodología de proceso) | Ciclo de planificación local | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §III.3 |
| `PL` Plan sectorial (PEM, PSMA) | (enfoques para grupos específicos) | Prioridades para esas poblaciones | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §III.5, §III.7 |
| `PSL` | (áreas de intervención, Cap. IV) | Deliberación del Grupo Motor | [D] CONTRACT-MIT-PSL §6.1; METHODOLOGICAL-FOUNDATIONS PM-6 |
| `PAI` | (propuesta razonada) | Deliberación del Grupo Motor → `PA` | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §VIII.4 |

### IV.4 Relaciones de garantía (GARANTIZA)

Una relación de garantía indica que A se compromete a producir B independientemente
de las decisiones del municipio, por mandato institucional propio.

| Entidad A | Garantiza | Evidencia |
|---|---|---|
| `PL` Plan Operativo ESCA (Distrito) | Diagnóstico comunitario por UGC en municipios RELAS | [D] ESCA línea 2.1.1; MODEL-OF-INSTITUTIONAL-ARTICULATION §IV.2 |
| `PL` Plan Operativo ESCA | Mapa de activos comunitarios anual por UGC | [D] ESCA línea 2.1.2; MODEL-OF-INSTITUTIONAL-ARTICULATION §IV.2 |
| `PL` Plan Operativo ESCA | Actividades grupales de EpS (≥2 por UGC/año) | [D] ESCA líneas 2.3.x; MODEL-OF-INSTITUTIONAL-ARTICULATION §IV.2 |
| `PL` Plan Operativo ESCA | Coordinación con centros educativos | [D] ESCA línea 2.4.1 |
| `PL` Plan Operativo ESCA | Seguimiento anual y evaluación final | [D] ESCA Plan Operativo preámbulo |

**Consecuencia metodológica:** las contribuciones garantizadas no necesitan ser creadas
por el Plan Local de Salud. El PLS las articula, las referencia y puede reforzarlas;
no las suplanta ni las sustituye.

### IV.5 Relaciones de referencia (REFERENCIA)

Una relación de referencia indica que A menciona a B sin contenerlo. B conserva su
existencia e identidad independiente de A.

| Entidad A | Referencia | Entidad B | Evidencia |
|---|---|---|---|
| `PSL` (Cap. II) | Informe de Salud | `DF` Informe de Salud | [D] CONTRACT-MIT-PSL PSL-I1; I-PSL-1 |
| `PSL` (Cap. III) | IDs de átomos | `E` EvidenceAtoms | [D] CONTRACT-MIT-PSL §6.2 Cap. III |
| `PSL` (Cap. I) | Marcos estratégicos | `EST` EPVSA, ESCA, RELAS | [D] CONTRACT-MIT-PSL §6.2 Cap. I |
| `PLS` | Marcos de referencia | `EST` EPVSA, ESCA, RELAS | [D] METHODOLOGICAL-FOUNDATIONS §V transición 7 |
| `PLS` | Proceso participativo | Contribuciones ciudadanas | [D] METHODOLOGICAL-FOUNDATIONS §II.1 (Participación ciudadana) |

### IV.6 Relaciones de generación (GENERA)

Una relación de generación indica que A produce B como efecto de su implementación,
sin que B sea el producto directo e intencionado de A.

| Entidad A | Genera | Entidad B | Condición | Evidencia |
|---|---|---|---|---|
| `PRG` Programa implantado | `AC` Activo comunitario | Cuando el programa está activo en el municipio | [D] GRUSE de mujeres Zagra (activo desde 2013) |
| `PL` (ESCA línea 2.1.2) | `AC` Mapa de activos actualizado | Anualmente por UGC | [D] ESCA línea 2.1.2 |
| Ciclo de evaluación del `PLS` | `E` Evidencia longitudinal | Al finalizar el período del plan | [D] METHODOLOGICAL-FOUNDATIONS PM-24; MODEL-OF-INSTITUTIONAL-ARTICULATION §II.9 |

### IV.7 Relaciones de movilización (MOVILIZA)

Una relación de movilización indica que A puede activarse o utilizarse como recurso
para B sin que A sea producido por B ni contenido en B.

| Entidad A | Movilizable para | Evidencia |
|---|---|---|
| `AC` Activo comunitario | Uno o varios `OBJ` Objetivos del plan | [D] INSTRUMENT-TAXONOMY §I.5; datos Zagra |
| `AC` Activo comunitario | Actuaciones concretas del `PA` | [I] La función salutogénica del activo es su movilización en el plan |
| `PRG` Programa activo | Objetivos para los que tiene metodología | [I] Los programas tienen metodología que puede aplicarse a objetivos locales |

### IV.8 Relaciones de evaluación (EVALÚA)

Una relación de evaluación indica que A mide el grado de cumplimiento o cambio de B.

| Entidad A | Evalúa | Nivel | Evidencia |
|---|---|---|---|
| `IND` Indicador de proceso | Actuaciones (¿se ejecuta lo planificado?) | Proceso | [D] METHODOLOGICAL-FOUNDATIONS §II.1 (Indicador); ESCA Plan Operativo |
| `IND` Indicador de resultado | `OBJ` Objetivos (¿cambian los determinantes?) | Resultado | [D] METHODOLOGICAL-FOUNDATIONS §II.1 (Indicador) |
| `IND` Indicador de impacto | Salud de la población (¿mejora?) | Impacto | [D] METHODOLOGICAL-FOUNDATIONS §II.1 (Indicador) |

### IV.9 Relaciones de articulación (ARTICULA)

Una relación de articulación indica que A integra las contribuciones de múltiples B
preservando la identidad y trazabilidad de cada una.

| Entidad A | Articula | Evidencia |
|---|---|---|
| `PAI` | Contribuciones institucionales garantizadas + orientaciones estratégicas + activos relevantes | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §VIII.3, Anexo I |
| `PLS` | Contribuciones de SSPA, Ayuntamiento, educación, servicios sociales, asociaciones, ciudadanía | [D] MODEL-OF-INSTITUTIONAL-ARTICULATION §V |

### IV.10 Relaciones de coordinación (COORDINA_CON)

Una relación de coordinación indica que A y B son producidos por distintas instituciones
pero tienen dependencias explícitas entre sí.

| Entidad A | Coordina con | Evidencia |
|---|---|---|
| `PL` Plan Operativo ESCA del Distrito | `PLS` Plan Local de Salud | [D] ESCA línea 2.1.1: "en coordinación con los Planes Locales de Salud en aquellos municipios adheridos a RELAS" |

---

## V. Relaciones expresamente prohibidas

Estas relaciones son metodológicamente inválidas. Su presencia en cualquier
contrato, motor o producto de COMPÁS NG constituye una violación del metamodelo.

### V.1 La evidencia no genera actuaciones automáticamente [D]

`E` (Evidencia) → [PROHIBIDO] → Actuaciones del `PA`

La evidencia informa la interpretación. La interpretación informa la priorización.
La priorización (deliberación humana) informa el plan. Ningún paso de este proceso
es automático ni puede saltarse.

*Fuente:* CONTRACT-INTERPRETATION §1.1; METHODOLOGICAL-FOUNDATIONS PM-1, PM-2.

### V.2 El PSL no decide [D]

`PSL` → [PROHIBIDO] → Decisión de prioridades o actuaciones

El PSL interpreta y sintetiza. Las decisiones (prioridades, compromisos, responsables)
corresponden al Grupo Motor y a la corporación municipal.

*Fuente:* CONTRACT-INTERPRETATION §6; CONTRACT-MIT-PSL §2; ARCHITECTURE-CONSTITUTION Art. 5.

### V.3 Una estrategia no sustituye un plan [D]

`EST` (Estrategia) → [PROHIBIDO] → Equivale a `PL` o `PLS`

Una estrategia orienta; un plan compromete. El alcance, la especificidad, los
responsables y los horizontes temporales son radicalmente distintos. Alinear una
prioridad con una línea estratégica no equivale a tener un plan de actuación.

*Fuente:* INSTRUMENT-TAXONOMY §I.1 vs §I.2; METHODOLOGICAL-FOUNDATIONS §III.3.

### V.4 Un programa no equivale a un activo [D]

`PRG` (Programa) → [PROHIBIDO] → `AC` (Activo comunitario) sin verificación

Un programa puede generar un activo cuando se implanta en un municipio, pero no
son intercambiables. El activo requiere verificación de existencia real en el
municipio. Un programa que no está implantado no genera el activo.

*Fuente:* INSTRUMENT-TAXONOMY §IV; MODEL-OF-INSTITUTIONAL-ARTICULATION Anexo I §A.2.

### V.5 Un indicador no constituye un objetivo [D]

`IND` (Indicador) → [PROHIBIDO] → `OBJ` (Objetivo)

Un indicador mide el grado de cumplimiento de un objetivo. No es el objetivo en sí.
Un objetivo puede medirse con varios indicadores. Un indicador solo puede medir si
existe un objetivo que lo define como relevante.

*Fuente:* INSTRUMENT-TAXONOMY §I.7 vs §I.8.

### V.6 La PAI no constituye el Plan de Acción [D]

`PAI` → [PROHIBIDO] → `PA` (Plan de Acción) sin deliberación

La Propuesta de Articulación Institucional es un insumo para la deliberación del
Grupo Motor. No es el Plan de Acción. El Plan de Acción emerge de la deliberación;
la PAI la facilita pero no la sustituye.

*Fuente:* MODEL-OF-INSTITUTIONAL-ARTICULATION §VIII.4; METHODOLOGICAL-FOUNDATIONS PM-7.

### V.7 El PSL no es el PLS [D]

`PSL` → [PROHIBIDO] → equivale a `PLS`

El PSL es el objeto analítico del Nivel 2 (diagnóstico). El PLS es el documento de
compromiso institucional (planificación). Son objetos distintos en niveles distintos
del sistema con finalidades distintas.

*Fuente:* CONTRACT-MIT-PSL I-PSL-2.

### V.8 Las actuaciones garantizadas de la ESCA no son actuaciones del municipio [D]

`PL` Plan Operativo ESCA → [PROHIBIDO] → contenido del `PLS` como si fuera compromiso municipal

Las actuaciones garantizadas por el Plan Operativo ESCA son compromisos del SSPA,
no del municipio. El PLS puede referenciarlas y articularse con ellas, pero no puede
apropiarse de ellas como compromisos propios sin que haya un acuerdo explícito.

*Fuente:* MODEL-OF-INSTITUTIONAL-ARTICULATION §V.1 y PM-14 de METHODOLOGICAL-FOUNDATIONS.

---

## VI. Flujo metodológico

El flujo representa la cadena de transformación que convierte documentos en un Plan
Local de Salud. Cada fase indica qué tipo de conocimiento aparece y qué tipo de
conocimiento nunca debe aparecer en esa fase.

```
┌─────────────────────────────────────────────────────────────────┐
│  FASE 1 — REPOSITORIO DOCUMENTAL                                │
│                                                                 │
│  DOCUMENTO FUENTE (Informe de Salud, exportaciones REDCap,      │
│  activos comunitarios, etc.)                                    │
│         │                                                       │
│         ▼                                                       │
│  Repositorio Documental Territorial                             │
│                                                                 │
│  Conocimiento que aparece: existencia verificada y procedencia  │
│  de cada documento; su tipo canónico; sus metadatos.            │
│                                                                 │
│  Conocimiento que nunca aparece: qué significa el documento     │
│  para el municipio; qué se debe hacer.                          │
└─────────────────────────────────────────────────────────────────┘
         │ Parsers (extracción estructurada)
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 2 — EVIDENCIA ESTRUCTURADA                                │
│                                                                 │
│  EvidenceStore (EvidenceAtom[])                                 │
│  → tipos: determinante, activo, indicador, participación,       │
│            hallazgo cualitativo, cautela metodológica           │
│                                                                 │
│  Conocimiento que aparece: qué dice cada documento en formato   │
│  semánticamente tipado; calidad de la evidencia; trazabilidad.  │
│                                                                 │
│  Conocimiento que nunca aparece: qué significa territorialmente  │
│  la evidencia; cuáles son los problemas del municipio.          │
└─────────────────────────────────────────────────────────────────┘
         │ MIT (LT1 + OIT + Reconciliación)
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3 — INTERPRETACIÓN TERRITORIAL                            │
│                                                                 │
│  Estado Territorial Evolutivo                                   │
│  → LT1: clasificación de átomos por tipo semántico              │
│  → OIT: áreas de intervención heurísticas                       │
│  → Tensiones entre fuentes                                      │
│                                                                 │
│  Conocimiento que aparece: qué patrones emergen del conjunto    │
│  de evidencia; qué tensiones existen entre fuentes.             │
│  Todo marcado como requiresHumanValidation: true.               │
│                                                                 │
│  Conocimiento que nunca aparece: cuáles son las prioridades     │
│  definitivas; qué compromisos debe asumir el municipio.         │
└─────────────────────────────────────────────────────────────────┘
         │ buildLocalHealthProfile + validación humana
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 4 — PERFIL DE SALUD LOCAL (PSL)                           │
│                                                                 │
│  7 capítulos:                                                   │
│  I-IV: generados por el sistema (marco, informe, diagnóstico,   │
│         interpretación)                                         │
│  V-VI: autoría humana (conclusiones, recomendaciones)           │
│  VII:  candidaturas técnicas + priorización participativa +     │
│         deliberación documentada (autoría humana)               │
│                                                                 │
│  Conocimiento que aparece: síntesis interpretativa validada;    │
│  conclusiones técnicas del equipo; prioridades deliberadas.     │
│                                                                 │
│  Conocimiento que nunca aparece: compromisos de actuación;      │
│  responsables; plazos; presupuesto.                             │
└─────────────────────────────────────────────────────────────────┘
         │ MTE + StrategicRepository + Mapa de Activos
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 5 — PROPUESTA DE ARTICULACIÓN INSTITUCIONAL (PAI)         │
│                                                                 │
│  Para cada prioridad del PSL:                                   │
│  → ¿Qué ya está garantizado estructuralmente? (ESCA, SSPA)     │
│  → ¿Qué orientaciones estratégicas aplican? (EPVSA, RELAS)     │
│  → ¿Qué activos comunitarios son relevantes?                    │
│  → ¿Qué actores son apropiados para qué tipo de actuación?     │
│  → ¿Dónde hay vacíos de capacidad?                             │
│                                                                 │
│  Conocimiento que aparece: mapa de articulación institucional   │
│  posible; actuaciones tipo propuestas con justificación.        │
│  Todo marcado como requiresHumanValidation: true.               │
│                                                                 │
│  Conocimiento que nunca aparece: compromisos definitivos;       │
│  responsables nominados; plazos; presupuesto real.              │
└─────────────────────────────────────────────────────────────────┘
         │ Deliberación del Grupo Motor
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 6 — PLAN DE ACCIÓN                                        │
│                                                                 │
│  → Objetivos validados por el Grupo Motor                       │
│  → Actuaciones adoptadas y contextualizadas                     │
│  → Indicadores con tiempo cero y meta                           │
│  → Responsables nominados (personas, no instituciones)          │
│  → Cronograma realista                                          │
│                                                                 │
│  Conocimiento que aparece: QUÉ se hará, QUIÉN lo hará, CUÁNDO, │
│  CON QUÉ indicadores se evaluará.                               │
│                                                                 │
│  Conocimiento que nunca aparece: resultados de la ejecución;    │
│  evaluación de impacto.                                         │
└─────────────────────────────────────────────────────────────────┘
         │ Compilación + aprobación corporación municipal
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 7 — PLAN LOCAL DE SALUD (PLS)                             │
│                                                                 │
│  → PSL-C (diagnóstico de referencia)                            │
│  → Plan de Acción validado                                      │
│  → Marco de gobernanza (Grupo Motor, participación, seguimiento)│
│  → Resumen Ejecutivo (audiencia política)                       │
│  → Aprobado por corporación municipal                           │
│                                                                 │
│  Conocimiento que aparece: compromiso institucional formal;     │
│  articulación visible de contribuciones; legitimidad democrática│
│                                                                 │
│  Conocimiento que nunca aparece: resultados de ejecución;       │
│  evaluación de impacto (esos son del ciclo siguiente).          │
└─────────────────────────────────────────────────────────────────┘
         │ Evaluación final → evidencia longitudinal
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 8 — CICLO SIGUIENTE                                       │
│                                                                 │
│  La evaluación genera evidencia longitudinal (EvidenceAtom[]    │
│  de origen "longi") que retroalimenta la Fase 2 del siguiente   │
│  ciclo. El fin del plan es el inicio del diagnóstico siguiente. │
│                                                                 │
│  [Ver Hipótesis H-8 en §VII: el mecanismo exacto de esta        │
│  retroalimentación no está completamente formalizado.]          │
└─────────────────────────────────────────────────────────────────┘
```

---

## VII. Relaciones pendientes de auditoría

Estas relaciones se han identificado como plausibles o necesarias pero no pueden
incorporarse al metamodelo sin evidencia documental adicional. Se registran aquí para
que la auditoría futura tenga un punto de partida explícito.

### H-1 — Cómo la evaluación retroalimenta el EvidenceStore [H]

Se sabe que la evaluación debe generar evidencia longitudinal para el siguiente ciclo.
No está formalizado: ¿qué tipo específico de EvidenceAtom produce el informe de evaluación?,
¿quién lo produce?, ¿es un proceso manual o asistido?, ¿cómo entra al EvidenceStore?

*Fuente de la hipótesis:* METHODOLOGICAL-FOUNDATIONS PM-24; MODEL-OF-INSTITUTIONAL-ARTICULATION
§II.9; Blueprint H-8.

### H-2 — Cómo el Mapa de Activos se mantiene entre ciclos [H]

Se sabe que el Mapa de Activos debe ser actualizable y es transversal al ciclo de
planificación. No está formalizado el mecanismo de actualización: ¿quién actualiza?,
¿con qué frecuencia?, ¿cómo entran los activos nuevos al EvidenceStore?, ¿cómo se
retiran los activos que dejan de existir?

*Fuente de la hipótesis:* ESCA línea 2.1.2 (actualización anual por UGC); MODEL-OF-INSTITUTIONAL-ARTICULATION Anexo I §A.1.

### H-3 — La relación de los programas ERACIS, GRAFA, UAEF con el modelo [H]

Se conoce la existencia de estos programas en el contexto andaluz, pero su naturaleza
exacta (actor responsable, mandato, relación con la planificación local en salud RELAS,
categoría en la taxonomía) no ha sido auditada documentalmente. No pueden incorporarse
al StrategicRepository ni al metamodelo hasta completar la actuation 4 de la Continuidad Maestra.

*Fuente de la hipótesis:* Continuidad Maestra actuation 4; INSTRUMENT-TAXONOMY §V.

### H-4 — Cómo los indicadores tipo de ESCA se vinculan a indicadores del PLS [H]

La ESCA tiene indicadores con forma de cálculo, meta y tiempo cero. Se plantea que
los indicadores del Plan Operativo ESCA podrían ser indicadores de referencia para
los indicadores análogos del PLS. No está formalizada la relación exacta.

*Fuente de la hipótesis:* ESCA Plan Operativo estructura; METHODOLOGICAL-FOUNDATIONS §II.1 (Indicador).

### H-5 — Cómo la PAI integra los activos comunitarios [H]

Se ha establecido que la PAI debe integrar activos comunitarios relevantes para cada
prioridad. No está formalizado el mecanismo: ¿cómo identifica el MTE qué activos son
relevantes para qué prioridad?, ¿es por dominio temático?, ¿por tipo de activo?

*Fuente de la hipótesis:* MODEL-OF-INSTITUTIONAL-ARTICULATION §VIII.3; Continuidad Maestra descubrimiento 7.

---

## VIII. Consecuencias arquitectónicas

Este metamodelo tiene consecuencias directas para los contratos del Sprint 2. Se
enuncian aquí como derivaciones del modelo sin proponer implementación concreta.

### VIII.1 Para el StrategicRepository

El StrategicRepository debe poder representar:
- `EST` Estrategias con sus líneas estratégicas y objetivos tipo.
- `PL` Planes operativos (SSPA) con sus contribuciones garantizadas.
- `PL` Planes sectoriales como referencias orientativas.
- `PRG` Programas con sus actuaciones tipo y su posible naturaleza de generadores de activos.
- `IND` Indicadores tipo vinculados a cada recurso.

La distinción entre `nature: "normative-reference"` y `nature: "guaranteed-capacity"` ya
identificada en INSTRUMENT-TAXONOMY §VI.1 es directamente derivable de las relaciones
de orientación (§IV.3) y garantía (§IV.4) de este metamodelo.

### VIII.2 Para el Motor de Traducción Estratégica (MTE)

El MTE debe implementar las cuatro consultas que derivan del metamodelo:
1. Para cada prioridad: ¿qué relaciones de garantía existen? (§IV.4)
2. Para cada prioridad: ¿qué relaciones de orientación aplican? (§IV.3)
3. Para cada prioridad: ¿qué activos comunitarios son movilizables? (§IV.7)
4. Para cada prioridad: ¿qué actores institucionales son apropiados? (§IV.9)

El output del MTE (PAI) debe reflejar estas cuatro dimensiones explícitamente (§IV.1).

### VIII.3 Para los compiladores

Tres productos documentales derivan de este metamodelo con inputs distintos:
- `LocalHealthProfileCompiler`: toma `PSL` (validated) → produce `PSL`-C compilado.
- `LocalHealthPlanCompiler`: toma `PLS` completo → produce el documento institucional.
- `REDCapCompiler`: toma `QuestionnaireDefinition` → produce Diccionario REDCap.

Las relaciones de composición (§IV.1) definen exactamente qué debe contener cada producto compilado.

### VIII.4 Para el modelo de persistencia

Las relaciones de derivación (§IV.2) implican que los objetos derivados (EvidenceStore,
Estado Territorial Evolutivo, PSL generado) no necesitan persistirse de forma permanente:
pueden reconstruirse desde su origen. Solo deben persistirse los objetos con validación
humana explícita (PSL validado, Plan de Acción validado, PLS aprobado), porque no
son reconstruibles sin el acto humano que los produjo.

### VIII.5 Para los objetos institucionales

Las relaciones de articulación (§IV.9) implican que el PLS debe poder descomponerse en
las contribuciones de cada actor, con trazabilidad completa (§IV.5). Esta propiedad de
descomposición debe estar representada en el modelo de datos del PLS, no solo en el
documento compilado.

---

## IX. Síntesis: el metamodelo como grafo

El metamodelo completo puede representarse como un grafo dirigido donde los nodos son
las entidades y los arcos son los tipos de relación formalizados en §IV.

```
[DF] ──parsers──► [ES] ──MIT──► [PSL] ──MTE+StrategicRepo──► [PAI]
                                  │                              │
                    StrategicRepo ─┘               deliberación  │
                    Mapa Activos ──────────────────────────────►─┘
                                                                 │
                                                          Grupo Motor
                                                                 │
[EST] ──ORIENTA──► PLS                                          ▼
[PL]  ──GARANTIZA─► contribuciones                         [PA]  ──compilación──► [PLS]
[PRG] ──GENERA───► [AC] ──MOVILIZA──► objetivos                │
                                      indicadores              ▼
[PLS] ──evaluación──► [E] longitudinal ──► [ES] ciclo siguiente
```

Este grafo es el objeto formal del metamodelo. Cada arco tiene una marca de evidencia
([D] o [I]) y un tipo de relación definido en §IV. Ningún arco sin marca de evidencia
existe en el metamodelo.

---

*Primera versión: 2026-06-28.*
*Este documento es la referencia conceptual del dominio de COMPÁS NG.*
*No debe modificarse sin verificar que los cambios tienen respaldo en evidencia documentada.*
*Complementa INSTRUMENT-TAXONOMY.md (qué es cada entidad) y MODEL-OF-INSTITUTIONAL-ARTICULATION.md*
*(cómo se articulan las instituciones).*
