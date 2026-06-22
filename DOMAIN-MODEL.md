# COMPÁS NG — Modelo de dominio

> Documento de referencia conceptual permanente.
> Define el lenguaje ubicuo del sistema: los conceptos, sus relaciones y sus
> límites. No describe implementación técnica.
> No debe modificarse sin deliberación explícita del equipo responsable.

---

## 1. Propósito de este documento

COMPÁS NG es una herramienta de apoyo a la planificación local de salud en
municipios andaluces. Su función es organizar, preservar y facilitar el análisis
de la información municipal de salud, sin sustituir en ningún momento el juicio
técnico ni la decisión institucional del equipo de salud pública.

Este documento define los conceptos fundamentales del sistema —su **lenguaje
ubicuo**— de forma que cualquier profesional o técnico implicado en el proyecto
pueda hablar de él con precisión y sin ambigüedad. Los conceptos aquí definidos
son los únicos autorizados para nombrar entidades, relaciones y comportamientos
en el código, en la documentación y en la comunicación oral sobre el sistema.

---

## 2. Núcleo territorial

### 2.1 Municipio

El **municipio** es la unidad canónica de trabajo de COMPÁS NG. Toda operación,
todo documento y toda evidencia pertenecen a un municipio concreto y no pueden
transferirse ni agregarse entre municipios sin intervención explícita del equipo
técnico.

Un municipio en COMPÁS NG se identifica por:

- Nombre oficial.
- Provincia y comunidad autónoma.
- Código INE, cuando está disponible.

El municipio no es solo un filtro: es el **contexto de sentido** de cualquier
dato que el sistema maneje. Un indicador de mortalidad o un activo comunitario
solo tienen interpretación dentro del municipio al que pertenecen.

### 2.2 Contexto municipal

El **contexto municipal** es la representación formal del municipio dentro del
sistema: su identidad, su estado operativo y los metadatos que permiten
trazabilidad y auditoría. No contiene documentos ni evidencias; solo describe
quién es el municipio.

El contexto municipal puede estar en estado *borrador* (cuando se está
constituyendo), *activo* (cuando el proceso local está en curso) o *archivado*
(cuando el proceso ha concluido o se ha suspendido). Esta distinción no afecta
aún a la lógica del sistema, pero forma parte del vocabulario del dominio porque
guiará funciones futuras de ciclo de vida.

### 2.3 Espacio de trabajo municipal

El **espacio de trabajo** (*workspace*) es el contenedor persistente de toda la
información asociada a un municipio en una sesión de planificación activa.
Incluye el repositorio documental, los estudios complementarios, la evidencia
estructurada, las priorizaciones y cualquier otra capa de información acumulada
sobre ese municipio.

El espacio de trabajo tiene tres propiedades fundamentales:

1. **Unicidad**: existe exactamente un espacio de trabajo activo por municipio.
2. **Persistencia local**: el estado se conserva entre sesiones en el dispositivo
   del profesional que trabaja con él.
3. **Inmutabilidad de la fuente**: las operaciones sobre el espacio de trabajo
   nunca modifican retroactivamente los documentos originales que contiene.

---

## 3. Repositorio Documental Municipal

### 3.1 Documento

Un **documento** es cualquier fuente de información municipal incorporada
formalmente al repositorio. Puede ser un informe epidemiológico, una lista de
activos comunitarios, los resultados de un taller participativo, una exportación
de datos REDCap o cualquier otro material que el equipo de salud pública
considere relevante para la planificación local.

Todo documento tiene, como mínimo:

- Un **identificador único** dentro del repositorio.
- Un **tipo** que determina cómo el sistema lo procesa y qué garantías ofrece.
- Una **fuente** que registra su procedencia institucional y la fecha de
  incorporación.
- Un **título** legible para el equipo que lo incorpora.

El documento es siempre **la fuente de verdad**. Cualquier representación
derivada de él —secciones estructuradas, átomos de evidencia, resúmenes— es
secundaria y regenerable. Si hay contradicción entre el documento original y una
representación derivada, el documento original prevalece siempre.

### 3.2 Documento canónico

Un **documento canónico** es aquel del que solo puede existir una versión activa
por municipio en cada momento. Representa una realidad única e indivisible: no
tiene sentido tener dos Informes de Salud vigentes simultáneamente, ni dos
catálogos de activos comunitarios contradictorios.

Cuando se incorpora un documento canónico nuevo, el anterior deja de estar
activo de forma automática.

Tipos canónicos actuales: Informe de Salud, Activos Comunitarios.

### 3.3 Documento acumulable

Un **documento acumulable** es aquel del que pueden coexistir múltiples versiones
activas. Los estudios complementarios, los documentos del proceso participativo
o los registros endocualitativos son acumulables: cada acta, cada entrevista,
cada exportación REDCap es un documento nuevo que convive con los anteriores sin
sustituirlos.

### 3.4 Sustitución documental

La **sustitución documental** es el acto por el que un documento canónico nuevo
reemplaza al anterior. Este acto tiene tres consecuencias simultáneas e
inseparables:

1. El documento anterior deja de estar activo en el repositorio.
2. Todas las representaciones derivadas vinculadas al documento anterior
   se eliminan del sistema.
3. El documento nuevo queda registrado como la fuente canónica vigente.

La sustitución no destruye información si el equipo conserva el fichero original
fuera del sistema — pero sí borra toda la información que el sistema había
derivado del documento anterior. Por eso requiere deliberación explícita.

### 3.5 Persistencia documental

La **persistencia documental** es la garantía de que los documentos incorporados
al repositorio permanecen disponibles entre sesiones de trabajo. En la
implementación actual, la persistencia es local (en el dispositivo del
profesional). La persistencia documental no implica sincronización entre
dispositivos ni respaldo centralizado en esta fase del proyecto.

---

## 4. Contrato documental

El **contrato documental** establece cómo puede usarse un documento en el
sistema: qué transformaciones son legítimas, qué representaciones se pueden
derivar, qué puede alimentar los motores analíticos y qué garantías debe cumplir
cada nivel del proceso.

El contrato se organiza en cinco niveles:

```
Nivel 1 — Documento original
          La fuente de verdad. Se preserva íntegra.
          Nunca se modifica después de su incorporación.
               │
               ▼
Nivel 2 — Representación estructurada
          Organización fiel del contenido del documento.
          No interpreta: segmenta, clasifica estructuralmente, formatea.
          Regenerable desde el Nivel 1.
               │
               ▼  ← FRONTERA DE EXPLOTACIÓN
Nivel 3 — Extracción controlada
          Transformación del contenido en unidades analíticas.
          Cada unidad lleva trazabilidad completa hasta el Nivel 1.
          Requiere validación humana antes de influir en una decisión.
          Regenerable desde el Nivel 1.
               │
               ▼
Nivel 4 — Evidence
          Colección de unidades analíticas disponibles para los motores.
          Desacoplada del documento original.
          Auditable: cada unidad puede rastrearse hasta su fuente.
               │
               ▼
Nivel 5 — Motor analítico
          Transforma la Evidence en propuestas, lecturas o candidatos.
          Nunca modifica documentos ni Evidence.
          Sus outputs son siempre propuestas, nunca decisiones.
          Requieren validación profesional explícita.
```

### La frontera de explotación

La **frontera de explotación** separa los niveles de representación fiel (1 y 2)
de los niveles de interpretación (3, 4 y 5). Cruzar esta frontera es un acto
deliberado que cambia la naturaleza de la información:

- **Antes de la frontera**: el sistema afirma que esto es lo que el documento
  dice. La garantía es documental.
- **Después de la frontera**: el sistema propone que esto puede ser analíticamente
  relevante. La garantía es metodológica y requiere validación.

No debe cruzarse la frontera de explotación sin que la unidad resultante lleve
marcada esa naturaleza provisional.

### Documento original frente a Interpretación

| Concepto | Naturaleza | Modificable | Regenerable |
|---|---|:---:|:---:|
| Documento original | Fuente de verdad | No | — |
| Representación estructurada | Fiel al documento | No (si es fiel) | Sí |
| Extracción controlada | Interpretación provisional | Sí (con validación) | Sí |
| Evidence | Pool analítico | Solo por extracción | Sí |
| Output de motor | Propuesta regenerable | Por definición | Sí |
| Decisión (generada) | Acto automático del sistema | — | No existe |
| Decisión (registrada) | Hecho documentado y trazable | Solo por personas competentes | Sí, como fuente preservada |

### Sobre las decisiones institucionales

COMPÁS NG nunca genera decisiones institucionales. Ningún output del sistema
constituye por sí solo una decisión del Grupo Motor, del equipo técnico ni de
ningún órgano municipal.

Sin embargo, COMPÁS NG sí puede **registrar, preservar y relacionar** decisiones
adoptadas por personas u órganos competentes. Una decisión registrada en el
sistema es un **hecho documentado y trazable**: quién la adoptó, cuándo, en qué
contexto y qué documentos la respaldaron. Forma parte de la memoria longitudinal
del proceso, no del pipeline analítico.

El sistema nunca valida si una decisión es correcta. Solo la preserva como
evidencia del proceso.

---

## 5. Familias documentales

Los documentos se agrupan en **familias** según su naturaleza, su ciclo de vida
y el tipo de pipeline que el sistema aplica sobre ellos. La familia determina
las garantías que el repositorio ofrece para ese documento.

### 5.1 Informe / Perfil de Salud

El **Informe de Salud** o **Perfil de Salud Local** es el documento epidemiológico
principal del municipio. Está elaborado y firmado por el equipo epidemiológico
competente. Describe el estado de salud de la población: demografía, mortalidad,
morbilidad, factores de riesgo, determinantes y, en algunos formatos, recursos
y activos.

Características de dominio:

- Es un **documento canónico**: solo puede haber uno activo por municipio.
- Se preserva **íntegramente** como fuente primaria literal. No se resume, no
  se parafrasea, no se extrae automáticamente sin validación explícita.
- Tiene **autoría institucional** identificable: quién lo firma tiene relevancia
  para la trazabilidad del diagnóstico.
- Puede estructurarse en **secciones** con significado semántico propio
  (introducción, metodología, resultados, mortalidad, morbilidad, etc.).
- La sección es una representación estructurada del documento, no una
  interpretación de su contenido.

El Informe de Salud es la única fuente documental que el sistema presenta al
profesional en su forma literal, sin mediación analítica, porque su contenido
requiere lectura técnica especializada que el sistema no puede sustituir.

### 5.2 Activos Comunitarios

Los **Activos Comunitarios** son los recursos, capacidades, espacios, redes,
personas y organizaciones del municipio que pueden apoyar estrategias de salud
desde un enfoque salutogénico. Representan lo que el territorio tiene, no lo que
le falta.

Características de dominio:

- Son un **documento canónico**: el catálogo vigente de activos es único.
- Pueden provenir de fuentes diversas: Localiza Salud, elaboración propia del
  equipo, aportaciones comunitarias, o cualquier combinación.
- Cada activo individual es la unidad mínima de sentido: un espacio concreto,
  una asociación identificable, una red con nombre.
- Son **entidades estructuradas con identidad propia**: cada activo identificado
  en el catálogo (un espacio, una red, una organización) es ya una unidad con
  sentido sin necesidad de segmentación adicional. Esta representación estructurada
  no requiere cruzar la frontera de explotación.
- Sin embargo, toda **interpretación sobre su relevancia, accesibilidad, impacto
  potencial o articulación con intervenciones** pertenece al plano analítico y
  requiere validación profesional explícita. Que un activo esté identificado no
  implica que sea adecuado para una determinada estrategia de salud: esa
  valoración es siempre humana.

La sustitución del catálogo de activos elimina el análisis derivado del catálogo
anterior. La decisión de cuándo y por qué sustituir el catálogo es siempre del
equipo profesional.

### 5.3 Estudios Complementarios

Los **Estudios Complementarios** son instrumentos de medición cuantitativa que
aportan dimensiones del estado de salud de la población que el Informe de Salud
puede no cubrir o cubrir de forma agregada. Se administran sobre la población
municipal mediante exportaciones REDCap y producen datos procesados localmente.

Características de dominio compartidas:

- Procesan registros individuales que **no se almacenan**: solo sobreviven los
  agregados estadísticos calculados.
- Los registros individuales se descartan en el momento del procesamiento, por
  razones de privacidad y de innecesariedad: el dato relevante para la
  planificación es el indicador municipal, no el registro personal.
- Cada instrumento es **independiente**: sus resultados coexisten sin conflicto
  con los demás.
- Ningún instrumento alimenta automáticamente motores analíticos: sus resultados
  son datos de contexto que requieren interpretación técnica especializada.

#### IBSE — Índice de Bienestar Socioemocional

El IBSE mide el bienestar socioemocional de la población escolar mediante
8 ítems agrupados en 4 factores (vínculo, situación, control, persona) y un
índice total. Su metodología es la de Bericat (2014). Sus resultados son medias
municipales por factor e índice total, con el número de registros válidos y
totales.

#### SF-12 — Salud percibida (versión corta)

El SF-12 mide la salud percibida en dos componentes: salud física (PCS-12) y
salud mental (MCS-12). Sus resultados son medias municipales de ambos
componentes, con referencia a baremos poblacionales cuando estén disponibles.

#### DUKE — Perfil de Salud de Duke

El DUKE mide la salud desde múltiples dimensiones (física, mental, social, dolor,
discapacidad, estado general de salud). Sus resultados son medias municipales
de cada subescala.

#### PREDIMED — Adherencia a la Dieta Mediterránea

PREDIMED mide el grado de adherencia a la dieta mediterránea mediante un
cuestionario de 14 ítems. Sus resultados son la puntuación media municipal y la
distribución por categorías de adherencia (baja, media, alta).

#### Instrumentos futuros

La familia de Estudios Complementarios está diseñada para incorporar nuevos
instrumentos sin cambiar la arquitectura del sistema. Todo instrumento nuevo debe
especificar: su origen (REDCap o equivalente), sus columnas de datos, sus
agregados calculados y sus cautelas metodológicas relevantes.

### 5.4 Priorización Temática

La **Priorización Temática** es el proceso deliberativo por el que la ciudadanía
y el equipo técnico identifican las temáticas de salud prioritarias para el Plan
Local. En COMPÁS NG se articula en dos conceptos distintos:

**Estudio de Priorización** (*ThematicPrioritisationStudy*): el resultado
estadístico del proceso participativo. Registra los votos ciudadanos, los
porcentajes de cada temática, el ranking y las cautelas metodológicas sobre la
muestra. Es un dato empírico del proceso.

**Decisión de Priorización** (*ThematicPrioritisation*): la decisión técnica y
deliberativa sobre qué temas se incorporan al Plan. Es un acto humano explícito.
Puede coincidir con el ranking del estudio, divergir justificadamente o
complementarlo con criterios técnicos adicionales.

La diferencia entre ambos es fundamental: el estudio informa, la decisión
compromete. COMPÁS NG registra ambos, pero solo facilita el primero — la
decisión la toma siempre el equipo.

### 5.5 Documentos del proceso

Los **documentos del proceso** son los registros formales generados durante el
propio proceso de planificación participativa del Plan Local de Salud. Incluyen:

- Actas de reuniones del Grupo Motor.
- Convocatorias y listas de asistencia de talleres y jornadas.
- Presentaciones institucionales de resultados.
- Informes de seguimiento de compromisos.
- Comunicaciones institucionales relevantes para el proceso.
- Registros de hitos: inicio del proceso, aprobaciones, publicaciones.
- **Actos institucionales formales**: acuerdos del Grupo Motor, validaciones
  técnicas, actas de aprobación del Plan Local, modificaciones acordadas y
  cualquier otro hecho de gobernanza que el proceso haya generado y que merezca
  preservación trazable.

Los documentos del proceso son acumulables: cada acta es un documento nuevo,
no una versión que sustituye a la anterior. Forman una secuencia temporal que
puede ser la base de la memoria longitudinal del proceso.

A diferencia del Informe de Salud o los Activos Comunitarios, los documentos
del proceso no tienen un pipeline de extracción definido: son fuentes
consultables que alimentan la comprensión del proceso, no la base del diagnóstico
epidemiológico.

### 5.6 Evidencia endocualitativa

La **evidencia endocualitativa** es la información narrativa generada dentro del
propio proceso local de salud, que da cuenta de la experiencia, la percepción y
la voz de los actores implicados en él. El prefijo *endo* señala que esta
información nace desde dentro del proceso, no se importa de fuentes externas.

La evidencia endocualitativa incluye:

- Grupos focales con ciudadanía o colectivos específicos.
- Entrevistas individuales o grupales con informantes clave.
- Talleres RELAS o similares de diagnóstico participativo.
- Jornadas de deliberación o priorización.
- Notas de campo del equipo técnico durante el proceso.
- Síntesis de aportaciones ciudadanas.
- Registros de desacuerdos, cambios de orientación y rupturas en el proceso.

#### Qué hace diferente a la evidencia endocualitativa

La evidencia endocualitativa no es simplemente un "documento del proceso". Es,
específicamente, información que capta **cómo los actores del territorio
comprenden, viven y nombran su propia salud y sus determinantes**. Esta
información no puede derivarse de indicadores epidemiológicos ni de encuestas
estandarizadas: emerge del encuentro entre el equipo técnico y la comunidad.

Su valor para la planificación radica precisamente en eso: es la voz que los
datos cuantitativos no capturan, el matiz que el Informe de Salud no puede
registrar, el contexto que hace comprensibles los indicadores.

#### Cómo debe tratarse

- Se preserva como fuente original en el repositorio documental, sin edición ni
  síntesis automática.
- No debe transformarse automáticamente en unidades de evidencia analítica: la
  interpretación de un grupo focal requiere técnicas cualitativas especializadas
  que el sistema no puede aplicar.
- Puede incorporarse a la memoria longitudinal del proceso como registro de hitos
  y voces.
- Su integración futura en motores analíticos, si se decide, requerirá un
  protocolo específico de extracción cualitativa con validación profesional.

---

## 6. Memoria longitudinal municipal

La **memoria longitudinal** es el registro acumulado y ordenado en el tiempo del
proceso de planificación de un municipio. No es un documento único: es una capa
interpretativa que relaciona todos los documentos, estudios, eventos y decisiones
del proceso en su secuencia temporal.

La memoria longitudinal tiene cuatro dimensiones:

### 6.1 Evolución cuantitativa

Seguimiento de los indicadores medibles que reflejan el estado de salud del
municipio a lo largo del tiempo: datos IBSE de años sucesivos, evoluciones del
Perfil de Salud, resultados de PREDIMED en distintos ciclos, etc. La evolución
cuantitativa requiere que los estudios sucesivos sean comparables metodológicamente.

### 6.2 Evolución documental

Registro de los documentos que han sido incorporados, sustituidos o archivados
en el repositorio: qué versión del Informe de Salud estuvo vigente en cada
período, cuándo se actualizó el catálogo de activos, qué estudios se incorporaron
en qué momento. La evolución documental es la trazabilidad del repositorio a
través del tiempo.

### 6.3 Evolución endocualitativa

Secuencia de los registros de evidencia endocualitativa: qué talleres se
realizaron, con quiénes, qué voces estuvieron presentes, qué temas emergieron,
cómo cambió la percepción de los actores entre distintos momentos del proceso.
La evolución endocualitativa es la historia del proceso desde la perspectiva de
sus protagonistas.

### 6.4 Hechos de gobernanza, decisiones y cambios de orientación

Los **hechos de gobernanza** son los actos institucionales que marcan la
dirección y el estado formal del proceso de planificación: constitución del
Grupo Motor y su composición, aprobación del diagnóstico, adopción de las
prioridades, validaciones técnicas intermedias, adopción del Plan Local,
modificaciones formales y suspensión o reinicio del proceso.

Son distintos de los documentos del proceso (aunque con frecuencia los documentos
del proceso —actas, certificaciones— los formalizan) y distintos de la evidencia
endocualitativa (que captura voces y experiencias, no actos institucionales).

COMPÁS NG puede registrar estos hechos como entradas trazables de la memoria
longitudinal: quién los adoptó, cuándo, con qué respaldo documental y con qué
consecuencias para el proceso. Lo que el sistema nunca hace es generar ni
validar estos actos — solo los preserva una vez que han ocurrido.

Este registro no es un log técnico: es la narrativa institucional del proceso
que permite entender por qué el municipio está donde está hoy, qué compromisos
se adoptaron y qué caminos se descartaron.

### Importancia del concepto

La memoria longitudinal no está implementada aún en COMPÁS NG. Pero es un
concepto de dominio central que debe estar presente en el modelo porque:

1. Toda decisión de arquitectura sobre documentos y persistencia tiene
   consecuencias sobre la posibilidad de construir esta memoria.
2. Los profesionales de salud pública que usan el sistema tienen una expectativa
   legítima de que el sistema recuerde el proceso, no solo su estado actual.
3. La memoria longitudinal es lo que permite que el conocimiento construido en un
   proceso no se pierda cuando cambia el equipo técnico responsable.

---

## 7. Estudios Complementarios: filosofía arquitectónica

Los Estudios Complementarios comparten una **infraestructura común** y se
especializan mediante **instrumentos independientes**.

### Infraestructura común

Todos los instrumentos cuantitativos de COMPÁS NG comparten:

- El mismo ciclo de vida: importación CSV REDCap → cómputo de agregados →
  descarte de individuales → preservación de resultados.
- Los mismos metadatos de estudio: municipio, fichero fuente, fecha de
  importación, registros totales y válidos, cautelas metodológicas.
- La misma posición en el sistema: datos de contexto municipal, desacoplados de
  los motores analíticos y de EAS.
- La misma garantía de privacidad: ningún registro individual persiste nunca.

### Instrumentos especializados

Cada instrumento tiene:

- Sus propios campos de agregados, con la terminología específica de su
  metodología.
- Su propio parser para la estructura de columnas de su exportación REDCap.
- Su propio panel de visualización, adaptado a la semántica de sus resultados.
- Su propia documentación metodológica (cautelas, referencias, interpretación).

La infraestructura es común; la especialización es modular.

### Independencia respecto a EAS y CMI

Los Estudios Complementarios son independientes de las variables EAS (Evaluación
de Activos de Salud) y de los indicadores CMI (Cuadro de Mando Integral). No se
mezclan en el mismo pipeline, no comparten el modelo de datos y no deben
fusionarse artificialmente solo porque todos sean cuantitativos.

EAS y CMI corresponden a sistemas de indicadores institucionales distintos,
con fuentes de datos, periodicidad y semántica propias. Si en el futuro COMPÁS NG
los incorpora, requerirán su propia familia documental.

### Integración futura sin acoplamiento

Los resultados de los Estudios Complementarios podrán, en el futuro, alimentar
motores de análisis contextual o de triangulación diagnóstica. Cuando eso ocurra,
la integración seguirá el contrato documental: los agregados son datos de contexto
(Nivel 1), no unidades de evidencia analítica inmediata (Nivel 3). La decisión
de cruzar la frontera de explotación documental para cada instrumento será
explícita, con el motor y las garantías metodológicas correspondientes.

---

## 8. La EAS como referencia metodológica primaria

### 8.1 Posición de la Encuesta Andaluza de Salud

La **VI Encuesta Andaluza de Salud** (EAS) es la fuente metodológica de referencia de COMPÁS NG
para la clasificación sociodemográfica de la población y para la definición de variables de salud
en el contexto de la planificación local.

Esta posición de primacía se concreta en tres planos:

- **Comparabilidad**: los resultados de estudios municipales son comparables con los microdatos
  provinciales y autonómicos cuando se utilizan los mismos instrumentos, categorías y
  codificaciones que la EAS.
- **Coherencia institucional**: la EAS es el instrumento oficial de referencia en salud pública
  en Andalucía. Utilizarla como base garantiza alineamiento con el sistema de información
  de salud autonómico.
- **Trazabilidad**: los módulos metodológicos derivados de la EAS mantienen correspondencia
  explícita con variables `.sav`, etiquetas de valor, filtros y lógica de salto del instrumento
  oficial.

### 8.2 Principio de primacía

Cuando exista una variable equivalente en la EAS, debe utilizarse su definición, codificación,
categorías y lógica. No deben crearse versiones alternativas salvo justificación técnica expresa.

El orden de preferencia es:

1. **EAS** — primera opción siempre que exista variable equivalente.
2. **Otras fuentes oficiales** (INE, IECA, CIS) — únicamente cuando la EAS no recoja la variable
   necesaria, cuando exista necesidad de armonización externa documentada, o cuando se justifique
   metodológicamente de forma explícita.
3. **Módulos municipales propios** — para dimensiones no cubiertas por ninguna fuente oficial,
   con documentación de la justificación de la desviación.

### 8.3 Consecuencias para la Biblioteca Metodológica

La Biblioteca Metodológica Canónica contempla módulos derivados de la EAS como categorías de
primera clase:

- **Módulo sociodemográfico EAS** (*eas-sociodemographic*): variables de clasificación de la
  población según los criterios y codificaciones oficiales de la Encuesta Andaluza.
- **Bloque oficial EAS** (*eas-official-block*): sección completa del instrumento EAS, con
  preguntas, opciones de respuesta y lógica de salto fieles al cuestionario oficial.

Los módulos de otras fuentes externas se clasifican como *external-official-module* y requieren
justificación explícita para su inclusión.

### 8.4 Trazabilidad hacia los microdatos

Cada módulo derivado de la EAS debe mantener trazabilidad explícita hacia:

- pregunta oficial (texto exacto del cuestionario);
- variable `.sav` en los microdatos de la encuesta;
- etiquetas de valor y codificación numérica;
- filtros aplicados antes de su administración;
- lógica de salto (*branching logic*);
- algoritmo de cálculo de variables derivadas, cuando exista;
- limitaciones metodológicas conocidas.

Esta trazabilidad garantiza que un equipo técnico pueda auditar la correspondencia entre
los datos municipales recogidos y los microdatos oficiales sin ambigüedad.

### 8.5 La Encuesta Municipal de Salud

La futura **Encuesta Municipal de Salud** se construirá preferentemente mediante:

1. clasificación sociodemográfica basada en la EAS;
2. bloques oficiales EAS seleccionados según necesidades del municipio;
3. escalas complementarias validadas (IBSE, SF-12, DUKE, CAGE, PREDIMED, IPAQ y otras);
4. módulos específicos municipales justificados metodológicamente.

Este diseño maximiza la comparabilidad con los microdatos oficiales y minimiza la necesidad
de adaptación posterior.

El **Constructor de Cuestionarios**, cuando se implemente, propondrá el bloque sociodemográfico
EAS como punto de partida por defecto para cualquier nuevo estudio o Encuesta Municipal de Salud.
La adición de módulos externos o personalizados será siempre un paso posterior y explícito.

---

## 9. La IA en COMPÁS NG

### Posición conceptual

La inteligencia artificial, en cualquiera de sus formas, tiene en COMPÁS NG
una posición **asistencial y subordinada**. No es un motor de decisiones, no es
una fuente de autoridad y no es el sujeto de las conclusiones del sistema.

### Lo que la IA puede hacer

- Ayudar al profesional a navegar por el repositorio documental.
- Sugerir interpretaciones posibles de los datos, señalando explícitamente su
  carácter provisional.
- Facilitar la redacción de síntesis o resúmenes que el profesional revisa y
  valida antes de incorporarlos al proceso.
- Identificar patrones en la evidencia que el equipo técnico puede considerar o
  descartar.

### Lo que la IA no puede hacer en ninguna circunstancia

- **Modificar el documento fuente.** Ningún proceso automático, de IA o no,
  puede alterar un documento original del repositorio.
- **Generar automáticamente decisiones institucionales.** Las prioridades del
  Plan Local, los objetivos, las líneas de acción y los compromisos son siempre
  producto de decisión humana.
- **Presentar inferencias como evidencia.** Lo que la IA infiere a partir de los
  datos es una propuesta interpretativa, no un hecho documentado.
- **Sustituir el juicio profesional.** El equipo de salud pública es siempre el
  responsable de las conclusiones técnicas del proceso.

### Principio de transparencia asistencial

Cuando el sistema emplee IA para generar cualquier contenido visible al
profesional, ese contenido debe estar claramente marcado como generado
asistencialmente, distinguido del contenido documental y sometido a validación
explícita antes de poder incorporarse al repositorio o al proceso.

---

## 10. Glosario de términos canónicos

Los términos siguientes tienen un significado preciso en COMPÁS NG y no deben
usarse con acepciones distintas en el código, la documentación ni la
comunicación del proyecto.

| Término | Definición canónica |
|---|---|
| **Municipio** | Unidad territorial de trabajo. Contexto obligatorio de toda operación. |
| **Workspace** | Contenedor persistente del estado completo de un municipio en proceso. |
| **Repositorio Documental** | Colección de documentos oficiales de un municipio, con metadatos de procedencia. |
| **Documento** | Fuente de información municipal incorporada formalmente al repositorio. |
| **Documento canónico** | Documento del que solo puede haber una versión activa por municipio. |
| **Documento acumulable** | Documento del que pueden coexistir múltiples versiones activas. |
| **Sustitución** | Reemplazo de un documento canónico que elimina el anterior y sus derivados. |
| **Familia documental** | Categoría de documentos con ciclo de vida y pipeline compartidos. |
| **Representación estructurada** | Organización fiel del contenido de un documento. No interpreta. |
| **Extracción controlada** | Transformación de contenido en unidades analíticas, con trazabilidad completa. |
| **Evidence** (*EvidenceAtom*) | Unidad mínima de información analítica extraída y trazable hasta su fuente. |
| **EvidenceStore** | Colección de unidades de evidencia de un municipio, consumible por motores. |
| **Motor analítico** | Función que transforma evidencia en propuestas. Nunca produce decisiones. |
| **Frontera de explotación** | Límite entre representación fiel e interpretación analítica. |
| **Informe de Salud** | Documento epidemiológico principal, canónico, preservado íntegramente. |
| **Activos Comunitarios** | Catálogo de recursos del territorio, canónico, con identidad estructurada propia. |
| **Estudio Complementario** | Instrumento cuantitativo que produce agregados municipales sin registros individuales. |
| **Priorización Temática** | Par compuesto por estudio participativo (empirismo) y decisión técnica (deliberación). |
| **Evidencia endocualitativa** | Información narrativa generada dentro del proceso local de salud. |
| **Hecho de gobernanza** | Acto institucional del proceso (constitución del Grupo Motor, aprobación de prioridades, adopción del Plan) registrable como entrada trazable de la memoria longitudinal. |
| **Memoria longitudinal** | Capa interpretativa que relaciona documentos, eventos y decisiones en el tiempo. |
| **Propuesta** | Output de un motor. Requiere validación profesional explícita antes de devenir decisión. |
| **Decisión** | Acto institucional explícito adoptado por personas u órganos competentes. COMPÁS NG puede registrarla como hecho documentado y trazable, pero nunca la genera ni la valida. |
| **Encuesta Andaluza de Salud (EAS)** | Fuente metodológica de referencia primaria de COMPÁS NG para clasificación sociodemográfica y variables de salud. La VI edición es la vigente. |
| **Biblioteca Metodológica Canónica** | Colección de módulos metodológicos que sirve como fuente única de verdad para instrumentos de medición. Parsers, motores e IA derivan de ella; no la sustituyen. |
| **Módulo Metodológico** | Unidad básica de la Biblioteca: descriptor declarativo de un instrumento (ítems, dimensiones, algoritmo, interpretación, adaptadores). Puede ser una escala validada, un bloque EAS, un módulo municipal u otro tipo canónico. |
| **Constructor de Cuestionarios** | Componente futuro que permite construir Encuestas Municipales de Salud a partir de módulos de la Biblioteca. Propondrá el bloque sociodemográfico EAS como punto de partida por defecto. |

---

*Última revisión: 2026-06-22*
*Documento creado tras las auditorías de repositorio documental, contrato de
explotación y arquitectura de Estudios Complementarios, e incorporando las tres
modificaciones aprobadas en la revisión final.*
*Revisión 2026-06-22: sección 8 añadida — la EAS como referencia metodológica primaria;
glosario ampliado con términos de la Biblioteca Metodológica.*
