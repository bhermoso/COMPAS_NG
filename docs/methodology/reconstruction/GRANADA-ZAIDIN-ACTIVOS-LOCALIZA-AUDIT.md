# GRANADA-ZAIDÍN — AUDITORÍA DE ACTIVOS: MapaDeActivo_PLS_Zaidin.csv

**Versión:** 1.0 — 2026-07-07  
**Producto:** Perfil Local de Salud  
**Ámbito:** Granada-Zaidín (distrito inframunicipal)  
**Fichero auditado:** `docs/source-material/territorial-cases/granada-zaidin/MapaDeActivo_PLS_Zaidin.csv`  
**Estado:** Auditoría de compatibilidad — sin modificación del CSV fuente

---

## 1. Descripción del fichero

| Propiedad | Valor |
|-----------|-------|
| Ruta | `docs/source-material/territorial-cases/granada-zaidin/MapaDeActivo_PLS_Zaidin.csv` |
| Tamaño | 19 KB (18.619 bytes) |
| Encoding | UTF-8 sin BOM |
| BOM UTF-8 | No |
| Separador | Coma (`,`) |
| Filas de datos | 18 |
| Columnas | 16 |
| Saltos de línea incrustados | No detectados |
| Procedencia aparente | Export de **Localiza Salud** (herramienta de mapeo de activos comunitarios, Junta de Andalucía) |

---

## 2. Tabla de columnas

| # | Nombre de columna | Contenido | Dato sensible |
|---|-------------------|-----------|---------------|
| 0 | `Orden` | Número de orden del recurso | No |
| 1 | `nombre` | Nombre del activo/recurso | No |
| 2 | `municipio` | Municipio del recurso | No |
| 3 | `localidad` | Localidad | No |
| 4 | `tipo_de_v_a` | Código de tipo de vía (1, 2, 5) — campo codificado, sin leyenda en el CSV | No |
| 5 | `direcci_n` | Dirección física | Sí — dirección postal |
| 6 | `c_digo_postal` | Código postal | Sí — parcialmente identificativo |
| 7 | `titular` | Nombre del responsable o entidad titular | **Sí — nombre personal en varios registros** |
| 8 | `tel_fono` | Teléfono de contacto | **Sí — teléfonos personales y móviles** |
| 9 | `requisito_uso` | Requisito para acceder al recurso | No |
| 10 | `descripci_n` | Descripción del activo | No |
| 11 | `actividades_del_activo` | Actividades ofrecidas | No |
| 12 | `razon_seleccion` | Razón de selección del activo | No |
| 13 | `razon_modificacion` | Razón de modificación | No (vacío en todos los registros) |
| 14 | `email` | Dirección de correo electrónico | **Sí — emails personales y corporativos** |
| 15 | `web_recurso` | URL del recurso | No |

---

## 3. Inventario de registros

| Orden | Nombre del activo | Municipio | Observación |
|-------|-------------------|-----------|-------------|
| 5 | Centro Participación Activa Mayores Zaidín | Granada | ✅ Zaidín |
| 6 | Asociación de Pacientes Cardíacos de Granada y Provincia | Granada | ✅ Granada |
| 7 | Centro de Participación Activa Mayores Manuel Benítez Carrasco | Granada | ✅ Zaidín |
| 8 | *(nombre corrupto: "ç")* | Granada | ⚠️ Corrupción — CMSS Zaidín/CGM presumible |
| 9 | Cruz Roja Granada | Granada | ✅ Granada |
| 10 | Profesional experta en prevención y promoción de la salud | Granada | ✅ Granada |
| 11 | Proyecto Hombre Granada | Granada | ✅ Granada |
| 12 | Bailes de Salón | Granada | ✅ Granada |
| 13 | AGAJER | Cenes de la Vega | ⚠️ Fuera de Zaidín |
| 14 | Centro de Participación Activa Zaidín | Granada | ✅ Zaidín |
| 15 | Fundación Albihar | Granada | ✅ Granada |
| 16 | Cruz Roja Granada | Granada | ⚠️ Duplicado de nombre (programa diferente) |
| 17 | V Plan Municipal de Prevención de Adicciones | Granada | ✅ Granada |
| 18 | Unidad Salud Mental Comunitaria Zaidín | Granada | ✅ Zaidín |
| 19 | Escuela de Salud y Cuidados del Colegio de Enfermería | Granada | ✅ Granada |
| 20 | Área de Prevención del Servicio Provincial de Drogodependencias | Municipios <20.000 hab. | ⚠️ Municipio = ámbito de cobertura, no localización |
| 22 | Centro de Salud Zaidín Sur (envejecimiento) | Granada | ✅ Zaidín |
| 23 | Hospital Universitario Clínico San Cecilio | Granada | ✅ Granada |

**Total registros:** 18  
**Registros directamente útiles tras filtrado:** ~15 (excluyendo corrupción, AGAJER y decisión sobre recurso provincial)

---

## 4. Anomalías detectadas

### 4.1 Fila corrupta — Orden 8
El campo `nombre` contiene `"ç"` (carácter aislado, probablemente un artefacto de encoding). El resto de la fila tiene datos válidos: dirección `MARGARITA XIRGÚ S/N`, teléfono `958130985`, titular `DIRECCIÓN CMSS ZAIDÍN`, email `zaidin.derechossociales@granada.org`. El recurso es presumiblemente el **CGM Zaidín** o el propio CMSS Zaidín. El nombre debe recuperarse manualmente antes de incluirlo.

### 4.2 Duplicado — Cruz Roja Granada (Órdenes 9 y 16)
Dos entradas con el mismo `nombre` pero contenidos diferentes (programas o contactos distintos dentro de Cruz Roja). El pipeline `localiza-salud` usa `upsertEvidenceAtom` con `stableAssetKey(municipalityId, origin, title)` — si ambas entradas tienen el mismo título normalizado, la segunda **sobrescribe** a la primera. Se pierde un registro.  
Solución: diferenciar los títulos en el texto normalizado (p. ej. `Cruz Roja Granada — Voluntariado` / `Cruz Roja Granada — Rehabilitación`).

### 4.3 AGAJER (Orden 13) — municipio Cenes de la Vega
El recurso pertenece a un municipio fuera del distrito Zaidín. Puede incluirse si se considera recurso de referencia comarcal (e.g., servicio de atención a personas con discapacidad intelectual de cobertura supramunicipal), pero debe justificarse explícitamente.

### 4.4 Fila 20 — campo `municipio` contiene ámbito de cobertura
El campo `municipio` de "Área de Prevención del Servicio Provincial" es `"MUNICIPIOS MENORES DE 20.000 HABITANTES"`, que es el ámbito de prestación del servicio, no el municipio del recurso. La localidad es Granada. No hay problema de contenido, pero el nombre largo podría truncarse en la UI.

### 4.5 Numeración no consecutiva
Los órdenes van 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, **22**, 23 — el Orden 21 está ausente. No es un error en el export (puede haber sido excluido intencionalmente).

---

## 5. Datos personales y sensibles

El CSV contiene **datos personales de personas físicas**, incluyendo:

- **Nombres personales** en `titular`: "Víctor Francisco Aranda León", "Ana Belén Soto", "Larissa de A. Nobre Sandoval", "Manuel Mingorance Carmona", "Isabel Moreno Ponce", "Desiree Garzón Alamino y Laura Navarro Bullejos", "Carmen Caballero Rivas".
- **Teléfonos móviles personales**: 633233472 (profesional salud), 629555782 (Bailes de Salón), 607418278 (AGAJER), 636279591 (Cruz Roja), 639106244 (Diputación).
- **Correos electrónicos personales**: nobre.lan@gmail.com, dosbailes@gmail.com.
- **Direcciones postales** de los recursos.

**Implicación:** Estos datos **no deben entrar en el EvidenceStore** ni en `localStorage` verbatim. El texto normalizado para la UI debe contener únicamente nombre del activo y descripción funcional, sin datos de contacto personal.

---

## 6. Compatibilidad con el pipeline Localiza Salud

### 6.1 Ruta visible en la UI

`localiza-salud` aparece como categoría visible en el selector de tipo de documento (`App.tsx:163`):
```
{ value: "localiza-salud", label: "Localiza Salud" }
```
`community-asset` **no está en el selector visible** — existe como tipo legado interno. Esta es la ruta correcta.

### 6.2 Comportamiento del pipeline para `localiza-salud`

El pipeline (`DocumentToEvidencePipeline.ts`) procesa el texto pegado en la UI de la siguiente manera:

1. Divide el texto por saltos de línea (`\r?\n`).
2. Por cada línea no vacía crea un `EvidenceAtom` de tipo `"asset"`.
3. Extrae el título mediante `extractLocalizaSaludTitle`:
   - Si la línea contiene `|`: usa el primer campo como título.
   - Si la línea contiene `\t`: usa el primer campo como título.
   - Si no hay separador reconocible: título genérico `"Activo detectado N"`.
4. Usa `upsertEvidenceAtom` con `stableAssetKey(municipalityId, "localiza-salud", title)` — los átomos son **idempotentes por título**: recargar el mismo texto no duplica.

### 6.3 ¿Es el CSV directamente pegable?

**No. Requiere normalización previa.** Razones:

| Problema | Impacto |
|----------|---------|
| Separador coma — `extractLocalizaSaludTitle` solo maneja `\|` y `\t` | Todos los átomos recibirían título `"Activo detectado N"` en lugar del nombre del activo |
| Línea de cabecera (`Orden,nombre,municipio,...`) | Crearía un átomo con título "Activo detectado 1" y contenido = la cabecera |
| Datos personales en columnas `titular`, `tel_fono`, `email` | Entrarían en el EvidenceStore y en `localStorage` — riesgo RGPD |
| Fila corrupta Orden 8 (`ç`) | Átomo con nombre sin sentido |
| Duplicado Cruz Roja (misma clave) | El segundo sobrescribe al primero silenciosamente |

---

## 7. Dictamen de compatibilidad

> **Requiere normalización previa antes de cargar.**

El CSV es un export de Localiza Salud con estructura válida y contenido relevante para el ámbito Zaidín, pero no es directamente pegable en la UI por los cinco problemas listados. La vía técnica es correcta (`localiza-salud` en el selector visible). Solo el contenido debe prepararse.

---

## 8. Formato recomendado de normalización

Texto plano con **separador pipe** (`|`), una línea por activo, **sin datos de contacto personal**.

Estructura de cada línea:
```
Nombre del activo | Descripción funcional concisa
```

El pipeline extrae el primer campo (`Nombre del activo`) como título del átomo y almacena la línea completa como contenido. La descripción funcional concisa permite recuperar el activo en el Perfil Local sin necesidad de conservar dirección, teléfono ni titular personal.

### Texto normalizado propuesto (15 entradas válidas)

```
Centro Participación Activa Mayores Zaidín | Talleres deportivos y socioculturales para mayores de 60 años. CPA Zaidín.
Asociación de Pacientes Cardíacos de Granada y Provincia | Atención integral al paciente cardíaco. Rehabilitación fase III. Apoyo psicológico y social.
Centro Participación Activa Mayores Manuel Benítez Carrasco | Talleres deportivos y socioculturales. CMSS Zaidín.
CMSS Zaidín — Centro de Gestión Municipal | Espacios para actividades comunitarias y asociaciones. Programas ERACIS. CMSS Zaidín.
Cruz Roja Granada — Atención social y voluntariado | Proyectos de atención social, emergencias y voluntariado. Cuesta Escoriaza.
Profesional experta en prevención y promoción de la salud | Servicios de prevención y promoción en el ámbito comunitario.
Proyecto Hombre Granada | Tratamiento y prevención de adicciones.
Bailes de Salón | Taller de baile comunitario. Asociación Cultural Acuario. Margarita Xirgú.
Centro de Participación Activa Zaidín | Consejería de Inclusión Social. Actividades para mayores. Valencia nº 4.
Fundación Albihar | Salud mental comunitaria. Atención y rehabilitación psicosocial.
Cruz Roja Granada — Programa específico Zaidín | Programa de intervención específica en el distrito.
V Plan Municipal de Prevención de Adicciones | Plan municipal del Ayuntamiento de Granada para la prevención de drogodependencias.
Unidad Salud Mental Comunitaria Zaidín | SAS — Distrito AP Granada-Metropolitano. América, 14.
Escuela de Salud y Cuidados del Colegio de Enfermería de Granada | Actividades formativas en salud y cuidados. COEGRA.
Centro de Salud Zaidín Sur | SAS — Distrito AP Granada-Metropolitano. Envejecimiento activo. Poeta Gracián, 7.
```

> **Nota sobre exclusiones:**
> - **Hospital Universitario Clínico San Cecilio** (Orden 23): recurso hospitalario terciario, no comunitario en sentido estricto. Decisión de inclusión a criterio del equipo.
> - **AGAJER** (Orden 13, Cenes de la Vega): fuera del distrito. Incluir solo si se considera referencia comarcal.
> - **Área de Prevención del SPD Diputación** (Orden 20): recurso provincial. Puede incluirse como contexto.
> - **Fila corrupta Orden 8**: el nombre `"CMSS Zaidín — Centro de Gestión Municipal"` es una reconstrucción a partir de los demás campos. Verificar antes de usar.

---

## 9. Riesgos operativos

| Riesgo | Gravedad | Mitigación |
|--------|----------|------------|
| Datos personales en EvidenceStore | Alta — RGPD | Normalizar excluyendo columnas `titular`, `tel_fono`, `email`, `direcci_n` |
| Título genérico por separador incorrecto | Media | Usar `\|` como separador en el texto normalizado |
| Duplicado Cruz Roja sobrescrito silenciosamente | Baja | Diferenciar título de las dos entradas |
| Fila corrupta (Orden 8) generando átomo sin nombre | Baja | Reconstruir nombre manualmente |
| Registro fuera de ámbito (AGAJER) | Baja | Excluir o documentar explícitamente si se incluye |
| Cabecera CSV como primer átomo | Alta si pegado crudo | No se produce si se usa el texto normalizado propuesto |

---

## 10. Próximos pasos para reconstrucción manual en la UI

1. **Verificar el texto normalizado propuesto** (sección 8) — confirmar que los nombres reconstruidos son correctos, en especial la fila Orden 8 (CMSS Zaidín CGM).
2. **Decidir qué registros incluir** (Hospital, AGAJER, Área de Prevención provincial).
3. **En la UI:** seleccionar Granada-Zaidín → Repositorio → Añadir documento → tipo `Localiza Salud`.
4. **Pegar el texto normalizado** en el área de texto. El pipeline crea un átomo por línea con `upsertEvidenceAtom` (idempotente).
5. **Verificar en el panel de Activos para la Salud** que aparecen los activos con nombres correctos (no "Activo detectado N").
6. **No cargar el CSV original** sin normalización previa.

---

## 11. No implementado en esta auditoría

- No se ha modificado el CSV fuente.
- No se ha implementado parser nuevo.
- No se ha reabierto `community-asset` como selector visible.
- No se ha cargado nada en la aplicación.
- No se ha tocado `localStorage`.
- No se ha añadido ningún test (auditoría documental sin función auxiliar nueva).
