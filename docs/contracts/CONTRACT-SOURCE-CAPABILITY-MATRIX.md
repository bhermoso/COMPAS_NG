# CONTRACT-SOURCE-CAPABILITY-MATRIX

> Matriz contractual de capacidades de fuente para el Perfil de Salud Local.
> Versión 1.0 — 2026-09-24
> Estado: VIGENTE
>
> Este contrato define qué tipos de información puede soportar, cargar e
> incorporar COMPÁS NG, qué papel metodológico tienen en el Perfil y cómo deben
> comportarse ante las dos salidas del mismo Perfil canónico: la salida
> interpretativa COMPÁS y la salida comparativa breve tipo OHID/Fingertips.

---

## 1. Propósito

El Perfil de Salud Local debe ser **siempre completo** aunque no siempre cuente
con las mismas fuentes. Completo no significa exhaustivo: significa que declara
qué sabe, de dónde procede, con qué escala, qué no sabe y qué cambia cuando se
incorpora una fuente nueva.

Esta matriz evita tres errores:

1. Tratar todas las fuentes como texto indiferenciado.
2. Confundir ausencia de una fuente con ausencia de Perfil.
3. Generar una ficha comparativa tipo OHID/Fingertips a partir de fuentes que no
   ofrecen indicadores comparables.

La matriz es el puente entre `CONTRACT-REPOSITORY`, `CONTRACT-EVIDENCE`,
`CONTRACT-COMPLEMENTARY-STUDIES` y
`CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY`.

---

## 2. Conceptos

| Concepto | Definición |
|---|---|
| **Fuente fija** | Fuente que actúa como base primaria del ciclo diagnóstico. En el estado actual, el Informe de Salud. |
| **Fuente variable** | Fuente que puede añadirse, sustituirse o acumularse según el municipio y el momento del proceso. |
| **Fuente atomizable** | Fuente de la que el sistema puede generar `EvidenceAtom` con trazabilidad. |
| **Fuente no atomizable** | Fuente preservada como documento o contexto, sin transformación a evidencia ordinaria. |
| **Fuente estructurada** | Fuente con parser, agregados o campos conocidos: CSV de instrumentos, priorización, dataset GES. |
| **Fuente documental genérica** | DOCX/PDF/texto que entra por selector documental y se clasifica por `DocumentKind`. |
| **Fuente contextual** | Información que contextualiza el territorio pero no debe protagonizar el Perfil ni sustituir evidencia local. |
| **Salida interpretativa** | Lectura territorial COMPÁS: patrones, tensiones, incertidumbres, capacidades y preguntas. |
| **Salida comparativa breve** | Ficha tipo OHID/Fingertips: indicadores, valores, referencias, periodos, escalas y cautelas. |

---

## 3. Matriz de capacidades actuales

| Fuente | Ruta actual | Fija / variable | ¿Genera `EvidenceAtom`? | Papel en Perfil interpretativo | Papel en salida comparativa breve | Madurez |
|---|---|---:|:---:|---|---|---|
| Informe de Salud | `DocumentKind: "health-report"`; `origin: "health-report"` reservado | Fija primaria | No | Base epidemiológica oficial; componente N de la regla N+1. | Cita y alcance de fuente; no genera filas comparativas por sí solo. | Activa |
| Estudios complementarios estructurados | CSV de instrumentos; `redcap-export` o `complementary-study`; `origin: "complementary-study"` cuando aplica | Variable | Sí | Indicadores cuantitativos, cautelas, calidad muestral y señales trazadoras. | Sí, si el indicador tiene valor, periodo, escala y referencia válida. | Activa |
| IBSE | `redcap-export` + tag `"ibse"`; `origin: "ibse"` | Variable canónica por tag | Sí | Bienestar socioemocional escolar y resumen cualitativo derivado. | Sí, con cautela cuando no exista referencia externa validada. | Activa |
| EAS / REDCap municipales | Parsers de 13 estudios complementarios | Variable | Sí | Salud percibida, apoyo social, alimentación, sueño, actividad física, consumo, salud mental y otros dominios medidos. | Sí, solo para indicadores headline con referencia metodológicamente válida. | Activa parcial por comparadores |
| Exportación REDCap genérica | `DocumentKind: "redcap-export"`; `origin: "redcap"` si no hay origen más específico | Variable | Sí | Entrada estructurada genérica hasta que un parser específico la clasifique. | No debe alimentar comparativa sin módulo/indicador identificado. | Activa genérica |
| Priorización ciudadana por votación | `redcap-export` + tag `"thematic-prioritisation"`; `origin: "citizen-participation"` | Variable canónica por tag | Sí | Evidencia participativa: preferencias, prioridades percibidas y base para deliberación. | Puede mostrar existencia, participación y temas priorizados; no mide prevalencia ni magnitud epidemiológica. | Activa |
| Selección deliberativa del Grupo Motor | Objeto de priorización deliberativa del workspace | Variable | No ordinaria | Decisión posterior que orienta planificación; no sustituye al diagnóstico. | No genera comparadores; puede aparecer solo como estado del proceso. | Activa |
| Localiza Salud / activos comunitarios | `DocumentKind: "localiza-salud"`; `origin: "localiza-salud"` | Variable acumulable | Sí | Activos y capacidades potenciales; equilibrio activos-déficits. | No produce posición sanitaria; puede resumir disponibilidad de activos con cautela. | Activa |
| Activos comunitarios legado | `DocumentKind: "community-asset"`; `origin: "community-assets"` | Variable interna/legado | Sí | Compatibilidad con datos anteriores; activos/capacidades. | Igual que Localiza Salud, sin abrir vía visible nueva. | Legacy activo |
| Marco estratégico y normativo | `DocumentKind: "strategic-framework"`; `origin: "strategic-framework"` | Variable acumulable | Sí | Contexto institucional: EPVSA, ESCA, RELAS, estrategias autonómicas o estatales. | No crea indicadores de salud; puede aportar marco de referencia visible. | Activa |
| Documentación territorial de contexto | `DocumentKind: "territorial-documentation"`; `origin: "territorial-documentation"` | Variable acumulable | Sí si hay texto procesable | Determinantes, contexto social, económico, urbano, institucional o clínico-asistencial. | Solo aporta filas comparativas si contiene indicador estructurado y referencia validada; por defecto, no. | Activa |
| Informes ERACIS u otros diagnósticos de programa | Normalmente `territorial-documentation`; `documentNature` pendiente si se especializa | Variable acumulable | Sí si hay texto procesable | Diagnóstico social/territorial complementario; desigualdades, vulnerabilidad, barrios, colectivos. | No debe transformarse automáticamente en comparador; requiere estructuración explícita. | Activa por ruta genérica |
| Informes clínico-asistenciales UGC | `territorial-documentation` + `documentNature: "ugc-clinical-assistance-report"` | Variable contextual | No como evidencia ordinaria en N1b | Preguntas de contraste clínico-asistencial; no reemplaza escala municipal. | No genera filas comparativas municipales; escala UGC debe quedar visible. | Activa parcial |
| Material cualitativo y participativo | `DocumentKind: "qualitative-material"`; `origin: "qualitative-material"` | Variable acumulable | Sí | Percepciones, relatos, actas, necesidades sentidas, contradicciones y preguntas. | No produce comparación cuantitativa; puede declarar participación cualitativa. | Activa |
| Evidencia longitudinal | `DocumentKind: "longitudinal-evidence"`; `origin: "longi"` | Variable acumulable | Sí | Cambios entre ciclos, evolución temporal y memoria diagnóstica. | Puede mostrar tendencia solo si periodo, indicador y escala son comparables. | Activa |
| Dataset GES / importación de proyecto | `projectDatasetImports` y parsers disponibles | Variable | Sí si el módulo tiene adaptador | Carga estructurada de instrumentos del proyecto; preserva metadatos sin registros individuales. | Igual que estudios complementarios, limitado por comparadores y adaptadores. | Activa parcial |
| BADEA/IECA y contexto municipal externo | Contexto/proxy del municipio matriz | Variable contextual | No como fuente ordinaria | Contextualiza condiciones del municipio matriz; no desplaza evidencia local. | Puede aparecer como referencia contextual, nunca como estimación distrital si el ámbito es inframunicipal. | Piloto/contextual |
| Variables EAS sueltas | `DocumentKind: "eas-variable"`; `origin: "eas"` | Variable reservada | No en flujo visible | Reservado para parser real; no debe usarse como carga cómoda. | No disponible hasta parser validado. | Reservada |
| Indicadores CMI | `DocumentKind: "cmi-indicator"`; `origin: "cmi"` | Variable reservada | No en flujo visible | Reservado para parser real; posible fuente de indicadores sanitarios estructurados. | No disponible hasta parser validado. | Reservada |
| SAM / calidad muestral transversal | `origin: "sam"` reservado | Variable metodológica | No en flujo activo | Evaluación futura de calidad muestral transversal; hoy no instancia átomos activos. | Puede aportar cautela de calidad cuando esté implementado, no indicador de salud. | Reservada |
| Entrada manual y migración legacy | `origin: "manual-entry"` o `origin: "legacy-compas"` | Variable de compatibilidad | Sí técnicamente | Corrección, migración o incorporación manual controlada con trazabilidad. | No debe alimentar comparativa sin reclasificación y fuente verificable. | Compatibilidad |
| Otros documentos | `DocumentKind: "other"`; `origin: "other"` | Variable fallback | Sí técnicamente | Fallback interno; no debe ser opción visible normal. | No debe alimentar salida comparativa sin reclasificación. | Fallback no preferente |

---

## 4. Regla de entrada para fuentes nuevas

Una fuente nueva entra por la ruta más específica disponible:

1. Si es el Informe de Salud, usa `health-report`.
2. Si es un estudio con parser estructurado, usa su importador específico.
3. Si es una priorización por votación, usa la ruta de priorización temática.
4. Si es inventario de activos, usa `localiza-salud`.
5. Si es estrategia, norma, plan autonómico, plan sectorial, plan estratégico
   temático o marco RELAS/ESCA, usa `strategic-framework`.
6. Si es diagnóstico social, informe ERACIS, diagnóstico de barrio, informe de
   otro programa o documento de contexto territorial, usa
   `territorial-documentation`.
7. Si es acta, entrevista, grupo focal, memoria participativa o relato
   comunitario, usa `qualitative-material`.
8. Si compara ciclos, usa `longitudinal-evidence`.

Si una fuente se usa repetidamente y exige reglas propias de extracción,
canonicidad o escala, debe graduarse a parser o `documentNature` específico
antes de condicionar decisiones del Perfil.

---

## 5. Efecto sobre completitud del Perfil

El Perfil es completo cuando:

- identifica qué fuentes están presentes;
- identifica qué fuentes relevantes están ausentes;
- declara la escala de cada fuente;
- distingue datos locales, proxies y contexto externo;
- conserva la regla N+1;
- presenta lagunas como lagunas, no como áreas de intervención;
- marca el Perfil como potencialmente desactualizado si cambia una fuente usada
  en su generación.

La llegada de una nueva fuente no invalida automáticamente el Perfil anterior:
lo convierte en una instantánea histórica del expediente previo. Para que la
nueva información tenga valor institucional debe producirse una nueva lectura,
nueva validación o nueva compilación, según el punto del ciclo.

---

## 6. Efecto sobre la salida comparativa breve

La salida comparativa breve tipo OHID/Fingertips solo puede crear filas cuando
el Perfil canónico dispone de:

- indicador identificable;
- valor local;
- periodo o fecha;
- escala territorial;
- fuente;
- cautela;
- referencia territorial o normativa válida, salvo que se declare expresamente
  "referencia no disponible".

No son filas comparativas por sí mismas:

- relatos cualitativos;
- prioridades ciudadanas;
- planes estratégicos;
- diagnósticos ERACIS no estructurados;
- activos comunitarios inventariados;
- informes UGC usados como contraste;
- documentos PDF registrados como referencia sin texto procesable.

Estos materiales pueden aparecer como contexto, cobertura de fuentes o cautela,
pero no como si fueran indicadores comparables.

---

## 7. Invariantes

**SCM-I1 — Fuente nueva no equivale a nuevo Perfil**

Una fuente nueva actualiza el expediente. No crea un segundo Perfil ni una línea
diagnóstica paralela.

**SCM-I2 — Ruta específica antes que fallback**

Toda fuente debe entrar por la ruta más específica disponible. `other` solo es
fallback interno.

**SCM-I3 — Comparación exige estructura**

La salida comparativa breve no compara texto. Solo compara indicadores con valor,
periodo, escala, fuente y cautela.

**SCM-I4 — Proxies visibles**

Toda fuente de escala superior o distinta al ámbito del Perfil debe declarar su
escala. Ningún proxy puede presentarse como dato municipal o distrital directo.

**SCM-I5 — Ausencia como contenido**

La ausencia de estudios, participación, activos, comparadores o evidencia
longitudinal se declara como alcance del diagnóstico. No se oculta y no se
transforma en prioridad.

**SCM-I6 — Participación no mide prevalencia**

La priorización ciudadana y el material cualitativo informan preferencias,
percepciones y sentido comunitario. No sustituyen indicadores epidemiológicos.

**SCM-I7 — Estrategias orientan, no diagnostican población**

Una estrategia autonómica, plan sectorial o marco normativo puede orientar la
lectura y la planificación posterior, pero no demuestra por sí solo un problema
de salud local.

---

## 8. Relaciones

| Contrato | Relación |
|---|---|
| `CONTRACT-REPOSITORY` | Define `DocumentKind`, canonicidad, visibilidad y preservación documental. |
| `CONTRACT-EVIDENCE` | Define `EvidenceAtom`, `EvidenceOrigin`, confianza, procedencia e IntegrityGuard. |
| `CONTRACT-COMPLEMENTARY-STUDIES` | Define los 13 instrumentos estructurados y sus pipelines. |
| `CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY` | Define cómo el Perfil usa fuentes, afirma, interpreta y declara incertidumbre. |
| `CONTRACT-NHS-HEALTH-PROFILE` §0 | Subordina la salida comparativa breve al Perfil único y evita una segunda fuente de verdad. |
| `PROFILE-VISUAL-CONTRACT` | Define cómo se visualizan fuentes, escalas, cautelas y salida comparativa breve. |

---

## Registro de revisiones

| Fecha | Versión | Cambio | Responsable |
|---|---|---|---|
| 2026-09-24 | 1.0 | Creación de la matriz de capacidades de fuentes y su relación con las dos salidas del Perfil | COMPÁS NG |
