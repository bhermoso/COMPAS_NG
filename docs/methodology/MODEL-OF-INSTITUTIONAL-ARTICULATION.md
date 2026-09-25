# COMPÁS NG — Modelo de Articulación Institucional para la Planificación Local en Salud

> Documento fundacional del Sprint 2.
> Formaliza el modelo mediante el cual COMPÁS NG articula las contribuciones
> institucionales necesarias para construir un Plan Local de Salud.
>
> No es un contrato. No es un manual técnico. No describe software.
> Es el marco metodológico del que derivan los contratos y motores del sistema.
>
> Las afirmaciones normativas indican explícitamente su fuente:
> [REP] = documentación del repositorio · [BM] = benchmark · [RMD] = reconstrucción
> metodológica derivada · [DCA] = decisión conceptual de COMPÁS NG.
>
> Fecha de emisión: 2026-06-28
> Complementa: METHODOLOGICAL-FOUNDATIONS-LOCAL-HEALTH-PLANNING.md

---

## Parte I — El problema institucional que resuelve COMPÁS NG

### I.1 El problema

Un Plan Local de Salud no puede producirse por acumulación de documentos institucionales.

La razón no es técnica. Es de naturaleza institucional.

Los documentos disponibles para la planificación local —el Informe de Salud del
Distrito, la ESCA, la EPVSA, los datos EAS, los activos comunitarios— proceden de
instituciones distintas, con mandatos distintos, vocabularios distintos, ciclos
de planificación distintos y sistemas de rendición de cuentas distintos.

Acumularlos no produce un plan. Produce un archivo.

Lo que produce un plan es la articulación de las contribuciones de cada institución
en un objeto colectivo donde cada contribución permanece identificable, atribuible
y trazable, y el conjunto tiene coherencia y compromiso propio.

[DCA] **COMPÁS NG existe para hacer posible esa articulación.**

No es un sistema de gestión documental.
No es un motor de análisis epidemiológico.
No es un generador de planes.

Es la infraestructura que permite que instituciones con mandatos distintos
co-produzcan un Plan Local de Salud con trazabilidad completa.

### I.2 Por qué la planificación local exige articulación y no simplemente coordinación

La distinción es metodológicamente crítica.

**Coordinación** responde a la pregunta: ¿cómo evitamos duplicidades y conflictos?
Su lógica es negativa: prevenir que las acciones de una institución interfieran
con las de otra. Produce alineación pero no un objeto colectivo nuevo.

**Articulación** responde a una pregunta distinta: ¿cómo producimos conjuntamente
algo que ninguna institución puede producir sola? Su lógica es generativa: crear
un nuevo objeto —el Plan Local de Salud— que incorpora las contribuciones de múltiples
instituciones de forma que cada una permanece reconocible pero el conjunto tiene
propiedades que ninguna contribución individual posee.

La diferencia no es de grado: es de naturaleza.

[RMD] Un municipio que coordina su plan con el Distrito Sanitario evita duplicidades.
Un municipio que articula su plan con el Distrito Sanitario produce un objeto donde
las actuaciones sanitarias y las actuaciones municipales se refuerzan mutuamente,
cada una trazable a su institución responsable, el conjunto coherente con el
diagnóstico territorial compartido.

La planificación local en salud requiere articulación porque:

1. **La salud es un objeto transversal.** La salud de la población depende de
   determinantes que no pertenecen a ninguna institución: el urbanismo, el empleo,
   la educación, los servicios sociales, el tejido comunitario, el sistema sanitario.
   Ninguna de estas instituciones puede abordar los determinantes de la salud sola.

2. **Las competencias no coinciden con las necesidades.** Las necesidades de salud
   del municipio no se alinean con los límites de competencia de ninguna institución.
   La solución de una necesidad requiere típicamente la acción coordinada de al menos
   dos instituciones que no tienen relación jerárquica entre sí.

3. **La legitimidad requiere participación.** Un Plan Local de Salud que no incorpora
   la voz de la ciudadanía, las asociaciones y el tejido comunitario carece de
   legitimidad social aunque sea técnicamente correcto. La participación no es
   un requisito procedimental: es una condición epistemológica (la ciudadanía posee
   conocimiento sobre el territorio que ninguna institución tiene) y una condición
   de legitimidad (el plan compromete a la comunidad que debe reconocerse en él).

4. **La trazabilidad exige atribución.** Para que el seguimiento y la evaluación
   sean posibles, cada compromiso del plan debe ser atribuible a un actor específico
   con responsabilidad formal. Sin atribución clara, el seguimiento produce
   datos pero no accountability.

### I.3 El problema específico que COMPÁS NG resuelve

[DCA] COMPÁS NG no resuelve el problema general de la articulación institucional.
Eso es un problema de gobernanza que solo puede resolverse en el mundo político e institucional.

COMPÁS NG resuelve el problema técnico-metodológico de hacer posible esa articulación:

- Construye la base de evidencia compartida que ninguna institución posee sola.
- Produce el diagnóstico territorial que es el objeto de referencia común.
- Ofrece la estructura formal en la que cada contribución puede ser registrada
  y atribuida a su institución de origen.
- Genera el borrador técnico del Plan de Acción que el Grupo Motor puede revisar,
  ajustar y validar.
- Garantiza la trazabilidad completa desde cada compromiso del plan hasta la
  evidencia que lo fundamenta.

COMPÁS NG no decide qué priorizar, no asigna responsabilidades y no aprueba compromisos.
Proporciona la infraestructura metodológica para que los actores institucionales
puedan hacer todo eso con rigor, transparencia y trazabilidad.

---

## Parte II — Ontología de la planificación local en salud

Los conceptos que siguen son distintos entre sí. Tratarlos como sinónimos o mezclarlos
produce errores metodológicos que se propagan a todo el proceso.

### II.1 Evidencia

[REP, CONTRACT-INTERPRETATION] La evidencia es una representación estructurada de
contenidos de un documento primario, extraída con metodología definida, con trazabilidad
al documento de origen y con declaración explícita de sus limitaciones.

La evidencia **no contiene** interpretación. Un EvidenceAtom dice lo que el documento
contiene, no lo que significa para el municipio.

La evidencia tiene procedencia: quién la produjo, cuándo, cómo, con qué limitaciones.
La procedencia no es un metadato opcional: es parte constitutiva de la evidencia.

Tipos de evidencia en COMPÁS NG: determinante, activo, indicador, hallazgo cualitativo,
cautela metodológica, participación ciudadana.

---

### II.2 Conocimiento

[RMD] El conocimiento es el conjunto de evidencias organizadas e interpretadas por
actores competentes de forma que permite comprender la situación y actuar sobre ella.

El conocimiento es **siempre situado**: es producido por alguien, en un contexto,
con un propósito y con las limitaciones propias de ese contexto.

El conocimiento territorial sobre la salud de un municipio no existe en ningún
documento individual. Emerge de la organización e interpretación del conjunto
de evidencias disponibles, proceso en el que intervienen tanto el sistema (MIT)
como el equipo técnico (que valida la interpretación).

---

### II.3 Interpretación

[REP, CONTRACT-INTERPRETATION] La interpretación es la operación de dar significado
a la evidencia en un contexto territorial específico.

La interpretación en COMPÁS NG:
- Organiza la evidencia por tipo semántico.
- Identifica tensiones entre fuentes.
- Señala áreas donde la evidencia sugiere posibilidades de intervención.
- No establece causalidad. No produce rankings. No prioriza.

La interpretación es **provisional y revisable**. Toda interpretación del sistema
lleva `requiresHumanValidation: true`. Sin validación técnica, ninguna interpretación
puede usarse como base de planificación.

---

### II.4 Contribución institucional

[DCA] Una contribución institucional es un aporte específico que una institución
realiza al proceso de planificación local en salud, basado en:

- Su **mandato** (qué está autorizada o requerida a hacer por ley, norma o acuerdo).
- Sus **competencias** (qué puede hacer en virtud de sus capacidades y recursos).
- Su **conocimiento** (qué sabe sobre el territorio en virtud de su práctica).

Una contribución institucional es cualitativamente distinta de una aportación de información.
La información es un dato. La contribución institucional es un aporte respaldado por
la autoridad y la responsabilidad de la institución que lo hace.

**Tipos de contribuciones institucionales** (desarrollados en Parte V):

| Tipo | Descripción |
|---|---|
| **Estructuralmente garantizada** | La institución está mandatada a realizar esta contribución independientemente de las decisiones del municipio |
| **Estratégica** | La institución ofrece un marco de referencia que orienta sin prescribir contenidos locales |
| **Deliberativa** | La institución participa en el proceso de toma de decisiones colectivas |
| **Propia del municipio** | Solo el municipio puede realizar esta contribución por su competencia exclusiva |

---

### II.5 Deliberación

[RMD, REP] La deliberación es el proceso por el que actores con conocimientos,
intereses y responsabilidades distintas alcanzan acuerdos sobre prioridades,
objetivos y actuaciones mediante el intercambio de argumentos.

La deliberación **no es negociación**: no se trata de llegar al mínimo común denominador
entre intereses opuestos. Es un proceso en el que los participantes pueden cambiar
de posición al escuchar los argumentos de otros, y en el que el resultado no estaba
determinado de antemano por la correlación de fuerzas.

[REP, CONTRACT-MIT-PSL] En COMPÁS NG, la deliberación produce el contenido de los
capítulos V, VI y VII del PSL. El sistema genera scaffolds orientativos; el equipo
técnico y el Grupo Motor deliberan y redactan el contenido definitivo.

La deliberación tiene condiciones de legitimidad:
- Todos los actores relevantes están representados (incluyendo los más vulnerables).
- Hay acceso equitativo a la información diagnóstica.
- Los resultados son transparentes y documentados.
- Las razones de los acuerdos y desacuerdos quedan registradas.

---

### II.6 Decisión

[RMD] La decisión es el acto formal mediante el cual un actor con autoridad institucional
adopta un compromiso con consecuencias reales sobre la realidad del municipio.

La decisión es **un acto, no un proceso**. El proceso es la deliberación; el acto es la decisión.
Una deliberación puede terminar en varias decisiones posibles; la decisión selecciona una.

La decisión en el PLS tiene varios niveles:
- La priorización (Grupo Motor, con participación ciudadana).
- La validación técnica del PSL (equipo técnico).
- La aprobación institucional del PLS (corporación municipal).

Ninguno de estos actos puede ser automatizado. [REP, ARCHITECTURE-CONSTITUTION Art. 5]

---

### II.7 Ejecución

[RMD] La ejecución es la implementación de las decisiones adoptadas mediante las
actuaciones planificadas.

La ejecución **cambia la realidad** que fue diagnosticada. Esta es su función y su
garantía: un plan que no produce cambios en el territorio no es un plan ejecutado.

La ejecución requiere:
- Responsables con autoridad real para actuar.
- Recursos suficientes para implementar las actuaciones.
- Un sistema de seguimiento que documente lo que se hace y cuándo.

La ejecución no produce evidencia automáticamente para COMPÁS NG. [RMD] El sistema
necesita ser diseñado para que los datos de seguimiento puedan retroalimentar el
EvidenceStore del siguiente ciclo. Este mecanismo está pendiente de diseño (Hueco H-8).

---

### II.8 Evaluación

[RMD] La evaluación es la valoración sistemática de si las actuaciones del plan han
producido los cambios esperados en los indicadores planificados y, más allá, en la
salud de la población.

La evaluación **no es seguimiento**. El seguimiento pregunta: ¿estamos haciendo lo
que planificamos? La evaluación pregunta: ¿está cambiando la salud gracias a lo que hacemos?

La evaluación requiere tiempo cero documentado. Sin él, no es posible medir cambio.
[RMD, PM-9 de METHODOLOGICAL-FOUNDATIONS]

---

### II.9 Las relaciones entre los ocho conceptos

```
Documentos fuente
    │ (extracción)
    ▼
[EVIDENCIA] ──────────────────────────────────────────────────┐
    │ (organización + lectura técnica)                        │
    ▼                                                         │
[CONOCIMIENTO territorial]                                    │
    │ (análisis territorial)                                  │
    ▼                                                         │
[INTERPRETACIÓN] (sistema + equipo técnico)                   │
    │                                                         │
    └──────────────────────────────────────────┐             │
                                               │             │
[CONTRIBUCIONES INSTITUCIONALES] ──────────────┼─────────────┤
    │ (marcos, capacidades garantizadas)       │             │
    │                                          ▼             │
    └─────────────────────────► [DELIBERACIÓN]               │
                                    │ (Grupo Motor)           │
                                    ▼                         │
                               [DECISIÓN]                     │
                                    │ (prioridades, PLS)      │
                                    ▼                         │
                               [EJECUCIÓN]                    │
                                    │ (actuaciones)           │
                                    ▼                         │
                               [EVALUACIÓN] ──────────────────┘
                                    │ (evidencia longitudinal)
                                    ▼
                            [NUEVO CICLO]
```

La línea punteada que va de la Evaluación de vuelta a la Evidencia es el **ciclo longitudinal**:
la evaluación genera evidencia del cambio (o la ausencia de cambio) que enriquece
el diagnóstico del siguiente ciclo.

---

## Parte III — Instituciones como actores

### III.1 Principio de modelado

[DCA] En este documento, las instituciones no se modelan como productores de documentos.
Se modelan como actores con competencias, capacidades y responsabilidades que hacen
contribuciones específicas al proceso de planificación local en salud.

Esta distinción es metodológicamente fundamental. Una institución que "aporta documentos"
puede ser sustituida por un archivo. Una institución que "aporta capacidades" es
irreemplazable: sus capacidades residen en sus profesionales, sus sistemas, sus redes
y su autoridad institucional.

---

### III.2 Sistema Sanitario Público de Andalucía (SSPA)

**Competencias formales:** prestación de servicios sanitarios de atención primaria y
comunitaria en el ámbito geográfico del Distrito; epidemiología y vigilancia de salud
pública; formación de profesionales; coordinación con otros sistemas (educación,
servicios sociales, sistema de dependencia).

**Responsabilidades en la planificación local:**
- Aportación del conocimiento epidemiológico del territorio.
- Coordinación técnica del proceso de diagnóstico.
- Ejecución de las actuaciones sanitarias comprometidas en el plan.
- Seguimiento de los indicadores de salud.
- Articulación entre el Plan Operativo ESCA y el PLS municipal.

**Procesos propios relevantes para el PLS:**
[REP, ESCA Plan Operativo]
- Elaboración del Informe Territorial de Salud Comunitaria (base del diagnóstico ESCA).
- Constitución y funcionamiento de la Comisión Territorial.
- Diagnóstico de salud comunitaria por Unidad de Gestión Clínica (UGC).
- Actualización anual del mapa de activos por UGC.
- Actividades grupales de educación para la salud.
- Coordinación con centros educativos y entorno comunitario.
- Seguimiento anual del Plan Operativo y evaluación final.

**Productos del SSPA relevantes para el PLS:**
- Informe de Salud del Distrito o del área (fuente primaria del diagnóstico).
- Plan Operativo Territorial ESCA (compromiso del SSPA para 2027-2028 y 2029-2030).
- Mapa de activos comunitarios actualizado.
- Datos de los registros de salud pública y de atención primaria.

**Capacidad de decisión sobre el PLS:**
Alta en materia de actuaciones sanitarias propias. Sin poder formal de aprobación del PLS
(la aprobación corresponde al municipio). Capacidad de co-validación técnica.

**Papel específico dentro del PLS:**
El SSPA es simultáneamente un **proveedor de conocimiento** (diagnóstico), un **ejecutor
de actuaciones** (comprometidas en el Plan Operativo ESCA) y un **co-articulador del
proceso** (el Grupo Motor requiere su participación técnica). No es el propietario del PLS.

---

### III.3 Ayuntamiento

**Competencias formales:** gobierno local; urbanismo y medio ambiente urbano; servicios
sociales básicos; equipamientos municipales; participación ciudadana; educación infantil;
transporte; vivienda; empleo local; mercados y actividades económicas.

**Responsabilidades en la planificación local:**
- Propietario y principal responsable del PLS.
- Impulsor del proceso de planificación.
- Movilizador de recursos municipales.
- Aprobador formal del PLS (a través de la corporación municipal).
- Primer garante del cumplimiento de los compromisos municipales.

**Procesos propios relevantes para el PLS:**
- Presupuesto municipal y su vinculación a las actuaciones del plan.
- Convocatoria y secretaría del Grupo Motor.
- Proceso de participación ciudadana (consultas, mesas, asambleas).
- Coordinación con los servicios municipales implicados en el plan.
- Rendición de cuentas ante la corporación municipal sobre el cumplimiento.

**Capacidad de decisión sobre el PLS:**
Máxima. El Pleno o la Junta de Gobierno Municipal es el órgano formal de aprobación del PLS.
Las decisiones sobre compromisos municipales, asignación de recursos y responsabilidades
corresponden al Ayuntamiento.

**Papel específico dentro del PLS:**
El Ayuntamiento es el **propietario institucional del PLS**. Sin la aprobación municipal,
el PLS no es un documento institucional: es un borrador técnico.

---

### III.4 Servicios Sociales

**Competencias formales:** atención social básica; prevención de la exclusión social;
atención a personas en situación de vulnerabilidad; sistema de dependencia; atención
a infancia y familia; atención a personas mayores.

**Responsabilidades en la planificación local:**
- Identificación de necesidades en grupos vulnerables (no visibles en los datos epidemiológicos estándar).
- Aportación de la perspectiva de la desigualdad y la vulnerabilidad al diagnóstico.
- Co-ejecución de actuaciones intersectoriales para grupos en riesgo.

**Capacidad de decisión sobre el PLS:**
Limitada. Los Servicios Sociales ejecutan sus propios programas en coordinación con el plan.
La integración requiere acuerdo entre concejalías.

**Papel específico dentro del PLS:**
Los Servicios Sociales son **actores de co-producción del diagnóstico** (para dimensiones
que la epidemiología formal no captura) y **co-ejecutores** de actuaciones dirigidas
a grupos en situación de vulnerabilidad.

---

### III.5 Educación

**Competencias formales:** educación formal en centros públicos; educación para la salud
en el currículo escolar; coordinación con familias; orientación académica y profesional.

**Responsabilidades en la planificación local:**
- Acceso a la población infantojuvenil para intervenciones de salud.
- Coordinación en salud escolar (vacunaciones, programas de alimentación, prevención).
- Aportación del entorno educativo como espacio de intervención de salud comunitaria.

[REP, ESCA línea 2.4.1] La ESCA mandata que los equipos de Atención Primaria se coordinen
con los centros educativos. Esta coordinación es una contribución estructuralmente garantizada.

**Capacidad de decisión sobre el PLS:**
Ninguna formal. Los centros educativos pueden comprometerse a participar en actuaciones del plan;
no pueden adoptar compromisos del plan como propios.

**Papel específico dentro del PLS:**
Educación es un **entorno de intervención** y un **actor de co-producción de actuaciones**
para las prioridades de salud infantojuvenil.

---

### III.6 Asociaciones y tejido comunitario

**Competencias:** no hay mandato formal. Sus competencias son de facto: conocen el territorio
desde dentro; tienen acceso a grupos que las instituciones formales no alcanzan; tienen
credibilidad para movilizar la participación ciudadana.

**Responsabilidades en la planificación local:**
- Aportación del conocimiento experiencial del territorio.
- Representación de grupos que no tienen voz institucional.
- Co-ejecución de actuaciones comunitarias con y sin apoyo institucional.
- Movilización social en torno al plan.

**Capacidad de decisión sobre el PLS:**
Ninguna formal. Su influencia es a través de la deliberación en el Grupo Motor y de la
participación ciudadana.

**Papel específico dentro del PLS:**
Las asociaciones son **activos comunitarios en sí mismas** y **mediadores epistemológicos**
entre el conocimiento técnico y el conocimiento vivencial del territorio.

---

### III.7 Ciudadanía

**Naturaleza:** no es una institución. Es el sujeto último del PLS y una fuente
epistémica primaria.

[RMD] La ciudadanía no "aporta información" al plan: aporta **conocimiento vivencial**
sobre el territorio que ninguna institución puede obtener por otros medios.

**Contribución al PLS:**
- Identificación de necesidades percibidas y expresadas.
- Selección participativa de prioridades.
- Validación comunitaria del diagnóstico técnico.
- Legitimidad democrática del plan.

**Capacidad de decisión sobre el PLS:**
En los modelos participativos de mayor intensidad, la ciudadanía co-decide las prioridades
mediante procesos deliberativos. En los modelos más básicos, su contribución se registra
como dato de preferencia que el Grupo Motor considera. [RMD]

**Papel específico dentro del PLS:**
La ciudadanía es simultáneamente **fuente epistémica** (lo que sabe sobre el territorio)
y **fuente de legitimidad** (su reconocimiento en el plan determina si el plan es suyo).

---

### III.8 Grupo Motor

**Naturaleza:** [RMD] El Grupo Motor no es una institución. Es el espacio de articulación
institucional: el lugar donde las contribuciones de las distintas instituciones se
encuentran y se integran en un proceso colectivo.

**Composición típica:**
- Representante del Distrito Sanitario (coordinación técnica SSPA-ESCA).
- Representante del Ayuntamiento (autoridad municipal y recursos).
- Representante de Servicios Sociales.
- Representante del ámbito educativo.
- Representantes de asociaciones y tejido comunitario.
- En municipios de mayor complejidad: empleo, medio ambiente, urbanismo.

**Competencias del Grupo Motor:**
El Grupo Motor no tiene competencias propias: tiene las competencias delegadas por sus
miembros para el proceso de planificación. Ninguna decisión del Grupo Motor puede
superar las competencias de las instituciones que lo componen.

**Función en la articulación:**
El Grupo Motor es el **órgano de articulación** en el sentido técnico del término:
no decide en lugar de las instituciones sino que crea el espacio donde las contribuciones
de cada institución se transforman en un plan colectivo.

---

## Parte IV — Capacidades institucionales

### IV.1 La distinción fundamental

[DCA] Las instituciones no aportan solo documentos ni solo estrategias. Aportan
**capacidades**: la combinación de mandato, recursos, conocimiento y autoridad que
les permite hacer cosas que otras instituciones no pueden hacer.

Distinguir entre:

| Concepto | Descripción | Ejemplo |
|---|---|---|
| **Capacidad institucional** | Lo que la institución puede hacer por virtud de su mandato, sus recursos y su posición | El SSPA puede realizar diagnósticos epidemiológicos en el territorio |
| **Contribución metodológica** | El marco conceptual o metodológico que la institución aporta para orientar la acción | La ESCA aporta la metodología del diagnóstico comunitario y el mapa de activos |
| **Actuación** | La acción concreta que la institución realiza en el territorio | El equipo de AP realiza actividades grupales de educación para la salud |

La misma institución puede aportar los tres: la ESCA proporciona a la vez la metodología,
la capacidad implementada y las actuaciones concretas.

### IV.2 Capacidades institucionales del SSPA derivadas de la ESCA

[REP, ESCA Plan Operativo] El Plan Operativo Territorial de la ESCA materializa capacidades
institucionales concretas del SSPA en los municipios RELAS. Estas capacidades no son
aspiraciones o posibilidades: son mandatos operativos con indicadores, metas y fechas.

#### Capacidad de gobernanza

La ESCA establece la Comisión Territorial como órgano consultivo del Distrito. La Comisión:
- Tiene representación de todos los perfiles profesionales de Atención Primaria y Comunitaria.
- Aporta la perspectiva técnica al diagnóstico inicial.
- Participa en la formulación de actuaciones concretas.
- Se reúne con convocatoria y actas documentadas.

[DCA] Para el proceso de planificación local, la Comisión Territorial es la **contraparte
institucional del Grupo Motor** en el ámbito del SSPA. El articulador no puede ignorar
la existencia de este órgano.

#### Capacidad de diagnóstico

La ESCA mandata [REP, ESCA línea 2.1.1]:
"Realizar un estudio de necesidades de salud comunitaria por UGC que incluya:
información sobre las estructuras de participación comunitaria, grupos en situación
de vulnerabilidad, actores y recursos con la participación de los agentes locales
(en coordinación con los Planes Locales de Salud en aquellos municipios adheridos a RELAS)."

Esta capacidad de diagnóstico comunitario está garantizada estructuralmente.
El SSPA se compromete a producir este diagnóstico para cada UGC.
[DCA] Para COMPÁS NG, el resultado de este diagnóstico es un insumo del EvidenceStore
del municipio correspondiente.

#### Capacidad de mapeo de activos

La ESCA mandata [REP, ESCA línea 2.1.2]:
"Actualizar anualmente el mapa de activos para la salud de cada UGC."

Esta capacidad de mapeo de activos está garantizada estructuralmente y es anual.
[DCA] El mapa de activos de la UGC es una fuente de átomos de tipo `asset`
para el EvidenceStore del municipio.

#### Capacidad de intervención grupal

La ESCA mandata [REP, ESCA líneas 2.3.x]:
- Planificación anual de actividades grupales de educación para la salud con enfoque
  de determinantes sociales.
- Realización de al menos 2 actividades grupales por UGC al año.
- Sesiones clínicas sobre actividades grupales y recursos comunitarios.

Esta capacidad de intervención grupal es estructuralmente garantizada.
[DCA] Para el PLS, esto significa que hay actuaciones que el SSPA ya ejecutará
independientemente de lo que el municipio decida. El PLS no necesita crearlas;
puede articularse con ellas.

#### Capacidad de coordinación intersectorial

La ESCA mandata [REP, ESCA líneas 2.4.x]:
- Coordinación con centros educativos.
- Participación en redes y mesas intersectoriales existentes.
- Refuerzo de las comisiones de participación ciudadana.

Esta capacidad de coordinación es parcialmente garantizada: el mandato existe,
pero la calidad y la intensidad de la coordinación dependen de la respuesta
de las otras instituciones y de los recursos locales disponibles.

#### Capacidad de seguimiento y evaluación

La ESCA establece [REP, ESCA Plan Operativo]:
- Seguimiento anual del Plan Operativo Territorial (tercer trimestre del año 1).
- Evaluación final del Plan Operativo (último trimestre del año 2).

Esta capacidad de seguimiento y evaluación es estructuralmente garantizada para
las actuaciones del SSPA. No es automáticamente extensible a las actuaciones
del municipio, pero provee el marco metodológico (indicadores con definición
operativa, tiempo cero, meta) que puede adoptarse en el PLS.

#### Capacidad de formación y comunicación

La ESCA mandata [REP, ESCA líneas 3.x y 5.x]:
- Inclusión de la salud comunitaria en los planes de acogida de nuevos profesionales.
- Publicaciones en redes/medios locales sobre actividades sociosanitarias.
- Información a la ciudadanía sobre recursos de salud comunitaria.

Estas capacidades son estructuralmente garantizadas en su existencia; su impacto
depende de la calidad de la implementación local.

### IV.3 Capacidades institucionales del Ayuntamiento

Las capacidades del Ayuntamiento son de naturaleza diferente a las del SSPA.
No están definidas por un plan operativo autonómico; son inherentes a la posición
del municipio como gobierno local.

| Capacidad | Descripción |
|---|---|
| **Autoridad normativa local** | Ordenanzas, regulaciones, permisos que afectan al entorno de salud |
| **Control del espacio público** | Parques, equipamientos, infraestructuras urbanas |
| **Servicios de proximidad** | Atención domiciliaria, servicios sociales básicos, centros cívicos |
| **Movilización de recursos locales** | Presupuesto municipal, espacios, personal |
| **Convocatoria y legitimidad local** | Capacidad de convocar a los actores del territorio con autoridad democrática |
| **Aprobación institucional** | Única institución con autoridad para adoptar formalmente el PLS |

---

## Parte V — Contribuciones institucionales al Plan Local de Salud

### V.1 Contribuciones estructuralmente garantizadas

Son las contribuciones que existen antes de que comience el proceso de planificación,
que no requieren negociación y que el municipio puede incorporar al PLS sin crear
nuevos compromisos.

[REP, ESCA Plan Operativo] Las principales contribuciones estructuralmente garantizadas
proceden del SSPA a través de la ESCA:

| Contribución | Fuente | Qué aporta al PLS |
|---|---|---|
| Diagnóstico de salud comunitaria por UGC | ESCA línea 2.1.1 | Evidencia diagnóstica municipal actualizada |
| Mapa de activos comunitarios (anual) | ESCA línea 2.1.2 | Inventario de activos para el EvidenceStore |
| Actividades grupales de EpS | ESCA líneas 2.3.x | Actuaciones ya garantizadas que el PLS puede referenciar |
| Coordinación intersectorial | ESCA líneas 2.4.x | Marco de coordinación con educación y entorno |
| Seguimiento con indicadores | ESCA Plan Operativo | Metodología de seguimiento trasladable al PLS |
| Comisión Territorial | ESCA estructura de gobernanza | Órgano técnico que puede articularse con el Grupo Motor |

[DCA] Para COMPÁS NG: cuando el MTE genera un borrador de Plan de Acción, debe distinguir
las actuaciones que ya están garantizadas estructuralmente por la ESCA de las que
requieren un nuevo compromiso municipal. Esta distinción no está implementada todavía
y constituye una laguna arquitectónica relevante.

### V.2 Contribuciones estratégicas

Son las contribuciones de los marcos institucionales que orientan sin prescribir
contenidos locales específicos.

[BM] Los marcos estratégicos proporcionan:
- Líneas de acción temáticas (EPVSA LE1-LE4).
- Metodologías recomendadas (RELAS-G).
- Enfoques prioritarios para grupos específicos (EBE para mayores; PSMA para salud mental).
- Indicadores tipo y estándares de evaluación (ESCA para las actuaciones del SSPA).

La diferencia con las contribuciones garantizadas: estas orientan pero no crean
capacidad local nueva. Un municipio que adopta la línea LE2 de EPVSA no tiene
automáticamente más recursos para actuar sobre estilos de vida; tiene un marco
que da sentido institucional a esa actuación si decide realizarla.

### V.3 Contribuciones deliberativas

Son las contribuciones que solo pueden producirse a través del proceso de deliberación
del Grupo Motor y de la ciudadanía.

No existe ninguna institución que pueda aportar estas contribuciones de forma unilateral:

| Contribución deliberativa | Quién la produce |
|---|---|
| Prioridades de salud del municipio | Grupo Motor + ciudadanía |
| Distribución de responsabilidades entre actores | Grupo Motor |
| Compromisos de recursos por institución | Cada institución en el Grupo Motor |
| Validación técnica del PSL | Equipo técnico del SSPA + municipio |
| Consenso comunitario sobre el plan | Proceso participativo |

Estas contribuciones no pueden ser automatizadas ni generadas por el sistema.
[REP, ARCHITECTURE-CONSTITUTION Art. 5, REP CONTRACT-MIT-PSL invariante I-PSL-4]

### V.4 Contribuciones propias del municipio

Son las contribuciones que solo el municipio puede hacer por su condición de gobierno local:

- La aprobación formal del PLS por la corporación municipal.
- Los compromisos de presupuesto municipal.
- El ejercicio de competencias urbanísticas, de espacios públicos y de servicios municipales.
- La representación democrática de la comunidad en el proceso.

---

## Parte VI — Articulación institucional

### VI.1 Definición formal

[DCA] Articular institucionalmente significa crear las condiciones para que contribuciones
procedentes de actores con mandatos, vocabularios y sistemas de rendición de cuentas
distintos se combinen en un objeto colectivo —el Plan Local de Salud— que:

1. **Preserva la identidad de cada contribución.** Cada compromiso del PLS es atribuible
   a un actor específico con responsabilidad formal.

2. **Produce propiedades emergentes.** El PLS tiene coherencia y compromiso colectivo
   que ninguna contribución individual posee. La suma articulada es metodológicamente
   más que la suma de las partes.

3. **Mantiene la trazabilidad.** Cada compromiso del PLS puede rastrearse hasta su
   evidencia de origen y hasta el actor que lo asumió.

4. **Permite la descomposición.** El PLS puede ser analizado, revisado y evaluado
   en términos de las contribuciones de cada actor.

### VI.2 Articulación frente a otros conceptos

La precisión terminológica no es pedantería: cada término supone un modelo distinto
con consecuencias reales sobre cómo se diseña el sistema.

#### Articular frente a integrar

[RMD] La integración implica que las contribuciones individuales se disuelven en un
todo unificado. Un sistema integrado no permite distinguir, después, qué parte
proviene de qué actor.

Un PLS integrado sería un documento donde no se puede distinguir qué compromisos
son del SSPA, cuáles del Ayuntamiento, cuáles de las asociaciones. Esto hace
imposible el seguimiento y la evaluación: si nadie es responsable de algo específico,
nadie rinde cuentas.

La articulación preserva la distinción: el PLS es un documento que puede descomponerse
en compromisos atribuibles a actores específicos.

#### Articular frente a coordinar

[RMD] La coordinación presupone un coordinador que alinea las acciones de otros.
Es un modelo jerárquico: alguien coordina, los demás son coordinados.

En la planificación local en salud, no hay una institución con autoridad suficiente
para coordinar a todas las demás. El Ayuntamiento tiene autoridad democrática local
pero no puede mandar al SSPA. El SSPA tiene competencias sanitarias pero no puede
imponer compromisos al Ayuntamiento.

La articulación es horizontal: los actores se articulan entre sí en un proceso
deliberativo donde ninguno tiene autoridad sobre los demás, pero todos reconocen
el objeto colectivo que están co-produciendo.

#### Articular frente a agregar

[RMD] La agregación es mecánica: se suman elementos del mismo tipo para obtener
una cantidad mayor. Agregar los planes de actuación del SSPA y del Ayuntamiento
produce una lista más larga; no produce un plan local articulado.

La articulación es generativa: el proceso de deliberación y de co-producción crea
relaciones entre las contribuciones que no existían antes. Una actuación municipal
en entornos deportivos urbanos y una actuación del SSPA en promoción de actividad
física no son la misma actuación sumada dos veces: articuladas, se refuerzan
mutuamente y producen un efecto que ninguna sola podría alcanzar.

#### Articular frente a compilar

[RMD] La compilación es técnica: ensambla elementos ya producidos en un formato estructurado.
Un compilador no decide qué hay en el documento; lo formatea.

La articulación es deliberativa: el proceso de articulación produce contenido nuevo
(las prioridades, los objetivos, los compromisos) que no existía en ninguna de las
contribuciones individuales.

COMPÁS NG incluye compiladores (para el PSL-C, para el PLS): son herramientas de
exportación documental. La articulación es el proceso previo, humano, que los compiladores
formalizan en documentos.

### VI.3 Las condiciones de posibilidad de la articulación

[RMD] Para que la articulación institucional sea posible, deben existir:

1. **Un objeto colectivo compartido.** Las instituciones se articulan en torno a algo.
   En COMPÁS NG, el PLS es el objeto colectivo. Sin un objeto claro, la articulación
   no tiene punto de convergencia.

2. **Un diagnóstico compartido.** Las instituciones no pueden articular sus contribuciones
   si parten de lecturas distintas de la misma realidad. El PSL es el diagnóstico
   compartido: todas las instituciones del Grupo Motor trabajan sobre el mismo objeto.

3. **Un proceso de deliberación con reglas explícitas.** La articulación requiere
   un proceso en el que los actores pueden expresar sus posiciones, escuchar las de
   otros y modificarlas. El Grupo Motor es ese proceso.

4. **Un mecanismo de trazabilidad.** Sin trazabilidad, la articulación no es verificable.
   COMPÁS NG proporciona la cadena desde la evidencia hasta el compromiso del PLS.

5. **Una asimetría asumida y gestionada.** Las instituciones no aportan lo mismo
   ni tienen el mismo poder. La articulación no requiere simetría: requiere que la
   asimetría sea visible y gestionada de forma que no imposibilite la co-producción.

### VI.4 COMPÁS NG como infraestructura de articulación

[DCA] Entendido como infraestructura de articulación, COMPÁS NG tiene cuatro funciones:

**Primera: producir el diagnóstico compartido.**
El EvidenceStore y el PSL son el objeto sobre el que las instituciones del Grupo Motor
convergen. Sin un diagnóstico compartido y riguroso, cada institución parte de su
propia lectura del territorio y la articulación es imposible.

**Segunda: estructurar el proceso de co-producción.**
Los capítulos V, VI y VII del PSL son los espacios donde la deliberación produce
contenido. La estructura del borrador técnico (generado por el MIT) proporciona
el andamiaje desde el que el Grupo Motor trabaja.

**Tercera: registrar y trazar las contribuciones.**
Cada elemento del Plan de Acción es atribuible a un actor específico. La cadena
de trazabilidad garantiza que la articulación es verificable.

**Cuarta: formalizar en documentos los acuerdos.**
Los compiladores (LocalHealthProfileCompiler, LocalHealthPlanCompiler) transforman
los acuerdos del Grupo Motor en documentos institucionales exportables.

---

## Parte VII — Productos institucionales desde el modelo de articulación

### VII.1 Principio de producción

Cada producto institucional de COMPÁS NG consume conocimiento de niveles anteriores,
produce conocimiento de un nivel superior y excluye conocimiento que todavía no puede
estar presente en ese nivel.

### VII.2 EvidenceStore

**Conocimiento que produce:**
- Representación estructurada de la realidad de salud del municipio.
- Mapa de activos comunitarios.
- Perspectiva ciudadana sobre el territorio.
- Cautelas metodológicas sobre la calidad de las fuentes.

**Conocimiento que consume:**
- Documentos primarios (Informe de Salud, estudios complementarios, activos, priorización temática).

**Conocimiento que nunca debe contener:**
- Interpretación de qué significa la evidencia.
- Prioridades (qué es más importante).
- Actuaciones (qué debe hacerse).
- Compromisos institucionales de ningún tipo.

---

### VII.3 Perfil de Salud Local (PSL-C)

**Conocimiento que produce:**
- Lectura territorial integrada (capítulos I-IV, sistema).
- Conclusiones del equipo técnico sobre el estado de salud (capítulo V, humano).
- Recomendaciones del equipo técnico (capítulo VI, humano).
- Candidaturas técnicas de priorización + priorización participativa + deliberación documentada (capítulo VII, humano + proceso).

**Conocimiento que consume:**
- EvidenceStore saneado.
- Output del MIT y la Reconciliación.
- Marcos institucionales de referencia (para el Marco Estratégico, Cap. I).

**Conocimiento que nunca debe contener:**
- Compromisos de actuación del municipio o del SSPA.
- Asignación de responsabilidades.
- Plazos de implementación.
- Indicadores con tiempo cero y meta.
- Nada que sea propio del Plan de Acción o del PLS.

---

### VII.4 Plan de Acción

**Conocimiento que produce:**
- Borrador de compromisos técnicamente fundamentados (sistema).
- Compromisos validados por el Grupo Motor (humano).
- Articulación entre contribuciones institucionales y compromisos del municipio.

**Conocimiento que consume:**
- PSL validado (única fuente autorizada del Nivel 3, PSL-C1).
- Priorizaciones validadas por el Grupo Motor.
- Output del MTE (correspondencias con marcos y capacidades institucionales).

**Conocimiento que nunca debe contener:**
- Evidencia directa del EvidenceStore (solo a través del PSL).
- Interpretaciones territoriales sin validar.
- Compromisos no atribuibles a ningún actor específico.
- Actuaciones sin indicador, sin responsable o sin cronograma.

---

### VII.5 Plan Local de Salud

**Conocimiento que produce:**
- Compromiso institucional formal del municipio.
- Articulación formal de todas las contribuciones institucionales.
- Marco de gobernanza, seguimiento y evaluación.
- Legitimidad democrática del proceso.

**Conocimiento que consume:**
- PSL-C compilado (versión resumida como capítulo diagnóstico).
- Plan de Acción validado.
- Resultados del proceso participativo.
- Compromisos formales de cada actor institucional del Grupo Motor.
- Recursos asignados por cada institución.

**Conocimiento que nunca debe contener:**
- Diagnóstico duplicado (el PSL-C es el diagnóstico; no se reproduce en el PLS).
- Compromisos sin responsable institucional identificable.
- Actuaciones que el sistema puede generar automáticamente pero que requieren validación.
- Proyecciones de impacto que el sistema no puede garantizar.

---

### VII.6 Biblioteca Metodológica y Cuestionario Municipal

**Conocimiento que produce la Biblioteca Metodológica:**
- Definición canónica de los instrumentos de medición (IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE, futuros).
- La fuente única de verdad para ítems, dimensiones, algoritmos e interpretación.

**Conocimiento que produce el Cuestionario Municipal:**
- La composición metodológica de un instrumento de medición específico para un municipio.
- La base para generar el Diccionario REDCap.

**Conocimiento que nunca debe contener el Cuestionario Municipal:**
- Prioridades del municipio.
- Compromisos de planificación.
- Resultados de la medición (eso es evidencia, una vez administrado).

**Conocimiento que produce el Diccionario REDCap:**
- La configuración técnica del proyecto REDCap (variables, tipos, lógica, cálculos).
- Con el nivel COMPÁS: también la presentación institucional del cuestionario.

**Conocimiento que nunca debe contener el Diccionario REDCap:**
- Decisiones metodológicas no contenidas en la Biblioteca.
- Análisis de los datos (eso ocurre después de la administración).

---

## Parte VIII — Consecuencias para el Motor de Traducción Estratégica

### VIII.1 El modelo actual y sus límites

El Motor de Traducción Estratégica (MTE) tal como está conceptualizado actualmente
[REP, CONTRACT-STRATEGIC-TRANSLATION] transforma:
- Prioridades del PSL → Correspondencias con líneas EPVSA/ESCA → Propuestas de Plan de Acción.

Este es un modelo de **traducción de referencias estratégicas**: el MTE busca en los
marcos institucionales las líneas que corresponden a las prioridades locales.

Este modelo es válido pero incompleto. Su limitación principal: trata todas las referencias
estratégicas como equivalentes (orientaciones de igual naturaleza) cuando en realidad son
de naturaleza radicalmente distinta.

### VIII.2 La distinción que el MTE no puede ignorar

[DCA] Un MTE que no distingue entre "la EPVSA recomienda actuar sobre estilos de vida"
(referencia estratégica) y "la ESCA garantiza que el SSPA realizará actividades grupales
de EpS en el municipio" (capacidad institucional estructuralmente garantizada) produce
propuestas que:

- Pueden duplicar actuaciones ya comprometidas por el SSPA.
- Pueden ignorar capacidades ya disponibles que el municipio podría articular.
- No permiten que el Grupo Motor distinga qué es nuevo de qué ya existe.

Esto no es un problema técnico: es un problema metodológico. Si el Plan de Acción que
el MTE propone no distingue entre "lo que el SSPA ya hará" y "lo que el municipio
necesita crear", el Grupo Motor no puede deliberar eficazmente.

### VIII.3 Qué significa traducir institucionalmente

[DCA] Traducir institucionalmente no es buscar la línea estratégica que mejor corresponde
a una prioridad. Es identificar:

1. **Qué capacidades institucionales ya existen** para abordar esta prioridad
   (estructuralmente garantizadas).

2. **Qué orientaciones estratégicas respaldan** la actuación en esta prioridad
   (referencias de los marcos).

3. **Qué vacío existe** entre las capacidades garantizadas y las necesidades identificadas
   (lo que requiere compromiso nuevo del municipio o negociación intersectorial).

4. **Qué actores tienen capacidad para cerrar ese vacío** (identificación de la institución
   apropiada para cada tipo de actuación).

Este es el modelo completo de traducción institucional. El actual MTE solo realiza el
paso 2 (orientaciones estratégicas).

### VIII.4 Qué significa articular institucionalmente en el MTE

[DCA] El MTE articular no solo traduce prioridades a líneas estratégicas.
Articula contribuciones:

- Señala qué ya aportará el SSPA (estructuralmente garantizado).
- Señala qué puede añadir el Ayuntamiento con sus competencias propias.
- Señala qué requiere negociación intersectorial en el Grupo Motor.
- Señala qué no tiene cobertura en ninguna institución disponible (vacío de capacidad).

Este modelo produce un borrador de Plan de Acción cualitativamente más útil: no una lista
de objetivos traducidos de marcos institucionales, sino un mapa de la articulación
posible entre las contribuciones disponibles.

### VIII.5 Debe el MTE limitarse a recomendar objetivos

[DCA] No. El MTE actual (conceptualizado como EPVSATranslator) recomienda líneas
estratégicas y sugiere actuaciones tipo.

Análisis crítico:

**Lo que hace bien el modelo actual:**
- Produce correspondencias entre prioridades y marcos.
- Genera propuestas estructuradas.
- Mantiene `requiresHumanValidation: true`.

**Lo que le falta:**
- No distingue entre referencias estratégicas y capacidades garantizadas.
- No identifica qué actores institucionales son los apropiados para cada tipo de actuación.
- No señala los vacíos de capacidad (prioridades sin actor que las pueda abordar).
- Solo consulta los marcos; no consulta las capacidades reales del territorio.

**Conclusión:** el MTE debe evolucionar desde un "motor de traducción de referencias"
hacia un "motor de articulación de contribuciones institucionales". Este es un cambio
conceptual con consecuencias para el diseño del StrategicRepository y del modelo
de datos de los recursos estratégicos.

---

## Parte IX — Consecuencias arquitectónicas

### IX.1 Sobre el concepto de Repositorio Estratégico

[REP, CONTRACT-STRATEGIC-REPOSITORY] El Repositorio Estratégico Territorial está
definido como colección de recursos normativos, estratégicos y programáticos:
EPVSA, ESCA, RELAS, EBE, PSMA, PEM.

[DCA] Tras el análisis del modelo de articulación, esta definición es correcta pero
insuficiente.

Los recursos estratégicos actuales describen **qué dice el marco** (sus líneas,
objetivos, indicadores, actuaciones tipo). No describen **qué puede hacer
el SSPA en este municipio específico** (sus capacidades garantizadas en este territorio).

### IX.2 El problema del StrategicRepository como repositorio de referencias

[DCA] Si el StrategicRepository almacena únicamente referencias estratégicas (lo que los
marcos dicen), el MTE solo puede proponer actuaciones que estén en esos marcos.
No puede distinguir:
- Qué actuaciones del marco ya están siendo realizadas por el SSPA en este municipio.
- Qué actuaciones del marco son posibles pero requieren negociación.
- Qué prioridades locales no tienen respaldo en ningún marco (y por tanto requieren
  justificación local autónoma).

### IX.3 Propuesta de ampliación del modelo de datos

[DCA] Sin proponer un renombre del contrato (la decisión sobre el nombre corresponde
al responsable del proyecto), se propone ampliar el modelo de datos del `StrategicResource`
con una dimensión adicional: las **capacidades institucionales garantizadas**.

Un recurso estratégico de tipo ESCA no es solo:
- "15 líneas estratégicas" (referencias).

Es también:
- "Diagnóstico comunitario por UGC: garantizado estructuralmente para municipios RELAS."
- "Mapa de activos: garantizado anual."
- "Actividades grupales: al menos 2 por UGC y año."

Esta información transforma el StrategicRepository de un repositorio de referencias
en un repositorio de contribuciones institucionales con capacidad diferenciada.

### IX.4 Contratos que deben modificarse o ampliarse

| Contrato | Tipo de cambio necesario |
|---|---|
| `CONTRACT-STRATEGIC-REPOSITORY` | Ampliar el modelo de datos para incluir capacidades institucionales garantizadas, distinguiéndolas de las orientaciones estratégicas |
| `CONTRACT-STRATEGIC-TRANSLATION` | Ampliar las responsabilidades del MTE para incluir: (a) identificación de capacidades garantizadas, (b) identificación de vacíos de capacidad, (c) señalamiento de qué actores son apropiados para cada tipo de actuación |
| `CONTRACT-ACTION-PLAN` | El Plan de Acción debe distinguir entre actuaciones ya garantizadas por el SSPA (referenciadas desde el Plan Operativo ESCA) y actuaciones nuevas comprometidas por el municipio |
| `CONTRACT-MIT-PSL` | Sin cambios en el contrato; pero el PSL debe incluir en el Cap. VII información sobre qué actuaciones del Plan Operativo ESCA son relevantes para las prioridades seleccionadas |

### IX.5 El StrategicRepository: ¿reemplazar o ampliar?

[DCA] La opción de crear un `InstitutionalCapacityRepository` separado al
`StrategicRepository` es arquitectónicamente posible pero introduce complejidad
innecesaria. La distinción no justifica dos repositorios separados si el MTE
puede trabajar con un único repositorio que tenga una clasificación interna de
`resourceType`:

- `strategic-framework`: orientaciones; no garantizadas.
- `operational-plan`: capacidades garantizadas por el marco (como el Plan Operativo ESCA).
- `programmatic-guide`: metodologías recomendadas (como RELAS-G).

Esta clasificación existe parcialmente ya en CONTRACT-STRATEGIC-REPOSITORY
(`"strategy"`, `"strategic-plan"`, `"programmatic-guide"`, etc.). La ampliación
necesaria es añadir, para los recursos de tipo `operational-plan`, un campo
`guaranteedCapabilities: string[]` que liste las capacidades estructuralmente
garantizadas en los municipios RELAS.

[DCA] **Recomendación:** ampliar el modelo de datos del `StrategicResource`, no crear
un nuevo repositorio. La razón es la simplicidad (Art. 1 ARCHITECTURE-CONSTITUTION):
el mismo objeto puede albergar la información adicional con un campo nuevo,
evitando la proliferación de repositorios con tipos similares.

### IX.6 Lo que no debe cambiar

[DCA] El nombre `StrategicRepository` no debe cambiarse. Las denominaciones canónicas
fijadas en CONTRACT-STRATEGIC-REPOSITORY (ESCA, EPVSA, RELAS, EBE, PSMA, PEM, RELAS-G)
son invariantes. Los contratos vigentes (CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-MIT-PSL,
CONTRACT-EVIDENCE) no requieren modificación como consecuencia de este análisis.

---

## Nota final: el principio metodológico central de COMPÁS NG

[DCA] La articulación institucional es el principio metodológico central de COMPÁS NG.

No es la gestión de evidencia (aunque COMPÁS NG gestiona evidencia).
No es la generación de planes (aunque COMPÁS NG genera borradores de planes).
No es el análisis territorial (aunque el MIT realiza análisis territorial).

Es la creación de las condiciones metodológicas y técnicas para que actores
institucionales distintos —con mandatos, vocabularios, ciclos y sistemas de
rendición de cuentas propios— puedan co-producir un Plan Local de Salud con:

- **Evidencia compartida** como base epistémica común.
- **Diagnóstico compartido** como objeto de referencia colectivo.
- **Contribuciones atribuibles** a cada actor institucional.
- **Compromisos verificables** con indicadores, tiempo cero y responsables.
- **Trazabilidad completa** desde cada compromiso hasta la evidencia que lo justifica.
- **Ciclo cerrado** que genera evidencia longitudinal para el siguiente proceso.

Esta formalización es la que permite que COMPÁS NG sea reproducible: el modelo
de articulación puede aplicarse a cualquier municipio de Andalucía con las
adaptaciones propias de cada territorio, sin perder su coherencia metodológica.

---

---

## Anexo I — Hallazgos de la Continuidad Maestra (2026-06-28)

Los siguientes hallazgos amplían el modelo de articulación sin contradecir ninguno
de sus principios. Derivan de: la Continuidad Maestra (documento de orientación
del proyecto), la auditoría del COMPÁS histórico y la taxonomía de instrumentos
(`INSTRUMENT-TAXONOMY.md`).

### A.1 El Mapa de Activos Comunitarios es un objeto transversal

[DCA, Continuidad Maestra] El Mapa de Activos Comunitarios para la Salud no es
únicamente un apartado del diagnóstico. Es un objeto presente en todas las fases
del ciclo de planificación:

- **Diagnóstico:** los activos son evidencia (`EvidenceAtom` tipo `asset`).
- **Perfil:** los activos son parte del Cap. IV (interpretación territorial, categoría `assets`).
- **Propuesta:** el MTE debe identificar qué activos articulan con cada prioridad.
- **Planificación:** los activos son palancas de actuación del Plan de Acción.
- **Ejecución:** los activos pueden ser medios de implementación de actuaciones.
- **Seguimiento:** el mantenimiento y desarrollo de activos es un indicador de proceso.
- **Evaluación:** la generación de nuevos activos es un resultado posible del plan.

[DCA] Este carácter transversal tiene consecuencia para el modelo de datos:
el `EvidenceAtom` de tipo `asset` necesita un campo adicional que indique si el
activo es preexistente, si fue generado por el plan actual o si tiene doble naturaleza
(activo comunitario Y programa institucional garantizado).

### A.2 Los programas comunitarios pueden tener doble naturaleza

[HCA, datos reales de Zagra] El GRUSE de mujeres de Zagra (activo desde 2013) es
simultáneamente:
1. Un activo comunitario verificable (existe, genera valor salutogénico, tiene historia documentada).
2. Una actuación tipo garantizada por la ESCA (los grupos de salud comunitaria están mandatados en las líneas 2.3.x del Plan Operativo ESCA).

Esta doble naturaleza no puede representarse en el modelo actual sin ambigüedad.
La taxonomía de instrumentos (`INSTRUMENT-TAXONOMY.md §IV`) formaliza esta doble naturaleza
y propone cómo representarla sin colapsar ambas dimensiones.

### A.3 El alcance de la "Propuesta de Articulación Institucional" es más amplio

[DCA, Continuidad Maestra] La Propuesta de Articulación Institucional (output del MTE,
identificada en la auditoría de coherencia metodológica) debe articular no solo
referencias estratégicas y capacidades garantizadas, sino también:

- Activos comunitarios existentes relevantes para cada prioridad.
- Programas en activo en el municipio (que son simultáneamente activos y actuaciones tipo).
- Contribuciones metodológicas de los marcos (metodologías de intervención, no solo líneas).
- Indicadores disponibles vinculados a cada área de prioridad.

La Propuesta de Articulación es, por tanto, un objeto más complejo de lo identificado
inicialmente. Su diseño requiere que el StrategicRepository también almacene
actuaciones tipo e indicadores tipo, no solo líneas estratégicas y objetivos.

### A.4 El COMPÁS histórico como fuente de conocimiento del dominio

[HCA] La "capa de mejoramiento municipal" del COMPÁS histórico (auditada en
`AUDITORIA-MEJORAMIENTO-MUNICIPAL-R1.md`) era una línea de desarrollo nunca
implementada operativamente. Sus `consultasPlanificadas` (activos, asociaciones,
equipamientos, planes, tejido económico) nunca se ejecutaron; el sistema permanecía
en `fase_0_contrato` con `fuentesExternasConsultadas: false` de forma permanente.

[DCA] Este hallazgo tiene dos consecuencias:
1. El problema que intentaba resolver la capa de mejoramiento municipal (enriquecer el
   conocimiento territorial con información sobre activos y recursos existentes) es
   exactamente el problema que el Mapa de Activos Comunitarios resuelve en COMPÁS NG.
   No hay deuda oculta: COMPÁS NG ya resolvió este problema de forma diferente y más sólida.
2. Las cinco categorías de consulta planificadas del histórico son una guía indirecta
   de las tipologías de activos relevantes: activos comunitarios, asociaciones, equipamientos,
   planes locales, tejido económico. La taxonomía de activos de `INSTRUMENT-TAXONOMY.md §I.5`
   las incorpora con más rigor metodológico.

### A.5 Programas pendientes de auditoría específica

[DCA] Los programas ERACIS, Ciudades ante las Drogas, GRUSE (categorización general),
GRAFA y UAEF requieren auditoría documental específica (actuation 4 de la Continuidad Maestra)
antes de incorporarse al StrategicRepository. Hasta completar esa auditoría, no deben
incluirse como recursos garantizados en ningún contrato.

Su estado actual en el modelo: identificados en `INSTRUMENT-TAXONOMY.md §V` como
"pendientes de auditoría específica".

---

*Primera versión: 2026-06-28.*
*Anexo I añadido: 2026-06-28 (Continuidad Maestra).*
*Este documento es el marco metodológico de COMPÁS NG relativo a la articulación institucional.*
*No debe modificarse sin deliberación explícita del responsable del proyecto.*
*Complementa, sin duplicar, METHODOLOGICAL-FOUNDATIONS-LOCAL-HEALTH-PLANNING.md.*
