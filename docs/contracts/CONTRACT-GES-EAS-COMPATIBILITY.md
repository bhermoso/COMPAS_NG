# CONTRACT-GES-EAS-COMPATIBILITY
## Principio de Compatibilidad EAS del Gestor de Encuestas de Salud

> Contrato metodológico permanente.  
> Aplica a toda la evolución futura del catálogo de instrumentos de COMPÁS NG
> y al Gestor de Encuestas de Salud (GES).  
> No debe modificarse sin revisión explícita y deliberada.  
> Fecha de emisión: 2026-07-02  
> Última revisión: 2026-07-03 — actualización §4.1, §5.3, §5.4, §6 tras auditoría metodológica del bloque sociodemográfico

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
| `nivel_educativo` (bloque identificación) | **P60_2016** (VI EAS) | `pending-verification` |
| `situacion_laboral` (bloque identificación) | **P61** (VI EAS) | `pending-verification` |

### 4.2 Instrumentos sin equivalente EAS (definición libre)

Cuando un instrumento no tenga equivalente en la EAS, su definición
metodológica canónica en COMPÁS NG es la referencia institucional del sistema.

| Instrumento | Referencia canónica |
|---|---|
| IBSE | Monitor IBSE — cuestionario REDCap municipal |
| `fecha_encuesta` (bloque identificación) | Definición libre COMPÁS NG |
| `municipio_cod` (bloque identificación) | Código INE de 5 dígitos |
| `anio_nacimiento` (bloque identificación) | Definición libre COMPÁS NG (ver §5) |
| PHQ-9 | Instrumento original Kroenke et al. (2001) — implementado en producción |
| GHQ-12 | Instrumento original Goldberg (1972) — implementado en producción |
| PSQI | Instrumento original Buysse et al. (1989) — implementado en producción |
| Fagerström (FTND) | Test de Dependencia a la Nicotina — implementado en producción |
| SBQ | Cuestionario de comportamiento sedentario — implementado en producción |
| AUDIT-C | Instrumento WHO (Bush et al., 1998) — implementado en producción |

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

### 5.3 `nivel_educativo` — agregación de 13 a 6 categorías respecto a P60_2016

La EAS VI (P60_2016) tiene **13 categorías** de nivel educativo. El GES implementa
**6 categorías** agrupadas para encuesta comunitaria de administración individual.

#### Tabla de equivalencia P60_2016 → GES

| GES | Etiqueta GES | P60_2016 incluidos | Estudios_MAX |
|---|---|---|---|
| 1 | Sin estudios o estudios primarios incompletos | 1 (no sabe leer), 2 (alfabetizado sin estudios) | 1 |
| 2 | Estudios primarios completos | 3 | 1 |
| 3 | Educación secundaria 1ª etapa | 4 (EGB 8ª), 5 (ESO) | 2 |
| 4 | Educación secundaria 2ª etapa (incl. FP medio) | 6 (FP I grado medio), 8 (BUP/Bach) | 2 |
| 5 | Formación Profesional de grado superior | 7 (FP II grado superior) | 2 |
| 6 | Educación postsecundaria no superior, universitaria o de postgrado | 9, 10, 11, 12, 13 | 3 |

#### Decisiones documentadas

**GES-6 incluye P60=9** (Educación postsecundaria no superior, n=453 en EAS Granada).
Esta categoría no es universitaria en sentido estricto, pero la EAS la agrupa en
`Estudios_MAX=3`. El GES sigue la misma armonización para preservar la comparabilidad
con la variable agregada EAS. La etiqueta GES-6 lo declara explícitamente:
*"postsecundaria no superior, universitaria o de postgrado"*.

**GES-1 fusiona P60=1 y P60=2** (analfabetismo y alfabetizado sin estudios).
Esta fusión sigue el estándar habitual en encuestas comunitarias y es coherente con
Estudios_MAX=1. El analfabetismo (P60=1, n≈70 en Granada) no tiene código propio en GES.

**La comparación con EAS se realiza a través de Estudios_MAX** (3 niveles), no
directamente desde P60_2016 (13 niveles). La tabla anterior define la correspondencia
necesaria para esa comparación.

**Riesgo residual:** La correspondencia GES → Estudios_MAX no es perfectamente
determinista en la EAS (el cruce P60_2016 × Estudios_MAX muestra cruces residuales).
El estado `pending-verification` debe mantenerse hasta disponer de la documentación
oficial del algoritmo de cálculo de Estudios_MAX.

---

### 5.4 `situacion_laboral` — adaptación de 8 a 7 categorías respecto a P61

La EAS VI (P61) tiene **8 categorías** de situación laboral. El GES implementa
**7 categorías**, añadiendo incapacidad/invalidez permanente como categoría explícita.

#### Tabla de equivalencia P61 → GES

| GES | Etiqueta GES | P61 EAS VI | Tipo de correspondencia |
|---|---|---|---|
| 1 | Trabaja (por cuenta propia o ajena) | 1 (Trabaja) | 1:1 |
| 2 | Jubilado/a o pensionista | 4 (Jubilado/a) + P62 | Fusión (ver nota) |
| 3 | Parado/a o en busca de empleo | 2 (paro con exp.) + 3 (primer empleo) | Fusión (ver nota) |
| 4 | Labores del hogar (exclusivamente) | 5 (Trabajo doméstico no remunerado) | 1:1 |
| 5 | Estudiante | 6 (Estudiante) | 1:1 |
| 6 | Incapacidad o invalidez permanente | 7 (Incapacidad/invalidez permanente) | 1:1 |
| 7 | Otra situación | 8 (Otros) | 1:1 |

#### Decisiones documentadas

**GES-6 (Incapacidad/invalidez permanente) es categoría nueva** respecto al borrador
anterior. Se añade explícitamente porque P61=7 representa n=659 en la muestra EAS de
Granada (2,3 % de la muestra total) y es un colectivo de alta relevancia diagnóstica
en salud pública. Sin esta categoría, estas personas caerían en "Otra situación" con
pérdida de información.

**GES-2 fusiona jubilados (P61=4) y pensionistas (P62 EAS)**. La EAS VI distingue a
jubilados de actividad laboral (P61=4) de los pensionistas que no trabajaron (captados
en P62). El GES los agrupa en un único código. Esta fusión limita la comparabilidad
para ese subgrupo específico pero simplifica la administración.

**GES-3 fusiona parados con experiencia (P61=2) y buscadores de primer empleo (P61=3)**.
Esta fusión es habitual en encuestas de salud comunitaria. La distinción entre desempleo
con y sin experiencia laboral previa tiene relevancia para análisis de mercado de trabajo
pero no para el diagnóstico de salud prioritario del GES.

**Riesgo residual:** La fusión GES-2 impide distinguir jubilación de invalidez, dado
que ambas pueden tener P62=Sí en la EAS. El estado `pending-verification` debe
mantenerse hasta certificar la correspondencia completa.

---

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
| `nivel_educativo` | `P60_2016` (ver §5.3) | `pending-verification` | Sí |
| `situacion_laboral` | `P61` (ver §5.4) | `pending-verification` | Sí |

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
