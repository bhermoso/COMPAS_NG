# CONTRACT-GES-EAS-COMPATIBILITY
## Principio de Compatibilidad EAS del Gestor de Encuestas de Salud

> Contrato metodológico permanente.  
> Aplica a toda la evolución futura del catálogo de instrumentos de COMPÁS NG
> y al Gestor de Encuestas de Salud (GES).  
> No debe modificarse sin revisión explícita y deliberada.  
> Fecha de emisión: 2026-07-02

---

## 1. Propósito

Este contrato establece el **Principio de Compatibilidad EAS**: el criterio
metodológico que rige la definición de instrumentos en el catálogo de COMPÁS NG
y la generación de encuestas municipales mediante el Gestor de Encuestas de Salud.

---

## 2. Principio de Compatibilidad EAS

Cuando un instrumento del catálogo de COMPÁS NG tenga equivalente en la
Encuesta Andaluza de Salud (EAS), su implementación canónica deberá ser
**compatible** con dicha implementación.

La compatibilidad comprende, cuando proceda:

- las preguntas utilizadas;
- el orden de las preguntas;
- las categorías de respuesta;
- la codificación numérica de las respuestas;
- los nombres de las variables en los sistemas de captura;
- las recodificaciones y dicotomizaciones;
- los campos derivados;
- los algoritmos de cálculo necesarios para producir los mismos indicadores
  que la EAS.

**El objetivo no es reproducir literalmente los cuestionarios originales de
cada escala. Es garantizar que una encuesta municipal generada por COMPÁS NG
produzca microdatos estructuralmente compatibles con la EAS.**

---

## 3. Consecuencias arquitectónicas

De este principio se derivan tres invariantes que tienen rango de restricción
permanente:

### I-EAS-1: Independencia de origen en los parsers

Los parsers de Estudios Complementarios deberán poder procesar
indistintamente microdatos procedentes de la EAS o de una encuesta municipal
generada por el GES. El parser no conoce ni debe conocer el origen de los datos.

### I-EAS-2: Transparencia en el EvidenceStore

Los Estudios Complementarios no conocen el origen de los EvidenceAtoms que
consumen. El EvidenceStore es el único contrato entre la captura de datos y
el diagnóstico.

### I-EAS-3: Verificación contra el codebook oficial

Toda variable que declare compatibilidad EAS debe indicar explícitamente el
nombre de la variable EAS de referencia y el estado de verificación:

- `verified` — codificación contrastada contra el codebook oficial EAS VI.
- `pending-verification` — codificación derivada de implementación conocida;
  pendiente de contraste con el codebook oficial.

Ninguna variable puede pasar a `verified` sin evidencia documental del codebook.

---

## 4. Ámbito de aplicación

### 4.1 Instrumentos con equivalente EAS (compatibilidad obligatoria)

| Instrumento COMPÁS NG | Variable EAS de referencia | Estado verificación |
|---|---|---|
| DUKE-EAS (apoyo social) | P5701–P5711 (11 ítems Likert 1–5) | `pending-verification` |
| PREDIMED-EAS (dieta mediterránea) | Predimed (campo derivado) | `pending-verification` |
| SF-12 EAS (salud percibida) | PCS12_SP, MCS12_SP (campos pre-calculados) | `pending-verification` |
| Sueño EAS | P33_R, P33A | `pending-verification` |
| CAGE-EAS (consumo alcohol) | CAGE_R, CAGE | `pending-verification` |
| `sexo` (bloque identificación) | SEX_01 | `pending-verification` |
| `nivel_educativo` (bloque identificación) | ME_01 | `pending-verification` |
| `situacion_laboral` (bloque identificación) | SIT_LAB (o equivalente EAS VI) | `pending-verification` |

### 4.2 Instrumentos sin equivalente EAS (definición libre)

Cuando un instrumento no tenga equivalente en la EAS, su definición
metodológica canónica en COMPÁS NG es la referencia institucional del sistema.

| Instrumento | Referencia canónica |
|---|---|
| IBSE | Monitor IBSE — cuestionario REDCap municipal |
| `fecha_encuesta` (bloque identificación) | Definición libre COMPÁS NG |
| `municipio_cod` (bloque identificación) | Código INE de 5 dígitos |
| `anio_nacimiento` (bloque identificación) | Definición libre COMPÁS NG (ver §5) |
| PHQ-9 (futuro) | Instrumento original Kroenke et al. (2001) |
| IPAQ (futuro) | Instrumento original Craig et al. (2003) |

---

## 5. Adaptaciones documentadas

Las siguientes adaptaciones respecto a la EAS son intencionadas y quedan
aprobadas en este contrato:

### 5.1 `sexo` — extensión de categorías

La EAS VI usa `SEX_01` con dos categorías: 1=Hombre, 2=Mujer.

COMPÁS NG extiende a cuatro: 1=Hombre, 2=Mujer, 3=Otro género,
4=Prefiero no indicar.

Los códigos 1 y 2 son idénticos a la EAS. Los códigos 3 y 4 son extensión
propia de COMPÁS NG para cumplimiento ético en encuestas contemporáneas.

Los parsers y el SAM tratarán los códigos 3 y 4 como no estratificables
demográficamente. Este comportamiento es metodológicamente correcto, no una
limitación.

### 5.2 `anio_nacimiento` vs `ED_01`

La EAS VI registra la edad directa del participante en el momento de la
entrevista (`ED_01`).

COMPÁS NG registra el año de nacimiento (`anio_nacimiento`) por tres razones:

1. Es suficiente para el SAM, que trabaja con grupos etarios quinquenales.
2. Permite calcular la edad en cualquier punto temporal posterior, no solo
   en el de la entrevista.
3. Es más preciso para análisis longitudinal entre oleadas.

**Transformación obligatoria:** El parser que calcule la edad a partir de
`anio_nacimiento` debe aplicar: `edad_aproximada = año(fecha_encuesta) − anio_nacimiento`.

Esta transformación es responsabilidad del parser, no del bloque de definición.

---

## 6. Bloque de Identificación y Clasificación

El Bloque de Identificación y Clasificación (`eas-sociodemographic`) es el
único bloque que el GES incluye como primer instrumento de cualquier encuesta.

No es un Estudio Complementario. No produce EvidenceAtoms. Su función es
proporcionar las variables necesarias para:

- caracterizar la muestra demográficamente;
- permitir el análisis de ajuste muestral (SAM);
- garantizar la comparabilidad entre municipios y oleadas;
- cumplir los requisitos mínimos de cualquier encuesta de salud.

### Variables del bloque mínimo (v1.0)

| Variable REDCap | Equivalente EAS | Verificación | Obligatoria |
|---|---|---|---|
| `fecha_encuesta` | Sin equivalente | — | Sí |
| `municipio_cod` | Sin equivalente | — | No |
| `sexo` | `SEX_01` | `pending-verification` | Sí |
| `anio_nacimiento` | `ED_01` (adaptación §5.2) | `pending-verification` | Sí |
| `nivel_educativo` | `ME_01` | `pending-verification` | Sí |
| `situacion_laboral` | SIT_LAB (o equivalente) | `pending-verification` | Sí |

---

## 7. Relación con otros contratos

**CONTRACT-COMPLEMENTARY-STUDIES:** Los Estudios Complementarios
(`IBSEPanel`, `DUKEPanel`, etc.) no deben modificarse para implementar este
principio. I-EAS-1 garantiza que los parsers existentes seguirán funcionando.

**CONTRACT-EVIDENCE:** El EvidenceStore permanece inalterado. I-EAS-2
garantiza que el origen de los datos es transparente para el pipeline.

**CONTRACT-DYNAMIC-TRIPYRAMID:** El análisis SAM usa las variables de
clasificación del bloque para comparar la muestra con la población municipal
de referencia. La variable `sexo` (códigos 1-2) y la edad derivada de
`anio_nacimiento` son las entradas del SAM.

---

## 8. Proceso de verificación

Para que una variable pase de `pending-verification` a `verified`:

1. Localizar el codebook oficial de la EAS VI (archivo .pdf o equivalente).
2. Contrastar nombre de variable, etiquetas de valor y códigos numéricos.
3. Documentar la evidencia en este contrato (sección 4.1, columna "Estado verificación").
4. Actualizar el módulo o bloque correspondiente en el sistema.

Este proceso es obligatorio antes de publicar comparaciones entre datos
municipales propios y datos EAS provinciales o autonómicos.

---

## 9. Estado del contrato

**Estado:** VIGENTE  
**Versión:** 1.0  
**Productores:** GES — `buildRedcapDictionary`, `SociodemographicRedcapBlock`  
**Consumidores:** Toda futura definición de instrumento del catálogo de COMPÁS NG  
**Relacionado con:** CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-EVIDENCE,
CONTRACT-DYNAMIC-TRIPYRAMID, CONTRACT-INDEX
