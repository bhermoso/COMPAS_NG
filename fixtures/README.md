# Fixtures de tests — COMPÁS NG

Este directorio contiene los datos de referencia utilizados por la batería de
tests de regresión. **Ningún fichero CSV de este directorio debe editarse a mano.**

Los fixtures se clasifican en tres categorías según su origen:

| Categoría | Descripción |
|---|---|
| `provincial-eas-granada` | Reproducible desde microdatos EAS (Encuesta Andaluza de Salud), filtro `PROV=18`. Representa la muestra provincial de Granada. No representa ningún municipio concreto. |
| `municipal-demo` | Datos reales de un municipio o de un programa de monitorización municipal. No sustituyen al informe de salud ni se generalizan a otros municipios. |
| `synthetic-validation` | Datos generados sintéticamente para validar el parser, los cálculos, el panel y el flujo. **No representan Granada, ni Andalucía, ni ningún municipio real. No deben interpretarse epidemiológicamente.** |

---

## Índice de clasificación

| Fichero | Categoría | n |
|---|---|---|
| `predimed-eas-granada.csv` | `provincial-eas-granada` | 3.064 |
| `sf12-eas-granada.csv` | `provincial-eas-granada` | 3.064 |
| `duke-eas-granada.csv` | `provincial-eas-granada` | 3.028 (pre-filtrado) |
| `sueno-eas-granada.csv` | `provincial-eas-granada` | 3.064 |
| `cage-eas-granada.csv` | `provincial-eas-granada` | 3.064 |
| `ipaq-eas-granada.csv` | `provincial-eas-granada` | 3.064 |
| `ibse-atarfe.csv` | `municipal-demo` | 909 (REDCap Atarfe 2026) |
| `ibse-granada-provincia.csv` | `municipal-demo` | 891 (monitor IBSE provincial) |
| `auditc-municipal.csv` | `synthetic-validation` | 95 |
| `ghq12-municipal.csv` | `synthetic-validation` | 100 |
| `phq9-municipal.csv` | `synthetic-validation` | 80 |
| `psqi-municipal.csv` | `synthetic-validation` | 60 |
| `fagerstrom-municipal.csv` | `synthetic-validation` | 50 |
| `sbq-municipal.csv` | `synthetic-validation` | 70 |

---

## `predimed-eas-granada.csv`

### Origen

Fixture **reproducible** generado a partir de los microdatos oficiales de la
**Encuesta Andaluza de Salud (EAS)**, provincia de Granada (`PROV = 18`).

Fuente: `EAS_microdatos_adulto_READY.csv` — todas las columnas PREDIMED
necesarias están presentes en el fichero READY (a diferencia de SF-12).

Script de referencia para regenerarlo:

```
scripts/export-predimed-granada.mjs
```

### Estadísticos de referencia (Granada, n=3064)

| Indicador | Valor |
|---|---|
| Registros exportados | 3.064 |
| Predimed válidos | 712 (23,2 %) |
| Registros sin Predimed | 2.352 (76,8 %) — oleadas sin módulo PREDIMED |
| Predimed media | 7,629 |
| Predimed mediana | 8,000 |
| Predimed DT | 2,412 |
| Adherencia baja (≤6) | 256 (36,0 %) |
| Adherencia media (7–8) | 186 (26,1 %) |
| Adherencia alta (≥9) | 270 (37,9 %) |

### Estructura de columnas

| Columna | Descripción |
|---|---|
| `Predimed` | **Campo canónico.** Índice PREDIMED-14 calculado con la recodificación oficial de la EAS. Es la única fuente que COMPÁS NG usa para puntuar. |
| `Predimed_R`, `Predimed_R2`, `Predimed_R3` | Variables derivadas de la EAS (niveles de adherencia). Se conservan por trazabilidad. |
| `P36BPD01_2023` … `P36BPD14_2023` | Los 14 ítems brutos del cuestionario PREDIMED (edición EAS 2023). Se conservan **únicamente para auditoría metodológica**, no para cálculo. |

### Por qué COMPÁS NG usa `Predimed` y no la suma de ítems

Los 14 ítems `P36BPD01_2023`–`P36BPD14_2023` almacenan códigos de respuesta
categoriales (1, 2, 3, 4), **no valores binarios (0/1)**. La conversión de cada
ítem a su contribución dicotómica al índice requiere una recodificación específica
por ítem —con umbrales distintos según el alimento o práctica evaluada— que la
EAS aplica internamente y materializa en el campo `Predimed`.

**La suma directa de los 14 ítems no reproduce el índice oficial PREDIMED.**

El parser (`PREDIMEDCSVParser.ts`) prioriza el campo `Predimed` cuando existe y
emite un aviso explícito si solo están disponibles los ítems brutos, precisamente
para evitar que un usuario calcule un índice incorrecto.

---

## `sf12-eas-granada.csv`

### Origen

Fixture **reproducible** generado a partir de los microdatos oficiales de la EAS,
provincia de Granada (`PROV = 18.0`), usando `EAS_COMPLETO.csv` como fuente.

**No puede generarse desde `EAS_microdatos_adulto_READY.csv`**: ese fichero
carece de `MCS12_SP` y de la mayoría de ítems canónicos recodificados.

Script de referencia para regenerarlo:

```
scripts/export-sf12-granada.mjs
```

### Estadísticos de referencia (Granada, n=3064)

| Indicador | Valor |
|---|---|
| Registros exportados | 3.064 |
| PCS12_SP válidos | 3.047 (99,4 %) |
| MCS12_SP válidos | 3.047 (99,4 %) |
| PCS12_SP media | 49,552 |
| PCS12_SP mediana | 54,697 |
| PCS12_SP DT | 10,664 |
| MCS12_SP media | 51,139 |
| MCS12_SP mediana | 53,579 |
| MCS12_SP DT | 9,446 |

### Estructura de columnas

| Columna | Tipo | Descripción |
|---|---|---|
| `PCS12_SP` | **Campo canónico** | Physical Component Summary España (0–100, continua). Calculado por la EAS según Vilagut et al. 2008. |
| `MCS12_SP` | **Campo canónico** | Mental Component Summary España (0–100, continua). Mismo algoritmo. |
| `PCS12_SP_R` | Derivada EAS | PCS en cuartiles (1=<49,02 / 2=49,02–54,99 / 3=54,99–56,40 / 4=>56,40). |
| `PCS12_SP_R2` | Derivada EAS | PCS bajo mediana (0=No / 1=Sí; corte: 54,993). |
| `MCS12_SP_R` | Derivada EAS | MCS en cuartiles (1=<48,39 / 2=48,39–53,58 / 3=53,58–56,61 / 4=>56,61). |
| `MCS12_SP_R2` | Derivada EAS | MCS bajo mediana (0=No / 1=Sí; corte: 53,579). |
| `RGH1` | Ítem canónico | GH1 — Salud general actual (1=Mala…5=Excelente). **Diferente de `P40`** (que es retrospectivo a 12 meses). |
| `PF02` | Ítem canónico | PF2 — Esfuerzos moderados (1=Limita mucho…3=No limita). Idéntico a `P0801`. |
| `PF04` | Ítem canónico | PF4 — Subir pisos. Idéntico a `P0802`. |
| `rp2` | Ítem canónico | RP2 — Menos de lo deseado (físico). 0=No / 1=Sí. Idéntico a `P0901`. |
| `rp3` | Ítem canónico | RP3 — Dejar tareas (físico). Idéntico a `P0902`. |
| `RE2` | Ítem canónico | RE2 — Menos de lo deseado (emocional). 1=Sí / 2=No (invertido vs `P1001`). |
| `RE3` | Ítem canónico | RE3 — No tan cuidadoso (emocional). 1=Sí / 2=No (invertido vs `P1002`). |
| `RBP2` | Ítem recodificado | BP2 — Dolor (1=Mucho…5=Nada). `RBP2 = 6 − P11` (verificado 100 %). |
| `RMH3` | Ítem recodificado | MH3 — Calmado (1=Nunca…6=Siempre). `RMH3 = 7 − P1201` (verificado 100 %). |
| `RVT2` | Ítem recodificado | VT2 — Energía (1=Nunca…6=Siempre). `RVT2 = 7 − P1202` (verificado 100 %). |
| `MH4` | Ítem canónico | MH4 — Desanimado (1=Siempre…6=Nunca). Idéntico a `P1203`. |
| `SF2` | Ítem canónico | SF2 — Función social (1=Siempre…5=Nunca). Idéntico a `P13`. |

### Qué consume COMPÁS NG de este fixture

**Campos canónicos (únicos campos que alimentan EvidenceAtoms):**

| Campo | Uso |
|---|---|
| `PCS12_SP` | Media municipal del componente físico (continua). Indicador primario. |
| `MCS12_SP` | Media municipal del componente mental (continua). Indicador primario. |

**Campos de referencia y trazabilidad (presentes en el fixture, no generan EvidenceAtoms automáticos):**

`PCS12_SP_R`, `PCS12_SP_R2`, `MCS12_SP_R`, `MCS12_SP_R2` y los 12 ítems
canónicos recodificados se incluyen en el fixture por trazabilidad metodológica
y para facilitar auditorías futuras. **COMPÁS NG no genera a partir de ellos
ningún indicador dicotómico, por cuartil ni por mediana.**

Cualquier clasificación categórica futura (ej. "% por debajo de la mediana
provincial", cuartiles, etc.) requerirá una referencia metodológica explícita
y documentada en el `MethodologicalModule` antes de ser emitida como
`EvidenceAtom`. No se generarán puntos de corte basados en decisiones ad hoc
de COMPÁS NG.

### Por qué se usan `PCS12_SP`/`MCS12_SP` y no se recalcula

El cálculo de PCS y MCS requiere aplicar coeficientes factoriales de la norma
española (Vilagut et al. 2008, *Med Clín Barc* 130(19):726-735), que no están
disponibles en ningún fichero local del repositorio. La EAS aplica ese algoritmo
internamente y lo materializa en `PCS12_SP` y `MCS12_SP`. COMPÁS NG los consume
directamente, igual que consume `Predimed` para PREDIMED-EAS.

**No usar `P40` como sustituto de `RGH1`.** Son preguntas distintas: P40 es
retrospectiva (salud en los últimos 12 meses) y RGH1 pregunta por el estado
actual. Se verificaron 19.447 discrepancias entre ambas en los microdatos EAS.

---

## `duke-eas-granada.csv`

### Origen

Fixture **reproducible** generado a partir de los microdatos oficiales de la EAS,
provincia de Granada (`PROV = 18`).

Fuente: `EAS_microdatos_adulto_READY.csv` — los 11 ítems del Duke-UNC-11
(`P5701`–`P5711`) están presentes en READY con escala 1–5.

Script de referencia para regenerarlo:

```
scripts/export-duke-granada.mjs
```

**Nota sobre pre-filtrado:** a diferencia de otros fixtures EAS que exportan todos
los registros de Granada, este fixture contiene únicamente los 3.028 registros con
los 11 ítems DUKE respondidos en rango válido 1–5. Los 36 registros con algún ítem
missing o fuera de rango no se incluyen porque un registro incompleto no puede
contribuir a ninguna de las tres escalas (global, confidencial, afectivo).

### Estadísticos de referencia (Granada, n=3028)

| Indicador | Valor |
|---|---|
| Registros en fixture | 3.028 |
| nValidGlobal | 3.028 (100 %) |
| meanGlobal | 49,2 / 55 |
| meanConfidential | 31,1 / 35 |
| meanAffective | 18,1 / 20 |
| Apoyo bajo global | 1.658 (54,8 %) |
| Apoyo bajo confidencial | 1.605 (53,0 %) |
| Apoyo bajo afectivo | 1.360 (44,9 %) |

Los estadísticos anteriores están verificados por los tests de regresión en
`tests/duke.test.ts`.

### Estructura de columnas

Contiene los 11 ítems del Duke-UNC-11 (`P5701`–`P5711`) con valores en escala
1–5. No hay campo derivado canónico: el parser (`DUKECSVParser.ts`) calcula las
tres puntuaciones (global, confidencial, afectivo) a partir de los ítems brutos.

---

---

## `sueno-eas-granada.csv`

### Origen

Fixture **reproducible** generado a partir de los microdatos oficiales de la EAS,
provincia de Granada (`PROV = 18.0`), usando `EAS_COMPLETO.csv` como fuente.

**`EAS_microdatos_adulto_READY.csv` no puede usarse**: carece de `P33_R` y de
`ProblemasDormirP33b`, que son derivados que solo existen en `EAS_COMPLETO`.

Script de referencia para regenerarlo:

```
scripts/export-sueno-granada.mjs
```

### Qué mide este fixture y qué no mide

Este fixture contiene indicadores propios de la EAS para la monitorización del
sueño en la población andaluza. **No es el PSQI ni ninguna escala de sueño
validada externamente.** Presentarlo con cualquier otra etiqueta de escala
sería metodológicamente incorrecto.

`P33_R` y `P33A` miden **dimensiones distintas y complementarias** del sueño:

- `P33_R` = **cantidad** — si la persona duerme las horas recomendadas por la
  Sociedad Española del Sueño (7–9 h en adultos). Campo derivado por la EAS.
- `P33A` = **calidad subjetiva percibida** — si las horas dormidas permiten
  descansar. Ítem directo de la encuesta.

Se espera una discordancia del ~29 % entre ambas variables en Granada. No es un
error: refleja que cantidad y calidad percibida del sueño son dimensiones
independientes (personas que duermen suficiente pero no descansan, y personas
que duermen menos de lo recomendado pero se sienten bien).

### Estadísticos de referencia (Granada, n=3064)

| Indicador | Valor |
|---|---|
| Registros exportados | 3.064 |
| P33\_R válidos | 3.004 (98,0 %) |
| P33\_R missing | 60 (2,0 %) — estructural (no recogido en alguna oleada) |
| P33\_R=0 (sí duerme suficiente) | 2.019 (67,2 % de válidos) |
| P33\_R=1 (no duerme suficiente) | 985 (32,8 % de válidos) |
| P33A válidos | 2.306 (75,3 %) |
| P33A=0 (no descansa) | 665 (28,8 % de válidos) |
| P33A=1 (sí descansa) | 1.641 (71,2 % de válidos) |
| P33\_1\_2023 válidos (oleada 2023) | 847 (27,6 %) — missing estructural |
| P33\_1\_2023 media | 6,89 h/día |
| ProblemasDormirP33b válidos (oleada 2023) | 891 (29,1 %) — missing estructural |
| Problemas diarios (=1) | 203 (22,8 % de válidos) |
| SHA256 | `11DCBECE47D5F4E407E26AED750E9CB77C9EEBA44B98F36F5C37F8B7021D5BE5` |

### Estructura de columnas

| Columna | Tipo | Cobertura | Descripción |
|---|---|---|---|
| `P33_R` | **Campo canónico primario** | ~98 % | Sueño insuficiente en horas (0=No / 1=Sí). Derivado EAS según criterios SES. |
| `P33A` | **Campo canónico secundario** | ~75 % | Calidad subjetiva percibida (0=No descansa / 1=Sí descansa). Ítem directo. |
| `P33_1_2023` | Trazabilidad (solo 2023) | ~28 % | Horas de sueño diarias entre semana (valor numérico). Missing estructural. |
| `P33B1_2023` | Trazabilidad (solo 2023) | ~27 % | "¿Dificultades para dormirse?" (1=Nunca … 4=Diariamente) |
| `P33B2_2023` | Trazabilidad (solo 2023) | ~27 % | "¿Se despierta durante la noche?" (ídem escala) |
| `P33B3_2023` | Trazabilidad (solo 2023) | ~27 % | "¿Se despierta demasiado temprano?" (ídem) |
| `P33B4_2023` | Trazabilidad (solo 2023) | ~27 % | "¿Se siente cansado/a al despertar?" (ídem) |
| `P33B5_2023` | Trazabilidad (solo 2023) | ~27 % | "¿Toma algún remedio para dormir (no farmacológico)?" (ídem) |
| `ProblemasDormirP33b` | Trazabilidad (solo 2023) | ~29 % | Problemas diarios: cualquier P33Bx=4. Binario derivado EAS. |

### Missing estructural — por qué es alto en columnas 2023

Los campos `P33B1_2023`–`P33B5_2023`, `P33_1_2023` y `ProblemasDormirP33b`
se recogen únicamente en la oleada EAS 2023. Los registros de oleadas anteriores
no tienen estas preguntas (missing legítimo, no ausencia de respuesta).

Los campos canónicos `P33_R` y `P33A` tienen cobertura amplia porque existen en
múltiples oleadas y la EAS los armoniza internamente.

### Qué consume COMPÁS NG de este fixture

**Campos que alimentarán EvidenceAtoms:**

| Campo | Uso |
|---|---|
| `P33_R` | % de la muestra con sueño insuficiente en horas (indicador continuo provincial). |
| `P33A` | % de la muestra que no descansa suficiente (calidad subjetiva percibida). |

Los campos de trazabilidad (`P33_1_2023`, `P33B1–5_2023`, `ProblemasDormirP33b`)
se incluyen por reproducibilidad metodológica y para facilitar auditorías futuras.
**COMPÁS NG no genera EvidenceAtoms dicotómicos, por ítem ni por frecuencia**
a partir de los campos P33B. Cualquier clasificación categórica futura requerirá
referencia metodológica explícita y documentación en el módulo correspondiente
antes de ser emitida como EvidenceAtom.

### Comparabilidad con datos municipales propios

`P33_R` y `P33A` reflejan la **muestra EAS provincial de Granada** (n=3.064),
no la población de ningún municipio concreto. Su uso en Atarfe es como
referencia contextual provincial, igual que los fixtures de DUKE, PREDIMED y SF-12.
No representan el estado de Atarfe ni de ningún municipio específico.

---

## `cage-eas-granada.csv`

### Origen

Fixture **reproducible** generado a partir de los microdatos oficiales de la EAS,
provincia de Granada (`PROV = 18.0`), usando `EAS_COMPLETO.csv` como fuente.

Script de referencia para regenerarlo:

```
scripts/export-cage-granada.mjs
```

### Estadísticos de referencia (Granada, n=3064)

| Indicador | Valor |
|---|---|
| Registros exportados | 3.064 |
| CAGE_R válidos | 2.513 (82,0 %) |
| Missing / No procede (abstinentes) | 551 (18,0 %) — estructural |
| CAGE_R=0 (sin riesgo) | 2.499 (99,4 % de válidos) |
| CAGE_R=1 (con riesgo) | 14 (0,6 % de válidos) |
| CAGE=1 Bebedor social | 2.499 |
| CAGE=2 Consumo de riesgo | 7 |
| CAGE=3 Consumo perjudicial | 3 |
| CAGE=4 Dependencia alcohólica | 4 |

### Estructura de columnas

| Columna | Tipo | Descripción |
|---|---|---|
| `CAGE_R` | **Campo canónico primario** | Riesgo de alcoholismo (0=No / 1=Sí). Derivado binario EAS. |
| `CAGE` | Campo secundario | Clasificación ordinal de nivel de consumo (1=Bebedor social … 4=Dependencia). |

### Notas metodológicas

- El 18 % de missing en `CAGE_R` es **estructural**: personas abstemias a las que
  el protocolo EAS no administra el test ("No procede", código 994). No es missing
  aleatorio.
- `CAGE_R` y `CAGE` son indicadores propios de la EAS. COMPÁS NG los consume
  directamente sin recalcular el CAGE desde ítems individuales.
- Los ítems de consumo episódico masivo de la EAS (oleada 2023) son instrumentos
  distintos y **no forman parte de este módulo**.

---

## `ibse-atarfe.csv`

### Origen

Fixture **específico de Atarfe** generado a partir de la exportación REDCap del
proyecto Monitor IBSE Atarfe 2026. **No es reproducible desde microdatos EAS**:
es datos primarios de evaluación municipal.

Fuente: `Atarfe/MonitorIBSEATARFE202_DATA_2026-06-22_1943.csv`

Script de regeneración: no aplica (datos primarios REDCap municipales). Para
actualizar, reexportar desde REDCap y ejecutar la extracción de columnas mínimas.

### Estadísticos de referencia (Atarfe, n=909)

| Indicador | Valor |
|---|---|
| Registros exportados | 909 |
| Registros completos (`monitor_ibse_complete=2`) | 811 (89,2 %) |
| Media IBSE total | 63,2 |

### Estructura de columnas

| Columna | Descripción |
|---|---|
| `ibse_factor_vinculo` | Media del factor Vínculo (calculada por REDCap) |
| `ibse_factor_situacion` | Media del factor Situación vital |
| `ibse_factor_control` | Media del factor Control percibido |
| `ibse_factor_persona` | Media del factor Persona |
| `ibse_total` | Media del índice IBSE total (0–100) |
| `monitor_ibse_complete` | Estado del formulario REDCap (2 = completado) |

### Diferencia respecto a fixtures EAS

A diferencia de los fixtures EAS (datos provinciales de Granada), este fixture
contiene datos **específicos de Atarfe** recogidos mediante REDCap. Se usa como
referencia contextual municipal, no provincial. Para otros municipios, se
reemplaza con la exportación REDCap correspondiente.

---

## `ibse-granada-provincia.csv`

**Categoría:** `municipal-demo`

### Origen

Fixture generado a partir del monitor IBSE provincial de COMPÁS histórico.
Contiene registros de participantes escolares de municipios de la provincia de Granada
que completaron el cuestionario IBSE via REDCap en diferentes ciclos del monitor
provincial. **No procede de microdatos EAS.** El IBSE no forma parte de la
Encuesta Andaluza de Salud.

Fuente de referencia: exportación acumulada del monitor IBSE provincial
(`_COMPAS_REPO_DEPURADO_20260409`). La regeneración requiere acceso al proyecto
REDCap del monitor provincial y no tiene script automatizado.

### Estadísticos de referencia (Granada provincial, n=891)

| Indicador | Valor |
|---|---|
| Registros exportados | 891 |
| Registros completos (`monitor_ibse_complete=2`) | 814 (91,4 %) |
| Media IBSE total | 76,2 / 100 |
| Media Factor Vínculo | 64,6 / 100 |
| Media Factor Situación | 84,4 / 100 |
| Media Factor Control | 77,7 / 100 |
| Media Factor Persona | 78,3 / 100 |

### Uso en tests

Sirve como referencia de contraste provincial para el parser IBSE. Los valores
(especialmente `meanTotal=76.2`) son la fuente de los valores de referencia
históricos usados en `IBSE_MODULE.interpretation.referenceValues`.

### Limitaciones

- Representa el monitor IBSE provincial de COMPÁS histórico, no una muestra
  aleatoria ni representativa de la población escolar de Granada.
- La composición por oleada, municipio y curso varía entre ciclos.
- No es comparable directamente con los datos IBSE de un municipio específico
  sin conocer la composición de cada muestra.

---

## `ipaq-eas-granada.csv`

**Categoría:** `provincial-eas-granada`

### Origen

Fixture **reproducible** generado a partir de los microdatos oficiales de la EAS,
provincia de Granada (`PROV = 18.0`), usando `EAS_COMPLETO.csv` como fuente.
`EAS_microdatos_adulto_READY.csv` no contiene `IPAQ_DICO`: este campo derivado
solo existe en `EAS_COMPLETO`.

Script de referencia para regenerarlo:

```
scripts/export-ipaq-granada.mjs
```

### Qué mide este fixture y qué no mide

Este fixture contiene dos indicadores de actividad física derivados por la EAS a
partir de los ítems IPAQ administrados en la encuesta. **No contiene los ítems
brutos IPAQ ni el cálculo en MET-minutos/semana.** Solo los indicadores dicotómicos
derivados oficiales de la EAS.

- `IPAQ_DICO` = clasificación de alta actividad física (1 = alta actividad: cumple
  criterios de ≥600 MET-min/sem o equivalente). Campo derivado EAS.
- `P34A_R` = inactividad física en tiempo libre (1 = no realiza actividad física
  en su tiempo libre). Campo derivado EAS.

### Estadísticos de referencia (Granada, n=3064)

| Indicador | Valor |
|---|---|
| Registros exportados | 3.064 |
| `IPAQ_DICO` válidos | 1.603 (52,3 %) |
| `IPAQ_DICO` missing | 1.461 (47,7 %) — estructural (módulo no aplicado en todas las oleadas) |
| Alta actividad (`IPAQ_DICO=1`) | 251 (15,7 % de válidos) |
| No alta actividad (`IPAQ_DICO=0`) | 1.352 (84,3 % de válidos) |
| `P34A_R` válidos | 3.058 (99,8 %) |
| Inactividad en ocio (`P34A_R=1`) | 1.047 (34,2 % de válidos) |
| Activos en ocio (`P34A_R=0`) | 2.011 (65,8 % de válidos) |

### Estructura de columnas

| Columna | Tipo | Cobertura | Descripción |
|---|---|---|---|
| `IPAQ_DICO` | **Campo canónico primario** | ~52 % | Alta actividad física (0=No / 1=Sí). Derivado IPAQ de la EAS. Missing estructural elevado por diseño muestral. |
| `P34A_R` | **Campo canónico secundario** | ~100 % | Inactividad en tiempo libre (0=activo / 1=inactivo). Presente en todas las oleadas. |

### Missing estructural en `IPAQ_DICO`

El 47,7 % de missing en `IPAQ_DICO` es **estructural**: el módulo IPAQ completo
no se administró en todas las oleadas de la EAS. Los registros de oleadas sin
módulo IPAQ tienen `IPAQ_DICO` en blanco (no es ausencia de respuesta individual).
`P34A_R` sí tiene cobertura universal porque corresponde a una pregunta general
sobre actividad en el tiempo libre presente en todas las oleadas.

### Comparabilidad con datos municipales propios

`IPAQ_DICO` y `P34A_R` reflejan la **muestra EAS provincial de Granada** (n=3.064).
No representan el estado de ningún municipio concreto. Su uso es como referencia
contextual provincial para comparar con datos municipales propios.

---

## `auditc-municipal.csv`

**Categoría:** `synthetic-validation`

> **Advertencia metodológica:** este fixture es sintético. No representa datos
> reales de ningún municipio, ni de Granada, ni de Andalucía. Su único uso
> es la validación funcional del parser, los cálculos y el panel de AUDIT-C.
> No debe interpretarse epidemiológicamente bajo ninguna circunstancia.

### Origen

Fixture generado sintéticamente para la batería de tests de AUDIT-C.
Contiene 95 filas con valores de los 3 ítems del AUDIT-C (Q1, Q2, Q3) diseñados
para cubrir el rango completo de scores (0–12), distintos niveles de riesgo y
casos de datos incompletos o inválidos en las últimas filas.

**No hay script de regeneración** — los valores exactos están fijados en el
fixture para garantizar la reproducibilidad de los tests.

### Estructura

| Columna | Rango válido | Descripción |
|---|---|---|
| `auditc_q1` | 0–4 | Frecuencia de consumo |
| `auditc_q2` | 0–4 | Cantidad habitual por ocasión |
| `auditc_q3` | 0–4 | Frecuencia de consumo episódico intensivo |

### Estadísticos del fixture (solo para trazabilidad de tests)

| Indicador | Valor |
|---|---|
| Registros totales | 95 |
| Registros válidos (3 ítems en rango 0–4) | 85 |
| Registros excluidos (incompletos / inválidos) | 10 |
| Score ≥ 4 (positivos AUDIT-C) | 18 (21,2 % de válidos) |
| Score medio | 1,98 / 12 |
| Sin consumo (score 0) | 28 |
| Bajo riesgo (score 1–3) | 39 |
| Riesgo (score 4–7) | 15 |
| Alto riesgo (score ≥ 8) | 3 |

---

## `ghq12-municipal.csv`

**Categoría:** `synthetic-validation`

> **Advertencia metodológica:** fixture sintético para validación funcional del
> parser GHQ-12. No representa datos reales de ningún municipio, ni de Granada,
> ni de Andalucía. No debe interpretarse epidemiológicamente.

### Origen

Fixture sintético de 100 filas generado para validar el parser GHQ-12.
Cubre el rango completo de respuestas Likert (0–3 por ítem), distintos niveles
de malestar psicológico y 5 filas con datos incompletos o inválidos al final.

### Estructura

| Columnas | Rango válido | Descripción |
|---|---|---|
| `ghq12_q1`–`ghq12_q12` | 0–3 | 12 ítems Likert del GHQ-12 |

### Estadísticos del fixture (trazabilidad de tests)

| Indicador | Valor |
|---|---|
| Registros totales | 100 |
| Registros válidos | 95 |
| Probable malestar psicológico (score bimodal ≥ 3) | 25 (26,3 % de válidos) |

---

## `phq9-municipal.csv`

**Categoría:** `synthetic-validation`

> **Advertencia metodológica:** fixture sintético para validación funcional del
> parser PHQ-9. No representa datos reales de ningún municipio. No debe
> interpretarse epidemiológicamente.

### Origen

Fixture sintético de 80 filas generado para validar el parser PHQ-9.
Cubre el rango completo de respuestas (0–3 por ítem), distintos niveles de
severidad depresiva y 3 filas con datos inválidos al final.

### Estructura

| Columnas | Rango válido | Descripción |
|---|---|---|
| `phq9_q1`–`phq9_q9` | 0–3 | 9 ítems del PHQ-9 |

### Estadísticos del fixture (trazabilidad de tests)

| Indicador | Valor |
|---|---|
| Registros totales | 80 |
| Registros válidos | 77 |
| Depresión moderada o más (score ≥ 10) | 10 (13,0 % de válidos) |
| Score medio | 8,65 / 27 |

---

## `psqi-municipal.csv`

**Categoría:** `synthetic-validation`

> **Advertencia metodológica:** fixture sintético para validación funcional del
> parser PSQI. No representa datos reales de ningún municipio. No debe
> interpretarse epidemiológicamente.

### Origen

Fixture sintético de 60 filas generado para validar el parser PSQI.
Cubre el rango completo de puntuaciones de componente (0–3 por componente),
distintos perfiles de calidad del sueño y 2 filas incompletas al final.

### Estructura

| Columnas | Rango válido | Descripción |
|---|---|---|
| `psqi_c1`–`psqi_c7` | 0–3 | 7 puntuaciones de componente del PSQI |

### Estadísticos del fixture (trazabilidad de tests)

| Indicador | Valor |
|---|---|
| Registros totales | 60 |
| Registros válidos | 58 |
| Mal dormidor (score global > 5) | 18 (31,0 % de válidos) |
| Score medio | 6,26 / 21 |

---

## `fagerstrom-municipal.csv`

**Categoría:** `synthetic-validation`

> **Advertencia metodológica:** fixture sintético para validación funcional del
> parser Fagerström (FTND). No representa datos reales de ningún municipio.
> No debe interpretarse epidemiológicamente.

### Origen

Fixture sintético de 50 filas generado para validar el parser Fagerström.
Contiene registros con los 6 ítems del FTND en sus respectivos rangos válidos
y 2 filas con datos inválidos al final. El fixture asume una muestra de fumadores
activos (contexto esperado del instrumento).

### Estructura

| Columna | Rango válido | Descripción |
|---|---|---|
| `ftnd_q1` | 0–4 | ¿Cuándo fuma el primer cigarrillo? |
| `ftnd_q2` | 0–1 | ¿Le resulta difícil no fumar en lugares prohibidos? |
| `ftnd_q3` | 0–1 | ¿A qué cigarrillo le costaría más renunciar? |
| `ftnd_q4` | 0–1 | ¿Cuántos cigarrillos fuma al día? (dicotomizado) |
| `ftnd_q5` | 0–1 | ¿Fuma más durante las primeras horas? |
| `ftnd_q6` | 0–3 | ¿Fuma aunque esté enfermo? |

### Estadísticos del fixture (trazabilidad de tests)

| Indicador | Valor |
|---|---|
| Registros totales | 50 |
| Registros válidos | 48 |
| Dependencia moderada o más (score ≥ 5) | 15 (31,3 % de válidos) |
| Score medio | 4,31 / 10 |

---

## `sbq-municipal.csv`

**Categoría:** `synthetic-validation`

> **Advertencia metodológica:** fixture sintético para validación funcional del
> parser SBQ. No representa datos reales de ningún municipio, ni de Granada,
> ni de Andalucía. No debe interpretarse epidemiológicamente.

### Origen

Fixture sintético de 70 filas generado para validar el parser del Sedentary
Behavior Questionnaire (SBQ, Rosenberg et al., 2010). Cubre el rango completo
de respuestas ordinales (0–4 por ítem, que se convierten a horas/día mediante
midpoints) y 2 filas incompletas al final.

### Estructura

| Columnas | Rango válido | Descripción |
|---|---|---|
| `sbq_q1`–`sbq_q9` | 0–4 | 9 ítems sobre tiempo en actividades sedentarias distintas (0=nada, 1=<1h, 2=1–2h, 3=2–4h, 4=>4h) |

La conversión ordinal→horas usa midpoints: 0→0h, 1→0,5h, 2→1,5h, 3→3h, 4→5h.
El score total es la suma de las 9 conversiones (horas sedentarias estimadas / día).

### Estadísticos del fixture (trazabilidad de tests)

| Indicador | Valor |
|---|---|
| Registros totales | 70 |
| Registros válidos | 68 |
| Altamente sedentario (score > 8 h/día) | 20 (29,4 % de válidos) |
| Score medio | 9,9 h/día |

---

## Principio general

Si se añade un fixture nuevo:

1. Clasifícalo en una de las tres categorías: `provincial-eas-granada`,
   `municipal-demo` o `synthetic-validation`.
2. Documéntalo en este README con origen, estructura, estadísticos y limitaciones.
3. Los fixtures `provincial-eas-granada` deben poder regenerarse desde los
   microdatos EAS usando un script en `scripts/`.
4. Los fixtures `synthetic-validation` no deben editarse a mano una vez
   establecidos: los tests de regresión dependen de sus valores exactos.
5. Los fixtures `municipal-demo` requieren acceso al sistema de captura original
   (REDCap u otro) para regenerarse; deben documentar la fuente explícitamente.
