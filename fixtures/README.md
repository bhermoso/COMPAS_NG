# Fixtures de tests — COMPÁS NG

Este directorio contiene los datos de referencia utilizados por la batería de
tests de regresión. **Ningún fichero CSV de este directorio debe editarse a mano.**
Todo fixture debe poder reconstruirse exactamente desde los microdatos oficiales
EAS usando los scripts de `scripts/`.

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

**Estado del script de exportación:** pendiente de crear
`scripts/export-duke-granada.mjs`. El fixture actualmente disponible fue
generado de forma ad hoc antes de que se estableciera el patrón de scripts
de exportación. Debe crearse el script antes de considerar este fixture
completamente consolidado.

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

## Principio general

Si se añade un fixture nuevo:

1. Documenta aquí su origen, columnas relevantes y script de regeneración.
2. No lo edites a mano: los tests de regresión deben poder reproducirse desde
   los microdatos fuente.
3. Si el fixture no tiene script de regeneración todavía, indica el origen
   explícitamente en esta sección hasta que el script esté disponible.
