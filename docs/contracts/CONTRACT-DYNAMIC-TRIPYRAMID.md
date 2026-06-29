# CONTRACT-DYNAMIC-TRIPYRAMID

> Contrato de la Tripirámide Dinámica y del Sistema de Ajuste Muestral (SAM).
> Versión 2.0 — Producto 2 — 2026-06-29

---

## Estado

**Motor SAM implementado. Visualización (Tripirámide) pendiente.**

El núcleo de cálculo de SAM (motor + integración) está implementado en:
- `src/domain/sam/` — `PopulationReference`, `SampleQualityAssessment`, `CochranParams`
- `src/application/sam/computeSampleQualityAssessment.ts` — función pura certificada (Producto 2, Sesión 1)
- `src/application/sam/assessStudies.ts` — capa de integración tipada con los 6 instrumentos (Producto 2, Sesión 2)
- `fixtures/population/atarfe-population-2022.ts` — Fuente Poblacional de Referencia adulta, ≥16 años (Padrón INE 2022, N=15.472)
- `fixtures/population/atarfe-school-population-2025.ts` — Fuente Poblacional escolar 6–17 años (MTI-BDU 2025, N=2.847)
- `tests/sam.test.ts` — 33 tests unitarios (motor)
- `tests/sam-integration.test.ts` — 39 tests de integración (6 instrumentos + IBSE dual)

**Pendiente:** visualización UI (Tripirámide visual), generación de `EvidenceAtom kind="sample-quality"`,
persistencia en workspace, estratificación, ponderación, desplazamiento, comparación longitudinal.

---

## Propósito

La Tripirámide Dinámica es el instrumento metodológico para evaluar la calidad muestral de los estudios complementarios en el contexto de la planificación local de salud.

No es un dashboard. No produce animaciones. Es un documento institucional que muestra la relación entre tres magnitudes y extrae conclusiones sobre la fiabilidad del dato.

---

## Modelo conceptual

```
Población
    ↓
Muestra teórica
    ↓
Muestra observada
    ↓
Calidad de la evidencia
    ↓
Interpretación
```

### Definición de los niveles

**Población**
Número total de habitantes del municipio en el grupo de edad o segmento poblacional al que aplica el estudio.
Fuente: Padrón Municipal de Habitantes (INE, último año disponible).

**Muestra teórica**
Tamaño muestral necesario para obtener estimaciones con margen de error determinado y nivel de confianza especificado.
Fórmula estándar de muestreo para proporciones.
Parámetros habituales: confianza 95 %, error ± 5 %, proporción esperada 0,5.

**Muestra observada**
Número de registros válidos disponibles en el estudio (n válido del instrumento correspondiente).

---

## Cálculo de la calidad muestral

La calidad muestral compara la muestra observada con la teórica:

| Relación | Calidad |
|---|---|
| Observada ≥ 100 % teórica | Alta |
| Observada ≥ 60 % teórica | Media |
| Observada < 60 % teórica | Baja |

La calidad muestral **solo informa**. No modifica los resultados del estudio. No puede descartar un dato ni aumentar su confianza.

---

## Fuentes de datos

| Fuente | Variable | Estado |
|---|---|---|
| Microdatos EAS (Granada) | n observado por instrumento | Disponible en fixtures |
| Padrón Municipal INE 2022 (Atarfe, ≥16 años) | N=15.472 | Disponible (`atarfe-population-2022.ts`) |
| MTI-BDU 2025 (Atarfe, 6–17 años) | N=2.847 | Disponible (`atarfe-school-population-2025.ts`) |
| Muestra teórica | n teórico = Cochran+FPC | Calculada por el motor |
| Padrón de otros municipios | Población objetivo | Pendiente por municipio |

---

## Cálculo previsto para Atarfe

Datos disponibles en fixtures existentes:

- IBSE: n observado = 811 válidos de 909 totales (muestra específica Atarfe, REDCap 2026)
- DUKE-EAS: n válido global = 3.028 (datos provinciales, no específicos de Atarfe)
- PREDIMED-EAS: n válido = 712
- SF-12 EAS: n válido PCS = 3.047
- Sueño EAS: n válido P33_R = 3.004
- CAGE-EAS: n válido CAGE_R = 2.513

**Decisión de diseño (Producto 2):** para los instrumentos EAS con n provincial, el motor SAM utiliza el n observado provincial directamente como `nObserved` y lo compara con el tamaño muestral teórico calculado sobre la población municipal de Atarfe. No se aplica ninguna fracción de peso poblacional provincial. Esta decisión simplifica el motor y evita estimaciones indirectas. La cautela metodológica correspondiente se genera automáticamente en el `SampleQualityAssessment`. La estrategia de fracción poblacional queda como opción futura de estratificación.

---

## Contrato de datos implementado

```typescript
// IMPLEMENTADO en src/domain/sam/ y src/application/sam/

// Fuente Poblacional de Referencia
interface PopulationReference {
  municipalityId: MunicipalityId;
  municipalityCode: string;       // Código INE del municipio
  source: string;                 // "Padrón Municipal de Habitantes — INE, 1 de enero de 2022"
  year: number;
  populationTotal: number;        // Población del grupo objetivo (p. ej., ≥16 años)
  ageGroupLabel: string;          // "16 años y más"
  extractedAt: string;            // Fecha de extracción del dato
}

// Parámetros Cochran — defaults: confianza 95 %, error ±5 %, proporción 0,5
interface CochranParams {
  confidence: number;             // 0.90 | 0.95 | 0.99
  marginOfError: number;          // p. ej., 0.05
  expectedProportion: number;     // p. ej., 0.5 (máxima varianza)
}

// Dictamen metodológico de calidad muestral
interface SampleQualityAssessment {
  instrumentId: string;
  municipalityId: MunicipalityId;
  nObserved: number;
  populationReference: PopulationReference;
  cochranParams: CochranParams;
  nTheoreticalRaw: number;        // n₀ antes de corrección FPC
  nTheoretical: number;           // n con corrección de población finita (FPC)
  coverageGlobal: number;         // nObserved / nTheoretical × 100
  sampleQuality: "high" | "medium" | "low";
  sampleQualityRationale: string; // Texto del dictamen
  methodologicalCautions: string[];
  capabilities: {
    canInferGlobalCoverage: boolean;
    canClassifyQuality: boolean;
  };
  requiresHumanValidation: true;
  computedAt: string;
}

// Input de la función pura computeSampleQualityAssessment()
interface ComputeSAMInput {
  instrumentId: string;
  municipalityId: MunicipalityId;
  nObserved: number;
  populationReference: PopulationReference;
  cochranParams?: Partial<CochranParams>; // Usa defaults si se omite
}
```

---

## Contrato de datos futuro (no implementado)

```typescript
// Diseño conceptual — no implementar todavía

interface DynamicTripyramidInput {
  municipalityId: MunicipalityId;
  instrument: "ibse" | "duke-eas" | "predimed-eas" | "sf12-eas" | "sueno-eas" | "cage-eas";
  nObserved: number;
  population: {
    total: number;
    targetGroup?: number;  // subgrupo si aplica
    source: string;        // "Padrón INE 2024"
    year: number;
  };
  theoreticalSample: {
    n: number;
    confidence: 0.95;
    marginOfError: 0.05;
    expectedProportion: 0.5;
  };
}

interface DynamicTripyramidResult {
  municipalityId: MunicipalityId;
  instrument: string;
  levels: {
    population: number;
    theoreticalSample: number;
    observedSample: number;
  };
  coverage: number;                      // observado / teórico × 100
  sampleQuality: "high" | "medium" | "low";
  sampleQualityRationale: string;
  methodologicalCautions: string[];
  requiresHumanValidation: true;
}
```

---

## Representación visual institucional

La Tripirámide se representa como un documento con:

1. **Tabla de tres niveles**: Población / Muestra teórica / Muestra observada.
2. **Barra de cobertura**: porcentaje observado/teórico, sin animación.
3. **Calidad resultante**: etiqueta `alta / media / baja` con su criterio explícito.
4. **Cautelas**: lista de advertencias metodológicas.
5. **Recordatorio institucional**: "La decisión territorial corresponde siempre al equipo técnico."

**No se utilizará:**
- Animaciones piramidales.
- Dashboards con indicadores de semáforo.
- Inferencias automáticas a partir de la calidad muestral.

---

## Relación con SAM

SAM (Sistema de Ajuste Muestral) es la capacidad metodológica transversal de evaluación de calidad muestral de COMPÁS NG. No es un módulo IBSE. Es una capacidad que aplica a todos los instrumentos de medición cuantitativa.

La Tripirámide Dinámica es la representación visual y documental de los resultados de SAM.

**Arquitectura futura (no implementada):** SAM alimentará la Tripirámide; la Tripirámide informará al EvidenceStore a través de átomos `kind: "sample-quality"`. Esta integración está reservada para cuando se implemente la visualización y la generación de EvidenceAtoms desde SAM.

**Estado actual (Producto 2 implementado):** el motor SAM produce `SampleQualityAssessment` como objeto canónico. No genera EvidenceAtom. La integración con la Tripirámide visual y con el EvidenceStore es arquitectura futura.

---

## Principio de no modificación

La calidad muestral nunca modifica los resultados del estudio.
Un IBSE con muestra baja sigue produciendo sus átomos con sus valores reales.
La Tripirámide añade contexto. El equipo técnico decide el peso del dato.

---

## Referencia cruzada

- Calidad de evidencia → CONTRACT-EVIDENCE-QUALITY.md
- EvidenceAtom `kind: "sample-quality"` → CONTRACT-EVIDENCE.md
- SAM como origen → `EvidenceOrigin: "sam"` (reservado, sin implementación activa)

---

*La decisión territorial corresponde siempre al equipo técnico.*
