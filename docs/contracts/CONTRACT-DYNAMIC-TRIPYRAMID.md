# CONTRACT-DYNAMIC-TRIPYRAMID

> Contrato conceptual de la Tripirámide Dinámica de calidad muestral.
> Versión 1.0 — Sprint 1 — 2026-06-27

---

## Estado

**Diseño conceptual. No implementar en Sprint 1.**

Este contrato define el modelo conceptual, los contratos de datos y la estructura futura.
La implementación se realizará cuando los microdatos del EAS, el padrón y la muestra teórica estén disponibles para los municipios objetivo.

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

## Fuentes de datos previstas

| Fuente | Variable |
|---|---|
| Microdatos EAS | n observado por municipio e instrumento |
| Padrón Municipal (INE) | Población total y por grupos de edad |
| Muestra teórica (calculada) | n teórico según parámetros estándar |
| Muestra provincial | n EAS para Granada capital y provincia |

---

## Cálculo previsto para Atarfe

Datos disponibles en fixtures existentes:

- IBSE: n observado = 811 válidos de 811 totales (muestra específica Atarfe)
- DUKE-EAS: n válido global = 3.028 (datos provinciales, no específicos de Atarfe)
- PREDIMED-EAS: n válido = 712
- SF-12 EAS: n válido PCS = 3.047
- Sueño EAS: n válido P33_R = 3.004
- CAGE-EAS: n válido CAGE_R = 2.513

Para los instrumentos con n provincial (EAS): la Tripirámide calculará la fracción esperada para Atarfe según el peso poblacional del municipio sobre la provincia.

---

## Contrato de datos futuro

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

SAM (Sistema de Auditoría Muestral) es la metodología de evaluación de calidad muestral de COMPÁS NG. No es un módulo IBSE.

La Tripirámide Dinámica es la representación visual y documental de los resultados de SAM.

SAM alimenta la Tripirámide; la Tripirámide informa al EvidenceStore a través de átomos `kind: "sample-quality"`.

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
