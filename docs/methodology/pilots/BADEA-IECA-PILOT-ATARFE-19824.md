# BADEA/IECA — Piloto controlado: Consulta 19824, Atarfe

> Documento de evaluación del piloto BADEA/IECA.
> Fecha de ejecución: 2026-07-07
> Estado: Completado — API verificada, datos confirmados, texto de ingesta generado.
> Contexto: Hueco arquitectónico H-16 (ARCHITECTURAL-GAP-REGISTER.md).

---

## 1. Consulta utilizada

| Campo | Valor |
|-------|-------|
| Identificador BADEA | 19824 |
| Título | Porcentaje de población según tipología de celda y grado de urbanización por municipio |
| Actividad estadística | Clasificación del grado de urbanización |
| Fuente | IECA (Instituto de Estadística y Cartografía de Andalucía) |
| Periodicidad | Anual |
| URL API | `https://www.juntadeandalucia.es/institutodeestadisticaycartografia/intranet/admin/rest/v1.0/consulta/19824` |
| Parámetros usados | `?nPrimerResultado=0&nResultados=800&lang=es` |
| Fecha de acceso | 2026-07-07 |
| Estado API | **Disponible y respondiendo** |

---

## 2. Verificación de la consulta

| Criterio | Resultado |
|----------|-----------|
| API responde | ✓ HTTP 200, JSON válido |
| Datos municipales disponibles | ✓ Todos los municipios de Andalucía, año 2024 |
| Filtrado por municipio | Posible por búsqueda en el array `data` (campo `cod[0]`) |
| Atarfe (INE 18022) presente | ✓ Confirmado |
| Datos a escala municipal | ✓ (no provincial) |
| Metainformación de trazabilidad | ✓ ID de consulta, actividad, fuente IECA, año |

### Estructura de la respuesta API

```json
{
  "metainfo": {
    "id": 19824,
    "title": "Porcentaje de población según tipología de celda...",
    "activity": "Clasificación del grado de urbanización",
    "source": "",
    "periodicity": "Anual"
  },
  "data": [
    [
      {"cod": ["18022"], "des": "Atarfe"},
      {"cod": ["2024"],  "des": "2024"},
      {"cod": ["IECA"],  "des": "IECA"},
      {"val": "",              "format": "Zona de densidad intermedia"},
      {"val": "0.0",           "format": "0,0%"},
      {"val": "94.31951509999999", "format": "94,3%"},
      {"val": "5.6804849",     "format": "5,7%"}
    ],
    ...
  ]
}
```

**Esquema de columnas (posiciones en cada fila):**

| Índice | Campo | Tipo |
|--------|-------|------|
| 0 | Municipio (cod + des) | Dimensión |
| 1 | Año | Dimensión |
| 2 | Fuente | Dimensión |
| 3 | Grado de urbanización | Categoría (literal) |
| 4 | % población en centros urbanos | Medida numérica |
| 5 | % población en agrupaciones urbanas | Medida numérica |
| 6 | % población en celdas de malla rurales | Medida numérica |

---

## 3. Municipio piloto: Atarfe (INE 18022)

### Datos obtenidos

| Indicador | Valor bruto | Valor formateado |
|-----------|-------------|-----------------|
| Grado de urbanización | — | **Zona de densidad intermedia** |
| % en centros urbanos | 0.0 | 0,0 % |
| % en agrupaciones urbanas | 94.31951509999999 | **94,3 %** |
| % en celdas de malla rurales | 5.6804849 | 5,7 % |

### Corrección metodológica respecto al briefing

El briefing previo indicaba "94,3 % de población en centros urbanos". El dato real muestra:

- `% centros urbanos = 0,0 %`
- `% agrupaciones urbanas = 94,3 %`

Son categorías distintas en la clasificación del grado de urbanización:
- **Centros urbanos**: núcleos densos (zonas urbanas de alta densidad).
- **Agrupaciones urbanas**: núcleos intermedios. Atarfe pertenece a esta categoría.
- Atarfe es "Zona de densidad intermedia", no "Zona urbana". Este matiz es relevante para el diagnóstico territorial del Perfil Local de Salud.

---

## 4. Texto de ingesta normalizado

Listo para pegar en COMPÁS NG como documento `cmi-indicator` titulado
`"BADEA consulta 19824 — Urbanización — Atarfe 2024"`.

```
Atarfe (INE 18022) · Grado de urbanización según tipología de celda, 2024: Zona de densidad intermedia. Fuente: IECA, BADEA, consulta 19824, Clasificación del grado de urbanización. Año 2024.
Atarfe (INE 18022) · Porcentaje de población en centros urbanos, 2024: 0,0%. Fuente: IECA, BADEA, consulta 19824, Clasificación del grado de urbanización. Año 2024.
Atarfe (INE 18022) · Porcentaje de población en agrupaciones urbanas, 2024: 94,3% (valor exacto: 94.32 %). Fuente: IECA, BADEA, consulta 19824, Clasificación del grado de urbanización. Año 2024.
Atarfe (INE 18022) · Porcentaje de población en celdas de malla rurales, 2024: 5,7% (valor exacto: 5.68 %). Fuente: IECA, BADEA, consulta 19824, Clasificación del grado de urbanización. Año 2024.
```

---

## 5. Prueba de encaje con `cmi-indicator`

### Pipeline prevista

- `DocumentKind: "cmi-indicator"` → `EvidenceOrigin: "cmi"` → `EvidenceAtomKind: "indicator"` (prior del pipeline genérico)
- `canGenerateEvidence`: `true` para `cmi-indicator` (no es tipo canónico con restricción)
- `requiresHumanValidation: true` en todos los átomos generados
- `provenance.documentId` fijado al documento del repositorio
- El IntegrityGuard acepta `origin: "cmi"` (registrado en `ALL_VALID_ORIGINS`)

### Clasificación heurística esperada

Cada línea contiene "porcentaje" y valores numéricos. La heurística textual del pipeline detecta:
- "porcentaje" → no está en los stems de `indicator` por sí solo.
- El fallback por tipo documental (`cmi-indicator`) fuerza `kind: "indicator"` cuando no hay señal textual suficiente.

Para "Zona de densidad intermedia" (línea categórica sin porcentaje): la heurística textual no detecta patrón, el prior `cmi-indicator` → `"indicator"` actúa. **Observación**: esta línea no es un indicador cuantitativo; es una categoría territorial. El `kind: "indicator"` es aceptable para el piloto pero podría ser `"territorial-context"` en una versión refinada.

### Resultado esperado del IntegrityGuard

El IntegrityGuard tiene `KIND_CONSTRAINTS["cmi"]` que acepta múltiples kinds para origen `"cmi"`. Ver `EvidenceStoreIntegrityGuard.ts`. No se esperan rechazos.

---

## 6. Cautelas metodológicas

1. **Granularidad municipal no universal**: la consulta 19824 cubre todos los municipios de Andalucía para 2024. Sin embargo, no todas las consultas BADEA tienen este nivel de detalle. Cada consulta debe verificarse individualmente antes de asumir disponibilidad municipal.

2. **Riesgo de duplicación por reimportación**: si se ingresa la misma consulta para el mismo municipio y año en momentos distintos, el pipeline genérico usa `addEvidenceAtom` (sin deduplicación). Se acumularían átomos duplicados. Para producción se necesita deduplicación idempotente por clave `(consultaId, municipioINE, año, indicador)`.

3. **Clasificación categórica vs cuantitativa**: la línea de grado de urbanización ("Zona de densidad intermedia") no es un indicador cuantitativo. El `kind: "indicator"` es funcional para el piloto pero semánticamente impreciso. En un parser específico se usaría `kind: "territorial-context"`.

4. **Frontera con SAM / PopulationReference**: los datos de grado de urbanización describen el contexto poblacional del municipio, no indicadores de salud directos. No deben confundirse con indicadores clínicos del Informe de Salud. Son datos de contexto territorial que enriquecen el diagnóstico del Perfil pero no lo reemplazan.

5. **Contaminación del MIT con indicadores no sanitarios**: el MIT procesará estos átomos como `kind: "indicator"` junto con indicadores epidemiológicos. Esto es aceptable si los indicadores BADEA están claramente etiquetados (fuente, consulta) y el equipo técnico valida su interpretación antes del PSL.

---

## 7. Decisión técnica provisional

### Conclusión del piloto

La vía `cmi-indicator` es **suficiente para este piloto** y para una primera integración de indicadores territoriales BADEA en COMPÁS NG, con las siguientes condiciones:

- El texto normalizado incluye siempre fuente, consulta BADEA, municipio e INE.
- El equipo técnico revisa e interpreta los átomos antes de que alimenten el PSL.
- No se realizan importaciones masivas ni automatizadas hasta tener parser específico.

### Recomendación para el siguiente paso

**Corto plazo**: usar `cmi-indicator` con ingesta manual de texto normalizado para consultas BADEA verificadas. El guion `scripts/badea/normalize-badea-pilot.mjs` puede usarse para generar el texto desde cualquier respuesta API. La ingesta se hace manualmente desde el panel de documentación, fuera del selector visible.

**Medio plazo**: cuando el volumen de consultas BADEA justifique automatización, crear:
- `DocumentKind: "badea-export"` (específico para BADEA, no confundir con CMI)
- `EvidenceOrigin: "ieca"` (para trazabilidad clara)
- Parser específico con deduplicación idempotente
- Catálogo de consultas BADEA verificadas municipalmente

**No hacer ahora**:
- No crear `DocumentKind` ni `EvidenceOrigin` nuevos en este sprint.
- No exponer `cmi-indicator` en el selector visible.
- No automatizar la ingesta desde la API.

---

## 8. Artefactos de este piloto

| Artefacto | Ruta | Descripción |
|-----------|------|-------------|
| Guion de normalización | `scripts/badea/normalize-badea-pilot.mjs` | Parser funciones puras + normalización de líneas |
| Documento de piloto | `docs/methodology/pilots/BADEA-IECA-PILOT-ATARFE-19824.md` | Este documento |
| Tests del piloto | `tests/badea-pilot.test.ts` | Cobertura del guion y del pipeline CMI |
