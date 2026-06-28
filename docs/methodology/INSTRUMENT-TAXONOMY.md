# COMPÁS NG — Taxonomía de Instrumentos Metodológicos

> Documento metodológico fundacional.
> Define las categorías canónicas de instrumentos que COMPÁS NG debe ser capaz
> de reconocer, representar y articular en el proceso de planificación local en salud.
>
> Fuentes: documentación del repositorio [REP], benchmark institucional [BM],
> reconstrucción metodológica derivada [RMD], decisión conceptual de COMPÁS NG [DCA],
> auditoría del COMPÁS histórico [HCA].
>
> Toda afirmación normativa indica explícitamente su fuente.
> No se afirma nada sin evidencia documental.
>
> Fecha de emisión: 2026-06-28

---

## Preámbulo

El COMPÁS histórico trató como equivalentes conceptos metodológicamente distintos:
líneas EPVSA, programas comunitarios, activos, actuaciones, indicadores y protocolos
aparecen mezclados en la misma capa de datos sin distinción de naturaleza.

[DCA] COMPÁS NG no debe repetir este error. La distinción entre tipos de instrumentos
no es pedantería taxonómica: tiene consecuencias directas sobre qué consume el MTE,
qué produce el Plan de Acción, qué referencia el StrategicRepository y qué contiene
el Mapa de Activos Comunitarios.

---

## I. Las ocho categorías canónicas

### I.1 Estrategia

**Definición:** Documento normativo de alto nivel que establece orientaciones, valores
y líneas de acción para un período prolongado, sin prescribir actuaciones concretas.

**Características:**
- Emitida por una autoridad institucional con mandato formal.
- Define el marco de referencia pero no opera directamente en el municipio.
- No garantiza actuaciones específicas; orienta sin prescribir contenidos locales.
- Horizonte temporal largo (4-10 años).

**Función metodológica en COMPÁS NG:**
Proporciona las líneas estratégicas con las que las prioridades locales pueden alinearse.
El MTE consulta las estrategias para establecer correspondencias de primer nivel.

**Ejemplos documentados:**
- [REP] EPVSA — Estrategia de Promoción de una Vida Saludable en Andalucía 2024-2030: 4 líneas estratégicas (LE1-LE4).
- [REP] ESCA — Estrategia de Salud Comunitaria de Andalucía 2026-2030.
- [RMD] Una estrategia no compromete al municipio a ninguna actuación por el mero hecho de alinearse con ella.

**Objeto en el StrategicRepository:** `nature: "normative-reference"`, `resourceType: "strategy"`.

---

### I.2 Plan

**Definición:** Documento operativo que traduce una estrategia en compromisos concretos
con indicadores, metas, responsables y plazos para un período definido.

**Características:**
- Tiene actores responsables nominados.
- Tiene indicadores con forma de cálculo, tiempo cero y meta.
- Tiene cronograma.
- Puede ser evaluado al finalizar el período.
- Es más específico que una estrategia; puede derivarse de una o varias estrategias.

**Función metodológica en COMPÁS NG:**
Los planes de origen SSPA (Plan Operativo ESCA) aportan contribuciones estructuralmente garantizadas.
Los planes municipales (PLS) son el producto final de COMPÁS NG.

**Subcategorías:**
- *Plan operativo territorial:* [REP] Plan Operativo Territorial ESCA (2027-2028 y 2029-2030 por Distrito).
  Nature: `"guaranteed-capacity"` porque sus actuaciones son compromisos del SSPA.
- *Plan local de salud:* producto de COMPÁS NG. Nature: no procede (es el output, no un input del StrategicRepository).
- *Plan sectorial:* [REP] Plan Estratégico de Personas Mayores (PEM) 2020-2023. Nature: `"normative-reference"`.

**Objeto en el StrategicRepository:** `nature: "guaranteed-capacity"` (si es Plan Operativo SSPA) o `"normative-reference"` (si es plan sectorial autonómico).

---

### I.3 Programa

**Definición:** Conjunto organizado de actuaciones agrupadas por objetivo temático,
con financiación, metodología y circuito de implementación propios.

**Características:**
- Tiene una metodología de implementación definida.
- Puede tener recursos propios (humanos, materiales, financieros).
- Tiene actores responsables con roles específicos.
- Puede ser temporal o permanente.
- Puede implementarse en múltiples municipios simultáneamente.

**Función metodológica en COMPÁS NG:**
Los programas pueden ser: contribuciones estructuralmente garantizadas (si el SSPA los implementa por mandato de la ESCA), referencias estratégicas (si son programas autonómicos disponibles pero no obligatorios), o activos del territorio (si ya están implantados en el municipio).

**Ejemplos identificados:**
- [HCA, Zagra real data] GRUSE (Grupo de Salud): programa de grupos de salud comunitarios liderado por equipos de AP. El GRUSE de mujeres de Zagra lleva activo desde 2013. [DCA] Es simultáneamente un programa (tiene metodología de AP) y un activo comunitario (está implantado y activo en el municipio).
- [RMD, por analogía con contexto andaluz] ERACIS — Estrategia Regional Andaluza para la Cohesión e Inclusión Social: marco de programas de inclusión social con implicaciones en salud. Requiere auditoría específica antes de categorizar como guaranteed-capacity o normative-reference.
- [RMD] Ciudades ante las Drogas / ante las Adicciones: programa de prevención de adicciones en municipios. Requiere auditoría específica.
- [RMD] GRAFA (Grupo de Alimentación Familiar / Alimentación Saludable): programa de educación nutricional grupal. Requiere auditoría específica.
- [RMD] UAEF (Unidad de Apoyo a las Escuelas de Familias): programa de apoyo a la parentalidad. Requiere auditoría específica.

**Objeto en el StrategicRepository:** `nature` debe determinarse por programa — puede ser `"guaranteed-capacity"` o `"normative-reference"` según esté mandatado por la ESCA u otra norma.

---

### I.4 Protocolo

**Definición:** Documento que prescribe procedimientos clínicos, metodológicos o
administrativos para situaciones específicas de forma estandarizada.

**Características:**
- Altamente específico en cuanto a pasos, actores y condiciones de aplicación.
- Reduce la variabilidad de la práctica mediante estandarización.
- Actualizable por consenso técnico-científico.
- Más operativo que un programa; aplica a situaciones concretas.

**Función metodológica en COMPÁS NG:**
Los protocolos de atención comunitaria (ej.: protocolo de detección precoz, protocolo de intervención en crisis) pueden ser relevantes para especificar actuaciones del Plan de Acción. No son típicamente objetos del StrategicRepository, pero pueden ser referencias metodológicas de la Biblioteca.

**Posición en la arquitectura:**
Los protocolos son más propios de la Biblioteca Metodológica Canónica que del StrategicRepository. Si un protocolo define un instrumento de medición (ej.: escala de detección) sí entra en la Biblioteca.

**Objeto en COMPÁS NG:** No en el StrategicRepository primario. Potencialmente en la Biblioteca Metodológica si define instrumentos.

---

### I.5 Activo comunitario

**Definición:** Recurso, capacidad o fortaleza del territorio que puede movilizarse
para mejorar la salud de la población, con existencia real y verificable en el municipio.

**Características:**
- Existe en el municipio (no es una aspiración, es una realidad).
- Tiene una ubicación, un responsable o una organización que lo sostiene.
- Puede movilizarse sin que ninguna institución lo cree ex novo.
- Tiene valor salutogénico comprobable o plausible.
- Su ausencia o desaparición puede identificarse y documentarse.

**Función metodológica en COMPÁS NG:**
Los activos comunitarios alimentan el EvidenceStore como átomos de tipo `asset`.
Son la contrapartida salutogénica de los determinantes de riesgo.
Son transversales a todo el ciclo: diagnóstico (evidencia), perfil (análisis), propuesta (articulación), plan (palanca de actuación), seguimiento (mantenimiento y desarrollo de activos).

**Tipología de activos:**
| Tipo | Descripción | Ejemplo real (Zagra) |
|---|---|---|
| Infraestructura comunitaria | Equipamientos accesibles y disponibles | Piscina municipal, polideportivo, Casa de la Cultura |
| Organización comunitaria | Grupos, asociaciones, tejido social | Asociación de Mujeres, Club de Fútbol, GRUSE de mujeres |
| Programa implantado | Programa en activo en el municipio | GRUSE de mujeres (desde 2013) |
| Capital social | Redes de apoyo, confianza comunitaria | Cáritas, Cruz Roja, monjas Hijas de San José |
| Recurso institucional | Servicio municipal o sanitario accesible | Guardería municipal, Biblioteca, Centro Guadalinfo |
| Recurso potencial | Activo identificado pero no completamente activado | Centro de Participación Activa (pendiente de apertura en Zagra) |

**Distinción crítica:** Un GRUSE implantado en el municipio es a la vez:
- Un **activo comunitario** (existe, está activo, genera valor salutogénico).
- Una **actuación tipo ESCA** (la ESCA mandata estos grupos desde el SSPA).

[DCA] Esta doble naturaleza es metodológicamente importante: el mismo objeto puede
ser evidencia (activo en el EvidenceStore), referencia estratégica (la ESCA lo
mandata) y palanca de planificación (puede articularse para objetivos específicos).
El modelo de datos debe poder expresar esta doble naturaleza sin confundirla.

**Objeto en COMPÁS NG:**
- Como evidencia: `EvidenceAtom` de tipo `asset` en el EvidenceStore.
- Como referencia estratégica: entrada en el StrategicRepository con `nature: "guaranteed-capacity"` si está mandatado.
- Como palanca de planificación: referenciado en el Plan de Acción como recurso disponible.

---

### I.6 Actuación tipo

**Definición:** Acción específica con metodología probada, frecuentemente asociada
a un programa o protocolo, que puede adoptarse como actuación concreta en el Plan de Acción.

**Características:**
- Tiene evidencia de efectividad (o al menos de viabilidad en el contexto).
- Puede ser replicada en diferentes municipios con adaptaciones mínimas.
- Tiene un perfil de actor responsable apropiado.
- Puede tener indicadores de proceso asociados.

**Función metodológica en COMPÁS NG:**
Las actuaciones tipo son el output del MTE: no objetivos abstractos sino acciones
concretas que el Grupo Motor puede evaluar, adaptar y adoptar.

**Distinción con "actuación del Plan de Acción":**
La actuación tipo es una propuesta genérica del sistema. La actuación del Plan de Acción
es la decisión validada por el Grupo Motor, adaptada al contexto local, con responsable
y cronograma asignados. Son estados distintos del mismo concepto.

**Objeto en COMPÁS NG:**
El MTE propone actuaciones tipo como output. El Grupo Motor las transforma en actuaciones del Plan.

---

### I.7 Objetivo

**Definición:** Formulación de un cambio deseable y verificable en la salud o en sus
determinantes, derivado de las prioridades seleccionadas en el proceso de planificación.

**Características:**
- Específico (qué cambia), medible (hay indicador), alcanzable, relevante, temporalizado.
- Está vinculado a una prioridad.
- Tiene al menos un indicador de resultado.
- Puede ser general (orientación) o específico (cambio operativo).

**Función metodológica en COMPÁS NG:**
Los objetivos emergen del proceso de deliberación del Grupo Motor sobre la propuesta
del MTE. No son generados automáticamente por el sistema; son adoptados por los actores.

**Distinción con "línea estratégica":**
Una línea estratégica (EPVSA LE1, ESCA objetivo 2.1) orienta. Un objetivo del PLS compromete.
La misma área temática puede tener una línea estratégica de referencia y un objetivo específico local.

**Objeto en COMPÁS NG:**
Parte del Plan de Acción validado. No existe como objeto independiente del plan.

---

### I.8 Indicador

**Definición:** Medida operativamente definida que permite verificar el grado de
cumplimiento de un objetivo o el avance de una actuación en un período determinado.

**Características:**
- Tiene definición operativa (exactamente qué se mide).
- Tiene numerador y denominador (cuando aplica).
- Tiene fuente de datos explícita.
- Tiene tiempo cero (baseline) documentado antes de la ejecución.
- Tiene meta (valor esperado al final del período).
- Tiene frecuencia de medición y responsable de medición.

**Tipos:**
- *De proceso:* ¿se están ejecutando las actuaciones planificadas?
- *De resultado:* ¿están cambiando los determinantes que se querían cambiar?
- *De impacto:* ¿está mejorando la salud de la población?

**Función metodológica en COMPÁS NG:**
Los indicadores son objetos del Plan de Acción y del Marco de Seguimiento.
La Biblioteca Metodológica define los indicadores de cada instrumento de medición (IBSE, DUKE, SF-12...).
El StrategicRepository puede incluir indicadores tipo de los marcos estratégicos (ESCA).

**Objeto en COMPÁS NG:**
Parte del Plan de Acción validado y del Marco de Seguimiento.
También presente en la Biblioteca Metodológica como indicadores de cada MethodologicalModule.

---

## II. Mapa de relaciones entre categorías

```
ESTRATEGIA
    │ orienta
    ▼
PLAN
    │ organiza
    ├──► PROGRAMA (implantación de actuaciones)
    │       │ puede generar
    │       ▼
    │    ACTIVO COMUNITARIO (si está activo en el municipio)
    │
    ├──► OBJETIVO (cambio esperado)
    │       │ se verifica con
    │       ▼
    │    INDICADOR
    │
    ├──► ACTUACIÓN TIPO (acción concreta propuesta)
    │       │ se operacionaliza en
    │       ▼
    │    ACTUACIÓN DEL PLAN (adoptada y contextualizada)
    │
    └──► PROTOCOLO (procedimiento estandarizado)
```

---

## III. Posición de cada categoría en COMPÁS NG

| Categoría | EvidenceStore | StrategicRepository | Biblioteca Metodológica | Plan de Acción | Mapa de Activos |
|---|:---:|:---:|:---:|:---:|:---:|
| Estrategia | ✗ | ✅ (`normative-reference`) | ✗ | (referencia) | ✗ |
| Plan operativo SSPA | ✗ | ✅ (`guaranteed-capacity`) | ✗ | (base) | ✗ |
| Plan sectorial | ✗ | ✅ (`normative-reference`) | ✗ | (referencia) | ✗ |
| Programa | ✗ | ✅ (según mandato) | ✗ | (actuaciones tipo) | ✗ |
| Protocolo | ✗ | ✗ | ✅ (si define instrumentos) | (metodología) | ✗ |
| Activo comunitario | ✅ (`asset`) | ✗ o ✅ (si garantizado) | ✗ | (palanca) | ✅ |
| Actuación tipo | ✗ | ✅ (output del MTE) | ✗ | ✅ (si adoptada) | ✗ |
| Objetivo | ✗ | ✗ | ✗ | ✅ | ✗ |
| Indicador | ✅ (outcome atoms) | ✅ (indicadores ESCA) | ✅ (por instrumento) | ✅ | ✗ |

---

## IV. La doble naturaleza de los programas comunitarios

[DCA] Un programa como GRUSE puede ser simultáneamente:
1. Un **activo comunitario** (el GRUSE de mujeres de Zagra existe desde 2013 y genera valor salutogénico observable).
2. Una **actuación tipo garantizada** por la ESCA (los grupos de salud comunitaria son mandatados por la ESCA línea 2.3.x).
3. Una **referencia metodológica** (el GRUSE tiene una metodología de intervención grupal).

COMPÁS NG debe poder representar esta doble o triple naturaleza sin colapsarla.

**Regla de representación:**
- Como activo en el EvidenceStore: cuando el GRUSE YA EXISTE en el municipio y es verificable.
- En el StrategicRepository: cuando la ESCA garantiza grupos de salud (categoría general, no la instancia local).
- En el Plan de Acción: cuando se propone articular el GRUSE existente para un objetivo específico.

---

## V. Programas pendientes de auditoría específica

Los siguientes programas aparecen referenciados como relevantes para la planificación local en salud en Andalucía. Su categorización en la taxonomía requiere auditoría documental específica antes de incorporarse al StrategicRepository.

| Programa | Referencia | Tipo probable | Pendiente de verificar |
|---|---|---|---|
| **GRUSE** | [HCA] Zagra real data | Programa + Activo comunitario | Mandato ESCA (línea 2.3.x), metodología, indicadores |
| **ERACIS** | [RMD] Conocimiento del contexto andaluz | Estrategia/Programa | Actor responsable, mandato, actuaciones tipo, relación con salud comunitaria |
| **Ciudades ante las Drogas/Adicciones** | [RMD] | Programa | Actor (¿DGPAD? ¿municipios?), metodología, indicadores |
| **GRAFA** | [RMD] | Programa | Actor, metodología, relación con EAS/nutrición |
| **UAEF** | [RMD] | Programa | Actor, metodología, relación con salud familiar |

**Nota metodológica:** La clasificación [RMD] para estos programas significa que su existencia es conocida pero su caracterización exacta (actor responsable, mandato, relación con la planificación local en salud RELAS) requiere confirmación documental antes de incorporarse al modelo. No deben incluirse en el StrategicRepository hasta completar la auditoría de actuation 4.

---

## VI. Consecuencias arquitectónicas

### VI.1 Para el StrategicRepository

El campo `nature` propuesto en la auditoría de coherencia debe distinguir al menos:
- `"normative-reference"`: estrategias y planes sectoriales que orientan.
- `"guaranteed-capacity"`: planes operativos SSPA y programas mandatados que garantizan actuaciones.

Adicionalmente, el `resourceType` actual (strategy, strategic-plan, operational-plan, programmatic-guide, normative-framework) puede ampliarse con:
- `"programme"`: para programas con metodología y actores propios.
- `"asset-generator"`: para programas que generan activos comunitarios cuando se implantan.

### VI.2 Para el MTE

El MTE debe consultar el StrategicRepository con dos preguntas distintas por prioridad:
1. "¿Qué capacidades o programas garantizados existen para esta prioridad?" (`nature: "guaranteed-capacity"`)
2. "¿Qué referencias estratégicas orientan esta prioridad?" (`nature: "normative-reference"`)

La respuesta a la pregunta 1 va al bloque "ya garantizado" de la Propuesta de Articulación.
La respuesta a la pregunta 2 va al bloque "marcos de referencia" de la misma propuesta.

### VI.3 Para el Mapa de Activos Comunitarios

El Mapa de Activos debe poder distinguir entre:
- Activos preexistentes (existían antes del plan).
- Activos generados por el plan (emergen como resultado de actuaciones).
- Programas en activo (tienen naturaleza de activo Y de actuación institucional garantizada).

Esta distinción no existe actualmente en el modelo de datos del EvidenceStore.
Es una laguna que debe resolverse en el diseño del Sprint 2.

---

*Primera versión: 2026-06-28.*
*Esta taxonomía es una referencia metodológica. Toda incorporación al StrategicRepository
de un programa, plan o estrategia debe referenciar esta taxonomía para determinar
su `nature` y `resourceType` correctos.*
