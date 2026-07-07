# COMPÁS NG — Catálogo de Conocimiento Territorial

> Documento metodológico de referencia para el Perfil de Salud Local y el proceso de planificación.
> No propone implementación ni arquitectura de datos.
> No recopila indicadores ni estadísticas.
> Construye exclusivamente la estructura del conocimiento territorial que puede alimentar
> el diagnóstico, la planificación y la evaluación en salud local.
>
> Municipios de contraste utilizados en la validación metodológica de la estructura:
> Granada-Zaidín · Atarfe · Churriana de la Vega · Padul · Zagra.
>
> Fecha de emisión: 2026-07-03

---

## Propósito

Un catálogo de conocimiento territorial no es una lista de indicadores. Es la descripción de
qué tipos de conocimiento existen sobre un territorio, qué función metodológica cumple cada uno
y qué preguntas diagnósticas permite responder.

La distinción entre catálogo de conocimiento e inventario de indicadores es metodológicamente
crítica. Un indicador es una medida concreta: un número, una proporción, una tasa. Un tipo de
conocimiento es la familia a la que pertenece ese indicador y el significado que le da contexto.
El catálogo se sitúa en el nivel del tipo; la selección de indicadores específicos es una
decisión técnica posterior que corresponde a cada proceso diagnóstico concreto.

COMPÁS NG necesita este catálogo porque:

- El sistema debe reconocer qué tipo de conocimiento aporta cada fuente que se incorpora
  al EvidenceStore, para organizar la interpretación territorial de forma coherente.
- El Perfil de Salud Local debe presentar la evidencia organizada por familias de conocimiento,
  no por fuentes o instrumentos.
- El proceso de priorización y planificación requiere que los actores del Grupo Motor entiendan
  qué tipo de conocimiento respalda cada candidatura técnica de intervención.
- La evaluación necesita saber qué tipo de conocimiento se modificó como resultado del plan.

---

## Nota metodológica: la escala como restricción fundamental

El conocimiento territorial solo es útil para la planificación local si está disponible a la
escala del territorio que se diagnostica. Esta restricción no es técnica: es metodológica.

Para los municipios donde opera COMPÁS NG, la escala presenta tres situaciones:

**Municipios grandes con subdivisiones internas** (como Granada-Zaidín): la mayor parte del
conocimiento existe a escala de ciudad o distrito sanitario, no de barrio. Producir un diagnóstico
específico del barrio requiere instrumentos de recogida propia o acceso a microdatos.

**Municipios medianos** (como Atarfe o Churriana de la Vega): la mayor parte del conocimiento
oficial existe a escala de Zona Básica de Salud o de municipio. Las fuentes nacionales y
autonómicas ofrecen datos utilizables, aunque con márgenes de incertidumbre para muestras
pequeñas.

**Municipios pequeños** (como Padul o Zagra): la mayor parte del conocimiento oficial no existe
a escala municipal con suficiente fiabilidad estadística. Los datos disponibles corresponden a
la Zona Básica de Salud, al Distrito Sanitario o a la provincia. En estos contextos, los
instrumentos de recogida propia —como los estudios complementarios de COMPÁS NG— son la única
fuente de conocimiento específicamente municipal disponible.

La columna **Escala territorial** de cada familia de este catálogo recoge estas restricciones.
Cuando la escala disponible no coincide con la escala municipal, el conocimiento puede usarse
como contexto o como proxy, pero siempre declarando esa limitación en el Perfil.

---

## Estructura del catálogo

El catálogo organiza el conocimiento territorial en **ocho macrofamilias** y **veinte familias**.

Cada familia se describe mediante ocho dimensiones:

| Dimensión | Descripción |
|---|---|
| **Definición** | Qué tipo de conocimiento abarca esta familia |
| **Finalidad metodológica** | Para qué sirve en el proceso de planificación |
| **Utilidad diagnóstica** | Qué añade al Perfil que ninguna otra familia puede aportar |
| **Preguntas que permite responder** | Las preguntas diagnósticas que esta familia ilumina |
| **Posibles fuentes** | Dónde puede obtenerse este conocimiento en el contexto andaluz |
| **Frecuencia de actualización** | Con qué periodicidad cambia este conocimiento |
| **Escala territorial disponible** | A qué nivel geográfico está disponible habitualmente |
| **Productos que alimenta** | Qué productos de COMPÁS NG se benefician de esta familia |

Los productos son: **PSL** (Perfil de Salud Local), **PA** (Plan de Acción), **PLS** (Plan Local de Salud), **EV** (Evaluación).

---

## MACROFAMILIA I — TERRITORIO Y POBLACIÓN

El conocimiento sobre quiénes viven en el territorio y cómo están distribuidos es el conocimiento
de base: condiciona la interpretación de todo lo demás. Los mismos indicadores de salud significan
cosas distintas en un municipio envejecido que en uno con alta proporción de menores.

---

### F-01. Estructura demográfica y composición poblacional

**Definición**
Descripción de quién vive en el territorio: cuántas personas, de qué edades, de qué sexos,
con qué composición de hogares, con qué tendencias de crecimiento o declive.

**Finalidad metodológica**
Contextualiza toda la evidencia de salud. Sin saber quién vive en el territorio, no es posible
interpretar qué significan sus indicadores de salud, qué grupos merecen atención preferente
o qué actuaciones son relevantes.

**Utilidad diagnóstica**
Permite detectar riesgos estructurales derivados de la composición de la población: envejecimiento
extremo, alta proporción de menores, desequilibrios de género por migración, dependencia
demográfica elevada.

**Preguntas que permite responder**
- ¿Cuántas personas viven en el territorio y cómo se distribuyen por edad y sexo?
- ¿Está el municipio envejeciendo o rejuveneciendo?
- ¿Qué proporción de la población está en edades de alta dependencia sanitaria?
- ¿Hay concentraciones de grupos de edad específicos en zonas del territorio?

**Posibles fuentes**
Padrón Municipal de Habitantes (INE, anual); Estadísticas del Movimiento Natural de la
Población (INE); proyecciones demográficas municipales (INE/IECA); datos del Registro Civil.

**Frecuencia de actualización**
Anual (Padrón). Las tendencias demográficas relevantes cambian con lentitud suficiente para
que una actualización cuatrienal sea aceptable para la planificación.

**Escala territorial disponible**
Municipal. Es una de las pocas familias con datos fiables a escala de municipio, incluidos
los de menos de 1.000 habitantes.

**Productos que alimenta**
PSL (capítulo de contexto territorial, denominadores para indicadores), PA (población diana
de cada actuación), PLS (estimaciones de alcance de las actuaciones), EV (cambios en la
estructura demográfica entre ciclos).

---

### F-02. Distribución territorial, movilidad y accesibilidad

**Definición**
Descripción de cómo está organizado el territorio: densidad, dispersión, existencia de
pedanías o núcleos secundarios, distancias a servicios esenciales, conectividad con el
entorno comunitario.

**Finalidad metodológica**
La distribución del territorio condiciona el acceso a los recursos de salud y la viabilidad
de las actuaciones planificadas. Un municipio muy disperso tiene restricciones operativas
distintas de uno compacto de igual tamaño demográfico.

**Utilidad diagnóstica**
Revela barreras de acceso no detectables por indicadores de salud: poblaciones que no acceden
a los servicios no por falta de oferta sino por distancia o transporte.

**Preguntas que permite responder**
- ¿Hay zonas del territorio con acceso limitado a centros de salud, servicios sociales o espacios comunitarios?
- ¿La dispersión geográfica actúa como determinante de inequidad en el acceso?
- ¿Qué actuaciones son inviables por razones de accesibilidad territorial?

**Posibles fuentes**
Catastro; cartografía municipal; datos del Plan de Ordenación del Territorio (IECA, DERA);
información sobre transporte público (municipio, Junta); datos de pedanías y núcleos (INE).

**Frecuencia de actualización**
Baja (la distribución territorial cambia muy lentamente). Relevante cuando hay crecimiento
urbanístico significativo o cambios en el transporte.

**Escala territorial disponible**
Municipal y submunicipal. La información cartográfica es el mejor aliado para esta familia.

**Productos que alimenta**
PSL (contexto territorial, factores de accesibilidad), PA (criterios de viabilidad operativa),
PLS (planificación diferencial por zonas).

---

## MACROFAMILIA II — CONDICIONES ESTRUCTURALES DE VIDA

Las condiciones de vida son los determinantes sociales de la salud. Este conocimiento explica
por qué la salud está distribuida desigualmente en el territorio. Sin él, el Perfil solo
describe el estado de salud; no lo explica.

---

### F-03. Condición socioeconómica y desigualdad material

**Definición**
Descripción de los recursos económicos de la población: nivel de renta, pobreza, privación
material, deuda, seguridad económica y distribución de la riqueza dentro del territorio.

**Finalidad metodológica**
La condición socioeconómica es el determinante con mayor capacidad predictiva del estado de
salud. Su presencia en el Perfil convierte el diagnóstico de salud en un análisis de causas,
no solo de consecuencias.

**Utilidad diagnóstica**
Permite identificar si las diferencias de salud observadas en el territorio están distribuidas
a lo largo del gradiente socioeconómico (indicación de desigualdad estructural) o son
transversales a todos los grupos (indicación de problema ambiental o epidémico).

**Preguntas que permite responder**
- ¿Qué proporción de la población vive en situación de pobreza o privación material?
- ¿Hay zonas del territorio con mayor concentración de pobreza?
- ¿Las diferencias de salud observadas siguen el gradiente socioeconómico?

**Posibles fuentes**
Atlas de Distribución de Renta de los Hogares (INE); Encuesta de Condiciones de Vida (INE);
Indicadores de pobreza y exclusión social (IECA); informe FOESSA (Cáritas);
datos de servicios sociales municipales sobre situaciones de vulnerabilidad económica.

**Frecuencia de actualización**
Bienal (ECV). Los cambios estructurales en la distribución de la renta son lentos; los cambios
en pobreza pueden ser más rápidos en contextos de crisis.

**Escala territorial disponible**
El Atlas de Renta ofrece datos a escala de sección censal para municipios grandes. Para
municipios pequeños (como Zagra), los datos son de nivel provincial o autonómico. Los datos
de servicios sociales municipales son la mejor fuente local de pobreza en municipios pequeños.

**Productos que alimenta**
PSL (contexto estructural, explicación de las desigualdades observadas), PA (identificación
de grupos prioritarios por nivel de riesgo socioeconómico), PLS (equidad como criterio de
priorización), EV (cambios en la distribución de la renta asociados al plan).

---

### F-04. Empleo, condiciones laborales y economía local

**Definición**
Descripción de la situación laboral de la población: tasa de empleo y desempleo, tipo de
contratación, sectores económicos predominantes, trabajo informal, precarización y riesgos
laborales específicos del territorio.

**Finalidad metodológica**
El empleo actúa como determinante de salud a través de múltiples vías: renta, horarios,
estrés, exposición a riesgos físicos y químicos, identidad social. La economía local
determina qué tipo de empleo es posible y qué grupos están en mayor riesgo.

**Utilidad diagnóstica**
Explica patrones de morbilidad que no son visibles en los indicadores de salud sin
contexto laboral: municipios con alta presencia de agricultura intensiva pueden mostrar
perfiles de salud distintos a municipios industriales o de servicios.

**Preguntas que permite responder**
- ¿Qué sectores económicos predominan y qué riesgos laborales específicos conllevan?
- ¿El desempleo está concentrado en algún grupo de edad o colectivo?
- ¿Existe trabajo estacional que genere inseguridad económica periódica?

**Posibles fuentes**
Encuesta de Población Activa (INE, trimestral); datos del SEPE (desempleo registrado);
Tesorería General de la Seguridad Social; datos de afiliación sectorial (IECA);
datos municipales sobre actividad económica.

**Frecuencia de actualización**
Trimestral (EPA). Los datos de desempleo registrado son mensuales.

**Escala territorial disponible**
Municipal para desempleo registrado (SEPE). La EPA no es representativa a escala municipal.
Para municipios pequeños, los datos de la Seguridad Social son la mejor fuente local.

**Productos que alimenta**
PSL (determinantes estructurales), PA (actuaciones en sectores laborales específicos),
PLS (objetivos de salud laboral, coordinación con servicios de empleo).

---

### F-05. Nivel educativo y capital formativo

**Definición**
Descripción del nivel de formación de la población: distribución por niveles educativos,
tasa de abandono escolar temprano, acceso a formación continua, analfabetismo funcional
y literacidad en salud.

**Finalidad metodológica**
La educación es uno de los determinantes de salud con mayor impacto sostenido a lo largo
del ciclo de vida. El nivel educativo condiciona no solo el empleo y la renta, sino también
la capacidad de entender información de salud, seguir tratamientos y tomar decisiones
informadas sobre la propia salud.

**Utilidad diagnóstica**
Identifica zonas o grupos donde la comunicación en salud debe adaptarse, donde las
intervenciones de alfabetización en salud son prioritarias y donde el sistema sanitario
puede necesitar mediación o facilidades adicionales.

**Preguntas que permite responder**
- ¿Qué proporción de la población adulta no tiene estudios primarios completos?
- ¿La tasa de abandono escolar es elevada en el municipio?
- ¿El nivel educativo explica parte de las diferencias de salud observadas?

**Posibles fuentes**
Padrón (nivel de estudios, a partir del Censo); datos del Ministerio de Educación
(abandono escolar por municipio); Delegación Provincial de Educación (absentismo, alumnado
con necesidades especiales); INE (indicadores de educación por municipio).

**Frecuencia de actualización**
Censal para distribución por nivel educativo. Anual para tasas de abandono escolar.

**Escala territorial disponible**
Municipal para tasas de escolarización y abandono. Los datos de nivel educativo adulto
son más fiables a partir del Censo y están disponibles para todos los municipios.

**Productos que alimenta**
PSL (contexto de literacidad en salud), PA (diseño de actuaciones adaptadas al nivel educativo),
PLS (objetivos de salud en el ámbito educativo).

---

### F-06. Vivienda y condiciones residenciales

**Definición**
Descripción de las condiciones habitacionales de la población: acceso a vivienda digna,
hacinamiento, calidad constructiva, eficiencia energética, régimen de tenencia y
existencia de asentamientos informales.

**Finalidad metodológica**
La vivienda es determinante directo de la salud: la humedad, el frío, el hacinamiento
y la inseguridad residencial son factores de riesgo documentados para enfermedades
respiratorias, salud mental y desarrollo infantil.

**Utilidad diagnóstica**
Permite conectar indicadores de salud respiratoria o de bienestar con condiciones
habitacionales específicas del territorio. En municipios con vivienda antigua o con
asentamientos informales, esta familia aporta explicaciones causales que ningún
indicador de salud puede ofrecer por sí solo.

**Preguntas que permite responder**
- ¿Hay hogares con problemas de humedad, frío o hacinamiento?
- ¿El acceso a la vivienda genera inestabilidad residencial en algún grupo?
- ¿Existen asentamientos informales con condiciones de habitabilidad deficientes?

**Posibles fuentes**
Censo de Población y Viviendas (INE); datos del Catastro; informes de servicios sociales
sobre situaciones de infravivienda; datos de la Agencia Andaluza de la Energía (pobreza
energética); registros de desahucios (datos judiciales, Plataforma de Afectados por la Hipoteca).

**Frecuencia de actualización**
Censal para la estructura del parque de vivienda. Los datos sobre situaciones de emergencia
habitacional son de actualización continua en servicios sociales.

**Escala territorial disponible**
Municipal y seccional (Censo). Para municipios pequeños, los datos seccionales coinciden
prácticamente con el total municipal.

**Productos que alimenta**
PSL (determinantes ambientales de la salud, inequidades en salud respiratoria y mental),
PA (actuaciones en rehabilitación habitacional, coordinación con vivienda municipal).

---

### F-07. Entorno físico, ambiental y espacio público

**Definición**
Descripción del ambiente físico en que vive la población: calidad del aire, ruido,
contaminación del agua o suelo, disponibilidad y calidad de espacios verdes y deportivos,
entorno peatonal, seguridad vial y acceso a alimentación saludable.

**Finalidad metodológica**
El entorno físico actúa como determinante de salud a través de las posibilidades que
ofrece o restringe: un entorno que facilita el desplazamiento activo promueve la actividad
física; un entorno contaminado genera carga respiratoria y cardiovascular.

**Utilidad diagnóstica**
Explica diferencias en conductas de salud que parecen voluntarias pero están condicionadas
por el entorno: la falta de actividad física en municipios sin espacios adecuados no es
un problema de motivación; es un problema ambiental.

**Preguntas que permite responder**
- ¿El municipio tiene espacios verdes, deportivos y peatonales accesibles para toda la población?
- ¿Hay fuentes de contaminación ambiental que afecten a la salud de la población?
- ¿El entorno facilita o dificulta la alimentación saludable y la actividad física?
- ¿La seguridad vial es un problema en alguna zona del municipio?

**Posibles fuentes**
Datos de calidad del aire (Red de Vigilancia y Control de la Calidad del Aire de Andalucía,
RVCA); datos del Catastro y cartografía municipal (espacios verdes, equipamientos deportivos);
informes de urbanismo municipal; datos de accidentalidad vial (DGT); planes de movilidad urbana.

**Frecuencia de actualización**
Continua para calidad del aire. Baja para la estructura urbanística.

**Escala territorial disponible**
Municipal y submunicipal. La cartografía permite análisis a escala de barrio o pedanía.

**Productos que alimenta**
PSL (determinantes ambientales de la salud), PA (actuaciones de mejora del entorno),
PLS (objetivos de entorno saludable, coordinación con urbanismo municipal).

---

## MACROFAMILIA III — ESTADO DE SALUD DE LA POBLACIÓN

El conocimiento sobre el estado de salud describe los resultados que el conjunto de los
determinantes produce en la población. Es la dimensión más visible del diagnóstico, pero
sin las macrofamilias II, IV y V no puede explicarse ni planificarse.

---

### F-08. Mortalidad y esperanza de vida

**Definición**
Descripción de las causas y la distribución de la muerte en el territorio: esperanza de
vida, mortalidad prematura, causas de defunción, años potenciales de vida perdidos y
evolución temporal.

**Finalidad metodológica**
La mortalidad es el indicador de resultado de salud de mayor gravedad. Su análisis revela
las causas que más vidas acortan en el territorio y permite comparar con territorios similares.

**Utilidad diagnóstica**
Identifica prioridades de salud de alto impacto que pueden no ser visibles en indicadores
de morbilidad ni en la percepción ciudadana: la mortalidad prematura por causas evitables
señala dónde la intervención tiene mayor potencial de cambio.

**Preguntas que permite responder**
- ¿Cuánto viven en promedio las personas del municipio respecto a referencias comparables?
- ¿Hay causas de muerte prematura que superen las referencias provinciales o autonómicas?
- ¿La mortalidad por causa muestra desigualdades por sexo o por zona del territorio?

**Posibles fuentes**
Estadísticas de defunciones (INE); Atlas de Mortalidad en España (ISCIII); datos de
mortalidad por municipio (IECA, SISA); informes del Distrito Sanitario.

**Frecuencia de actualización**
Anual (con retraso de dos a tres años para datos consolidados).

**Escala territorial disponible**
Municipal para totales. Las tasas ajustadas por causa solo son estadísticamente fiables
para municipios grandes. Para municipios pequeños (como Zagra), los datos deben agregarse
a varios años para obtener estimaciones estables.

**Productos que alimenta**
PSL (diagnóstico epidemiológico), PA (priorización de causas de muerte evitables),
PLS (objetivos de reducción de mortalidad prematura), EV (comparación de tasas de mortalidad
entre ciclos del plan).

---

### F-09. Morbilidad, enfermedad crónica y carga de enfermedad

**Definición**
Descripción de las enfermedades que afectan a la población: prevalencia de enfermedades
crónicas, hospitalización por causa, frecuentación de atención primaria, carga de enfermedad
medida en años de vida ajustados por discapacidad.

**Finalidad metodológica**
La morbilidad completa el cuadro de salud de la población: las enfermedades crónicas no
matan a corto plazo pero reducen la calidad de vida, sobrecargan el sistema sanitario y
son evitables en muchos casos con intervenciones sobre determinantes.

**Utilidad diagnóstica**
Identifica enfermedades que pueden prevenirse con actuaciones locales (diabetes tipo 2,
enfermedades cardiovasculares, problemas musculoesqueléticos), diferenciando de las que
requieren intervenciones del sistema sanitario especializado.

**Preguntas que permite responder**
- ¿Qué enfermedades crónicas tienen mayor prevalencia en el territorio?
- ¿El patrón de morbilidad del municipio difiere del referente provincial?
- ¿La hospitalización evitable es elevada?

**Posibles fuentes**
Base de Datos para el Análisis de la Consulta en Atención Primaria (BDCAP); SISA (Junta
de Andalucía); CMBD (altas hospitalarias); Encuesta Andaluza de Salud; Registro de
Enfermedades Raras; informes del Equipo de Atención Primaria del territorio.

**Frecuencia de actualización**
Anual (registros de atención primaria). Bienal o quinquenal para encuestas de morbilidad.

**Escala territorial disponible**
ZBS (Zona Básica de Salud) para datos de atención primaria. Municipal para algunos
indicadores de hospitalización. Las encuestas no son representativas a escala municipal
para municipios pequeños.

**Productos que alimenta**
PSL (diagnóstico de carga de enfermedad), PA (actuaciones preventivas de enfermedades
crónicas), PLS (objetivos de reducción de morbilidad evitable), EV (evolución de
prevalencias entre ciclos).

---

### F-10. Salud mental y bienestar emocional

**Definición**
Descripción del estado de salud mental de la población: prevalencia de trastornos mentales
comunes (ansiedad, depresión), consumo de psicofármacos, utilización de servicios de salud
mental, ideación suicida y conducta suicida.

**Finalidad metodológica**
La salud mental es una dimensión del estado de salud cuya carga ha crecido significativamente
y que está fuertemente condicionada por determinantes sociales locales (desempleo, soledad,
condiciones de vivienda). Su presencia en el Perfil es necesaria para un diagnóstico completo.

**Utilidad diagnóstica**
Permite detectar una carga de sufrimiento emocional que los indicadores de morbilidad física
no capturan. La salud mental es frecuentemente la dimensión más sentida por la comunidad y
la más ausente de los diagnósticos técnicos.

**Preguntas que permite responder**
- ¿Qué prevalencia de trastornos mentales comunes hay en el territorio?
- ¿El consumo de psicofármacos supera las referencias comparables?
- ¿Hay datos sobre conducta suicida en el municipio o en su zona?
- ¿La salud mental se distribuye desigualmente entre grupos socioeconómicos o de edad?

**Posibles fuentes**
SISA (datos de salud mental comunitaria); BDCAP (diagnósticos en atención primaria);
datos de prescripción farmacéutica (Servicio Andaluz de Salud); Encuesta Andaluza de Salud;
informes del Equipo de Salud Mental Comunitaria del Distrito.

**Frecuencia de actualización**
Anual (registros). Bienal o quinquenal (encuestas).

**Escala territorial disponible**
ZBS o Distrito para la mayoría de los registros. Las encuestas no son representativas
a escala municipal para municipios pequeños. Los datos de conducta suicida a escala
municipal son escasos y requieren agregación de varios años.

**Productos que alimenta**
PSL (diagnóstico de salud mental, convergencia con bienestar percibido), PA (actuaciones
en salud mental comunitaria), PLS (objetivos de salud mental, coordinación con servicios
especializados y comunitarios).

---

## MACROFAMILIA IV — CONDUCTAS Y ESTILOS DE VIDA

---

### F-11. Conductas relacionadas con la salud

**Definición**
Descripción de los comportamientos de la población que influyen sobre su salud: tabaquismo,
consumo de alcohol, actividad física, calidad de la alimentación, hábitos de sueño,
conductas sexuales de riesgo y uso de sustancias.

**Finalidad metodológica**
Las conductas de salud son el puente entre los determinantes sociales y el estado de salud.
No son elecciones individuales libres de contexto: están condicionadas por el entorno, la
disponibilidad de recursos y la norma social del territorio.

**Utilidad diagnóstica**
Identifica áreas de intervención comportamental donde la acción local puede ser eficaz,
distinguiendo entre conductas modificables con actuaciones locales (actividad física en
entornos adecuados) y conductas con determinantes estructurales más profundos (tabaquismo
en contextos de alta privación).

**Preguntas que permite responder**
- ¿Qué proporción de la población fuma, consume alcohol de riesgo o tiene sedentarismo?
- ¿Hay diferencias por sexo, edad o nivel socioeconómico en las conductas de salud?
- ¿Las conductas del municipio difieren de las referencias provinciales o autonómicas?

**Posibles fuentes**
Encuesta Andaluza de Salud (EAS); Encuesta Nacional de Salud (ENSE); estudios complementarios
propios de COMPÁS NG (PREDIMED, CAGE, Sueño). Para municipios pequeños, los estudios propios
son con frecuencia la única fuente de datos específicamente municipales.

**Frecuencia de actualización**
Quinquenal (ENSE), bienal o cuatrienal (EAS). Los estudios propios se actualizan en cada
ciclo diagnóstico de COMPÁS NG.

**Escala territorial disponible**
Provincial o autonómica para las encuestas nacionales y regionales. **Municipal únicamente
con estudios propios** (EAS de municipio o estudios complementarios COMPÁS). Esta es la
familia donde los instrumentos propios de COMPÁS NG tienen mayor valor diferencial.

**Productos que alimenta**
PSL (diagnóstico de conductas, contexto para interpretar indicadores de morbilidad),
PA (actuaciones de promoción de conductas saludables), PLS (objetivos de cambio conductual,
entornos que faciliten la conducta saludable).

---

## MACROFAMILIA V — BIENESTAR SUBJETIVO Y PERCEPCIONES

---

### F-12. Salud percibida, bienestar subjetivo y calidad de vida

**Definición**
Descripción de cómo percibe la población su propio estado de salud: autovaloración de
la salud, bienestar emocional, calidad de vida relacionada con la salud, satisfacción
vital y percepción de apoyo social.

**Finalidad metodológica**
La salud percibida tiene valor epistémico propio, independiente de los indicadores clínicos.
La comunidad sabe cosas sobre su salud que los registros sanitarios no capturan. La
divergencia entre salud percibida y salud clínica es en sí misma información diagnóstica.

**Utilidad diagnóstica**
Revela la experiencia subjetiva de la salud en el territorio. Es especialmente relevante
para detectar sufrimiento no objetivado clínicamente (malestar emocional difuso, soledad,
sensación de falta de apoyo) y para comparar la percepción de la comunidad con los datos técnicos.

**Preguntas que permite responder**
- ¿Cómo valora la población su propia salud respecto a referencias comparables?
- ¿Hay diferencias en la salud percibida entre grupos de edad, sexo o nivel socioeconómico?
- ¿El bienestar subjetivo de los menores del municipio es comparable al referente provincial?
- ¿La percepción ciudadana coincide con los indicadores técnicos o hay divergencia?

**Posibles fuentes**
Encuesta Andaluza de Salud (autovaloración de salud, SF-12); instrumentos complementarios
propios de COMPÁS NG (IBSE para bienestar socioemocional escolar, DUKE para apoyo social
funcional, SF-12 para salud percibida física y mental). Para municipios pequeños, los
instrumentos propios son la fuente con mayor resolución territorial.

**Frecuencia de actualización**
Cuatrienal o quinquenal para encuestas oficiales. Por ciclo diagnóstico para instrumentos propios.

**Escala territorial disponible**
Provincial o autonómica para las encuestas. **Municipal únicamente con instrumentos propios.**
Es la familia con mayor brecha entre disponibilidad de datos oficiales y necesidad diagnóstica.

**Productos que alimenta**
PSL (diagnóstico de bienestar, comparación con referencias provinciales), PA (actuaciones
sobre bienestar y calidad de vida), EV (cambios en percepción de salud entre ciclos).

---

## MACROFAMILIA VI — CAPITAL SOCIAL Y PARTICIPACIÓN

---

### F-13. Redes sociales, apoyo social y soledad

**Definición**
Descripción de los vínculos relacionales de la población: existencia y calidad de las
redes de apoyo informal, percepción de soledad, aislamiento social, apoyo disponible
en situaciones de dificultad.

**Finalidad metodológica**
El apoyo social es un factor protector de salud con efectos documentados sobre la
mortalidad, la recuperación de enfermedades y la salud mental. Su ausencia (soledad,
aislamiento) actúa como determinante de riesgo independiente. En municipios con alta
proporción de personas mayores, esta familia es especialmente crítica.

**Utilidad diagnóstica**
Identifica grupos o zonas del territorio con escasez de vínculos relacionales que
ningún indicador clínico capta. La soledad no aparece en los registros sanitarios
hasta que se convierte en problema de salud mental o de descompensación de una
enfermedad crónica.

**Preguntas que permite responder**
- ¿Qué proporción de la población percibe tener apoyo suficiente en situaciones de dificultad?
- ¿Hay grupos con alto riesgo de aislamiento social: personas mayores solas, personas
  con discapacidad, familias monoparentales, personas migrantes recientes?
- ¿El territorio tiene mecanismos informales de detección del aislamiento?

**Posibles fuentes**
Instrumentos propios COMPÁS NG (DUKE-EAS para apoyo social funcional); Encuesta Andaluza
de Salud (apoyo social); estudios de soledad y aislamiento (Fundación ONCE, CSIC); datos
de servicios sociales sobre personas sin red de apoyo.

**Frecuencia de actualización**
Por ciclo diagnóstico para instrumentos propios. Las encuestas sobre soledad son escasas
y de periodicidad irregular.

**Escala territorial disponible**
Municipal con instrumentos propios. Provincial con la EAS.

**Productos que alimenta**
PSL (diagnóstico de capital relacional, contexto para interpretar la salud mental),
PA (actuaciones de reducción del aislamiento social), PLS (objetivos de cohesión social).

---

### F-14. Tejido asociativo y activos comunitarios

**Definición**
Descripción de los recursos, capacidades y fortalezas del territorio que pueden movilizarse
para mejorar la salud: asociaciones vecinales, deportivas y culturales; espacios comunitarios;
grupos informales activos; redes de voluntariado; recursos institucionales accesibles;
iniciativas de economía social.

**Finalidad metodológica**
El diagnóstico de activos es el complemento imprescindible del diagnóstico de déficits.
La planificación construida solo sobre lo que falta ignora las palancas que ya existen en
el territorio para el cambio. El conocimiento de activos transforma el análisis de qué hay
que crear en un análisis de qué hay que potenciar, conectar o escalar.

**Utilidad diagnóstica**
Permite diseñar actuaciones que se apoyen en la capacidad existente del territorio, que son
más sostenibles que las actuaciones que crean capacidad nueva desde cero. Revela también
qué zonas del territorio carecen de activos, señalando dónde hay más necesidad de inversión
comunitaria.

**Preguntas que permite responder**
- ¿Qué organizaciones, grupos y recursos comunitarios existen en el territorio?
- ¿Los activos están distribuidos equitativamente por zonas del territorio?
- ¿Qué activos son relevantes para las prioridades de salud identificadas?
- ¿Qué capacidades existen para apoyar actuaciones de salud comunitaria?

**Posibles fuentes**
Catálogo de activos de salud (elaborado en procesos RELAS y COMPÁS histórico);
Registro de Asociaciones (municipio, Junta); mapa de recursos comunitarios (Distrito
Sanitario, servicios sociales); datos del Tercer Sector (entidades locales).

**Frecuencia de actualización**
Alta (los activos comunitarios cambian: asociaciones se crean, se disuelven, cambian de
actividad). Un mapa de activos sin actualización de tres o más años puede ser inexacto.

**Escala territorial disponible**
Municipal. El mapa de activos es uno de los pocos productos que puede ser más preciso en
municipios pequeños que en contextos urbanos grandes.

**Productos que alimenta**
PSL (diagnóstico de activos, base para el análisis salutogénico del territorio),
PA (identificación de recursos que pueden apoyar actuaciones), PLS (estrategias de
fortalecimiento del tejido comunitario).

---

### F-15. Participación ciudadana y conocimiento experiencial del territorio

**Definición**
Descripción del conocimiento que la comunidad tiene sobre su propio territorio y sobre
su propia salud, expresado a través de procesos participativos: qué identifican como
problemas, qué priorizan, qué proponen, qué valoran.

**Finalidad metodológica**
El conocimiento experiencial de la comunidad es evidencia de una naturaleza que ninguna
fuente estadística puede reemplazar. La comunidad conoce su territorio con una resolución
que los registros sanitarios nunca alcanzan. Su ausencia en el diagnóstico produce Perfiles
técnicamente correctos pero socialmente ilegítimos.

**Utilidad diagnóstica**
Contrasta la lectura técnica del Perfil con la percepción ciudadana, revelando convergencias
que refuerzan la solidez del diagnóstico y divergencias que señalan aspectos mal captados
por los datos técnicos. La divergencia entre la perspectiva técnica y la ciudadana es en sí
misma un hallazgo diagnóstico.

**Preguntas que permite responder**
- ¿Qué identifica la comunidad como sus principales problemas de salud?
- ¿Dónde diverge la perspectiva ciudadana de la técnica y por qué?
- ¿Han participado en el proceso los grupos con mayor riesgo de salud?
- ¿Qué conocimiento local existe sobre el territorio que no está en ningún registro?

**Posibles fuentes**
Resultados de priorización temática (proceso RELAS/COMPÁS NG); actas del Grupo Motor;
resultados de grupos focales y talleres participativos; encuestas de percepción municipal;
informes de mesas comunitarias.

**Frecuencia de actualización**
Por ciclo diagnóstico. El conocimiento experiencial de la comunidad cambia con el territorio
y con las generaciones.

**Escala territorial disponible**
Municipal y submunicipal. Es la familia con mayor resolución territorial posible cuando
se trabaja con metodologías participativas de calidad.

**Productos que alimenta**
PSL (capítulo de participación ciudadana, contraste con la lectura técnica), PA (propuestas
ciudadanas como base de actuaciones), PLS (legitimidad social del plan), EV (satisfacción
ciudadana con el plan y sus resultados).

---

## MACROFAMILIA VII — RECURSOS Y ACCESO A SERVICIOS

---

### F-16. Acceso y utilización de servicios sanitarios

**Definición**
Descripción de la oferta sanitaria disponible en el territorio y de cómo la utiliza la
población: cobertura de atención primaria, tiempos de espera, frecuentación, acceso a
especialidades, utilización de urgencias, cobertura de programas preventivos y de cribado.

**Finalidad metodológica**
La accesibilidad y la utilización de los servicios sanitarios determinan si la oferta
disponible llega a quien la necesita. Las barreras de acceso (geográficas, económicas,
culturales, idiomáticas) pueden hacer que la oferta formal sea insuficiente para grupos
específicos aunque el mapa de recursos parezca adecuado.

**Utilidad diagnóstica**
Revela inequidades en el uso de servicios: grupos que usan los servicios menos de lo que
su estado de salud justificaría (infrautilización) o grupos que los usan por vías inadecuadas
(urgencias como puerta de entrada por falta de acceso a atención primaria).

**Preguntas que permite responder**
- ¿Toda la población tiene acceso efectivo al centro de salud de referencia?
- ¿Hay grupos que utilizan los servicios sanitarios con menor frecuencia de la esperada?
- ¿La cobertura de programas de cribado y vacunación es adecuada?
- ¿Qué garantiza la ESCA en este territorio en términos de actuaciones del SSPA?

**Posibles fuentes**
SISA; BDCAP; Registro de Actividad de Atención Primaria (Distrito Sanitario); datos de
urgencias hospitalarias (SIPA); informes del Equipo de Atención Primaria; Plan Operativo
ESCA del Distrito (actuaciones garantizadas en el territorio).

**Frecuencia de actualización**
Anual (registros de actividad).

**Escala territorial disponible**
ZBS para la mayor parte de los datos de actividad. Municipal en algunos indicadores
de cobertura (vacunación, programas de cribado).

**Productos que alimenta**
PSL (contexto de recursos disponibles, barreras de acceso), PA (actuaciones para mejorar
el acceso, coordinación con el Equipo de Atención Primaria), PLS (compromisos de accesibilidad,
diferenciación entre actuaciones SSPA y actuaciones municipales).

---

### F-17. Servicios sociales, atención comunitaria y redes de apoyo institucional

**Definición**
Descripción de los recursos de servicios sociales disponibles para la población: servicios
de atención primaria social, prestaciones económicas, recursos de dependencia, alojamiento,
orientación e inserción laboral, y coordinación con el sistema sanitario.

**Finalidad metodológica**
Los servicios sociales son el recurso institucional más próximo a los determinantes sociales
de la salud. Su funcionamiento, su accesibilidad y sus vacíos determinan el nivel de
protección real de la población frente a situaciones de vulnerabilidad que deterioran la salud.

**Utilidad diagnóstica**
Revela la brecha entre necesidad social y respuesta institucional: cuántas personas necesitan
apoyo que el sistema no les está dando, y dónde hay vacíos de coordinación sociosanitaria
que están produciendo deterioro de salud evitable.

**Preguntas que permite responder**
- ¿La lista de espera en servicios sociales es indicador de demanda no atendida?
- ¿Existe coordinación efectiva entre el equipo de atención primaria y los servicios sociales?
- ¿Hay grupos vulnerables que no acceden a las prestaciones a las que tienen derecho?

**Posibles fuentes**
SIUSS (Sistema de Información de Usuarios de Servicios Sociales); datos municipales de
servicios sociales; datos del IMSERSO (dependencia); informes del Distrito Sanitario sobre
coordinación sociosanitaria; datos de la Red de Servicios Sociales de la Junta de Andalucía.

**Frecuencia de actualización**
Anual (registros de actividad).

**Escala territorial disponible**
Municipal (servicios sociales municipales). ZBS o Distrito para datos del SSPA.

**Productos que alimenta**
PSL (diagnóstico de recursos y vacíos de protección social), PA (coordinación intersectorial),
PLS (compromisos de coordinación sociosanitaria), EV (cambios en la demanda atendida).

---

## MACROFAMILIA VIII — GRUPOS POBLACIONALES CON NECESIDADES ESPECÍFICAS

El conocimiento de grupos con condiciones específicas de salud no sustituye al conocimiento
de la población general: lo complementa. Las necesidades específicas de ciertos grupos
son visibles solo cuando el diagnóstico dispone de herramientas que los hacen visibles.

---

### F-18. Infancia, adolescencia y etapa formativa

**Definición**
Descripción del estado de salud, del bienestar y de las condiciones de vida de los menores
del territorio: bienestar socioemocional, desarrollo infantil, salud escolar, conductas de
salud en adolescentes, absentismo, maltrato y situaciones de riesgo.

**Finalidad metodológica**
La infancia y la adolescencia son las etapas de mayor plasticidad del desarrollo humano y
las de mayor eficiencia de las intervenciones preventivas. Los problemas de salud que se
instauran en la infancia tienen efectos acumulados a lo largo de toda la vida.

**Utilidad diagnóstica**
Identifica el patrón de bienestar de los menores del territorio, que es predictor de la
salud de la población adulta futura y señal de las condiciones estructurales de las familias.
El bienestar socioemocional escolar es observable directamente con instrumentos propios.

**Preguntas que permite responder**
- ¿Cómo está el bienestar socioemocional de los menores en edad escolar?
- ¿Hay señales de dificultades en el desarrollo infantil detectadas desde los servicios?
- ¿La tasa de absentismo escolar es indicador de vulnerabilidad familiar?
- ¿Hay conductas de riesgo en adolescentes que requieran atención preventiva?

**Posibles fuentes**
Instrumento IBSE (COMPÁS NG, ciclo diagnóstico propio); datos de salud escolar (Delegación
de Educación y Salud); datos del programa de salud infantil del EAP; datos de servicios
de protección de menores; registros educativos de absentismo y abandono.

**Frecuencia de actualización**
Por ciclo diagnóstico para instrumentos propios. Anual para registros de servicios.

**Escala territorial disponible**
Municipal con instrumentos propios (IBSE). ZBS o municipal con datos de servicios educativos
y de salud escolar.

**Productos que alimenta**
PSL (diagnóstico de bienestar infantil, señales de vulnerabilidad en menores),
PA (actuaciones de salud escolar y promoción del bienestar en menores),
PLS (compromisos intersectoriales entre salud y educación).

---

### F-19. Envejecimiento activo y personas mayores

**Definición**
Descripción del estado de salud, el bienestar y las condiciones de vida de la población
mayor: capacidad funcional, autonomía, dependencia, soledad, participación social,
acceso a recursos y carga de cuidado informal.

**Finalidad metodológica**
En municipios con alta proporción de población mayor —especialmente en municipios rurales
pequeños, como Zagra— esta familia es determinante para el diagnóstico. El envejecimiento
no es solo un reto demográfico: es un contexto que transforma qué servicios, qué activos
y qué actuaciones son relevantes para la salud del territorio.

**Utilidad diagnóstica**
Identifica la carga de dependencia y de soledad de la población mayor, que son señales
de riesgo sanitario y social que no aparecen en los registros de morbilidad hasta que
ya están en fase avanzada.

**Preguntas que permite responder**
- ¿Qué proporción de la población mayor tiene algún grado de dependencia?
- ¿Cuántas personas mayores viven solas sin red de apoyo?
- ¿Hay sobrecarga de cuidado informal (cuidadoras no profesionales) en el territorio?
- ¿Las personas mayores participan en actividades comunitarias del municipio?

**Posibles fuentes**
IMSERSO (prestaciones por dependencia); datos del Registro de Dependencia (SIUSS-Junta);
Padrón (hogares unipersonales de mayores); Encuesta Andaluza de Salud (mayores);
datos del Equipo de Atención Primaria sobre pacientes mayores crónicos complejos;
informes locales sobre envejecimiento y soledad.

**Frecuencia de actualización**
Anual (Padrón, dependencia). Cuatrienal (EAS).

**Escala territorial disponible**
Municipal para datos de Padrón y dependencia. ZBS o Distrito para datos sanitarios.

**Productos que alimenta**
PSL (diagnóstico de envejecimiento y dependencia), PA (actuaciones de envejecimiento
activo, reducción del aislamiento), PLS (compromisos de atención a personas mayores,
coordinación con servicios sociales y SSPA).

---

### F-20. Grupos en situación de vulnerabilidad social

**Definición**
Descripción de las condiciones de vida y del estado de salud de grupos que acumulan
factores de riesgo social: personas en situación de pobreza extrema o exclusión social,
personas con discapacidad, personas sin hogar, población migrante reciente con barreras
de acceso, personas en contextos de violencia doméstica.

**Finalidad metodológica**
Los grupos en situación de vulnerabilidad concentran una proporción desproporcionada de
la carga de enfermedad evitable. Sin hacer visibles sus condiciones específicas, el Perfil
puede presentar promedios que ocultan situaciones de urgencia en subgrupos.

**Utilidad diagnóstica**
Revela la distribución más extrema de las inequidades en salud del territorio. Identifica
grupos que los servicios convencionales no alcanzan y donde las intervenciones estándar
no son efectivas sin adaptación.

**Preguntas que permite responder**
- ¿Hay grupos en el territorio que acumulan múltiples factores de riesgo social y de salud?
- ¿Los grupos más vulnerables tienen acceso real a los servicios de salud y sociales?
- ¿Hay situaciones de violencia de género o violencia doméstica que requieran atención específica?
- ¿La población migrante tiene barreras de acceso al sistema que producen inequidades en salud?

**Posibles fuentes**
SIUSS; datos de Servicios Sociales municipales; informes del Centro de la Mujer
(violencia de género); datos del Padrón de población extranjera; informes locales de
Cáritas, Cruz Roja y entidades del Tercer Sector; datos del Sistema de Integración Social
de Andalucía.

**Frecuencia de actualización**
Continua en servicios sociales. Censal para datos de Padrón.

**Escala territorial disponible**
Municipal (servicios sociales municipales). ZBS o municipal con datos del Padrón.

**Productos que alimenta**
PSL (diagnóstico de equidad, visibilización de grupos con mayor riesgo de salud),
PA (actuaciones dirigidas a grupos específicos con mayor necesidad), PLS (compromisos
de equidad en el acceso a los recursos del plan), EV (reducción de la brecha de salud
entre grupos).

---

## Perspectivas transversales

Dos perspectivas metodológicas son transversales a todas las familias: no son familias
adicionales sino filtros que deben aplicarse al interpretar el conocimiento de cualquier familia.

**Perspectiva de género:** en cada familia, el conocimiento debe desagregarse por sexo
cuando los datos lo permitan, y la interpretación debe considerar si las diferencias
observadas entre hombres y mujeres son biológicas (diferencia) o socialmente producidas
(desigualdad). Cuando los datos no permiten desagregar, el Perfil declara esa limitación.

**Perspectiva del ciclo de vida:** el estado de salud no puede interpretarse sin referencia
a la edad. Las necesidades, los determinantes y los recursos relevantes son distintos en
la infancia, en la edad adulta y en la vejez. El diagnóstico territorial integra todas las
etapas del ciclo de vida en lugar de centrarse en la población general como si fuera homogénea.

---

## Nota metodológica: contraste de escalas

Los cinco municipios utilizados como contraste en la construcción de este catálogo
representan perfiles territoriales radicalmente distintos. Esta diversidad fue útil
para verificar que la estructura del catálogo puede operar en contextos muy diferentes.

Los principales hallazgos metodológicos del contraste son:

**Sobre la disponibilidad de datos.** Para Granada-Zaidín (contexto urbano de alta densidad)
existe abundancia de datos a escala de ciudad pero escasez a escala de barrio: el conocimiento
oficial no resuelve la especificidad del diagnóstico de barrio. Para Zagra (municipio rural
de menos de 600 habitantes), los datos oficiales a escala municipal son casi inexistentes para
la mayoría de las familias. En ambos extremos —el contexto urbano de barrio y el municipio rural
pequeño— los instrumentos de recogida propia son los que producen conocimiento específicamente
territorial.

**Sobre la relevancia diferencial de las familias.** Las familias F-19 (envejecimiento) y
F-02 (distribución territorial y accesibilidad) son determinantes para municipios rurales
pequeños (Padul, Zagra) pero tienen un peso relativo menor en contextos urbanos (Zaidín).
Las familias F-03 (condición socioeconómica) y F-20 (vulnerabilidad) adquieren mayor
complejidad y mayor urgencia en contextos urbanos con alta densidad de desigualdad.

**Sobre el mapa de activos.** Los municipios rurales pequeños tienen frecuentemente un
tejido asociativo escaso pero más identificable: los activos son pocos pero conocidos.
Los contextos urbanos (Zaidín) tienen mayor densidad de activos pero mayor dispersión
y menor conectividad entre ellos.

**Sobre la utilidad de la estructura.** Las veinte familias del catálogo son pertinentes
para todos los perfiles de municipio. Lo que varía entre perfiles es la importancia relativa
de cada familia, la disponibilidad de datos para cada una y el tipo de fuente que es más útil.
El catálogo no prescribe qué familias son obligatorias en cada municipio: informa qué tipo
de conocimiento existe y de qué fuentes puede obtenerse para que el equipo técnico tome
esa decisión en el contexto concreto.

---

## Vacíos sistemáticos del conocimiento territorial

El catálogo no puede ofrecer lo que el sistema de información no produce. Estos vacíos son
estructurales en el contexto español y andaluz y deben declararse en los Perfiles que los
encuentren.

**Ausencia de datos a escala municipal para municipios pequeños.** La mayor parte de las
encuestas de salud nacionales y autonómicas no producen estimaciones representativas para
municipios de menos de 5.000 habitantes. Para estos municipios, las únicas fuentes con
datos específicamente municipales son el Padrón, algunos registros administrativos y los
instrumentos de recogida propia.

**Ausencia de series temporales comparables.** El conocimiento territorial solo puede
interpretarse longitudinalmente si los instrumentos, las definiciones y las fuentes han
permanecido estables entre ciclos. Muchos cambios metodológicos en las encuestas oficiales
impiden la comparación entre años.

**Ausencia de datos de calidad sobre morbilidad a escala municipal.** Los registros de
atención primaria están disponibles por ZBS, no siempre por municipio. Los datos de
hospitalización son de baja resolución geográfica para municipios pequeños.

**Ausencia de datos desagregados por nivel socioeconómico.** La mayor parte de las fuentes
oficiales no permiten cruzar indicadores de salud con nivel socioeconómico a escala municipal,
lo que impide calcular gradientes de salud intramunicipales con datos de registro.

**Ausencia de conocimiento sobre grupos invisibles.** Los grupos que no acceden a los
servicios no aparecen en los registros de esos servicios. El conocimiento sobre personas
sin hogar, personas migrantes irregulares o personas en exclusión social extrema requiere
metodologías específicas que los sistemas de información oficiales no contemplan.

---

## Relación del catálogo con el proceso de planificación

Este catálogo informa el proceso de planificación en tres momentos:

**En la construcción del Perfil de Salud Local:** el catálogo define qué familias de
conocimiento están representadas en el EvidenceStore y cuáles son lagunas. Organiza la
interpretación territorial por familias en lugar de por instrumentos o fuentes.

**En la planificación:** el catálogo permite al Grupo Motor identificar qué tipo de
conocimiento respalda cada prioridad y qué familias han quedado fuera del diagnóstico.

**En la evaluación:** el catálogo establece qué tipo de conocimiento debe cambiar como
resultado del plan, permitiendo seleccionar indicadores de resultado coherentes con la
naturaleza de las intervenciones planificadas.

---

*Este catálogo es un documento metodológico de referencia. No prescribe indicadores específicos*
*ni propone fuentes de datos definitivas. Es la estructura de conocimiento desde la que COMPÁS NG*
*puede desarrollar instrumentos, parsers y módulos metodológicos coherentes con una visión*
*completa del territorio y de la salud de sus habitantes.*
