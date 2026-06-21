# COMPÁS NG — Hoja de ruta

> Estado tras la estabilización de Zagra (2026-06-21, commit `7bd223b`).
> Cada hito se activa solo cuando el anterior está estabilizado y verificado en interfaz.

---

## Estado actual

La incidencia de fragmentación de Activos Comunitarios ha sido cerrada.

El sistema dispone de:

- Repositorio Documental Municipal funcional con sustitución canónica.
- Parser de Activos Comunitarios que genera un átomo por activo (no por línea).
- Purga de átomos derivados al sustituir un documento canónico.
- Purga de átomos huérfanos al hidratar desde localStorage.
- Informe de Salud cargable como DOCX, preservado como documento íntegro.
- IBSE como primer Estudio Complementario (parser CSV REDCap).
- Priorización Temática con importación REDCap y explotación estadística.
- Persistencia por municipio en localStorage con saneamiento de duplicados.
- Municipio piloto: Zagra. Verificado end-to-end.

---

## Hito 1 — Consolidación del Repositorio Documental Municipal

**Objetivo:** Que el Repositorio sea la fuente de verdad completa y auditable del municipio.

Tareas pendientes de definir en sesión específica:

- Revisión del modelo `MunicipalDocument`: ¿qué metadatos faltan?
- Visualización del repositorio: ¿cómo se navega por los documentos registrados?
- Eliminación manual de documentos individuales desde la interfaz.
- Exportación del repositorio como inventario legible.

**Restricción:** No añadir motores analíticos hasta que este hito esté cerrado.

---

## Hito 2 — Soporte para Perfil/Informe de Salud en PDF

**Objetivo:** Permitir cargar el Informe de Salud Municipal en formato PDF, preservando
el documento íntegro como fuente de verdad, sin transformación destructiva.

Consideraciones técnicas conocidas:

- El formato PDF requiere un parser diferente al DOCX (mammoth no aplica).
- La preservación íntegra implica almacenar el binario o una representación fiel,
  no solo texto extraído.
- El texto extraído del PDF puede usarse como entrada al pipeline de evidencias,
  pero el PDF original es el documento de referencia.
- La cuota de localStorage (~5 MB) impone restricciones sobre qué se persiste localmente.

**Principio rector:** El PDF original es la fuente de verdad. El texto extraído es una
representación derivada regenerable.

---

## Hito 3 — Explotación no destructiva de Perfiles de Salud y Activos Comunitarios

**Objetivo:** Diseñar cómo los documentos del repositorio alimentan futuros motores
analíticos sin modificar ni consumir el documento original.

Principios:

- Los documentos son **leídos, nunca modificados** por los motores.
- Los motores operan sobre representaciones derivadas (`EvidenceAtom`, `MunicipalSnapshot`).
- Toda representación derivada incluye trazabilidad al documento fuente.
- La regeneración de derivados no requiere acción del usuario si el documento fuente
  está disponible.

Tareas pendientes:

- Definir la interfaz canónica que los motores consumen (`MunicipalSnapshot` actual o
  una abstracción superior).
- Establecer qué información del Perfil de Salud alimenta qué tipo de análisis.
- Establecer qué activos comunitarios alimentan qué dimensiones del diagnóstico.

---

## Hito 4 — Consolidación de Estudios Complementarios

**Objetivo:** Incorporar SF-12, DUKE, PREDIMED y otros estudios al mismo modelo
arquitectónico que IBSE, con parsers específicos y paneles de visualización propios.

Estudios pendientes:

| Estudio | Fuente | Parser | Estado |
|---|---|---|---|
| IBSE | REDCap CSV | `IBSECSVParser` | Completado |
| SF-12 | REDCap CSV | Pendiente | — |
| DUKE | REDCap CSV | Pendiente | — |
| PREDIMED | REDCap CSV | Pendiente | — |

Patrón arquitectónico a seguir (basado en IBSE):

```
application/[estudio]/[Estudio]CSVParser.ts   → parser
domain/[estudio]/[Estudio]Study.ts            → entidad de dominio
domain/[estudio]/[Estudio]Aggregates.ts       → agregados calculados
ui/components/[Estudio]Panel.tsx              → visualización
```

**Restricción:** Cada estudio se incorpora de forma independiente. Ningún estudio activa
automáticamente recomendaciones ni modifica el Plan de Acción.

---

## Hito 5 — Integración controlada de Priorización Temática REDCap

**Objetivo:** Conectar los datos de priorización ciudadana (ya importables desde REDCap)
con el resto del sistema de forma controlada y desacoplada.

Estado actual:

- La importación CSV REDCap de priorización funciona.
- La priorización está desacoplada de los motores analíticos.
- No hay conexión automática entre priorización y Plan de Acción.

Pendiente de decisión:

- ¿Qué visibilidad tiene la priorización en el análisis territorial?
- ¿Cómo se pondera junto a los datos epidemiológicos?
- ¿En qué momento del flujo se integra formalmente en el Plan Local?

**Principio rector:** La priorización es una capa deliberativa intermedia. No sustituye
al diagnóstico técnico ni genera automáticamente objetivos de Plan.

---

## Hito 6 — Interfaces para motores inteligentes

**Objetivo:** Preparar los contratos de acceso que futuros motores analíticos o de IA
usarán para consultar el estado del municipio, sin acceso directo al documento original.

Principios:

- Los motores **leen** representaciones derivadas, nunca el documento fuente.
- Los motores **proponen**, nunca deciden ni modifican el repositorio.
- Toda propuesta de un motor queda pendiente de validación técnica explícita.
- El documento original permanece íntegro e inmodificable independientemente de lo que
  los motores produzcan.

Tareas pendientes:

- Definir la interfaz de consulta canónica para motores (`MunicipalSnapshot` o superior).
- Establecer el modelo de propuesta-validación para outputs de motores.
- Decidir qué motores se incorporan primero y en qué orden.

---

## Lo que no está en esta hoja de ruta

Las siguientes capacidades están **explícitamente fuera del alcance** hasta nueva decisión:

- Generación automática de líneas EPVSA.
- Generación automática de objetivos del Plan de Acción.
- Interpretación automática del Perfil de Salud.
- Conexión con Variables EAS o CMI sin intervención técnica.
- Despliegue en producción con datos reales sin revisión de seguridad.

---

*Última revisión: 2026-06-21 — Tras cierre de incidencia de Activos Comunitarios*
