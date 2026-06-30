# CONTRACT-NHS-HEALTH-PROFILE

> Contrato canónico del Producto 4 — Perfil de Salud Local tipo NHS (PSL-NHS).
> Versión 1.0 — 2026-06-30
> Estado: VIGENTE

---

## 1. Naturaleza del Producto 4

El **Perfil de Salud Local tipo NHS (PSL-NHS)** es un documento institucional de diagnóstico comparativo. Presenta los indicadores de salud disponibles del municipio junto a sus valores de referencia, para que la corporación municipal, la ciudadanía y los medios puedan entender en pocos minutos en qué situación está el municipio respecto a su entorno.

**El PSL-NHS no es:**
- una vista de la aplicación;
- un dashboard interactivo;
- un resumen del PSL-C;
- un formato alternativo del Producto 3.

Es un **producto institucional independiente**, con su propio compilador, su propia audiencia y su propio propósito.

### 1.1 Distinción fundamental con el PSL-C

| Dimensión | PSL-C (Producto 3) | PSL-NHS (Producto 4) |
|---|---|---|
| Naturaleza | Narrativo, técnico, interpretativo | Comparativo, sintético, factual |
| Pregunta que responde | ¿Qué dice la evidencia sobre este territorio? | ¿Cómo está este municipio respecto a otros? |
| Extensión | Larga (7 capítulos; 30–80 páginas) | Corta (máximo 4 páginas imprimibles) |
| Texto analítico | Sí (MIT + autoría humana) | No: solo datos, valores de referencia y dirección |
| Comparadores externos | No (diagnóstico absoluto) | Sí (Granada / España como referencia) |
| Conclusiones | Sí (Cap. V, autoría humana) | No |
| Recomendaciones | No | No |
| Áreas de intervención | Sí (Cap. IV, candidaturas técnicas) | No |
| Autoría humana obligatoria | Sí (caps. V, VI, VII) | No: generado completamente por el compilador |
| Ciclo de vida del objeto | `generated → validated → approved` | Artefacto compilado e inmutable desde el primer momento |
| Audiencia primaria | Equipo técnico, Distrito Sanitario, Junta | Alcaldía, corporación municipal, ciudadanía |
| Relación con el MTE | Entrada canónica al Nivel 3 | No alimenta el MTE |

---

## 2. Audiencia

La audiencia del PSL-NHS es política y ciudadana, no técnica.

| Audiencia | Rol | Prioridad |
|---|---|---|
| **Alcaldía** | Lectura antes de cualquier reunión de planificación. Entiende en una página si el municipio está bien o mal y en qué. | Principal |
| **Concejalía de Salud / Servicios Sociales** | Justifica propuestas presupuestarias o programas ante la corporación. | Principal |
| **Corporación municipal** | Recibe el documento como información de contexto antes de debatir prioridades. | Principal |
| **RELAS / Grupo Motor** | Material de trabajo en la primera sesión con responsables políticos. | Secundario |
| **Ciudadanía** | Acceso cuando se publica; inteligible sin formación técnica. | Secundario |
| **Medios de comunicación locales** | Citable en noticias sobre salud municipal. | Secundario |
| Equipo técnico | No es la audiencia. Tiene el PSL-C. | No target |
| Distrito Sanitario | No es la audiencia principal. Tiene el PSL-C completo. | No target |

**Regla de diseño:** si un párrafo o elemento requiere formación en salud pública para ser comprendido, no pertenece al PSL-NHS.

---

## 3. Preguntas que el documento responde

El PSL-NHS responde, en este orden de prioridad, las siguientes preguntas:

1. ¿Qué estudios de salud se han realizado en nuestro municipio y cuántos son?
2. ¿Cómo está el bienestar de los menores?
3. ¿Cómo está la salud percibida de la población adulta, física y mentalmente?
4. ¿Tienen los mayores apoyo social suficiente?
5. ¿Cómo se alimenta la población?
6. ¿Cuánta gente duerme mal?
7. ¿Hay consumo de riesgo de alcohol?
8. Para cada indicador con referencia: ¿estamos por encima o por debajo?
9. ¿La ciudadanía ha participado en el proceso de diagnóstico?
10. ¿Cuándo se elaboró este diagnóstico y quién lo validó?

---

## 4. Relación con el Producto 3

El PSL-NHS y el PSL-C nacen del mismo objeto fuente: el `LocalHealthProfile` en estado `validated`.

```
LocalHealthProfile (validated)
    │
    ├──► LocalHealthProfileCompiler  →  LocalHealthProfileArtifact  (PSL-C, Producto 3)
    │
    └──► NHSHealthProfileCompiler   →  NHSHealthProfileArtifact    (PSL-NHS, Producto 4)
```

**P4-R1:** El PSL-NHS no puede generarse desde un PSL no validado: `psl.status === "validated"`.

**P4-R2:** El PSL-NHS no nace del PSL-C. Nunca es un derivado del artefacto compilado del Producto 3. Ambos compilan el `LocalHealthProfile`; no se generan uno desde el otro.

**P4-R3:** El PSL-NHS no consume los capítulos V, VI ni VII del PSL (conclusiones, cierre interpretativo, priorización). Su contenido proviene exclusivamente del Capítulo III (datos de diagnóstico integrado: qué estudios hay, cuántos registros) y del Capítulo IV (indicadores cuantitativos y cautelas metodológicas del MIT).

---

## 5. Fuentes

### 5.1 Fuentes directas (del LocalHealthProfile validado)

| Fuente | Qué aporta | Obligatoria |
|---|---|---|
| `ibsePresent`, `dukePresent`, … `cagePresent` (Cap. III) | Presencia/ausencia de cada estudio | Sí |
| `complementaryStudyCount` (Cap. III) | Total de estudios disponibles | Sí |
| Agregados de cada estudio (via workspace) | Indicadores headline (ver §6) | Al menos 1 estudio |
| `methodologicalCautionCount` (Cap. IV) | Número de cautelas activas | Sí |
| `healthReportTitle` / `healthReportDocumentId` (Cap. II) | Referencia al Informe de Salud | No (omitido si ausente) |
| `tematicasSeleccionadasIds` (Cap. VII) | Existencia de priorización ciudadana (solo sí/no) | No |
| `validatedAt`, `validatedBy` | Fecha y responsable de validación | Sí |

### 5.2 Valores de referencia disponibles en el sistema

Los valores de referencia para los estudios EAS ya existen en las definiciones metodológicas del sistema (`MethodologicalModule.ReferenceValues`). El trabajo de implementación de D3-04 consiste en **conectar estos valores al `NHSHealthProfileCompiler`**, no en obtener datos externos nuevos.

| Instrumento | Indicador | Valor de referencia | Población | Fuente |
|---|---|---|---|---|
| DUKE-EAS | `meanGlobal` | 49,2 | Adultos ≥16 años, Granada (EAS) | `fixtures/duke-eas-granada.csv`, n=3028 |
| PREDIMED-EAS | `meanScore` | 7,6 | Adultos ≥16 años, Granada (EAS) | `fixtures/predimed-eas-granada.csv`, n=3064 (válidos=712) |
| SF-12 PCS | `meanPCS` | 50,0 (SD=10) | Población española general | Vilagut et al. Med Clín Barc. 2008;130(19):726-735 |
| SF-12 MCS | `meanMCS` | 50,0 (SD=10) | Población española general | Vilagut et al. 2008 |
| IBSE | `meanTotal` | Sin referencia externa | N/A | La escala no tiene referencia provincial o nacional |
| Sueño-EAS | `pctInsufficientSleep` | Sin referencia definida | N/A | Pendiente |
| CAGE-EAS | `pctRisk` | Sin referencia definida | N/A | Pendiente |

**Estado de D3-04 (revisado):**
D3-04 no describe datos ausentes del mundo exterior. Describe valores ya presentes en el sistema que aún no están conectados al compilador. Los indicadores IBSE, Sueño y CAGE no tienen referencia y se mostrarán sin comparador hasta que se definan valores de referencia metodológicamente validados.

### 5.3 Fuentes explícitamente excluidas

El PSL-NHS no consume ninguno de los siguientes objetos:
- Capítulos V, VI, VII del `LocalHealthProfile` (conclusiones, cierre interpretativo, priorización)
- `ActionPlanDraft`, `AgendaDraft`, `MonitoringDraft`
- `StrategicRepository`, `EPVSATranslationResult`
- `ReconciliacionResult`, `EstadoTerritorialEvolutivo` (MIT)
- `LT1Result`, `OITResult`
- Cualquier output del Motor de Traducción Estratégica

---

## 6. Indicadores canónicos

Esta tabla es **normativa**. El compilador produce exactamente estos indicadores y no otros.

| Instrumento | Indicador visible (nombre no técnico) | Campo técnico | Dirección positiva | Valor de referencia |
|---|---|---|---|---|
| **IBSE** | Bienestar socioemocional escolar | `ibseStudy.aggregates.meanTotal` | Mayor = mejor | Sin referencia externa |
| **DUKE-EAS** | Apoyo social funcional | `dukeStudy.aggregates.meanGlobal` | Mayor = mejor | 49,2 (EAS Granada) |
| **PREDIMED-EAS** | Adherencia a dieta mediterránea | `predimedStudy.aggregates.meanScore` | Mayor = mejor | 7,6 (EAS Granada) |
| **Sueño-EAS** | Población con sueño insuficiente | `suenoStudy.aggregates.pctInsufficientSleep` | Menor = mejor | Sin referencia |
| **CAGE-EAS** | Consumo de riesgo de alcohol | `cageStudy.aggregates.pctRisk` | Menor = mejor | Sin referencia |
| **SF-12** | Salud física percibida | `sf12Study.aggregates.meanPCS` | Mayor = mejor | 50,0 (población española) |
| **SF-12** | Salud mental percibida | `sf12Study.aggregates.meanMCS` | Mayor = mejor | 50,0 (población española) |

**Reglas sobre indicadores:**

- SF-12 aporta dos indicadores. Son dimensiones independientes y ambas se incluyen siempre juntas.
- No se incluyen sub-escalas (ej.: `meanFactorVinculo` de IBSE, `meanConfidential` de DUKE) en el PSL-NHS. Solo el indicador global de cada instrumento, más SF-12 PCS y MCS.
- Si un estudio no está cargado, su indicador no aparece en el documento. No se muestra como vacío.
- El `pctRisk` de CAGE y el `pctInsufficientSleep` de Sueño se expresan como porcentaje (%) de la muestra válida.

---

## 7. Estructura documental

El documento se organiza en **cuatro partes** que el lector recorre de arriba hacia abajo. La organización es por dominio, nunca por instrumento.

### Parte I — Marco municipal

**Propósito:** identificar el municipio, la fecha del diagnóstico y la base de datos disponible.

**Contenido obligatorio:**
- Nombre del municipio y provincia
- Fecha de validación técnica del PSL de origen (`psl.validatedAt`)
- Responsable técnico (`psl.validatedBy`)
- Total de estudios disponibles: "X de 6 estudios complementarios"
- Referencia al Informe de Salud si existe (solo título; nunca el contenido)

**Formato:** bloque compacto de identificación. No hay párrafos descriptivos.

---

### Parte II — Indicadores de salud por dominio

**Propósito:** presentar los indicadores disponibles con sus comparadores, organizados por dominio causal.

Los dominios son tres. Cada dominio se muestra solo si tiene al menos un estudio disponible. Si ningún instrumento de un dominio está cargado, el dominio no aparece en el documento.

#### Dominio A — Bienestar y salud comunitaria

| Indicador | Instrumentos que contribuyen |
|---|---|
| Bienestar socioemocional escolar | IBSE |
| Apoyo social funcional | DUKE-EAS |

#### Dominio B — Conductas y estilos de vida

| Indicador | Instrumentos que contribuyen |
|---|---|
| Adherencia a dieta mediterránea | PREDIMED-EAS |
| Sueño insuficiente | Sueño-EAS |
| Consumo de riesgo de alcohol | CAGE-EAS |

#### Dominio C — Salud percibida

| Indicador | Instrumentos que contribuyen |
|---|---|
| Salud física percibida | SF-12 (PCS) |
| Salud mental percibida | SF-12 (MCS) |

**Formato de cada fila de indicador:**

Cada indicador se presenta como una fila con cuatro campos:

```
[Nombre del indicador]  |  [Valor municipal]  |  [Referencia]  |  [Posición relativa]
```

- **Nombre:** en lenguaje no técnico (columna "Indicador visible" de §6).
- **Valor municipal:** número + unidad o etiqueta de interpretación si la escala es no intuitiva (ej.: "7,2 / 14" para PREDIMED).
- **Referencia:** valor de referencia + población (ej.: "49,2 — Adultos, Granada (EAS)") o "Sin referencia disponible".
- **Posición relativa:** se muestra solo cuando existe referencia. Cuatro valores posibles:
  - `Por encima` — el valor municipal supera el valor de referencia en la dirección positiva
  - `Por debajo` — el valor municipal es inferior al de referencia en la dirección positiva
  - `Similar` — diferencia dentro del margen de variación esperado
  - *(columna vacía)* — cuando no hay referencia

**Por qué etiquetas explícitas y no flechas:** las escalas van en sentidos distintos (mayor DUKE es mejor; mayor CAGE-riesgo es peor). Una flecha sin contexto requiere conocer la dirección de la escala. La etiqueta textual "Por encima / Por debajo" siempre se refiere a la dirección positiva del indicador y es interpretable sin conocimiento técnico.

**Nota de muestra pequeña:** si el número de registros válidos para el cálculo es inferior a 30, la fila incluye la indicación "(muestra reducida — interpretar con precaución)". El umbral es 30 registros válidos, no 30 registros totales.

**No se muestran intervalos de confianza ni pruebas de significación estadística.** El tamaño de las muestras municipales de COMPÁS NG no permite inferencia estadística rigurosa comparable a la del NHS inglés. La comparación es indicativa, no estadística.

---

### Parte III — Participación ciudadana

**Propósito:** informar factualmente sobre si el proceso de priorización ciudadana se realizó.

**Contenido:** una única línea.
- Si existe priorización temática en el PSL: "Proceso de participación ciudadana: realizado (fecha). [N] temáticas identificadas por la ciudadanía."
- Si no existe: "Proceso de participación ciudadana: no realizado en este diagnóstico."

**Esta parte no lista las temáticas.** No interpreta los resultados. No dice cuáles son las prioridades. Solo informa de que el proceso existe o no existe.

**Esta parte se omite** si el lector político no necesita saberlo (ej.: versiones abreviadas). No es structuralmente obligatoria, pero sí recomendada.

---

### Parte IV — Alcance del diagnóstico

**Propósito:** hacer explícito qué se ha medido y qué no, para que el lector sepa qué confianza depositar en el documento y qué información falta.

Esta parte es **obligatoria**. Sin ella, el lector no puede distinguir entre "el municipio no tiene problema con el sueño" y "no tenemos datos de sueño de este municipio."

**Contenido:**

1. **Estudios realizados:** lista de los estudios disponibles con su fecha de carga.
2. **Estudios no disponibles:** lista de los estudios del catálogo (de los 6 posibles) que no están cargados en este expediente.
3. **Indicadores sin referencia:** lista de indicadores que se muestran sin comparador y razón (ej.: "Bienestar socioemocional escolar — sin referencia provincial disponible").
4. **Nota de cautela general** (una frase fija en todos los PSL-NHS):
   > "Este perfil presenta datos disponibles en el momento del diagnóstico. La ausencia de un estudio en este documento significa que no estaba disponible en el expediente del municipio, no que el problema no exista."

**Esta parte no contiene interpretación técnica.** Solo informa sobre completitud de datos. La profundidad técnica (cautelas del MIT, calidad muestral detallada) pertenece al PSL-C.

---

## 8. Portada

La portada es obligatoria y es la primera cosa que el receptor ve.

**Título del documento (en portada):**
```
PERFIL DE SALUD LOCAL
Diagnóstico Comparativo
```

**Por qué esta denominación:** "Perfil de Salud Local" mantiene la coherencia familiar con el Producto 3 y con el ecosistema institucional de COMPÁS NG. "Diagnóstico Comparativo" distingue este producto del PSL-C narrativo. La denominación completa del producto en el catálogo institucional es "Perfil de Salud Local tipo NHS (PSL-NHS)"; la portada usa la versión legible para audiencia no técnica.

**Contenido completo de la portada:**
- Franja del gradiente COMPÁS (6px, uso canónico per VISUAL-CONTRACT §2)
- Título: `PERFIL DE SALUD LOCAL · Diagnóstico Comparativo`
- Nombre del municipio (tipografía principal, tamaño destacado)
- Provincia
- Año del diagnóstico (año de `psl.validatedAt`)
- `Diagnóstico basado en [N] de 6 estudios complementarios`
- `Validado técnicamente: [fecha] · [nombre del técnico]`
- Identificación COMPÁS NG
- Identificación institucional (Junta de Andalucía / Distrito Sanitario si corresponde)

**La portada no incluye:**
- Resumen ejecutivo
- Ningún indicador
- Ninguna conclusión
- Logotipos de sistemas informáticos internos

---

## 9. Comportamiento con datos parciales

El PSL-NHS debe funcionar en todas las combinaciones posibles de estudios y comparadores. Esta tabla define el comportamiento canónico:

### 9.1 Casos por número de estudios

| Situación | Comportamiento |
|---|---|
| 6 estudios disponibles | Documento completo con tres dominios |
| 2–5 estudios disponibles | Solo los dominios con al menos 1 estudio; Parte IV lista los estudios ausentes |
| 1 estudio disponible | Documento mínimo: 1 dominio + Parte IV con 5 estudios ausentes |
| 0 estudios disponibles | Gate G-NHS-2 bloquea la compilación |

### 9.2 Casos por disponibilidad de comparadores

| Situación | Comportamiento |
|---|---|
| Indicador con referencia disponible | Muestra valor + referencia + posición relativa |
| Indicador sin referencia (IBSE, Sueño, CAGE) | Muestra valor; columnas "Referencia" y "Posición" vacías o con "Sin referencia disponible" |
| Indicador con referencia y muestra < 30 registros | Muestra valor + referencia + posición + nota "(muestra reducida)" |
| Todos los indicadores sin referencia | Documento válido; Parte IV explica la ausencia de comparadores |

### 9.3 Advertencia de comparadores escasos

Si **ninguno** de los indicadores del documento tiene referencia disponible, la portada incluye una nota visible:

> "Este perfil no incluye comparadores externos. Los valores reflejan la situación del municipio sin posibilidad de comparación provincial o nacional."

Esto no bloquea la generación pero comunica la limitación sin ocultar la utilidad parcial del documento.

---

## 10. Compilador

El compilador del PSL-NHS es el `NHSHealthProfileCompiler`.

**Estado:** No implementado. El contrato del compilador detallado es `CONTRACT-NHS-HEALTH-PROFILE-COMPILER` (pendiente de crear; se creará al iniciar la implementación del Producto 4).

### 10.1 Entradas del compilador

```typescript
interface CompileNHSHealthProfileInput {
  psl: LocalHealthProfile;          // PSL validado (o superior)
  workspace: MunicipalityWorkspace; // Para acceder a los agregados de estudios
  compiledBy?: string;
  municipalityName: string;
  municipalityProvince: string;
  existingArtifactCount: number;
}
```

### 10.2 Gates de compilación

| Gate | Condición | Tipo |
|---|---|---|
| G-NHS-1 | `psl.status === "validated" \|\| psl.status === "approved"` | Bloqueante |
| G-NHS-2 | `psl.complementaryStudyCount >= 1` | Bloqueante |
| G-NHS-3 | Al menos 3 indicadores con referencia disponible | Advertencia (no bloquea; genera nota en portada) |

### 10.3 Restricciones del compilador

El compilador **nunca**:
- genera texto analítico o interpretativo;
- emite conclusiones sobre los indicadores;
- accede al Capítulo V, VI o VII del PSL;
- accede a ningún motor del Nivel 3 (MTE, ActionPlan, etc.);
- modifica el PSL de origen;
- produce dashboards interactivos.

### 10.4 Salida del compilador

El `NHSHealthProfileArtifact` es:
- **Inmutable** desde el momento de compilación (`isCongealed: true`)
- **Exportable** como documento de presentación (PDF o HTML estático); no depende de la aplicación para ser leído
- **Trazable**: incluye `sourcePSLId`, `sourcePSLVersion`, `compiledAt`, `compiledBy`
- **Versionado**: `PSL-NHS/v{N}` donde N es el número de artefactos compilados para el municipio + 1

---

## 11. Exclusiones explícitas

| Elemento prohibido | Razón |
|---|---|
| Recomendaciones de cualquier tipo | El PSL-NHS compara; no prescribe. Las orientaciones estratégicas pertenecen al MTE y al Plan de Acción. |
| Conclusiones interpretativas | Interpretar ("la situación es preocupante") pertenece al PSL-C. El PSL-NHS presenta datos; el lector interpreta. |
| Áreas de intervención territorial | Son candidaturas técnicas del Nivel 2. No pertenecen a un documento de comunicación política. |
| Prioridades seleccionadas | La priorización es deliberativa. No puede aparecer en un documento generado automáticamente. |
| Compromisos institucionales | Pertenecen al Plan de Acción y al PLS. |
| Terminología técnica del sistema | MIT, LT1, OIT, EvidenceStore, SAM, Compiler, Scaffold, EvidenceAtom — ninguno visible. |
| Sub-escalas de los instrumentos | `meanFactorVinculo` (IBSE), `meanConfidential` (DUKE), `lowGlobalCount` (DUKE), etc. Solo indicadores headline (§6). |
| Estadísticas del EvidenceStore | Número de átomos, distribución por origen, `atomsByKind` — información técnica, no comunicativa. |
| Intervalos de confianza | No aplicables con muestras municipales pequeñas. |
| Líneas estratégicas (EPVSA, ESCA, RELAS) | El encaje estratégico pertenece al proceso de planificación posterior. |
| Análisis de desigualdades por subgrupo | Los agregados disponibles son municipales totales; la desagregación por sexo/edad/socioeconómico no está en los `*Aggregates` del sistema. |
| Tendencias temporales | No existe historial de series temporales en el sistema. |
| IA generativa de texto | Ningún texto del PSL-NHS es generado por un modelo de lenguaje. Todo el contenido procede de los datos del workspace. |

---

## 12. Relación con otros productos

| Producto | Relación con el PSL-NHS |
|---|---|
| **Producto 1** — Estudios Complementarios | Fuente primaria de contenido. Los seis instrumentos certificados son la base de los indicadores del PSL-NHS. |
| **Producto 2** — SAM NG | Las cautelas de calidad muestral informan la nota "(muestra reducida)" en Parte II cuando el número de registros válidos es bajo. |
| **Producto 3** — PSL-C | Comparte fuente (`LocalHealthProfile`); no se sustituyen. El PSL-NHS no nace del PSL-C: ambos compilan el mismo objeto por separado. |
| **Producto 5** — MTE | Sin relación directa. El PSL-NHS no alimenta el MTE. |
| **Producto 6** — Plan de Acción | Sin relación directa. |
| **Producto 7** — Plan Local de Salud | El PSL-NHS **puede incorporarse al PLS como documento complementario de comunicación** (ej.: como primer anexo de comunicación política). Esta incorporación no es automática ni obligatoria; la decide el equipo técnico en el momento de compilar el PLS. |

---

## 13. Invariantes

**P4-I1:** El PSL-NHS no sustituye al PSL-C. Son productos independientes con propósitos distintos sobre la misma base de evidencia.

**P4-I2:** El PSL-NHS no es una versión corta del PSL-C. No resume capítulos del Producto 3. Toma indicadores del workspace y los presenta con comparadores.

**P4-I3:** El PSL-NHS presenta datos y comparadores. No concluye, no recomienda, no prioriza, no interpreta.

**P4-I4:** El PSL-NHS es inmutable desde el momento de compilación (`isCongealed: true`). Si el PSL cambia y se revalida, debe generarse un nuevo PSL-NHS con nueva versión.

**P4-I5:** El PSL-NHS solo se genera desde un PSL en estado `validated` o `approved`. Nunca desde `generated`.

**P4-I6:** El PSL-NHS requiere al menos 1 estudio complementario con resultados. Sin estudios no hay indicadores y el documento no puede generarse.

**P4-I7:** La organización es por dominio causal (Bienestar y salud comunitaria / Conductas y estilos de vida / Salud percibida). Nunca por instrumento.

**P4-I8:** Los indicadores headline son los definidos en §6. No se añaden sub-escalas ni indicadores adicionales sin revisión de este contrato.

**P4-I9:** La Parte IV (Alcance del diagnóstico) es obligatoria en todos los PSL-NHS generados.

**P4-I10:** El documento es exportable y legible fuera de la aplicación (portabilidad). No depende de la aplicación COMPÁS NG para ser interpretado.

---

## 14. Deuda residual

| ID | Deuda | Tipo | Estado |
|---|---|---|---|
| D4-01 | Conectar `MethodologicalModule.ReferenceValues` de DUKE, PREDIMED y SF-12 al `NHSHealthProfileCompiler` | Implementación (wiring) | Abierta — resolución durante implementación P4 |
| D4-02 | Definir valores de referencia metodológicamente validados para IBSE, Sueño-EAS y CAGE-EAS | Disponibilidad de datos metodológicos | Abierta — no bloquea implementación |
| D4-03 | Crear `CONTRACT-NHS-HEALTH-PROFILE-COMPILER` con especificación de tipos y estructura del artefacto | Implementación | Pendiente de crear al iniciar P4 |
| D4-04 | Formato de exportación PDF/HTML del artefacto | Implementación de rendering | Pendiente; no bloquea el compilador |
| ~~D3-04~~ | ~~Datos de referencia Granada/Andalucía no disponibles~~ | **RECLASIFICADO:** los valores existen en el sistema (DUKE, PREDIMED, SF-12). La deuda real es el wiring al compilador (= D4-01). | D3-04 cerrado → D4-01 abierta |

---

## 15. Checklist de preparación para implementación

Antes de escribir código del `NHSHealthProfileCompiler`, estas condiciones deben cumplirse:

- [x] Audiencia definida (§2)
- [x] Preguntas que responde el documento definidas (§3)
- [x] Indicadores canónicos especificados con campo técnico (§6)
- [x] Estructura documental por dominios definida (§7)
- [x] Formato visual de comparación definido (§7, Parte II)
- [x] Portada especificada (§8)
- [x] Comportamiento con datos parciales definido (§9)
- [x] Gates del compilador definidos (§10.2)
- [x] Entradas del compilador tipadas (§10.1)
- [x] Exclusiones normativas definidas (§11)
- [x] Estado de los valores de referencia verificado en código (§5.2)
- [ ] Tipos TypeScript del `NHSHealthProfileArtifact` → crear al iniciar P4
- [ ] `CONTRACT-NHS-HEALTH-PROFILE-COMPILER` → crear al iniciar P4
- [ ] Valores de referencia conectados al compilador (D4-01) → implementación P4

---

## 16. Referencia cruzada

| Documento | Rol |
|---|---|
| `CONTRACT-PSL-COMPAS` | Define el Producto 3 como fuente compartida |
| `CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER` | Arquitectura de referencia para el compilador del P4 |
| `CONTRACT-COMPLEMENTARY-STUDIES` | Define los 6 instrumentos cuyo output es el contenido primario del PSL-NHS |
| `CONTRACT-DYNAMIC-TRIPYRAMID` | SAM como fuente de la nota "(muestra reducida)" |
| `CONTRACT-NAVIGATION §4.1` | Nombre canónico en la interfaz: "Perfil de Salud tipo NHS" |
| `VISUAL-CONTRACT §2` | Uso autorizado del gradiente COMPÁS en la portada |
| `INSTITUTIONAL-PRODUCTS-ARCHITECTURE §4` | Análisis completo del PSL-NHS: transferibilidad NHS, limitaciones, audiencias |
| `BENCHMARK-INSTITUTIONAL-PRODUCTS §VII.2, §VIII.2` | Principios P9–P12; decisión DM-2 sobre umbral de comparadores |
| `src/domain/methodology/MethodologicalModule.ts` | Tipo `ReferenceValues` que contiene los valores de referencia disponibles |
| `src/domain/methodology/definitions/duke-eas.ts` | Referencia DUKE: mean 49,2, EAS Granada, n=3028 |
| `src/domain/methodology/definitions/predimed-eas.ts` | Referencia PREDIMED: mean 7,6, EAS Granada |
| `src/domain/methodology/definitions/sf12-eas.ts` | Referencia SF-12: mean 50, SD 10, Vilagut 2008 |

---

*El PSL-NHS es el primer documento que ve la corporación municipal. Debe responder en tres minutos. Los datos hablan solos cuando van acompañados de un referente.*
