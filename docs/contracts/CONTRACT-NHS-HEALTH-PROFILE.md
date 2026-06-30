# CONTRACT-NHS-HEALTH-PROFILE

> Contrato canónico del Producto 4 — Perfil de Salud Local tipo NHS (PSL-NHS).
> Versión 0.1 — Conceptual — 2026-06-30
> Estado: CONCEPTUAL

---

## 1. Naturaleza del Producto 4

El **Perfil de Salud Local tipo NHS (PSL-NHS)** es un artefacto institucional de diagnóstico comparativo sintético. Su modelo de referencia editorial son los NHS Local Health Profiles (OHID, England), adaptados al contexto metodológico, de datos y de audiencia de COMPÁS NG.

El PSL-NHS **no es el PSL-C (Producto 3)**.

| Dimensión | PSL-C (Producto 3) | PSL-NHS (Producto 4) |
|---|---|---|
| Naturaleza | Narrativo, técnico, interpretativo | Sintético, visual, comparativo |
| Extensión | Largo (7 capítulos estructurados) | Corto (2–4 páginas / formato editorial) |
| Texto analítico | Sí (MIT + autoría humana) | No |
| Comparadores | No (diagnóstico absoluto) | Sí (Granada/Andalucía como referencia) |
| Audiencia primaria | Equipo técnico, Distrito Sanitario, Junta | Corporación municipal, ciudadanía, prensa |
| Conclusiones | Sí (Capítulo V, autoría humana) | No |
| Recomendaciones | No (D3-05 resuelto: PSL no contiene recomendaciones) | No |
| Áreas de intervención | Sí (candidaturas técnicas, Cap. VII) | No |

**Invariante P4-I1:** el PSL-NHS no sustituye al PSL-C. Son productos complementarios que sirven finalidades distintas con las mismas fuentes de evidencia.

**Invariante P4-I2:** el PSL-NHS no es una versión corta del PSL-C. Es otro tipo de producto, con otra lógica de presentación, para otra audiencia.

**Invariante P4-I3:** el PSL-NHS concluye mediante la comparación estadística. No emite conclusiones narrativas. No hace recomendaciones. No prioriza.

---

## 2. Relación con el Producto 3

El PSL-NHS comparte la misma fuente de datos con el PSL-C: el `LocalHealthProfile` en estado `validated` (o superior).

```
LocalHealthProfile (validated)
    │
    ├──► LocalHealthProfileCompiler → LocalHealthProfileArtifact (PSL-C, Producto 3)
    │
    └──► NHSHealthProfileCompiler  → NHSHealthProfileArtifact (PSL-NHS, Producto 4)
```

**Regla P4-R1:** el PSL-NHS no puede generarse a partir de un PSL sin validar. El mismo gate de entrada que el PSL-C: `psl.status === "validated"`.

**Regla P4-R2:** el PSL-NHS no consume los capítulos V, VI ni VII del PSL-C (conclusiones, recomendaciones, priorización). Su contenido procede exclusivamente del Capítulo III (diagnóstico integrado) y del Capítulo IV (lectura territorial cuantitativa del MIT).

**Regla P4-R3:** el PSL-NHS no puede generarse si no hay al menos un estudio complementario con resultados disponibles, dado que su contenido esencial son los indicadores comparativos de los estudios.

---

## 3. Fuentes

El PSL-NHS utiliza únicamente:

### 3.1 Fuentes directas (del LocalHealthProfile validado)

| Fuente | Contribución | Obligatoria |
|---|---|---|
| Estudios Complementarios (1–6 instrumentos) | Indicadores cuantitativos comparables | Mínimo 1 |
| EvidenceStore — estadísticas de diagnóstico | Resumen de base documental | Sí |
| MIT — dimensión cuantitativa | Indicadores y marcadores territoriales | Sí |
| Estructura poblacional (si disponible) | Marco demográfico básico | No |

### 3.2 Fuentes adicionales necesarias para valor comparativo

| Fuente | Estado actual | Impacto si ausente |
|---|---|---|
| Datos de referencia Granada (por instrumento) | ❌ No disponibles | El PSL-NHS puede generarse con referencia `null`; pierde valor comparativo |
| Datos de referencia Andalucía (por instrumento) | ❌ No disponibles | Ídem |

**El PSL-NHS requiere al menos un comparador disponible para justificar su generación.** Sin comparadores, el documento resultante confunde las audiencias: parece un NHS Profile pero funciona como resumen del PSL-C. Se recomienda no generar el PSL-NHS hasta tener datos de referencia para al menos 3 instrumentos (principio DM-2, `BENCHMARK-INSTITUTIONAL-PRODUCTS.md §VIII.4`).

### 3.3 Fuentes explícitamente excluidas

El PSL-NHS **no consume**:
- Capítulo V (Conclusiones) del PSL
- Capítulo VI (Recomendaciones) del PSL
- Capítulo VII (Priorización) del PSL
- ActionPlanDraft, AgendaDraft, MonitoringDraft
- StrategicRepository
- Cualquier output del Motor de Traducción Estratégica

---

## 4. Salida esperada

El `NHSHealthProfileArtifact` es un documento institucional exportable, inmutable y comparable. Sus elementos obligatorios:

| Elemento | Descripción |
|---|---|
| Portada | Municipio, provincia, fecha de generación |
| Marco demográfico | Población total, estructura etaria básica (si disponible) |
| Panel de indicadores | Un panel por estudio complementario disponible |
| Gráfico de comparación | Para cada indicador: valor municipal + referencia Granada/Andalucía + significación estadística (cuando comparable) |
| Base documental | Número de estudios cargados, fecha del PSL de origen |
| Cautelas de comparación | Indicación explícita de qué comparadores faltan y qué limita la lectura comparativa |
| Trazabilidad | `sourcePSLId`, `sourcePSLVersion`, `compiledAt` |

**Lo que el PSL-NHS NO contiene:**
- Texto narrativo de análisis territorial
- Conclusiones diagnósticas del equipo técnico
- Recomendaciones de ningún tipo
- Áreas de intervención candidatas
- Prioridades seleccionadas
- Compromisos institucionales

---

## 5. Compilador

El compilador del PSL-NHS es el `NHSHealthProfileCompiler`.

**Estado:** No implementado. El contrato del compilador es `CONTRACT-NHS-HEALTH-PROFILE-COMPILER` (pendiente de crear).

**Gates mínimos previstos:**

| Gate | Condición | Razón |
|---|---|---|
| G-NHS-1 | `psl.status === "validated"` | Solo PSL técnicamente validados |
| G-NHS-2 | `psl.complementaryStudyCount >= 1` | Sin estudios no hay indicadores |
| G-NHS-3 | Al menos 1 dato de referencia disponible (recomendado, no bloqueante) | Sin comparadores el valor es reducido |

El compilador **no puede**:
- Generar texto interpretativo
- Emitir conclusiones
- Acceder al Nivel 3
- Modificar el PSL de origen

---

## 6. Exclusiones explícitas

| Elemento excluido | Motivo |
|---|---|
| Recomendaciones | El PSL-NHS no recomienda. Ninguna sección del PSL-NHS puede contener recomendaciones. |
| Plan de Acción | Pertenece al Producto 6. El PSL-NHS no tiene continuación estratégica interna. |
| Motor de Traducción Estratégica (MTE) | Pertenece al Producto 5. El PSL-NHS no activa ningún motor de planificación. |
| IA generativa de texto | El PSL-NHS no contiene texto narrativo generado por el sistema ni por IA. |
| Sustitución del PSL-C | El PSL-NHS no reemplaza, no resume ni reproduce el contenido analítico del Producto 3. |
| Priorización de problemas | Pertenece al Capítulo VII del PSL-C (Producto 3) y a los motores del Nivel 3. |
| Dashboard interactivo | El PSL-NHS es un documento exportable, no una aplicación de consulta permanente. |
| Actualización automática | El PSL-NHS se genera bajo demanda desde el PSL validado, no se actualiza automáticamente. |

---

## 7. Relación con otros productos

| Producto | Relación |
|---|---|
| **Producto 1** — Estudios Complementarios | Fuente principal del contenido del PSL-NHS |
| **Producto 2** — SAM NG | Las cautelas de calidad muestral del SAM pueden indicarse en las cautelas del PSL-NHS |
| **Producto 3** — PSL-C | Comparte fuente (LocalHealthProfile); no se sustituyen |
| **Producto 5** — MTE | No relacionado directamente; el PSL-NHS no alimenta el MTE |
| **Producto 6** — Plan de Acción | No relacionado directamente; el PSL-NHS no alimenta el Plan de Acción |

---

## 8. Prerrequisito que bloquea la implementación

La implementación plena del PSL-NHS está condicionada a la disponibilidad de datos de referencia (Granada/Andalucía) para al menos 3 de los 6 instrumentos. Sin datos de referencia, el producto puede implementarse técnicamente pero no cumple su función diferencial.

**Deuda preexistente:** D3-04 en `CONTRACT-PSL-COMPAS.md`.

---

## 9. Decisiones pendientes

| Decisión | Descripción |
|---|---|
| Nomenclatura canónica | ¿"PSL-NHS", "NHS Health Profile", "Perfil tipo NHS"? Este contrato usa "PSL-NHS" como código y "Perfil de Salud Local tipo NHS" como nombre completo. |
| Formato de exportación | PDF, HTML, DOCX o combinación. Decisión de Sprint de implementación. |
| Estructura interna del artefacto | Número y denominación exacta de paneles. Pendiente del contrato del compilador. |
| Relación con la UI | ¿Mismo módulo que el PSL-C o módulo separado? Decisión de Sprint de implementación. |
| Umbral mínimo de comparadores | DM-2 recomienda 3 de 6 instrumentos. Decisión formal pendiente. |

---

## 10. Invariantes

**P4-I1:** El PSL-NHS no sustituye al PSL-C.
**P4-I2:** El PSL-NHS no es una versión corta del PSL-C.
**P4-I3:** El PSL-NHS no concluye, no recomienda, no prioriza.
**P4-I4:** El PSL-NHS es inmutable una vez compilado.
**P4-I5:** El PSL-NHS comparte gate de entrada con el PSL-C: `psl.status === "validated"`.
**P4-I6:** El PSL-NHS no puede generarse sin al menos 1 estudio complementario con resultados.

---

## 11. Referencia cruzada

| Documento | Rol |
|---|---|
| `CONTRACT-PSL-COMPAS.md` | Define el Producto 3 como fuente; D3-04 como deuda relevante (D3-05 resuelto) |
| `CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER.md` | Compilador del Producto 3; comparte arquitectura de puerta y trazabilidad |
| `CONTRACT-COMPLEMENTARY-STUDIES.md` | Define los 6 instrumentos cuyo output es el contenido primario del PSL-NHS |
| `CONTRACT-DYNAMIC-TRIPYRAMID.md` | SAM como fuente de cautelas de calidad muestral para el PSL-NHS |
| `docs/architecture/INSTITUTIONAL-PRODUCTS-ARCHITECTURE.md §4` | Especificación detallada del PSL-NHS (análisis NHS, transferibilidad, limitaciones) |
| `docs/research/BENCHMARK-INSTITUTIONAL-PRODUCTS.md §VII–VIII` | Benchmarking NHS Profiles; principios P9–P12; decisiones de diseño DM-1, DM-2 |

---

*El PSL-NHS es un documento de comparación, no de deliberación. La decisión territorial corresponde siempre al equipo técnico.*
