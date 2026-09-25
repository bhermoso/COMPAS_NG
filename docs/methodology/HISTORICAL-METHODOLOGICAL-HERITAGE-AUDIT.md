# COMPÁS NG — Auditoría de Patrimonio Metodológico Histórico

> Auditoría del repositorio: `COMPAS_REPO_DEPURADO_20260409`
> El repositorio auditado es patrimonio metodológico, no referencia técnica.
> Se ignoran completamente: arquitectura, implementación, clases, componentes,
> persistencia, contratos técnicos, Firebase, JavaScript y estructura de ficheros.
>
> Pregunta rectora:
> ¿Qué conocimiento profesional contiene este repositorio que merece recuperarse para COMPÁS NG?
>
> Archivos examinados: 40+ documentos del directorio cuaderno/
> Fecha de auditoría: 2026-07-03

---

## Leyenda de estados

| Símbolo | Estado |
|---|---|
| **✓** | Ya recuperado en COMPÁS NG |
| **~** | Parcialmente recuperado |
| **○** | Pendiente de recuperar |
| **✗** | Obsoleto — específico de la arquitectura histórica; no transferible |

---

## I. PRINCIPIOS METODOLÓGICOS

---

### PM-H-01. La interpretación cualitativa no puede automatizarse

**Descripción**
El repositorio histórico contenía un sistema completo de interpretación cualitativa —denominado internamente Sistema EQ (Endocualitativo)— cuyo invariante más importante no era técnico sino epistemológico: la interpretación de materiales cualitativos no puede automatizarse, solo estructurarse para que el investigador la realice.

El invariante se expresaba como campos inmutables en el objeto del sistema:
`_aptoAnalisisAutomatico: false` y `_requiereInterpretacionHumana: true`.

La intención era explícita: el Sistema EQ aportaba la estructura (fases, catálogos, andamiaje); el investigador aportaba el contenido interpretativo. La automatización de la interpretación cualitativa quedaba arquitectónicamente bloqueada, no como limitación técnica sino como decisión metodológica.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, sección 4 — Sistema EQ Fases EQ-0 a UI-M1.

**Por qué tiene valor**
COMPÁS NG maneja datos cualitativos de tres familias: participación ciudadana, activos comunitarios y narrativas territoriales. El principio de no-automatización de la interpretación cualitativa no está formulado explícitamente en la documentación actual, aunque está implícito en el invariante `requiresHumanValidation: true`. El principio explícito tiene más fuerza normativa y protege mejor de violaciones graduales.

**Estado: ~ Parcialmente recuperado.**
`requiresHumanValidation: true` existe en COMPÁS NG pero no hay un principio equivalente que declare específicamente la no-automatización de lo cualitativo. Recuperar el principio explícito en CONTRACT-INTERPRETATION o CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY.

---

### PM-H-02. El conflicto entre fuentes es un hallazgo, no un problema a resolver

**Descripción**
El repositorio articulaba un principio contraintuitivo: las contradicciones, divergencias y silencios entre fuentes distintas no son ruido a eliminar ni son errores del diagnóstico. Son datos analíticos de primer orden.

Las cautelas estaban codificadas directamente en el sistema:
- El conflicto discursivo no debe resolverse automáticamente.
- La divergencia de posiciones entre actores es un hallazgo, no un fallo metodológico.
- La ambivalencia —la coexistencia de sentidos contradictorios sobre el mismo fenómeno— es un dato válido y frecuente en diagnósticos participativos.
- Los silencios —lo que nadie menciona sobre algo que es relevante— pueden ser normalizaciones, tabúes o zonas no exploradas.
- La convergencia de posiciones en múltiples fuentes indica frecuencia, no acuerdo real entre actores.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, cautelas embebidas en las fases EQ-3 y EQ-4.

**Por qué tiene valor**
Los diagnósticos participativos de COMPÁS NG integran voces ciudadanas, datos técnicos y activos comunitarios que con frecuencia se contradicen. El principio protege frente a la tendencia —especialmente en sistemas automáticos— de producir una síntesis armónica que borre las contradicciones reales del territorio. Art. 14 del CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY lo menciona parcialmente.

**Estado: ~ Parcialmente recuperado.**
El Art. 14 del CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY aborda la divergencia de evidencias, pero no de forma tan precisa como el sistema histórico. No distingue entre divergencia, ambivalencia, silencio y convergencia sin acuerdo. La precisión importa en diagnósticos participativos.

---

### PM-H-03. La persistencia del conocimiento debe ser un acto deliberado del usuario

**Descripción**
El repositorio histórico formalizó el principio que denominaba internamente AUSTERO: el conocimiento territorial —análisis, síntesis, propuestas— no se persiste automáticamente en ninguna ruta del sistema. Toda persistencia requiere una acción humana explícita: el usuario decide qué análisis merece formalizarse y cuál es provisional.

El principio reflejaba una posición epistemológica: quién tiene autoridad sobre qué es "conocimiento formalizado" en el expediente municipal. La respuesta era clara: el equipo técnico, no el sistema.

**Evidencia**
`AUDITORIA-CONOCIMIENTO-CONSOLIDADO-R1.md`, análisis del patrón AUSTERO con comentario en código: `if (false) { // [AUSTERO] bloque original de guardado automático desactivado`.

**Por qué tiene valor**
COMPÁS NG tiene el mismo principio implícito en sus gates de compilación (el Perfil no se compila sin validación humana), pero no está formulado como principio general que regule toda la gestión del expediente municipal. La formalización protege de regresiones en implementaciones futuras.

**Estado: ~ Parcialmente recuperado.**
Los gates G-LHC-1 a G-LHC-7 implementan una versión restringida de este principio para la compilación del PSL. No existe un principio general de persistencia deliberada para el conjunto del expediente municipal.

---

### PM-H-04. La evidencia tiene jerarquía epistémica explícita con pesos numéricos

**Descripción**
El sistema histórico operaba con una jerarquía formal de cuatro niveles epistémicos para ponderar la evidencia territorial disponible:

| Nivel | Tipo de evidencia | Peso |
|---|---|---|
| N1 | Indicadores municipales directos (CMI), determinantes EAS, IBSE | 3 |
| N2 | Informe de Salud, estudios complementarios | 2 |
| N3 | Participación ciudadana, lectura territorial heredada | 1 |
| N4 | Estrategias de referencia secundarias | 0 |

Sobre esta jerarquía operaban reglas de inferencia concretas:
- `puedeInferir`: cuando el peso total acumulado era ≥ 2.
- `puedeInferirFuerte`: cuando existía al menos un elemento N1 o al menos dos N2.
- Cuando no se cumplían los umbrales, el sistema producía hipótesis condicionales en lugar de inferencias.

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, análisis de `_v4_construirEvidenciaMeta()` y `_v4_construirLecturas()`.

**Por qué tiene valor**
COMPÁS NG distingue niveles de confianza en los EvidenceAtoms (high/medium/low) pero no tiene una jerarquía epistémica formal entre familias de evidencia ni umbrales explícitos que determinen cuándo se puede inferir y cuándo solo hipotizar. Esta distinción es metodológicamente crítica para la interpretación territorial del MIT y para la redacción de los capítulos de autoría humana del Perfil.

**Estado: ○ Pendiente de recuperar.**
CONTRACT-EVIDENCE-QUALITY distingue cuatro dimensiones de calidad pero no establece una jerarquía entre familias de evidencia ni umbrales de inferencia. Este principio es el candidato más relevante para incorporar a la metodología del MIT en COMPÁS NG.

---

### PM-H-05. El territorio en su primer ciclo requiere protección metodológica especial

**Descripción**
El sistema histórico identificó un caso metodológico particular: el primer ciclo de planificación de un municipio sin cierres verificables de ciclos anteriores no puede interpretarse como indicador de baja capacidad institucional. Es simplemente una limitación de madurez longitudinal del sistema.

Este caso recibía tratamiento diferenciado: `sin_cierres_primer_ciclo`, que modificaba la lectura de gobernanza para evitar penalizar a los municipios en su primera iteración.

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, análisis de `_v4_leerGobernanzaLongitudinal()`.

**Por qué tiene valor**
COMPÁS NG no tiene todavía un primer ciclo completo en producción para ningún municipio. Cuando lo tenga, la distinción entre "municipio sin historia institucional" y "municipio con baja capacidad" será metodológicamente crítica. El principio protege la equidad en la interpretación.

**Estado: ○ Pendiente de recuperar.**
METHODOLOGICAL-FOUNDATIONS (PM-12) menciona la continuidad entre ciclos pero no trata el primer ciclo como caso especial con requisitos propios. Candidato para incorporar en las notas metodológicas del MIT.

---

## II. TAXONOMÍAS CONSOLIDADAS

---

### TAX-H-01. Taxonomía de técnicas de investigación cualitativa en salud comunitaria

**Descripción**
El sistema histórico contenía un catálogo formal y congelado de quince técnicas de investigación cualitativa que COMPÁS reconocía como fuentes de evidencia legítimas:

```
grupo_focal · entrevista_semiestructurada · entrevista_en_profundidad · photovoice
paseo_comentado · observacion_participante · observacion_no_participante
taller_participativo · mapeo_colectivo · historia_de_vida · relato_biografico
diario_de_campo · analisis_documental_cualitativo · triangulacion_metodologica
metodologia_mixta
```

El catálogo era `Object.freeze`: no modificable en tiempo de ejecución.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, análisis del Sistema EQ Fase EQ-0.

**Por qué tiene valor**
COMPÁS NG reconoce la participación ciudadana como familia de evidencia y los activos comunitarios como átomos de tipo `asset`, pero no tiene una taxonomía de las técnicas cualitativas mediante las cuales se produce esa evidencia. La taxonomía permitiría declarar con qué método se obtuvo cada pieza de evidencia cualitativa, lo que es relevante para evaluar su confianza y aplicabilidad.

**Estado: ○ Pendiente de recuperar.**
No existe equivalente en COMPÁS NG. Candidato para el futuro CONTRACT-EVIDENCE cuando se formalicen los métodos de obtención de evidencia cualitativa.

---

### TAX-H-02. Taxonomía de enfoques interpretativos

**Descripción**
Junto a las técnicas, el sistema identificaba el enfoque interpretativo con que se había analizado el material cualitativo:

```
fenomenologico · hermeneutico · etnografico · grounded_theory
investigacion_accion_participativa · analisis_critico_del_discurso
analisis_narrativo · construccionismo_social · mixto · inductivo
```

La distinción entre técnica (cómo se recogió) y enfoque (desde qué marco se interpretó) era explícita y relevante para valorar el alcance de las conclusiones.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, análisis del Sistema EQ Fase EQ-0 (catálogos de enfoques).

**Por qué tiene valor**
Un diagnóstico basado en un grupo focal analizado desde análisis crítico del discurso produce un tipo de conocimiento diferente del mismo grupo focal analizado desde grounded theory. La taxonomía permite declarar esa diferencia y valorarla en la integración de evidencias.

**Estado: ○ Pendiente de recuperar.**
No tiene equivalente en COMPÁS NG. Candidato de menor urgencia que TAX-H-01, pero complementario.

---

### TAX-H-03. Seis niveles de maduración del análisis cualitativo

**Descripción**
El sistema histórico distinguía seis niveles de madurez en el procesamiento de materiales cualitativos, formando una cadena de transformación:

```
material_bruto → observacion → codificacion → interpretacion → hipotesis → decision
```

Y adicionalmente, cuatro niveles hermenéuticos dentro del nivel de interpretación:

```
descripcion → interpretacion → posicionamiento → critica_estructural
```

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, análisis del Sistema EQ Fases EQ-1 y EQ-3.

**Por qué tiene valor**
Permite saber en qué nivel de maduración se encuentra un material cualitativo incorporado al EvidenceStore. Un relato biográfico cargado como `material_bruto` tiene rango epistémico diferente al mismo material en nivel `interpretacion`. La cadena es también una guía metodológica para el equipo técnico.

**Estado: ○ Pendiente de recuperar.**
El EvidenceStore de COMPÁS NG tiene tipos de átomo y niveles de confianza, pero no tiene una cadena de maduración del análisis cualitativo. El concepto es distinto: la confianza mide fiabilidad del dato; el nivel de maduración mide hasta dónde ha llegado el análisis de ese dato.

---

### TAX-H-04. Diez dimensiones ponderadas para la priorización territorial (SFA)

**Descripción**
El sistema histórico contenía un modelo de Señales de Fuerza Analítica (SFA) para ponderar la relevancia de una prioridad territorial. Diez dimensiones con pesos explícitos:

| Dimensión | Peso |
|---|---|
| Epidemiológica (carga de enfermedad objetiva) | 0.22 |
| Ciudadana (preferencia participativa) | 0.20 |
| Inequidad (afecta desproporcionalmente a grupos vulnerables) | 0.18 |
| Evidencia complementaria (estudios propios) | 0.12 |
| Impacto esperado (modificabilidad del problema) | 0.10 |
| Factibilidad local (capacidad real del municipio) | 0.08 |
| Activos disponibles (recursos para abordar el problema) | 0.05 |
| Consistencia intersectorial (convergencia entre sectores) | 0.03 |
| Riesgo de inacción (coste de no actuar) | 0.01 |
| Alineación con marcos estratégicos | 0.01 |

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, análisis de `_v4_leerSeñalesEstructurales()`.

**Por qué tiene valor**
COMPÁS NG establece que la priorización es un acto deliberativo humano (PM-7) y que el sistema solo puede ofrecer candidaturas técnicas. El SFA es precisamente ese mecanismo: produce candidaturas informadas, no decisiones. La distribución de pesos refleja años de reflexión sobre qué criterios importan más en el contexto de la planificación local andaluza. Es un modelo transferible al Cap. VII del PSL.

**Estado: ○ Pendiente de recuperar.**
CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY menciona criterios de priorización (magnitud, severidad, modificabilidad, inequidad, viabilidad local, demanda ciudadana) pero no los pondera. El SFA histórico ofrece una propuesta de ponderación que merece evaluación metodológica antes de adoptarse.

---

### TAX-H-05. Factor de Modulación Comunitaria (FMC)

**Descripción**
El sistema histórico calculaba un Factor de Modulación Comunitaria que ajustaba la intensidad de las recomendaciones en función de la fortaleza comunitaria del municipio. Era la media de tres componentes:

```
FMC = (participacion + activos + percepcion) / 3
```

Donde:
- `participacion`: score de participación ciudadana.
- `activos`: máximo entre dos fuentes de activos comunitarios (no suma, para evitar doble conteo).
- `percepcion`: puntuación IBSE de bienestar subjetivo.

El FMC modulaba la intensidad de las recomendaciones: un municipio con alto FMC recibía propuestas más ambiciosas de movilización comunitaria; uno con FMC bajo recibía propuestas más centradas en consolidación de base.

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, análisis de `_v4_construirFMC()`.

**Por qué tiene valor**
Captura la intuición metodológica de que la misma necesidad de salud tiene respuestas distintas según la capacidad comunitaria del municipio. Una propuesta de movilización de activos en un municipio con tejido asociativo débil no tiene el mismo sentido que en uno con tejido fuerte. COMPÁS NG reconoce los activos como evidencia, pero no tiene un mecanismo que los use para modular la ambición de las propuestas.

**Estado: ○ Pendiente de recuperar.**
No tiene equivalente en COMPÁS NG. Candidato para la fase de traducción estratégica (MTE). Requiere revisión del modelo de ponderación antes de adoptarse.

---

## III. MODELOS CONCEPTUALES

---

### MC-H-01. El territorio como intersección de dos órdenes de conocimiento

**Descripción**
El sistema histórico operaba con un modelo implícito pero consistente: el territorio tiene dos órdenes de conocimiento sobre su salud que son distintos y no reducibles el uno al otro.

El **orden analítico** incluye indicadores cuantitativos, determinantes sociales, datos epidemiológicos y evidencia de estudios. Describe el territorio desde afuera, con métricas comparables.

El **orden vivencial** incluye participación ciudadana, narrativas comunitarias, activos percibidos y experiencia acumulada de los actores locales. Describe el territorio desde adentro, con conocimiento experiencial no codificable en estadísticas.

La interpretación territorial válida requiere ambos órdenes. Ninguno puede reemplazar al otro. La discrepancia entre órdenes —cuando la percepción ciudadana contradice los indicadores técnicos— es un hallazgo de primera magnitud, no un problema a resolver.

**Evidencia**
`AUDITORIA-CONOCIMIENTO-CONSOLIDADO-R1.md`, estructura del `analisisActual` y arquitectura de familias cognitivas de COMPÁS.

**Por qué tiene valor**
COMPÁS NG tiene este principio implícito en PM-5 (participación como evidencia) y en la coexistencia de EvidenceAtoms cuantitativos y cualitativos. Pero no está formulado como modelo: la idea de que hay dos órdenes de conocimiento sobre el territorio que son irreducibles entre sí tiene potencia explicativa para el equipo técnico y para el Grupo Motor.

**Estado: ~ Parcialmente recuperado.**
El TERRITORIAL-KNOWLEDGE-CATALOG (F-12, F-13, F-15) y el CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY (Art. 6, Art. 10) los articulan por separado. El modelo que los une como órdenes complementarios de la misma realidad no está formulado explícitamente.

---

### MC-H-02. El territorio habla también a través de sus silencios

**Descripción**
Un modelo territorial complementario al anterior: lo que ningún actor menciona, lo que no aparece en ninguna fuente y lo que se omite sistemáticamente de las narrativas locales son también datos sobre el territorio.

Los silencios pueden indicar normalizaciones (algo que todos dan por hecho y nadie necesita nombrar), tabúes (algo que existe pero resulta socialmente incómodo mencionar) o zonas no exploradas (áreas donde ningún instrumento ha llegado).

El sistema diferenciaba entre ausencia de dato (no se midió) y silencio estructural (se exploró y nadie lo mencionó). La segunda es interpretable; la primera no.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, cautelas del Sistema EQ sobre silencios como dato.

**Por qué tiene valor**
Los Perfiles de Salud Local de COMPÁS NG declaran lagunas (Art. 8 del CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY), pero el concepto de laguna está ligado a la ausencia de datos. El silencio estructural es distinto: hay datos, pero lo que esos datos dicen es que nadie nombra algo relevante. Es un refinamiento metodológico importante para el análisis participativo.

**Estado: ○ Pendiente de recuperar.**
Las cautelas sobre silencios no están en la documentación actual de COMPÁS NG. Candidato para incorporar en las notas metodológicas sobre participación ciudadana como evidencia.

---

### MC-H-03. La cadena diagnóstico-acción tiene puntos de control humanos obligatorios

**Descripción**
El sistema histórico articuló formalmente los momentos en que el sistema cede la iniciativa al usuario y el usuario tiene poder de veto:

```
Análisis automático
    ↓
P1 — Decisión voluntaria: ¿guardo este análisis?
    ↓ (solo si P1 se ejecuta)
Plan automático
    ↓
P2 — Decisión obligatoria: ¿acepto esta propuesta?
    ↓ (solo si P2 se ejecuta)
Persistencia formal del compromiso institucional
```

P1 era voluntaria: el usuario podía no guardar ningún análisis. P2 era obligatoria para que el plan existiera. En ningún punto el sistema podía saltar ninguno de los dos.

**Evidencia**
`AUDITORIA-CONOCIMIENTO-CONSOLIDADO-R1.md`, análisis de la cadena de transición conocimiento-acción.

**Por qué tiene valor**
COMPÁS NG tiene equivalentes en los gates de compilación (G-LHC-1 a G-LHC-7) y en el modelo de ciclo de vida del PSL (`generated → validated → approved`). Sin embargo, la formulación histórica es más clara sobre la asimetría entre P1 (voluntaria) y P2 (obligatoria) y sobre qué ocurre si P1 no se ejecuta. Esa asimetría tiene consecuencias para el diseño de flujos.

**Estado: ~ Parcialmente recuperado.**
CONTRACT-INSTITUTIONAL-LIFECYCLE cubre el ciclo de vida del PSL. El modelo de dos puntos de control asimétricos no está explicitado como principio.

---

### MC-H-04. Las distintas generaciones del conocimiento territorial coexisten sin jerarquía

**Descripción**
El sistema histórico acumuló interpretaciones territoriales de distintas generaciones sin eliminar las anteriores. LT1 (lectura territorial heredada), el análisis modular y la síntesis V4 coexistían. Cuando el sistema nuevo fallaba, el anterior actuaba como fallback. No había jerarquía declarada de qué versión era "la verdad": el equipo técnico evaluaba qué lectura era más útil para el momento.

La lección fue que el conocimiento territorial acumulado de ciclos anteriores no es obsoleto cuando aparece uno nuevo: es un recurso de contraste que revela cómo ha evolucionado el territorio.

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, genealogía de los sistemas interpretativos GEN-1, GEN-2.5, GEN-3.

**Por qué tiene valor**
COMPÁS NG tiene un modelo de versiones del PSL (PSL-C/v1, PSL-C/v2) pero el tratamiento de los Perfiles anteriores como recursos de contraste —no solo como historial— no está formalizado. La idea de que el diagnóstico del ciclo anterior ilumina el diagnóstico del ciclo actual es relevante para la evaluación y para el diseño de la evidencia longitudinal.

**Estado: ○ Pendiente de recuperar.**
PM-12 y PM-24 mencionan el ciclo, pero no el valor de contraste del conocimiento acumulado de ciclos anteriores.

---

## IV. CRITERIOS DE INTERPRETACIÓN Y UMBRALIZACIÓN

---

### CRI-H-01. Cuándo inferir y cuándo solo hipotizar: umbrales numéricos explícitos

**Descripción**
El sistema histórico distinguía formalmente entre tres niveles de conclusión sobre el territorio:

- **Inferencia confirmada:** la evidencia es suficiente para afirmar. Condición: peso total ≥ 2, o al menos un elemento N1, o al menos dos elementos N2.
- **Hipótesis condicional:** hay señales pero la evidencia es insuficiente para afirmar. Se formula como posibilidad, no como hecho.
- **Observación pura:** se describe sin interpretar la causa.

La regla operativa era: si no se cumple el umbral de inferencia, el sistema produce una hipótesis condicional, nunca una afirmación. Esta distinción se reflejaba en el lenguaje: "la evidencia sugiere" vs. "se observa" vs. "es probable que".

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, análisis de `_v4_construirLecturas()` y `_v4_construirEvidenciaMeta()`.

**Por qué tiene valor**
COMPÁS NG tiene el tipo de afirmación "hipótesis" en el Art. 8 del CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY, pero no tiene umbrales formales que determinen cuándo pasar de hipótesis a inferencia. Esa frontera es actualmente una decisión subjetiva del equipo técnico. Los umbrales numéricos históricos son una propuesta concreta de formalización.

**Estado: ○ Pendiente de recuperar.**
La distinción entre hipótesis e inferencia existe en COMPÁS NG (Art. 8) pero sin criterios de transición. Los umbrales históricos merecen revisión metodológica para adaptarlos al contexto de COMPÁS NG, donde la jerarquía de evidencia es distinta.

---

### CRI-H-02. Naturalización vs verdad en el análisis participativo

**Descripción**
El sistema articulaba un criterio específico para el análisis del discurso participativo: las afirmaciones que se presentan como obviedad, sentido común o verdad universal en el discurso de los participantes son mecanismos discursivos —naturalizaciones— que no equivalen a verdades factuales.

El diagnóstico participativo debe distinguir entre:
- Lo que los participantes perciben y declaran.
- Lo que los datos independientes confirman.
- Lo que el discurso presenta como obvio sin evidencia de respaldo.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, cautela del Sistema EQ: `_naturalizacion_no_es_verdad`.

**Por qué tiene valor**
COMPÁS NG integra participación ciudadana como evidencia de tipo "percepción" (Art. 8). El criterio de naturalización añade una capa de análisis: hay que distinguir entre lo que la comunidad percibe y lo que la comunidad da por sentado sin evidencia. Es un refinamiento metodológico relevante para los capítulos de autoría humana del Perfil.

**Estado: ○ Pendiente de recuperar.**
No está formulado en COMPÁS NG. Candidato para las notas metodológicas sobre participación ciudadana como evidencia.

---

## V. HEURÍSTICAS

---

### HEU-H-01. Primer ciclo sin referente temporal propio: no penalizar

**Descripción**
Heurística para la evaluación de la gobernanza territorial: cuando no existen cierres verificables de ciclos anteriores, el diagnóstico no puede interpretar esa ausencia como baja capacidad institucional. El sistema la reconocía como condición estructural del primer ciclo y la trataba con protección metodológica explícita.

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, caso especial `sin_cierres_primer_ciclo`.

**Por qué tiene valor**
COMPÁS NG está produciendo los primeros ciclos para sus municipios. La heurística es directamente aplicable a la interpretación de la gobernanza en los primeros Perfiles que se produzcan.

**Estado: ○ Pendiente de recuperar.**

---

### HEU-H-02. Convergencia como frecuencia, no como consenso

**Descripción**
Cuando varias posiciones ciudadanas o varias fuentes de evidencia apuntan en la misma dirección, el sistema registraba esa convergencia como frecuencia de aparición del fenómeno. No como acuerdo real entre los actores ni como prueba de verdad.

La heurística protegía frente a la falsa armonización: en un diagnóstico participativo, que cinco personas mencionen el mismo problema no significa que todas lo perciban del mismo modo, con la misma intensidad o con las mismas causas.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, nota metodológica de EQ-4: `_notaMetodologica: 'frecuencia_no_implica_acuerdo'`.

**Por qué tiene valor**
El Art. 14 del CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY menciona la convergencia de evidencias pero no hace la distinción entre frecuencia y acuerdo. La heurística protege de una forma específica de falsa armonización que es frecuente en diagnósticos participativos.

**Estado: ~ Parcialmente recuperado.**
El principio de declarar divergencias existe (Art. 14). La distinción específica frecuencia/acuerdo no está.

---

### HEU-H-03. Recomendación universal como señal de ausencia de modulación

**Descripción**
El sistema histórico identificó un defecto metodológico propio: algunas recomendaciones aparecían en todos los diagnósticos independientemente de las características específicas del municipio. Esto era síntoma de que la lógica de recomendación no tenía acceso a datos suficientes para modular su salida.

La heurística: una recomendación que aparece en el 100% de los territorios es probablemente una recomendación general disfrazada de territorial. Debe revisarse.

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, análisis de `rec_mapeo_activos_relas_universal`.

**Por qué tiene valor**
En COMPÁS NG, el MTE producirá candidaturas técnicas de intervención. La heurística es una prueba de calidad para esas candidaturas: si el mismo set de actuaciones aparece para todos los municipios, hay un problema de modulación territorial.

**Estado: ○ Pendiente de recuperar.**
No existe este criterio de calidad en COMPÁS NG.

---

## VI. VOCABULARIO CONSOLIDADO

---

### VOC-H-01. Léxico de niveles de certeza de las afirmaciones territoriales

**Descripción**
El sistema articuló un vocabulario preciso para los niveles de certeza:

| Término | Significado |
|---|---|
| `inferencia_confirmada` | Evidencia suficiente para afirmar; peso ≥ umbral |
| `hipotesis_condicional` | Señales detectadas pero evidencia insuficiente para afirmar |
| `observacion_pura` | Descripción sin interpretación causal |
| `incertidumbre` | Falta de evidencia nuclear; no puede formularse ni hipótesis |

El vocabulario determinaba el lenguaje de los capítulos de interpretación: "se observa que" vs. "la evidencia sugiere que" vs. "es posible que" vs. "no es posible determinar si".

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, análisis del motor de inferencia V4.

**Por qué tiene valor**
Art. 8 del CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY define los tipos de afirmación del Perfil (hecho, interpretación, hipótesis, percepción, cautela, laguna, decisión posterior). El léxico histórico añade la dimensión de la certeza basada en evidencia acumulada, que es distinta de la tipología por naturaleza. Son complementarios.

**Estado: ~ Parcialmente recuperado.**
Los tipos de afirmación del Art. 8 son un vocabulario de naturaleza. El léxico histórico es un vocabulario de certeza. COMPÁS NG necesita ambos para que los capítulos de autoría humana del Perfil sean metodológicamente precisos.

---

### VOC-H-02. Léxico de posiciones en el diagnóstico participativo

**Descripción**
El sistema contenía un vocabulario específico para el análisis del discurso participativo:

| Término | Definición |
|---|---|
| `posicion_discursiva` | Enunciación de un actor sobre la realidad territorial |
| `posicion_social` | Ubicación del actor en la estructura territorial (profesional sanitario, vecino, etc.) |
| `repertorio_retorico` | Registro de legitimación que el actor utiliza (sanitario, económico, comunitario) |
| `marco_interpretativo` | La lente conceptual desde la que el actor lee el territorio |

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, análisis del Sistema EQ Fase EQ-3 (contrato hermenéutico-discursivo).

**Por qué tiene valor**
En los diagnósticos participativos de COMPÁS NG, los resultados de la priorización temática y los procesos del Grupo Motor producen posiciones de distintos actores. El vocabulario histórico permite analizar esas posiciones con más precisión que simplemente registrar quién dijo qué.

**Estado: ○ Pendiente de recuperar.**
COMPÁS NG registra participación como evidencia pero no tiene vocabulario para analizar las posiciones de los actores participantes.

---

## VII. CAUTELAS METODOLÓGICAS

---

### CAU-H-01. Bloque de cautelas sobre materiales cualitativos

**Descripción**
El sistema histórico tenía un bloque de ocho cautelas embebidas que protegían el análisis cualitativo de distorsiones comunes. Reproducidas aquí como formulaciones normativas:

1. El sistema no interpreta automáticamente materiales cualitativos.
2. El sistema no produce consenso artificial entre posiciones contradictorias.
3. La ambivalencia es un dato analítico de primer orden, no un ruido a eliminar.
4. La convergencia de posiciones en múltiples fuentes no implica acuerdo real entre actores.
5. La divergencia de posiciones no es un problema metodológico: es un hallazgo.
6. Los silencios no implican inexistencia: pueden indicar áreas no exploradas o normalizaciones.
7. El mapa del conocimiento no equivale al diagnóstico territorial: describe el estado del conocimiento, no la realidad.
8. Toda interpretación permanece abierta y revisable.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, cautelas del Sistema EQ, fases EQ-3 y EQ-4.

**Por qué tiene valor**
Son cautelas con formulación precisa, derivadas de problemas reales encontrados en el proceso diagnóstico. COMPÁS NG tiene algunas de estas cautelas implícitas en sus principios. Formularlas explícitamente como un bloque de cautelas sobre evidencia cualitativa añadiría una protección metodológica que hoy no existe de forma clara.

**Estado: ~ Parcialmente recuperado.**
El CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY (Arts. 8, 10, 14) cubre los puntos 2, 4, 5 y 8 parcialmente. Los puntos 3 (ambivalencia), 6 (silencios) y 7 (mapa ≠ diagnóstico) no están explicitados en COMPÁS NG.

---

### CAU-H-02. La persistencia incompleta destruye la trazabilidad del ciclo siguiente

**Descripción**
El sistema histórico documentó un problema estructural: cada nivel de persistencia en el ciclo de planificación perdía campos respecto al nivel anterior. Lo que entraba como análisis completo con fuentes, justificaciones y contexto salía como plan con solo identificadores y actuaciones.

La consecuencia: al inicio del siguiente ciclo, era imposible saber por qué se habían tomado ciertas decisiones. La trazabilidad de la justificación de cada prioridad se perdía con cada ciclo.

La cautela: la persistencia de conocimiento debe preservar la cadena completa de razonamiento, no solo el resultado.

**Evidencia**
`AUDITORIA-CONOCIMIENTO-CONSOLIDADO-R1.md`, análisis de los tres niveles de persistencia y la pérdida de información en cada transición.

**Por qué tiene valor**
COMPÁS NG tiene el principio de trazabilidad (PM-19) y los campos `sourcePSLId`, `sourceHash` en los artefactos. Sin embargo, la cautela sobre qué ocurre cuando la cadena de razonamiento no se preserva en la transición entre ciclos no está formulada explícitamente. Es especialmente relevante para el diseño del Informe de Evaluación y del modelo de evidencia longitudinal.

**Estado: ○ Pendiente de recuperar.**
PM-19 exige trazabilidad pero no advierte específicamente sobre el riesgo de pérdida en la transición entre ciclos. La cautela histórica es directamente aplicable al diseño del expediente longitudinal en COMPÁS NG.

---

## VIII. BUENAS PRÁCTICAS DOCUMENTADAS

---

### BP-H-01. El andamiaje del sistema es punto de partida, no contenido final

**Descripción**
El sistema histórico desarrolló la práctica de ofrecer andamiaje (scaffold) orientativo en los capítulos interpretativos que el equipo técnico debía completar: propuestas de texto, estructuras de razonamiento, sugerencias de interpretación. El andamiaje era visible como tal —marcado como provisional— y su sustitución por contenido de autoría humana era condición para la validación del documento.

Esta práctica resolvía un problema real: sin andamiaje, el equipo técnico se enfrentaba a una página en blanco. Con él, tenía una propuesta que podía aceptar, modificar o rechazar. El andamiaje facilitaba sin sustituir.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, descripción del Sistema EQ Fase EQ-6 (Informe de Estado Metodológico como andamiaje para el investigador).

**Por qué tiene valor**
COMPÁS NG tiene el concepto de scaffold en los capítulos V y VI del PSL, con los gates G-LHC-2 y G-LHC-3. La buena práctica está incorporada. Lo que puede añadirse es la distinción entre diferentes tipos de andamiaje: texto de ejemplo, estructura de razonamiento, sugerencia de interpretación basada en datos.

**Estado: ~ Parcialmente recuperado.**
El concepto de scaffold existe en COMPÁS NG. La tipología de andamiaje (texto / estructura / sugerencia) no está desarrollada.

---

### BP-H-02. Usar el máximo de fuentes disponibles, no la suma

**Descripción**
Para algunos cálculos que integraban fuentes alternativas sobre el mismo fenómeno, el sistema histórico usaba el máximo de las fuentes disponibles en lugar de la suma. La lógica: dos fuentes distintas sobre los activos comunitarios de un territorio no significan el doble de activos; significan que el mismo mapa de activos ha sido confirmado desde dos ángulos.

La buena práctica generalizable: cuando varias fuentes miden el mismo fenómeno con métodos distintos, la convergencia es evidencia de fiabilidad, no de multiplicación del fenómeno.

**Evidencia**
`AUDITORIA-CAPA-INTERPRETATIVA-R1.md`, análisis de `_v4_construirFMC()`, componente `activos`: `max(LT1_activos, Localiza_Salud_activos)`.

**Por qué tiene valor**
Cuando COMPÁS NG integra el mapa de activos de un proceso RELAS con los activos identificados en el diagnóstico de salud comunitaria ESCA, la lógica de integración importa. Sumar puede generar duplicidades; usar el máximo con nota de convergencia es metodológicamente más honesto.

**Estado: ○ Pendiente de recuperar.**
El TERRITORIAL-KNOWLEDGE-CATALOG (F-14) aborda los activos comunitarios pero no establece la lógica de integración cuando varias fuentes los describen.

---

## IX. PREGUNTAS RECURRENTES CON RESPUESTA METODOLÓGICA

---

### PRI-H-01. ¿Cómo integrar fuentes heterogéneas sin que una domine sobre las demás?

**Descripción**
El sistema histórico respondió esta pregunta con la jerarquía epistémica de cuatro niveles y los umbrales de inferencia (PM-H-04 y CRI-H-01). La respuesta no era eliminar la heterogeneidad sino declararla formalmente y operar sobre ella con reglas explícitas.

**Estado: ○ Pendiente de recuperar formalmente** — la respuesta existe en el patrimonio histórico pero no en la documentación de COMPÁS NG.

---

### PRI-H-02. ¿Cuándo puede el sistema afirmar algo sobre el territorio?

**Descripción**
La pregunta más recurrente en el diseño del sistema interpretativo. La respuesta histórica: el sistema solo puede afirmar cuando el peso de evidencia supera un umbral definido; por debajo, solo puede formular hipótesis. Y el sistema nunca puede tomar decisiones: esas pertenecen al equipo técnico.

**Estado: ~ Parcialmente recuperado** — PM-20 establece que todo output es propuesta; los umbrales de cuándo afirmar vs. hipotizar no están en COMPÁS NG.

---

### PRI-H-03. ¿Cómo preservar el disenso legítimo en el diagnóstico participativo?

**Descripción**
La respuesta histórica: registrando explícitamente las divergencias, declarando convergencias como frecuencias y evitando producir síntesis que borren diferencias legítimas. La síntesis del diagnóstico participativo no es la media aritmética de posiciones: es la descripción de las posiciones con sus convergencias, divergencias y tensiones.

**Estado: ~ Parcialmente recuperado** — Arts. 10 y 14 del CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY lo abordan. La formulación histórica es más precisa y operativa.

---

### PRI-H-04. ¿Qué pasa cuando el municipio está en su primer ciclo sin historia?

**Descripción**
La pregunta sobre equidad en la evaluación de municipios nuevos. La respuesta histórica: protección metodológica explícita, umbrales de evaluación adaptados y no comparación de lo inexistente con lo maduro.

**Estado: ○ Pendiente de recuperar** — no está en la documentación actual de COMPÁS NG.

---

## X. MODELOS TERRITORIALES E INSTITUCIONALES

---

### MT-H-01. El municipio no es un agregado demográfico sino un actor institucional

**Descripción**
El sistema histórico trató consistentemente al municipio no como un conjunto de datos sino como un actor con historia, con ciclos, con capacidad de decisión y con responsabilidad sobre sus compromisos. El municipio en primer ciclo es diferente del municipio en tercer ciclo no porque sus datos sean distintos sino porque su capacidad institucional acumulada es diferente.

Este modelo tiene implicaciones para la evaluación: no se evalúa si el municipio tiene buenos indicadores de salud sino si el municipio ha cumplido sus compromisos, ha mejorado su diagnóstico y ha aprendido del ciclo anterior.

**Evidencia**
`AUDITORIA-CONOCIMIENTO-CONSOLIDADO-R1.md`, concepto del ciclo institucional y la cadena diagnóstico-acción con P1 y P2.

**Por qué tiene valor**
COMPÁS NG tiene el ciclo de vida del PSL y el modelo de gobernanza. Lo que no está explicitado es la diferencia entre evaluación de indicadores de salud (qué tan sana está la población) y evaluación de la capacidad institucional del municipio (qué tan capaz es el municipio de planificar y ejecutar). Son objetos de evaluación distintos.

**Estado: ○ Pendiente de recuperar.**
La distinción entre evaluación de resultados de salud y evaluación de capacidad institucional no está formalizada en COMPÁS NG.

---

### MT-H-02. El sistema cuantitativo y el sistema cualitativo son familias cognitivas distintas, no versiones del mismo sistema

**Descripción**
El repositorio histórico dejó documentado un hallazgo de diseño: el sistema de análisis cuantitativo (indicadores, escalas, estudios) y el sistema de análisis cualitativo (materiales comunitarios, narrativas, participación) no son versiones más o menos sofisticadas del mismo sistema. Son familias cognitivas con lógicas distintas, catálogos distintos, invariantes distintos y productos distintos.

Integrarlos no significa fusionarlos sino hacer que cada uno aporte lo que puede aportar y que su articulación sea explícita.

**Evidencia**
`AUDITORIA-INTERPRETACION-CUALITATIVA-R1.md`, descripción del Sistema EQ como "cuarta familia cognitiva" sin herencia de las familias cuantitativas.

**Por qué tiene valor**
COMPÁS NG integra todos los tipos de evidencia en el EvidenceStore bajo la misma estructura de EvidenceAtom. Esto es metodológicamente adecuado para el almacenamiento, pero puede producir la ilusión de que todos los tipos de evidencia son tratados con la misma lógica. El modelo histórico advierte que la integración estructural no equivale a integración epistémica.

**Estado: ○ Pendiente de recuperar.**
El EvidenceStore unifica tipos de evidencia en la misma estructura pero no declara que la lógica de análisis cualitativo y cuantitativo son distintas. Esta advertencia merece incorporarse a las notas metodológicas del MIT.

---

## TABLA RESUMEN

| ID | Conocimiento | Estado | Prioridad de recuperación |
|---|---|---|---|
| PM-H-01 | No-automatización de lo cualitativo | ~ Parcial | Alta |
| PM-H-02 | Conflicto como hallazgo | ~ Parcial | Alta |
| PM-H-03 | Persistencia deliberada (AUSTERO) | ~ Parcial | Media |
| PM-H-04 | Jerarquía epistémica con pesos numéricos | ○ Pendiente | Alta |
| PM-H-05 | Protección metodológica del primer ciclo | ○ Pendiente | Alta |
| TAX-H-01 | 15 técnicas cualitativas formalizadas | ○ Pendiente | Media |
| TAX-H-02 | 10 enfoques interpretativos | ○ Pendiente | Baja |
| TAX-H-03 | 6 niveles de maduración del análisis cualitativo | ○ Pendiente | Media |
| TAX-H-04 | SFA — 10 dimensiones de priorización ponderadas | ○ Pendiente | Alta |
| TAX-H-05 | FMC — Factor de Modulación Comunitaria | ○ Pendiente | Media |
| MC-H-01 | Dos órdenes de conocimiento territorial | ~ Parcial | Alta |
| MC-H-02 | Silencio estructural como dato | ○ Pendiente | Media |
| MC-H-03 | Dos puntos de control humano asimétricos | ~ Parcial | Media |
| MC-H-04 | Coexistencia de generaciones de conocimiento | ○ Pendiente | Baja |
| CRI-H-01 | Umbrales de inferencia numéricos | ○ Pendiente | Alta |
| CRI-H-02 | Naturalización vs verdad | ○ Pendiente | Media |
| HEU-H-01 | No penalizar el primer ciclo | ○ Pendiente | Alta |
| HEU-H-02 | Convergencia como frecuencia, no como consenso | ~ Parcial | Alta |
| HEU-H-03 | Recomendación universal = señal de ausencia de modulación | ○ Pendiente | Media |
| VOC-H-01 | Léxico de niveles de certeza | ~ Parcial | Alta |
| VOC-H-02 | Léxico del análisis participativo | ○ Pendiente | Media |
| CAU-H-01 | Bloque de cautelas sobre materiales cualitativos | ~ Parcial | Alta |
| CAU-H-02 | Persistencia incompleta destruye trazabilidad longitudinal | ○ Pendiente | Alta |
| BP-H-01 | Andamiaje como punto de partida, no como contenido | ~ Parcial | Baja |
| BP-H-02 | Máximo de fuentes, no suma, para fenómenos múltiplemente medidos | ○ Pendiente | Media |
| PRI-H-01 | Integrar fuentes heterogéneas sin dominación de una sobre otras | ○ Pendiente | Alta |
| PRI-H-02 | Cuándo afirmar vs cuándo solo hipotizar | ~ Parcial | Alta |
| PRI-H-03 | Preservar el disenso legítimo en el diagnóstico participativo | ~ Parcial | Alta |
| PRI-H-04 | Tratamiento del municipio en primer ciclo | ○ Pendiente | Alta |
| MT-H-01 | El municipio como actor institucional, no como agregado | ○ Pendiente | Media |
| MT-H-02 | Familias cognitivas cuantitativa y cualitativa como sistemas distintos | ○ Pendiente | Media |

---

## Conocimiento clasificado como obsoleto

El siguiente conocimiento identificado en el repositorio histórico es específico de su arquitectura y no es transferible metodológicamente a COMPÁS NG:

- El modelo de gobernanza distribuida con 9 mecanismos sin coordinador: describe una patología de la arquitectura monolítica histórica, no un modelo deseable.
- El bridge provisional para migración gradual: respuesta a una deuda técnica de la monolito; no hay equivalente en COMPÁS NG.
- Los campos `window.*` y el objeto global `analisisActual`: artefactos del monolito.
- La lógica específica de rehidratación desde Firebase: tecnología sustituida.
- El nomenclator de compatibilidad legacy (mejoramientoMunicipal → mejoramiento_municipal): campo de compatibilidad específico sin equivalente.

---

## Conocimiento de recuperación prioritaria

Los siguientes hallazgos tienen mayor urgencia de incorporación porque son relevantes para fases actualmente en desarrollo o próximas en COMPÁS NG:

1. **PM-H-04 + CRI-H-01 (jerarquía epistémica y umbrales de inferencia):** Fundamentales para el MIT y para los capítulos de autoría humana del Perfil. Son el mecanismo que distingue cuándo el sistema puede sugerir una interpretación firme de cuándo solo puede formular una hipótesis.

2. **TAX-H-04 (SFA — 10 dimensiones de priorización):** Directamente aplicable al Cap. VII del PSL y al motor de candidaturas técnicas. El modelo de pesos reflejam años de reflexión sobre qué criterios importan en la planificación local andaluza.

3. **PM-H-05 + HEU-H-01 (primer ciclo sin referente):** Aplicable inmediatamente a los primeros Perfiles que COMPÁS NG produce. Protegen la equidad en la interpretación de municipios en su primera iteración.

4. **CAU-H-01 (bloque de cautelas sobre cualitativos):** Los puntos sobre ambivalencia, silencios y distinción mapa/diagnóstico no están en la documentación actual y son relevantes para cualquier Perfil con evidencia participativa.

5. **CAU-H-02 (persistencia incompleta → pérdida de trazabilidad):** Relevante para el diseño del Informe de Evaluación y del modelo de evidencia longitudinal, que son los productos de evaluación futuros de COMPÁS NG.

---

*Auditoría de patrimonio metodológico — Solo lectura — Sin modificaciones al repositorio histórico.*
*Los hallazgos son candidatos metodológicos, no decisiones de implementación.*
*Cada hallazgo pendiente de recuperar requiere revisión metodológica antes de incorporarse a un contrato o documento normativo de COMPÁS NG.*
