# COMPÁS NG — Fundamentos Metodológicos de la Planificación Local en Salud

> Documento fundacional del Sprint 2 y de toda la arquitectura documental futura.
> No es un contrato. No es un manual. Es el modelo metodológico del que derivan,
> sin contradicciones, todos los contratos documentales de COMPÁS NG.
>
> No contiene código. No contiene pseudocódigo. No contiene instrucciones de implementación.
> Responde únicamente a preguntas metodológicas.
>
> Fuentes: documentación del repositorio, benchmark institucional realizado,
> análisis ESCA Plan Operativo, literatura de salud pública comunitaria,
> auditoría del COMPÁS histórico, arquitectura consolidada de COMPÁS NG.
>
> Fecha de emisión: 2026-06-28

---

## Parte I — Naturaleza del Plan Local de Salud

### I.1 Qué es un Plan Local de Salud

Un Plan Local de Salud es el instrumento institucional mediante el cual una comunidad
local —el municipio, con sus actores técnicos, políticos y ciudadanos— formaliza
compromisos explícitos y verificables para mejorar la salud de su población
en un período definido.

Tres palabras condensan su naturaleza: **compromiso**, **explícito**, **verificable**.

- **Compromiso** porque no es un estudio, ni una declaración de intenciones, ni un
  análisis. Es un acto institucional que vincula a sus firmantes.
- **Explícito** porque cada objetivo, actuación, indicador y responsable están nombrados
  con suficiente precisión para poder evaluarse sin ambigüedad.
- **Verificable** porque el plan define desde su origen los criterios con los que
  juzgará su propio cumplimiento.

Un Plan Local de Salud que no puede evaluarse es una declaración, no un plan.

### I.2 Qué no es un Plan Local de Salud

| Lo que el PLS no es | Lo que sí es |
|---|---|
| Un diagnóstico epidemiológico | El PSL es el diagnóstico; el PLS lo referencia |
| Un documento del sistema sanitario | El PLS es del municipio; la ESCA es del SSPA |
| Una estrategia autonómica trasladada al municipio | El PLS es una respuesta local a un contexto local, articulada con marcos autonómicos |
| Una declaración de buenos propósitos | Un compromiso con indicadores, responsables y plazos |
| Un documento del equipo técnico | Un documento del municipio validado por el equipo técnico |
| Un informe de situación | El informe de situación precede al plan; no es el plan |
| Un catálogo de servicios sanitarios | Los servicios sanitarios son del SSPA; el PLS puede referenciarlos como activos |
| Un documento eterno | Tiene vigencia definida; expira y genera el siguiente ciclo |

### I.3 Las seis etapas de la planificación local en salud

La planificación local en salud atraviesa seis etapas que nunca pueden mezclarse
sin consecuencias metodológicas graves. Cada etapa tiene actores propios, productos
propios y transiciones formales hacia la siguiente.

#### Etapa 1 — Diagnóstico

**Qué es:** la recogida, organización y calidad de la información disponible sobre
el estado de salud del municipio.

**Producto:** el EvidenceStore y el repositorio documental territorial.

**Actor principal:** el sistema (COMPÁS NG), con supervisión técnica del equipo
de salud pública.

**Lo que puede aparecer:** datos, hechos, documentos, estudios. Lo que los documentos
dicen, no lo que significan.

**Lo que nunca puede aparecer todavía:** interpretación, prioridades, objetivos,
actuaciones, compromisos.

**Por qué no puede mezclarse con lo siguiente:** si el diagnóstico ya anticipa
prioridades, seleccionará e interpretará la evidencia en función de lo que ya
se ha decidido que importa. La evidencia contaminada no es diagnóstico; es justificación.

---

#### Etapa 2 — Perfil

**Qué es:** la síntesis interpretativa del diagnóstico. La lectura organizada,
trazable y revisable de lo que la evidencia disponible revela sobre el territorio.

**Producto:** el Perfil de Salud Local (PSL), en sus capítulos I-IV (generados por
el sistema) y V-VI (redactados por el equipo técnico).

**Actor principal:** el MIT y la Reconciliación (sistema) + el equipo técnico
(autoría de las conclusiones y recomendaciones).

**Lo que puede aparecer:** qué dice la evidencia, qué tensiones existen entre fuentes,
qué áreas emergen como candidatas de intervención, qué limitaciones metodológicas
tiene el análisis, qué ha dicho la ciudadanía en el proceso participativo.

**Lo que nunca puede aparecer todavía:** qué se va a hacer, quién lo hará, cuándo
y con qué recursos. El perfil describe; no prescribe.

**Por qué no puede mezclarse con lo siguiente:** si el perfil ya incorpora
decisiones de planificación, el diagnóstico queda subordinado al plan en lugar
de fundamentarlo. El equipo pierde la posibilidad de revisar el diagnóstico con
ojos frescos antes de planificar.

---

#### Etapa 3 — Planificación

**Qué es:** la decisión deliberada sobre qué hacer, cómo, cuándo, con qué
recursos y con qué criterios de evaluación.

**Producto:** el Plan de Acción (borrador técnico) → el Plan Local de Salud (documento
institucional aprobado).

**Actores:** el Grupo Motor (coordinación intersectorial), el equipo técnico
(propuesta y sistematización), la corporación municipal (aprobación formal).

**Lo que puede aparecer:** prioridades seleccionadas mediante deliberación
documentada, objetivos SMART, actuaciones con responsable y plazo, indicadores
con tiempo cero y meta.

**Lo que nunca puede aparecer todavía:** resultados de la ejecución (eso es
seguimiento), evaluación del impacto (eso es evaluación).

**Por qué no puede mezclarse con la ejecución:** si el plan se modifica continuamente
durante la ejecución sin registro formal, se pierde la capacidad de evaluar si lo
que se ejecutó coincidió con lo que se planeó.

---

#### Etapa 4 — Decisión política

**Qué es:** el acto institucional formal mediante el cual el órgano de gobierno
del municipio adopta el PLS como compromiso oficial.

**Producto:** el PLS aprobado por la corporación municipal. El PSL en estado
`approved`.

**Actor principal:** la corporación municipal (pleno, junta de gobierno). El equipo
técnico propone; la corporación decide.

**Lo que puede aparecer:** el texto del PLS aprobado, las posibles enmiendas de
la corporación, la fecha y el órgano que lo aprueba.

**Por qué es una etapa diferente:** la aprobación no es un trámite administrativo.
Es el momento en que los compromisos técnicos se convierten en compromisos
institucionales con consecuencias políticas y legales.

---

#### Etapa 5 — Ejecución

**Qué es:** la implementación de las actuaciones planificadas.

**Producto:** las actuaciones ejecutadas, los datos de seguimiento, los registros
de progreso.

**Actor principal:** los responsables asignados en el plan (servicios municipales,
equipos de atención primaria, entidades comunitarias).

**Lo que puede aparecer:** qué se ha hecho, cuándo, quién lo ha hecho, cuánto
ha costado. No todavía: si ha funcionado (eso es evaluación).

**Por qué no puede mezclarse con la evaluación:** si durante la ejecución ya se
emiten juicios sobre si está funcionando, se confunden el seguimiento de proceso
(¿estamos haciendo lo que planificamos?) con la evaluación de resultado (¿está
mejorando la salud?). Son preguntas distintas con métodos distintos.

---

#### Etapa 6 — Evaluación

**Qué es:** la valoración sistemática de si las actuaciones del plan han producido
los cambios esperados en los indicadores de resultado y, en última instancia, en
la salud de la población.

**Producto:** el Informe de Evaluación. La base del siguiente ciclo diagnóstico.

**Actor principal:** el equipo técnico de evaluación (puede incluir evaluadores
externos para garantizar independencia).

**Lo que puede aparecer:** comparación indicadores baseline → fin de período,
análisis de qué funcionó y qué no, recomendaciones para el siguiente ciclo.

**Por qué es la etapa más frecuentemente omitida:** la evaluación requiere
haber definido el tiempo cero y los indicadores antes de ejecutar. Si no se hizo,
la evaluación no es posible. Por eso es metodológicamente obligatorio definir
los indicadores en la etapa de planificación.

### I.4 La regla de la no-mezcla

La mezcla de etapas es el error metodológico más frecuente en la planificación local
de salud. Sus formas más comunes:

**Diagnóstico con sesgo de planificación:** los técnicos buscan evidencia de lo
que ya saben que va a priorizarse. El diagnóstico confirma, no descubre.

**Perfil que ya propone actuaciones:** el PSL incluye recomendaciones tan específicas
que el paso de planificación queda vacío. El equipo técnico ha tomado decisiones
que corresponden al Grupo Motor.

**Plan que es diagnóstico:** el PLS dedica el 80% de su espacio al análisis de
la situación y el 20% a los compromisos. El lector político no puede encontrar
qué se va a hacer.

**Ejecución sin plan aprobado:** se comienzan actuaciones antes de que el PLS
esté aprobado, lo que impide luego evaluarlas como compromisos del plan.

**Evaluación sin tiempo cero:** se evalúa el plan pero no se sabe el punto de partida,
porque no se documentó antes de ejecutar.

COMPÁS NG opera como sistema contra estas patologías. Su arquitectura de tres niveles
(evidencia → interpretación → decisión) y la secuencia de estados del PSL
(`generated → validated → approved`) son mecanismos técnicos de garantía de
la no-mezcla metodológica.

---

## Parte II — Gramática formal del Plan Local de Salud

Un Plan Local de Salud no es un texto libre. Es una composición de objetos metodológicos
con relaciones formales entre ellos. Un PLS que no puede descomponerse en estos
objetos tiene defectos metodológicos.

### II.1 Catálogo de objetos metodológicos

#### Necesidad de salud

Una necesidad de salud es la brecha entre el estado de salud observado en la población
y el estado que sería esperable según estándares normativos, comparativos o comunitarios.

**Tipología:**
- *Necesidad normativa:* definida por expertos según criterios técnicos (ej.: prevalencia de una enfermedad supera umbral establecido).
- *Necesidad comparativa:* el indicador del municipio es peor que el de territorios similares.
- *Necesidad sentida:* la población percibe una carencia de salud, aunque no sea objetivable en indicadores.
- *Necesidad expresada:* la población busca activamente recursos para una carencia.

**Propiedades mínimas:** dominio de salud, población afectada, magnitud, severidad, modificabilidad, dimensión de equidad.

**En COMPÁS NG:** las necesidades emergen del EvidenceStore como átomos tipo `determinant`, `indicator` y `qualitative-observation`. Su síntesis territorial está en el Cap. IV del PSL.

---

#### Activo comunitario

Un activo comunitario es cualquier recurso, capacidad o fortaleza del territorio
que puede movilizarse para mejorar la salud de la población.

**Tipología:**
- *Individual:* habilidades, conocimientos y valores de las personas.
- *Asociativo:* grupos, redes sociales, organizaciones informales.
- *Institucional:* servicios, equipamientos, organizaciones formales.
- *Económico:* empresas, recursos materiales, empleo.
- *Físico/ambiental:* espacios verdes, infraestructuras, entorno.

**Propiedades mínimas:** tipo, localización, accesibilidad, sostenibilidad, conexión con necesidades de salud.

**En COMPÁS NG:** los activos son átomos tipo `asset` en el EvidenceStore, generados por el parser de Activos Comunitarios. Tienen el mismo rango epistémico que los indicadores de déficit.

---

#### Prioridad de salud

Una prioridad de salud es una necesidad (o grupo de necesidades relacionadas)
seleccionada mediante un proceso deliberativo documentado para ser objeto de acción
planificada.

**Propiedad crítica:** la priorización es un acto humano y deliberativo. Nunca puede
ser completamente automática. El sistema puede ofrecer candidaturas técnicas; la
selección corresponde al Grupo Motor con participación ciudadana.

**Criterios habituales de priorización:**
- Magnitud (cuántas personas afecta).
- Severidad (qué tan grave es el daño a la salud).
- Modificabilidad (puede mejorarse con intervenciones disponibles).
- Inequidad (afecta desproporcionalmente a grupos vulnerables).
- Viabilidad local (el municipio tiene capacidad para actuar).
- Demanda ciudadana (la comunidad ha expresado esta prioridad).

**En COMPÁS NG:** el Cap. VII del PSL documenta las candidaturas técnicas y la priorización participativa. El Grupo Motor valida la priorización final.

---

#### Necesidad identificada pero no priorizada

Un objeto metodológico formal que documenta qué necesidades fueron identificadas en
el diagnóstico pero no seleccionadas para acción planificada, con justificación explícita.

**Por qué es obligatorio:** la transparencia sobre lo que no se aborda es parte de
la rendición de cuentas. Una necesidad que no aparece en el PLS puede ser ignorada
(defecto metodológico) o conscientemente diferida (decisión documentada).

**En COMPÁS NG:** campo del Plan de Acción pendiente de especificar como objeto formal.

---

#### Línea estratégica de referencia

Una línea estratégica de referencia es la articulación temática de un marco
institucional (EPVSA, ESCA, RELAS) que orienta qué tipo de acciones son
coherentes con la política autonómica o supramunicipal.

**No es una prioridad del PLS:** es el marco dentro del cual las prioridades locales
encuentran respaldo institucional y, a veces, recursos.

**Propiedades:** marco de origen, nivel (estratégico/operativo), actores responsables
al nivel del marco (no del municipio), acciones tipo del marco.

**En COMPÁS NG:** los marcos están en el `StrategicFrameworkRegistry` y, en el futuro,
en el `StrategicRepository`. El MTE busca correspondencias entre las prioridades
del PSL y las líneas de referencia disponibles.

---

#### Objetivo

Un objetivo es la formulación de un cambio deseable y verificable en la salud
o en sus determinantes, derivado de las prioridades seleccionadas.

**Tipología:**
- *Objetivo general:* orienta la dirección estratégica para una prioridad (un
  municipio puede tener 1-2 objetivos generales por prioridad).
- *Objetivo específico:* determina qué cambio concreto y medible se espera lograr
  en un período definido (2-5 objetivos específicos por objetivo general, como máximo).

**Propiedades obligatorias:** específico, medible, alcanzable, relevante, temporalizado (SMART).

**Dependencias:** un objetivo no puede existir sin una prioridad que lo origine.
Un objetivo sin indicador no es verificable. Un objetivo sin plazo no es un
compromiso: es una aspiración.

---

#### Actuación

Una actuación es la intervención concreta planificada para contribuir al logro
de un objetivo específico.

**Tipología por nivel de intervención:**
- *Individual:* dirigida a personas en sus conductas o habilidades.
- *Grupal:* educación para la salud, grupos de apoyo, talleres.
- *Comunitaria:* movilización de activos, redes, participación.
- *Ambiental:* modificación del entorno físico o social.
- *Política/normativa:* abogacía, regulación, decisiones municipales.

**Propiedades obligatorias:** descripción precisa, responsable, cronograma,
recursos estimados, población diana, evidencia que la justifica.

**Dependencias:** una actuación no puede existir sin un objetivo que la justifique.
Una actuación sin responsable no tiene accountability. Una actuación sin cronograma
es una intención.

---

#### Indicador

Un indicador es una medida que permite verificar el grado de cumplimiento de un
objetivo o el avance de una actuación.

**Tipología:**
- *De proceso:* mide si se están realizando las actuaciones planificadas
  (¿estamos haciendo lo que dijimos?).
- *De resultado:* mide si los objetivos intermedios se están alcanzando
  (¿están cambiando los determinantes?).
- *De impacto:* mide si la salud de la población está mejorando
  (¿está mejorando el indicador de salud final?).

**Propiedades obligatorias:**
- Definición operativa (exactamente qué se mide).
- Numerador y denominador.
- Fuente de datos.
- Frecuencia de medición.
- **Tiempo cero (baseline):** valor del indicador al inicio del plan, documentado
  antes de ejecutar. Sin tiempo cero, la evaluación final es imposible.
- Meta: valor esperado al final del período.

**Principio de responsabilidad del indicador:** cada indicador debe tener
una persona responsable de su medición. Sin responsable, el indicador
no se medirá.

---

#### Responsable

El responsable de una actuación o indicador es la persona con autoridad
y capacidad para asegurar su cumplimiento.

**Niveles de responsabilidad:**
- *Estratégico:* quien responde ante la corporación municipal del cumplimiento
  del plan (típicamente: concejalía de salud o alcaldía).
- *Operativo:* quien ejecuta la actuación concreta (servicios municipales,
  equipo de atención primaria, entidad comunitaria).
- *De seguimiento:* quien mide los indicadores y reporta el progreso.

**Principio de la responsabilidad nominal:** el responsable debe ser una persona
o un cargo, no una institución. "El Ayuntamiento" no es un responsable verificable.
"La coordinadora del Área de Salud Comunitaria del DAP Granada-Metro" lo es.

---

#### Cronograma

El cronograma establece la distribución temporal de las actuaciones y los momentos
de medición de indicadores.

**Propiedades mínimas:** fecha de inicio, hitos, fecha de medición de indicadores,
fecha de fin del período, fecha de evaluación.

**Principio de realismo:** un cronograma que comprime todas las actuaciones en
el último trimestre no es un cronograma: es una postergación disfrazada de plan.

---

#### Marco de gobernanza

El marco de gobernanza define cómo se tomarán las decisiones sobre el plan a lo
largo de su ejecución: quién convoca, quién participa, con qué frecuencia, qué
autoridad tiene el órgano de coordinación.

**Objetos de gobernanza:**
- *Grupo Motor:* órgano de coordinación intersectorial del proceso RELAS.
- *Mesa de participación ciudadana:* espacio de diálogo con la comunidad.
- *Comisión de seguimiento:* órgano técnico de revisión del progreso del plan.

**Propiedades mínimas:** composición, periodicidad de reuniones, competencias
(qué puede decidir), mecanismo de resolución de conflictos.

---

#### Financiación

La financiación establece cómo se costea el plan.

**Fuentes típicas en el contexto RELAS:**
- Presupuesto municipal (concejalía de salud, urbanismo, servicios sociales).
- Financiación RELAS (Junta de Andalucía a través del Distrito Sanitario).
- Recursos del SSPA (enfermería comunitaria, trabajo social sanitario).
- Financiación intersectorial (educación, servicios sociales, empleo).
- Fondos europeos (cuando aplicable).

**Principio de presupuesto como compromiso:** un plan sin estimación de coste es
un plan sin realismo. No es necesario un presupuesto exacto, pero sí una
estimación de orden de magnitud por línea de actuación.

---

#### Participación ciudadana

La participación ciudadana es el conjunto de mecanismos mediante los cuales la
comunidad contribuye al diagnóstico, la priorización y el seguimiento del plan.

**Niveles de participación (escala Arnstein adaptada):**
- *Información:* la comunidad recibe información sobre el proceso.
- *Consulta:* la comunidad es preguntada; sus respuestas se tienen en cuenta.
- *Deliberación:* la comunidad participa en el proceso de toma de decisiones.
- *Codecisión:* la comunidad comparte la decisión con las instituciones.

**En COMPÁS NG:** la Priorización Temática (importada de REDCap) representa el
nivel de consulta/deliberación. El Cap. VII del PSL documenta si el proceso ha
llegado a la deliberación y el consenso.

**Principio de representatividad:** la participación es metodológicamente válida
solo si los grupos más vulnerables (mayor riesgo de salud) han tenido acceso
igual o preferente al proceso. Una consulta que solo recoge la voz de los grupos
más activos no es representativa.

---

### II.2 Grafo de dependencias entre objetos metodológicos

Las dependencias son metodológicamente obligatorias: no puede existir un objeto
sin que existan los objetos de los que depende.

```
Diagnóstico (EvidenceStore)
    │
    ▼
Necesidades de salud ◄── Activos comunitarios ◄── Participación ciudadana
    │                                                       │
    ▼                                                       │
Prioridades ◄──────────────────────────────────────────────┘
    │                                          (deliberación documentada)
    ├──► Necesidades NO priorizadas (objeto obligatorio)
    │
    ▼
Líneas de referencia estratégica (EPVSA / ESCA / RELAS)
    │
    ▼
Objetivos generales
    │
    ▼
Objetivos específicos
    │
    ▼
Actuaciones
    ├── Responsable
    ├── Cronograma
    ├── Financiación
    └── Indicadores de proceso
         ├── Definición operativa
         ├── Tiempo cero
         └── Meta
    │
    ▼
Indicadores de resultado
    ├── Definición operativa
    ├── Tiempo cero (previo a la ejecución)
    └── Meta
    │
    ▼
Marco de gobernanza
    ├── Grupo Motor
    ├── Mesa de participación
    └── Comisión de seguimiento
    │
    ▼
Marco de evaluación
    ├── Preguntas de evaluación
    ├── Momentos de evaluación
    └── Responsable de la evaluación
```

### II.3 Propiedades formales de la gramática

**Completitud:** un PLS está metodológicamente completo cuando todos los objetos
obligatorios existen y todas las dependencias están satisfechas. La completitud
puede verificarse mecánicamente.

**Coherencia:** existe coherencia cuando:
- Toda prioridad tiene al menos un objetivo.
- Todo objetivo tiene al menos una actuación.
- Toda actuación tiene un responsable, un cronograma y un indicador de proceso.
- Todo indicador tiene tiempo cero y meta.
- Todo objetivo tiene al menos un indicador de resultado.

**Trazabilidad ascendente:** dado cualquier elemento del PLS (una actuación, un
indicador, un objetivo), es posible trazar su origen hasta la evidencia del
EvidenceStore que lo fundamenta.

**Trazabilidad descendente:** dado cualquier átomo de evidencia relevante, es
posible encontrar el objetivo y la actuación que lo incorporan, o la justificación
de por qué no fue priorizado.

---

## Parte III — Tipología de contribuciones institucionales

Los marcos institucionales no son documentos que el PLS cita. Son contribuciones
metodológicas que estructuran, orientan y, en algunos casos, garantizan partes
del proceso de planificación local.

### III.1 EPVSA — Estrategia de Promoción de una Vida Saludable en Andalucía 2024-2030

**Naturaleza:** marco normativo-estratégico de la política de salud comunitaria
de la Junta de Andalucía. Define las líneas estratégicas en las que los planes
locales deben enmarcarse para recibir reconocimiento y apoyo institucional.

**Actor responsable:** Consejería de Salud y Consumo.

**Obligatoriedad:** no prescribe contenidos específicos para cada municipio.
Prescribe el marco de referencia dentro del cual los contenidos deben articularse.

**Ámbito:** toda Andalucía; todos los niveles (autonómico, provincial, local).

**Contribución al PLS:**
- Proporciona las cuatro líneas estratégicas (LE1-LE4) con las que cada prioridad
  local debe buscar correspondencia.
- Garantiza que el PLS es coherente con la política autonómica.
- Facilita el acceso a financiación autonómica para actuaciones alineadas.

**Lo que no aporta:** prioridades locales específicas, actuaciones concretas,
responsables municipales, indicadores de medición local.

---

### III.2 ESCA — Estrategia de Salud Comunitaria de Andalucía 2026-2030

**Naturaleza:** mandato operativo del Sistema Sanitario Público de Andalucía
para los equipos de Atención Primaria y Comunitaria. No es un marco de referencia:
es un Plan Operativo Territorial obligatorio para los Distritos.

**Actor responsable:** SSPA / DAP (Distritos de Atención Primaria y AGS).

**Obligatoriedad:** obligatoria para los Distritos Sanitarios (DAP/AGS). En los
municipios RELAS, el Plan Operativo ESCA debe coordinarse con el PLS.

**Ámbito:** los Distritos de Atención Primaria de Andalucía. Cada distrito elabora
su propio Plan Operativo Territorial (2027-2028 y 2029-2030).

**Estructura del Plan Operativo ESCA:**
- 5 objetivos estratégicos / 13 líneas de acción territorial.
- Cada línea de acción tiene: responsable, indicador, forma de cálculo, meta, tiempo cero, actuaciones y temporalización.
- Horizonte: 2027-2028 (primer plan) y 2029-2030 (segundo plan). El año 2026 es de diagnóstico.

**Contribución al PLS — lo que la ESCA garantiza estructuralmente:**

La ESCA es el único marco institucional que garantiza actuaciones concretas de forma
estructural, independientemente de las decisiones de cada PLS. Esto es porque el
SSPA tiene obligaciones propias ante la ESCA.

Las actuaciones garantizadas por la ESCA para los municipios RELAS incluyen:
- Diagnóstico de salud comunitaria por UGC (línea 2.1.1), que debe coordinarse con el PLS.
- Actualización anual del mapa de activos de cada UGC (línea 2.1.2).
- Actividades grupales de educación para la salud con enfoque de determinantes sociales (línea 2.3).
- Coordinación con centros educativos y entorno comunitario (línea 2.4).

**Lo que la ESCA no garantiza** (y que sigue siendo objeto de deliberación local):
- Las prioridades específicas del municipio.
- Las actuaciones comunitarias de iniciativa municipal (más allá del SSPA).
- La participación ciudadana en la priorización.
- Los recursos municipales asignados al plan.
- La integración intersectorial con educación, servicios sociales, urbanismo.

**Contribución al PLS — integración metodológica:**
El PLS debe identificar explícitamente qué actuaciones de su plan son propias del
municipio y cuáles forman parte del Plan Operativo ESCA del Distrito. Esta distinción
es metodológicamente crítica para dos razones:
1. Evita duplicidades (la actuación existe en el plan ESCA; el PLS no necesita crearla).
2. Revela los vacíos (lo que ninguno de los dos cubre requiere acción conjunta o nueva).

---

### III.3 RELAS — Red Local de Acción en Salud

**Naturaleza:** metodología de proceso para la planificación local de salud.
No es un marco de contenidos; es un marco de procedimiento.

**Actor responsable:** SSPA / Consejería, con participación municipal.

**Obligatoriedad:** voluntaria para los municipios (la adhesión a RELAS es
una decisión municipal). Una vez adheridos, la metodología RELAS define el
proceso que debe seguirse.

**Ámbito:** los municipios de Andalucía adheridos a RELAS.

**Contribución al PLS:**
- Define el ciclo de planificación (diagnóstico → prioridades → plan → ejecución → evaluación).
- Establece la figura del Grupo Motor y sus responsabilidades.
- Proporciona metodologías de participación ciudadana.
- Conecta el PLS con el sistema de apoyo institucional (Distrito Sanitario, SSPA).
- Define cuándo y cómo se entrega el PLS a la Junta de Andalucía.

**Lo que RELAS no aporta:** los contenidos específicos del plan, las prioridades,
los indicadores municipales ni los recursos.

---

### III.4 EPVSA vs ESCA vs RELAS — diferencia metodológica fundamental

| Dimensión | EPVSA | ESCA | RELAS |
|---|---|---|---|
| ¿Qué es? | Estrategia de contenidos | Mandato operativo del SSPA | Metodología de proceso municipal |
| ¿Quién la aplica? | Todos los actores de salud en Andalucía | Los equipos AP/Comunitaria del SSPA | El municipio adherido + Distrito |
| ¿Qué prescribe? | Líneas estratégicas temáticas | Actuaciones concretas del SSPA | Cómo se hace el proceso |
| ¿Qué garantiza? | Coherencia estratégica | Actuaciones del sistema sanitario | Método y proceso reconocido |
| ¿Es obligatorio para el municipio? | Como marco de referencia | Para el Distrito sanitario (no para el municipio directamente) | Solo si adhiere a RELAS |

---

### III.5 Plan Estratégico de Personas Mayores (PEM)

**Naturaleza:** plan sectorial para la población mayor.

**Contribución al PLS:** referencia para actuaciones dirigidas a personas mayores,
envejecimiento activo, soledad, dependencia y cuidados.

**Obligatoriedad:** marco de referencia; no obligatorio para el PLS. Relevante
en municipios con alto índice de envejecimiento.

**En COMPÁS NG:** presente en el `StrategicFrameworkRegistry` como `MAYORES`.

---

### III.6 En Buena Edad (EBE)

**Naturaleza:** programa de la Consejería para el envejecimiento activo y saludable.

**Contribución al PLS:** orienta actuaciones de envejecimiento activo, autonomía
personal y participación de personas mayores.

**En COMPÁS NG:** presente en el `StrategicFrameworkRegistry` como `BUENA_EDAD`.

---

### III.7 Plan de Salud Mental de Andalucía (PSMA)

**Naturaleza:** plan estratégico para la salud mental en Andalucía.

**Contribución al PLS:** referencia para actuaciones de salud mental comunitaria,
prevención del suicidio, desestigmatización, apoyo a personas con problemas de
salud mental.

**Obligatoriedad:** marco de referencia sectorial.

**En COMPÁS NG:** denominación canónica fijada en CONTRACT-STRATEGIC-REPOSITORY.
Ausente del `StrategicFrameworkRegistry` actual. Laguna identificada (Hueco H-5
del Blueprint de Producción).

---

## Parte IV — Productos institucionales

Los productos de COMPÁS NG se clasifican en cuatro familias según su función
metodológica. Un producto puede pertenecer a más de una familia.

### IV.1 Productos de conocimiento

Son los productos que organizan, sintetizan e interpretan la evidencia disponible.
No contienen compromisos de acción. Son la base epistémica del proceso.

| Producto | Función | Audiencia |
|---|---|---|
| **EvidenceStore** | Repositorio estructurado de evidencia territorial | Sistema (interno) |
| **Perfil de Salud Local COMPÁS (PSL-C)** | Síntesis interpretativa del diagnóstico | Equipo técnico, Distrito Sanitario, Junta |
| **Perfil tipo NHS (PSL-NHS)** | Presentación comparativa de indicadores de salud | Corporación municipal, ciudadanía, prensa |

### IV.2 Productos de decisión

Son los productos que formalizan compromisos institucionales validados por actores
con autoridad para comprometer al municipio. No existen sin haber pasado por los
productos de conocimiento.

| Producto | Función | Audiencia |
|---|---|---|
| **Plan Local de Salud (PLS)** | Compromiso institucional de planificación | Municipio, Junta, ciudadanía |
| **Resumen Ejecutivo (RE)** | Síntesis del PLS para audiencias políticas | Corporación municipal, prensa, comunidad |

### IV.3 Productos metodológicos

Son los productos que habilitan la captura de nueva evidencia y la reproducibilidad
del proceso metodológico.

| Producto | Función | Audiencia |
|---|---|---|
| **Cuestionario Municipal (CM)** | Definición metodológica del instrumento de medición | Equipo técnico, metodólogos |
| **Diccionario REDCap (DD)** | Implementación técnica del cuestionario en REDCap | Administradores REDCap |
| **Anexo Técnico Metodológico (AT)** | Documentación de rigor metodológico del proceso | Revisores, auditores, académicos |

### IV.4 Productos operativos

Son los productos que apoyan la ejecución y el seguimiento del plan aprobado.
Dependen de que el Plan de Acción esté validado.

| Producto | Función | Audiencia |
|---|---|---|
| **Agenda de actuaciones** | Calendario operativo de implementación | Equipo técnico, responsables de actuaciones |
| **Marco de seguimiento** | Estructura para medir el progreso del plan | Comisión de seguimiento, Grupo Motor |
| **Informe de evaluación** *(futuro)* | Valoración del cumplimiento del plan | Equipo técnico, Grupo Motor, Junta |
| **Memoria del Proceso** | Registro del proceso participativo y deliberativo | Comunidad, Junta, futuras ediciones del plan |

### IV.5 Relaciones de alimentación entre productos

```
EvidenceStore (conocimiento primario)
    │
    ▼
PSL-C (síntesis interpretativa)
    ├──► PSL-NHS (versión comunicativa)
    │
    ▼
PLS (decisión, con PSL-C como diagnóstico de referencia)
    ├──► RE (síntesis política del PLS)
    │
    ├──► Agenda (implementación del PLS)
    │
    └──► Marco de seguimiento (control del PLS)
                │
                ▼
          Informe de evaluación
                │
                ▼
         [Siguiente ciclo: nuevo EvidenceStore]

Cuestionario Municipal (CM)
    ├──► Diccionario REDCap (DD)
    │         │
    │    [Captura de datos en REDCap]
    │         │
    │         ▼
    └──► EvidenceStore (retroalimentación)

Anexo Técnico Metodológico
    (alimentado por EvidenceStore + Biblioteca Metodológica)
```

---

## Parte V — Arquitectura metodológica

### V.1 Flujo completo y conocimiento en cada transición

#### Transición 1: Documento Fuente → Repositorio Documental Territorial

**Qué ocurre:** el equipo técnico incorpora los documentos disponibles al sistema.

**Conocimiento que aparece:**
- La existencia de la información (hay un Informe de Salud de fecha X, hay datos
  de estudios EAS de año Y, existen activos comunitarios documentados).
- La procedencia (quién produjo el documento, cuándo, cómo).
- La trazabilidad inicial (cada documento tiene ID, fecha y metadatos de origen).

**Conocimiento que puede perderse:**
- El contexto en que el documento fue producido (una reunión política que precedió
  al Informe de Salud puede condicionar su alcance; esto no está en el repositorio).
- El conocimiento tácito de los técnicos que conocen el territorio.

**Conocimiento que todavía no puede aparecer:**
- Qué significa la información para el municipio.
- Qué problemas revela.
- Qué debería hacerse.

---

#### Transición 2: Repositorio → EvidenceStore

**Qué ocurre:** los parsers extraen unidades de evidencia estructurada de los
documentos y las depositan en el EvidenceStore, con trazabilidad al documento de origen.

**Conocimiento que aparece:**
- La estructura semántica de la evidencia: qué átomo es un determinante, cuál
  es un activo, cuál es un indicador, cuál es una cautela metodológica.
- La calidad de la evidencia: confianza, origen, fecha de extracción.
- La trazabilidad: qué documento originó cada átomo.

**Conocimiento que puede perderse:**
- La narrativa contextual del documento (un párrafo del Informe de Salud que
  describe el contexto histórico de un indicador se convierte en un átomo
  que no captura esa narrativa).
- La relación entre átomos de un mismo documento.

**Conocimiento que todavía no puede aparecer:**
- La lectura territorial (qué patrón emerge del conjunto).
- Las prioridades.
- Las actuaciones.

---

#### Transición 3: EvidenceStore → MIT

**Qué ocurre:** el Motor de Interpretación Territorial organiza, clasifica y
relaciona el conjunto de evidencia disponible para producir una lectura territorial
estructurada.

**Conocimiento que aparece:**
- Los patrones de la evidencia: qué predomina (determinantes, activos, indicadores).
- Las tensiones entre fuentes (el IBSE dice X; el Informe de Salud dice Y; la
  priorización ciudadana señala Z).
- Las áreas de intervención que emergen heurísticamente de la configuración de evidencia.
- Los marcos interpretativos con los que la evidencia se conecta.

**Conocimiento que puede perderse:**
- Las relaciones causales (el MIT detecta patrones, no causas).
- La experiencia acumulada del territorio que no está en ningún documento.
- La evolución histórica, si no hay evidencia longitudinal disponible.

**Conocimiento que todavía no puede aparecer:**
- Los problemas definitivos del municipio (el MIT ofrece una lectura, no un diagnóstico cerrado).
- Las prioridades (emergentes de la deliberación, no del cálculo).
- Las actuaciones o los compromisos.

---

#### Transición 4: MIT → Perfil de Salud Local (PSL)

**Qué ocurre:** el sistema genera un borrador del PSL a partir del MIT. El equipo
técnico redacta las conclusiones (Cap. V), las recomendaciones (Cap. VI) y documenta
la deliberación de priorización (Cap. VII).

**Conocimiento que aparece:**
- La síntesis del diagnóstico territorial en lenguaje institucional.
- Las conclusiones técnicas del equipo sobre el estado de salud (autoría humana).
- Las recomendaciones de intervención (autoría humana).
- Las prioridades seleccionadas mediante deliberación.

**Conocimiento que puede perderse:**
- La complejidad de la interpretación (el PSL sintetiza; los detalles del MIT
  no se exportan al documento compilado).
- Las voces individuales del proceso participativo (se recoge el resultado
  estadístico, no cada voz).

**Conocimiento que todavía no puede aparecer:**
- Los compromisos concretos (esos son del PLS).
- Los responsables de las actuaciones.
- El presupuesto.

---

#### Transición 5: PSL → Motor de Traducción Estratégica (MTE)

**Qué ocurre:** el MTE busca correspondencias entre las prioridades del PSL
y los recursos del Repositorio Estratégico (líneas EPVSA, líneas ESCA, programas RELAS,
planes sectoriales).

**Conocimiento que aparece:**
- Qué prioridades locales tienen respaldo en marcos institucionales.
- Qué actuaciones tipo propone cada marco para las prioridades identificadas.
- Qué prioridades no encuentran respaldo en los marcos disponibles
  (señal importante: o son muy locales, o los marcos son insuficientes, o la
  priorización fue atípica).

**Conocimiento que puede perderse:**
- El contexto local específico que hace que una actuación tipo de EPVSA no sea
  adecuada para este municipio concreto.
- Las limitaciones de capacidad local que condicionan qué es posible.

**Conocimiento que todavía no puede aparecer:**
- Los compromisos definitivos (requieren validación del Grupo Motor).
- Los responsables (son una decisión de gobernanza, no metodológica).
- Los plazos y presupuestos reales.

---

#### Transición 6: MTE → Plan de Acción

**Qué ocurre:** el MTE produce un borrador de Plan de Acción que el Grupo Motor
revisa, ajusta y valida. El borrador incluye: objetivos sugeridos, actuaciones
alineadas con los marcos, indicadores tipo, marcos de referencia.

**Conocimiento que aparece:**
- El borrador de compromisos técnicamente fundamentados.
- Las correspondencias entre prioridades locales y marcos institucionales.
- Los indicadores de seguimiento propuestos.

**Conocimiento que puede perderse:**
- La viabilidad local real (el Grupo Motor la aporta; el sistema no la conoce).
- Los acuerdos informales de colaboración intersectorial (que no están en ningún repositorio).

**Conocimiento que todavía no puede aparecer:**
- Los responsables definitivos (el Grupo Motor los negocia).
- Los recursos asignados (son una decisión presupuestaria).
- La aprobación institucional (eso es la decisión política).

---

#### Transición 7: Plan de Acción → Plan Local de Salud

**Qué ocurre:** el Plan de Acción validado, la memoria del proceso participativo,
la gobernanza, el marco de evaluación y el Resumen Ejecutivo se integran en el
Plan Local de Salud. La corporación municipal lo aprueba formalmente.

**Conocimiento que aparece:**
- El compromiso institucional completo del municipio.
- La trazabilidad desde la evidencia hasta cada compromiso.
- El marco temporal y de gobernanza para la ejecución.
- El mecanismo de evaluación del cumplimiento.

**Nada se pierde en esta transición:** el PLS es la integración de todo lo anterior.

**Nada debe aparecer todavía:** los resultados de la ejecución, la evaluación del impacto.

---

## Parte VI — Papel del Grupo Motor

El Grupo Motor es el órgano de coordinación intersectorial que gobierna el proceso
de planificación local en salud en el marco RELAS. No es un comité consultivo:
es el órgano de co-producción del PLS.

### VI.1 Composición típica

- Representante del Distrito Sanitario (coordinación técnica con SSPA/ESCA).
- Representante de la concejalía de salud (o alcaldía, si no hay concejalía).
- Representante de servicios sociales municipales.
- Representante del ámbito educativo (preferiblemente del municipio).
- Representantes de entidades ciudadanas y asociaciones locales.
- En municipios RELAS con alta complejidad: representantes de empleo, urbanismo, medio ambiente.

### VI.2 Lo que el Grupo Motor decide

- Qué necesidades priorizar, a partir de las candidaturas técnicas del PSL y las
  preferencias ciudadanas.
- Qué actuaciones son factibles en el contexto local.
- Quién asume la responsabilidad de cada actuación.
- Cómo distribuir los recursos disponibles.
- El texto definitivo del PLS (incluyendo las secciones de autoría humana del PSL-C
  integradas en el PLS).
- Si aprobar el PSL y elevar el PLS a la corporación municipal.

### VI.3 Lo que el Grupo Motor no puede decidir

- La existencia de las necesidades identificadas (la evidencia es lo que es).
- La calidad metodológica de los estudios complementarios.
- Los contenidos de los marcos institucionales (EPVSA, ESCA no son negociables).
- Los algoritmos de scoring de los instrumentos (IBSE 0-100 no es una preferencia).

### VI.4 Lo que el Grupo Motor recibe ya construido

Del sistema (COMPÁS NG):
- El diagnóstico del EvidenceStore.
- El borrador del PSL (caps. I-IV).
- Las candidaturas técnicas de priorización (cap. VII scaffold).
- Las correspondencias con marcos estratégicos (output del MTE).
- El borrador del Plan de Acción.

De la ciudadanía (proceso participativo):
- Los resultados de la Priorización Temática.
- Las aportaciones de las mesas de participación.
- La perspectiva de los grupos más vulnerables.

### VI.5 Lo que el Grupo Motor delibera

- La coherencia entre el diagnóstico técnico y el conocimiento local.
- La pertinencia de las prioridades sugeridas en relación con la capacidad real del municipio.
- La viabilidad de las actuaciones propuestas por el MTE.
- Los posibles conflictos de interés entre actores institucionales.
- La adecuación de los indicadores a las posibilidades de medición local.

### VI.6 Lo que el Grupo Motor valida

- El PSL como base de planificación (transición a `validated`).
- La priorización (que refleja tanto el análisis técnico como la voz ciudadana).
- El Plan de Acción (antes de elevarlo a la corporación).
- El marco de gobernanza y seguimiento del PLS.

### VI.7 Lo que el Grupo Motor puede rechazar

- Prioridades técnicas que no reflejan la realidad vivida en el territorio.
- Actuaciones propuestas que son inviables en el contexto local.
- Indicadores que no pueden medirse con los recursos disponibles.
- Cronogramas que ignoran los ciclos políticos y presupuestarios del municipio.

### VI.8 Lo que el Grupo Motor puede modificar

- El texto de las conclusiones y recomendaciones del PSL (siempre que lo haga como
  autoría humana explícita, no delegando en el scaffold del sistema).
- Las actuaciones del Plan de Acción (pueden añadir, eliminar o modificar las
  propuestas del borrador técnico).
- Los indicadores (pueden proponer indicadores más adecuados a la medición local).
- Los cronogramas (pueden ajustarlos a los ciclos reales del municipio).

### VI.9 Lo que el Grupo Motor aprueba

- El PSL en estado `approved` (en coordinación con la corporación municipal).
- El PLS como documento institucional definitivo.
- El informe de seguimiento anual.
- La evaluación final del plan.

---

## Parte VII — Papel del Motor de Traducción Estratégica

El Motor de Traducción Estratégica (MTE) es el puente metodológico entre el análisis
territorial (PSL) y la planificación institucional (PLS). No es un motor de decisión.
Es un motor de propuesta trazable.

### VII.1 Qué debe traducir

El MTE traduce **tres tipos de conocimiento**:

1. **Prioridades territoriales** (del PSL) → **Líneas estratégicas institucionales** (de los marcos).
   Qué dice el análisis territorial sobre lo que importa → a qué línea del EPVSA/ESCA/RELAS
   corresponde esa prioridad.

2. **Áreas de intervención** (del MIT/PSL) → **Acciones tipo de los marcos**.
   Qué áreas ha identificado el análisis territorial como candidatas → qué actuaciones
   proponen los marcos institucionales para esas áreas.

3. **El contexto territorial** (del PSL) → **Pertinencia diferencial de los marcos**.
   No todos los marcos son igualmente relevantes para todos los municipios.
   El MTE debe poder identificar qué marcos tienen más resonancia con el perfil
   territorial específico.

### VII.2 Qué no debe decidir nunca

El MTE **no puede**:

- Asignar una prioridad a una línea estratégica sin que el equipo técnico valide la correspondencia.
- Ponderar la importancia relativa de los marcos entre sí.
- Descartar una prioridad local porque no encuentra correspondencia en los marcos.
- Decidir que una actuación es obligatoria porque aparece en un marco institucional.
- Establecer responsables, plazos o presupuestos.
- Producir texto narrativo definitivo sin revisión del Grupo Motor.
- Afirmar que el municipio "debe" hacer algo.

### VII.3 Qué tipos de propuestas puede producir

| Tipo de propuesta | Descripción | Certeza epistémica |
|---|---|---|
| **Correspondencia directa** | La prioridad coincide explícitamente con una línea o actuación del marco | Alta (pero siempre requiere validación) |
| **Correspondencia temática** | La prioridad se relaciona con el ámbito temático del marco, sin coincidencia explícita | Media (la validación es especialmente necesaria) |
| **Sin correspondencia detectada** | La prioridad no encuentra respaldo en los marcos disponibles | Señal para el Grupo Motor: ¿es una necesidad muy local? ¿Los marcos son insuficientes? |

Toda propuesta lleva `requiresHumanValidation: true`. Sin excepción.

### VII.4 Cómo justificar cada propuesta

Cada propuesta del MTE debe incluir:

1. La prioridad territorial de origen (ID del tema del PSL).
2. Los átomos de evidencia que fundamentan esa prioridad (IDs del EvidenceStore).
3. El recurso estratégico con el que se establece la correspondencia (ID del StrategicRepository).
4. El nivel de correspondencia (directa/temática).
5. La explicación del criterio de correspondencia (en lenguaje natural).
6. Las cautelas sobre la correspondencia (qué puede no aplicar en el contexto local).

### VII.5 Cómo preservar la trazabilidad completa

La trazabilidad del MTE es una cadena desde la propuesta hasta la evidencia original:

```
Propuesta de actuación en el Plan de Acción
    ↑ deriva de
Correspondencia estratégica (MTE)
    ↑ usa como referencia
Recurso del Repositorio Estratégico (EPVSA/ESCA/RELAS)
    ↑ aplica sobre
Prioridad del PSL (Cap. VII)
    ↑ fundamentada en
Áreas de intervención del MIT (Cap. IV)
    ↑ derivadas de
EvidenceAtoms del EvidenceStore
    ↑ extraídos de
Documentos del Repositorio Documental
```

Esta cadena debe ser reproducible para cualquier propuesta del MTE.
Si un elemento de la cadena no puede establecerse, la propuesta no puede incluirse
en el borrador del Plan de Acción.

---

## Parte VIII — Principios metodológicos permanentes

### Principios de fundamento epistemológico

**PM-1 — La evidencia es previa a la interpretación**

*Formulación:* Ninguna interpretación del estado de salud territorial puede producirse sin evidencia sistematizada que la sustente. La evidencia precede metodológicamente a la interpretación.

*Justificación:* La interpretación sin evidencia es opinión. La arquitectura de tres niveles de COMPÁS NG (evidencia → interpretación → decisión) formaliza este principio.

*Impacto arquitectónico:* El MIT opera sobre el EvidenceStore saneado, nunca sobre documentos directamente ni sobre presuposiciones del equipo técnico.

---

**PM-2 — La interpretación es previa a la priorización**

*Formulación:* Ninguna prioridad puede establecerse sin una lectura interpretativa previa del conjunto de la evidencia disponible.

*Justificación:* Priorizar sin interpretar significa seleccionar en función de la disponibilidad de datos, no de la relevancia territorial. Los temas mejor documentados tenderán a ser priorizados aunque no sean los más urgentes.

*Impacto arquitectónico:* El PSL (Cap. I-IV) debe estar generado antes de que el proceso de priorización (Cap. VII) pueda iniciarse.

---

**PM-3 — La incertidumbre no se oculta**

*Formulación:* Toda afirmación sobre el estado de salud de un municipio que tenga incertidumbre metodológica debe declarar explícitamente esa incertidumbre, cuantificarla cuando sea posible y abstenerse de usarla como base de planificación cuando sea crítica.

*Justificación:* Un diagnóstico que no declara sus limitaciones crea falsa certeza. La falsa certeza es más peligrosa que la incertidumbre reconocida porque conduce a decisiones incorrectas con confianza indebida.

*Impacto arquitectónico:* Las cautelas metodológicas (`methodological-caution`) son átomos de evidencia de primer nivel en COMPÁS NG, con el mismo rango que los indicadores.

---

**PM-4 — Los activos tienen rango epistémico igual que los déficits**

*Formulación:* El diagnóstico de salud territorial no es el inventario de lo que falta. Es la lectura integrada de lo que existe (activos) y de lo que falta (necesidades).

*Justificación:* El paradigma salutogénico (Antonovsky) y la perspectiva de activos comunitarios (Morgan & Ziglio) han demostrado que las intervenciones construidas sobre fortalezas existentes tienen mayor sostenibilidad que las construidas exclusivamente sobre déficits.

*Impacto arquitectónico:* Los `EvidenceAtom` de tipo `asset` tienen la misma importancia arquitectónica que los de tipo `determinant` o `indicator`. El PSL los integra en el Cap. IV con el mismo peso analítico.

---

**PM-5 — La participación ciudadana es evidencia, no decoración**

*Formulación:* El conocimiento de la comunidad sobre su propio territorio y su propia salud es una forma de evidencia con valor epistémico propio, no reducible a los datos cuantitativos ni subordinado a ellos.

*Justificación:* Las comunidades poseen conocimiento experiencial sobre su territorio que la epidemiología no puede capturar. La integración de ambas formas de conocimiento produce diagnósticos más completos y planes más pertinentes.

*Impacto arquitectónico:* Los átomos `participation` del EvidenceStore tienen rango de primer nivel. El Grupo Motor debe documentar cómo el conocimiento ciudadano ha informado las prioridades del PLS.

---

**PM-6 — La comparación es obligatoria para dar sentido a los indicadores**

*Formulación:* Un indicador sin referencia de comparación es descriptivo. Un indicador con referencia territorial (provincial, autonómica, normativa) es diagnóstico.

*Justificación:* Saber que el IBSE promedio de un municipio es 62,5/100 no dice nada sobre si es bueno o malo. Saber que la referencia provincial estimada es 68/100 transforma el dato en un hallazgo con implicaciones.

*Impacto arquitectónico:* Los paneles de estudios de COMPÁS NG muestran "sin referencia disponible" cuando los datos de comparación no están disponibles. Proporcionar esos datos es una prioridad de Sprint 2.

---

### Principios de gobernanza metodológica

**PM-7 — La priorización es siempre un acto humano y deliberativo**

*Formulación:* No existe algoritmo que pueda asignar legítimamente la importancia relativa de necesidades de salud en competencia. La priorización es un juicio de valor que pertenece a la comunidad y a sus representantes técnicos e institucionales.

*Justificación:* ¿Priorizar la salud mental juvenil o la patología cardiovascular en mayores? No hay respuesta técnica: es una decisión sobre valores, equidad y capacidad. El sistema puede ofrecer información para iluminar esa decisión; no puede tomarla.

*Impacto arquitectónico:* El sistema produce candidaturas técnicas de priorización (Cap. VII del PSL); el Grupo Motor selecciona las prioridades. La transición de `generated` a `validated` requiere acto explícito del equipo técnico.

---

**PM-8 — Los responsables son personas, no instituciones**

*Formulación:* La accountability de una actuación del PLS recae en una persona con un cargo identificable, no en una institución abstracta.

*Justificación:* "El Ayuntamiento" no puede ser interpelado cuando una actuación no se ejecuta. "La concejala de Salud, Dña. X" sí. La responsabilidad personalizada no es un exceso burocrático: es la condición de posibilidad del seguimiento.

*Impacto arquitectónico:* El Plan de Acción debe incluir un campo de responsable con rol identificable, no solo el nombre de la institución.

---

**PM-9 — El tiempo cero es obligatorio antes de ejecutar**

*Formulación:* El valor baseline de todos los indicadores del PLS debe quedar documentado antes de que comiencen las actuaciones planificadas.

*Justificación:* Sin tiempo cero, la evaluación final solo puede documentar dónde está el indicador al final, no cuánto ha cambiado gracias al plan.

*Impacto arquitectónico:* Los indicadores en COMPÁS NG deben incluir un campo obligatorio de valor baseline con fecha de medición. Sin este campo, el indicador no está completamente definido.

---

**PM-10 — Las necesidades no priorizadas se documentan siempre**

*Formulación:* Un PLS es metodológicamente incompleto si no registra qué necesidades identificadas en el diagnóstico han quedado fuera del plan y por qué.

*Justificación:* La transparencia sobre las exclusiones es rendición de cuentas. Una necesidad que no aparece puede haber sido ignorada (defecto) o conscientemente diferida (decisión). Solo el registro distingue ambos casos.

*Impacto arquitectónico:* El Plan de Acción debe incluir un objeto formal de "necesidades identificadas pero no priorizadas" con justificación por necesidad excluida.

---

**PM-11 — La evaluación es parte del plan desde su diseño, no su apéndice**

*Formulación:* Las preguntas de evaluación, los indicadores de impacto, los momentos de medición y el responsable de la evaluación deben estar definidos antes de que el plan comience a ejecutarse.

*Justificación:* Los planes diseñados sin evaluación desde el inicio no pueden ser evaluados significativamente al final.

*Impacto arquitectónico:* El Marco de Evaluación es un objeto formal del PLS, con el mismo rango que el Plan de Acción o la Agenda.

---

**PM-12 — El plan tiene vigencia definida y genera el siguiente ciclo**

*Formulación:* Un PLS sin fecha de expiración no es un plan: es una lista de intenciones. El cierre formal del ciclo (evaluación final) es la apertura del siguiente (nuevo diagnóstico).

*Justificación:* La continuidad del proceso de planificación local depende de que cada ciclo genere evidencia longitudinal que enriquezca el siguiente.

*Impacto arquitectónico:* El PLS tiene un campo de vigencia (fecha de inicio y fin). La evaluación final genera evidencia longitudinal (`longi` origin) que retroalimenta el EvidenceStore del siguiente ciclo.

---

### Principios de separación metodológica

**PM-13 — El plan es del municipio, no del sistema**

*Formulación:* COMPÁS NG facilita la producción del PLS; no lo posee ni lo suplanta. El PLS es un documento institucional del municipio, validado por su equipo técnico y aprobado por su corporación.

*Justificación:* La legitimidad institucional del PLS depende de que sea un acto de voluntad del municipio, no el output de un sistema informático. El sistema puede automatizar la producción del borrador; no puede automatizar la responsabilidad política.

*Impacto arquitectónico:* El PLS requiere al menos dos actos humanos explícitos: la validación técnica (equipo) y la aprobación política (corporación). Ninguno puede ser automatizado.

---

**PM-14 — La ESCA garantiza actuaciones del SSPA, no del municipio**

*Formulación:* Las actuaciones del Plan Operativo ESCA son compromisos del Sistema Sanitario Público de Andalucía. Son garantías estructurales de los equipos de Atención Primaria, no del municipio.

*Justificación:* El error más frecuente en la articulación ESCA-PLS es asumir que las actuaciones ESCA son actuaciones del PLS. Son complementarias pero de naturaleza diferente: el SSPA hace X en el municipio; el municipio hace Y en coordinación con el SSPA.

*Impacto arquitectónico:* El MTE debe distinguir en su output entre actuaciones del SSPA (garantizadas estructuralmente por ESCA) y actuaciones del municipio (compromisos del PLS).

---

**PM-15 — Los marcos institucionales son referencias, no mandatos de contenido**

*Formulación:* EPVSA, ESCA, RELAS-G y los planes sectoriales orientan el qué y el cómo; no determinan las prioridades locales específicas.

*Justificación:* Las líneas estratégicas de EPVSA son tan amplias que virtualmente cualquier prioridad local puede alinearse con alguna de ellas. La alineación con marcos no valida una prioridad; la evidencia territorial la valida.

*Impacto arquitectónico:* El MTE produce correspondencias; el Grupo Motor valida su pertinencia. La validación no es automática aunque la correspondencia sea obvia.

---

**PM-16 — La coherencia del plan es verificable formalmente**

*Formulación:* Un PLS coherente es aquel en el que: toda prioridad tiene al menos un objetivo; todo objetivo tiene al menos una actuación; toda actuación tiene un responsable, un cronograma y un indicador; todo indicador tiene tiempo cero y meta.

*Justificación:* La coherencia formal no garantiza la pertinencia (el plan puede ser coherente pero irrelevante). Pero la incoherencia formal garantiza problemas de evaluabilidad.

*Impacto arquitectónico:* El compilador del PLS puede verificar mecánicamente la coherencia formal antes de compilar. Un PLS incoherente no puede compilarse; se devuelve al Grupo Motor para completarse.

---

**PM-17 — La equidad es dimensión transversal, no capítulo adicional**

*Formulación:* La perspectiva de equidad no es una sección del PLS: es un filtro que se aplica en todas las etapas. ¿Quién está peor? ¿El plan beneficia a quienes más lo necesitan? ¿El proceso participativo ha sido accesible para todos?

*Justificación:* Las desigualdades en salud son la señal más potente de dónde la acción local es más necesaria y más efectiva.

*Impacto arquitectónico:* Los EvidenceAtom deben poder desagregarse por grupo de población cuando la evidencia lo permite. El PSL-C incluye dimensión de equidad en el Cap. IV. El PLS evalúa si las actuaciones son equitativas en diseño.

---

**PM-18 — La voz técnica y la voz ciudadana son complementarias, no sustituibles**

*Formulación:* El equipo técnico tiene conocimiento metodológico y epidemiológico. La ciudadanía tiene conocimiento experiencial y territorial. Ninguno puede reemplazar al otro.

*Justificación:* Un PLS construido solo desde la evidencia técnica puede ser metodológicamente correcto pero socialmente ilegítimo. Un PLS construido solo desde las preferencias ciudadanas puede ser socialmente legítimo pero metodológicamente ineficaz.

*Impacto arquitectónico:* El Cap. VII del PSL distingue explícitamente las candidaturas técnicas (del MIT/PSL) de la priorización participativa (de la ciudadanía). La deliberación del Grupo Motor integra ambas.

---

**PM-19 — La trazabilidad es bidireccional y completa**

*Formulación:* Dado un compromiso del PLS, debe ser posible trazar su origen hasta la evidencia que lo fundamenta. Dada una evidencia en el EvidenceStore, debe ser posible identificar si fue incorporada al PLS o por qué no lo fue.

*Justificación:* La trazabilidad es la garantía de que el PLS es una respuesta fundamentada y no un conjunto de intenciones desconectadas del diagnóstico.

*Impacto arquitectónico:* La cadena de trazabilidad (EvidenceAtom → MIT → PSL → MTE → Plan de Acción → PLS) debe ser reproducible sin saltos.

---

**PM-20 — Ningún output del sistema puede presentarse como decisión territorial**

*Formulación:* Todo output generado automáticamente por COMPÁS NG es una propuesta que requiere validación humana. Esta regla no tiene excepciones.

*Justificación:* La legitimidad de las decisiones de planificación local en salud depende de que sean adoptadas por actores con responsabilidad institucional. La automatización puede apoyar la decisión; no puede tomarla.

*Impacto arquitectónico:* `requiresHumanValidation: true` es un invariante tipado en todos los outputs del MIT, del MTE y de los compiladores de borrador. No puede eliminarse ni relajarse.

---

**PM-21 — El seguimiento sin base de comparación no es seguimiento**

*Formulación:* El seguimiento requiere comparar el estado actual con el estado planificado (el plan) y con el estado inicial (el tiempo cero). Sin ambas referencias, el seguimiento solo describe, no evalúa.

*Justificación:* Saber que se ha ejecutado el 70% de las actuaciones planificadas es seguimiento de proceso. Saber si el indicador de resultado ha mejorado requiere la comparación con el tiempo cero.

*Impacto arquitectónico:* El Marco de Seguimiento del PLS debe incluir tanto indicadores de proceso (comparación con lo planificado) como de resultado (comparación con el tiempo cero).

---

**PM-22 — La financiación es condición de posibilidad, no de diseño**

*Formulación:* Las actuaciones del PLS deben diseñarse por su pertinencia para el problema de salud identificado. La financiación determina cuáles son implementables en el período planificado, pero no cuáles son metodológicamente correctas.

*Justificación:* Si el diseño del plan está determinado exclusivamente por lo que puede financiarse, el plan pierde su capacidad de señalar qué es necesario más allá de lo disponible.

*Impacto arquitectónico:* El Plan de Acción distingue entre actuaciones prioritarias (metodológicamente justificadas) y actuaciones con financiación asegurada (implementables en el período). Las primeras que no tienen financiación son señales para la abogacía de recursos.

---

**PM-23 — El PLS es complementario al Plan Operativo ESCA, no su sustituto**

*Formulación:* El Plan Operativo ESCA del Distrito y el Plan Local de Salud del municipio son documentos complementarios con responsables distintos, aunque con un ámbito compartido.

*Justificación:* Confundirlos produce dos errores simétricos: creer que el PLS no es necesario porque la ESCA ya lo cubre, o diseñar el PLS ignorando lo que la ESCA ya garantiza.

*Impacto arquitectónico:* El MTE debe distinguir entre actuaciones garantizadas por la ESCA (del SSPA) y actuaciones propias del PLS (del municipio). El Plan de Acción debe referenciar las actuaciones ESCA sin duplicarlas.

---

**PM-24 — El ciclo de planificación local cierra y abre en el mismo punto**

*Formulación:* La evaluación final del PLS genera evidencia longitudinal que es el punto de partida del siguiente diagnóstico. El fin de un plan es el origen del siguiente.

*Justificación:* La continuidad del proceso RELAS depende de que cada ciclo alimente el siguiente. Un plan que no genera evidencia para el siguiente ciclo cierra el proceso en lugar de perpetuarlo.

*Impacto arquitectónico:* El Informe de Evaluación final del PLS produce átomos de evidencia longitudinal (`origin: "longi"`) que se incorporan al EvidenceStore del siguiente ciclo de COMPÁS NG.

---

## Parte IX — Consecuencias para el Sprint 2

Desde la metodología, el orden de construcción lógico del Sprint 2 no es una lista
de tareas: es una cadena de dependencias. Nada puede construirse sin que sus
prerequisitos metodológicos estén establecidos.

### IX.1 Lo que debe establecerse primero: el modelo documental

El primer acto del Sprint 2 es de naturaleza metodológica, no técnica:

**Paso 1: Definir la estructura documental del PSL-C compilado.**
El PSL ya existe como objeto analítico. Falta decidir su forma como documento institucional.
Esto produce `CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER`.

**Paso 2: Definir la estructura del PLS.**
Solo puede hacerse conociendo la estructura del PSL-C (que es su capítulo diagnóstico).
Esto produce `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT`.

Ambos contratos deben producirse antes de implementar ningún compilador. Son el plano
que guía la construcción, no el resultado de ella.

### IX.2 Orden lógico de construcción

**Bloque A — Contratos documentales** *(prerequisito de todo lo demás)*
1. `CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER` (estructura del PSL-C compilado)
2. `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT` (estructura del PLS: partes A, B, C)

**Bloque B — Completar la Biblioteca Metodológica** *(prerequisito del Constructor)*
3. `MethodologicalModule` de SF-12 EAS
4. `MethodologicalModule` de Sueño EAS
5. `MethodologicalModule` de CAGE EAS

**Bloque C — Compiladores de conocimiento** *(prerequisito del PLS)*
6. `LocalHealthProfileCompiler` (PSL-C versión completa + versión resumida)
7. `NHSHealthProfileCompiler` (cuando referencias estén disponibles)
8. `TechnicalAppendixCompiler` (versión básica, sin SAM)

**Bloque D — Repositorio Estratégico y MTE** *(prerequisito del PLS)*
9. Completar `StrategicFrameworkRegistry` con ESCA territorial y PSMA
10. Implementar `StrategicRepository` (gestionable por el equipo técnico)
11. Implementar MTE con cobertura EPVSA + ESCA (no solo EPVSA)

**Bloque E — Compilador del Plan** *(requiere A + B + C + D)*
12. Transición PSL `validated → approved` (handler + actor model)
13. `LocalHealthPlanCompiler` (con RE integrado como Parte A del PLS)

**Bloque F — Constructor Metodológico** *(puede ejecutarse en paralelo con C)*
14. `ClassificationBlocks` con contenido (EAS sociodemográfico como mínimo)
15. UI del Constructor Metodológico
16. REDCap Compiler (Nivel 1: funcional mínimo; Nivel 2: institucional COMPÁS)
17. `CONTRACT-REDCAP-VISUAL-TEMPLATE` y plantilla visual

**Bloque G — Portada institucional** *(independiente)*
18. Portada institucional que explica el sistema, el Expediente Territorial y el ciclo

### IX.3 Lo que pertenece al Sprint 3

Desde la metodología, pertenecen al Sprint 3 los objetos que requieren que el
ciclo completo de Sprint 2 esté en producción:

- La Agenda inteligente (requiere MTE operativo con ESCA integrado).
- El Seguimiento inteligente (requiere Agenda inteligente validada en producción).
- El cierre del ciclo longitudinal (Informe de Evaluación → nueva evidencia): requiere
  haber ejecutado al menos un ciclo completo de PLS.
- La Tripirámide Dinámica/SAM (requiere datos de padrón por municipio que no están disponibles).
- La Inteligencia Territorial Explicable (requiere investigación metodológica previa
  formalizada en CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE).

### IX.4 Lo que no debe construirse antes de estar metodológicamente definido

La regla es simple: **nada puede implementarse sin su contrato metodológico previo**.

- El LocalHealthPlanCompiler no puede implementarse sin `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT`.
- El MTE no puede implementarse sin decidir cómo distingue actuaciones ESCA de actuaciones municipales.
- El Resumen Ejecutivo no puede implementarse sin que `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT` decida si es la Parte A del PLS o un documento independiente.
- El Seguimiento inteligente no puede diseñarse sin un Marco de Evaluación formalmente especificado.

El riesgo de construir antes de definir no es técnico: es que el software correcto se convierte en el software equivocado cuando el modelo metodológico queda formalizado después.

---

## Nota de coherencia con el sistema documental de COMPÁS NG

Este documento es coherente con:

- **ARCHITECTURE-CONSTITUTION:** Arts. 1, 2, 5, 6, 9 son la base de los principios PM-13, PM-20 y la separación de etapas de la Parte I.
- **OPERATING-CONSTITUTION:** §1-§3 (arquitectura tres niveles, separación evidencia/interpretación/decisión) son formalizaciones de los principios PM-1, PM-2 y la Parte V.
- **CERTIFICATION-SPRINT-0-1:** El modelo metodológico aquí formalizado asume el estado certificado del Sprint 0 y Sprint 1 como base.
- **BLUEPRINT-PRODUCTION:** La Parte V amplía y profundiza la sección §V del Blueprint. La Parte IX refina la sección §X.
- **INSTITUTIONAL-PRODUCTS-ARCHITECTURE:** Las Partes I, II y IV amplían los §1-§4 de ese documento con rigor metodológico adicional.
- **BENCHMARK-INSTITUTIONAL-PRODUCTS:** Los principios PM-6, PM-9, PM-10, PM-17 emergen directamente del benchmark.

*Primera versión: 2026-06-28. Este documento es la referencia metodológica de COMPÁS NG.
No debe modificarse sin deliberación explícita del responsable del proyecto y sin
actualizar consecuentemente los contratos que de él derivan.*
