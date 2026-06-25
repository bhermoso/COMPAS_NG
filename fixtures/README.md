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

Script de referencia para regenerarlo:

```
scripts/export-predimed-granada.mjs
```

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

## `duke-eas-granada.csv`

### Origen

Fixture **reproducible** generado a partir de los microdatos oficiales de la EAS,
provincia de Granada (`PROV = 18`).

Contiene los 11 ítems del Duke-UNC-11 (`P5701`–`P5711`) con valores en escala
1–5. No hay campo derivado canónico: el parser (`DUKECSVParser.ts`) calcula las
tres puntuaciones (global, confidencial, afectivo) a partir de los ítems brutos.

Los tests de regresión en `tests/duke.test.ts` verifican los agregados esperados
sobre este fixture.

---

## Principio general

Si se añade un fixture nuevo:

1. Documenta aquí su origen, columnas relevantes y script de regeneración.
2. No lo edites a mano: los tests de regresión deben poder reproducirse desde
   los microdatos fuente.
3. Si el fixture no tiene script de regeneración todavía, indica el origen
   explícitamente en esta sección hasta que el script esté disponible.
