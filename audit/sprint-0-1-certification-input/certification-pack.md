# COMPÁS NG — Paquete textual de certificación Sprint 0/1


================================================================
FILE: audit/sprint-0-1-certification-input/ROADMAP.md
================================================================
# COMPÁS NG — Hoja de ruta

> Última revisión: 2026-06-27.
> Cada hito se activa solo cuando el anterior está estabilizado y verificado en interfaz.

---

## Estado actual (2026-06-27 — Sprint 0 cierre)

**Sprint 0 — en cierre.** La infraestructura del conocimiento está completada.
Los cambios pendientes son de consolidación arquitectónica, contractual y de interfaz.
Véase `docs/architecture/OPERATING-CONSTITUTION.md §4–5` para criterios del Gate 1.

El sistema dispone de:

- Repositorio Documental Municipal funcional con sustitución canónica.
- Parser de Activos Comunitarios que genera un átomo por activo (no por línea).
- Purga de átomos derivados al sustituir un documento canónico.
- Purga de átomos huérfanos al hidratar desde localStorage.
- Informe de Salud cargable como DOCX y PDF, preservado como documento íntegro.
- **Seis Estudios Complementarios implementados**: IBSE (REDCap), DUKE-EAS, PREDIMED-EAS,
  SF-12 EAS, Sueño EAS y CAGE-EAS (los cinco últimos sobre microdatos EAS Granada).
  Cada uno dispone de dominio, parser, EvidenceAtoms, panel UI, workspace y persistencia.
- Priorización Temática con importación REDCap y explotación estadística.
- Persistencia por municipio en localStorage con saneamiento de duplicados y reparación
  de trazabilidad (estados inconsistentes study-sin-documento).
- **MIT (Motor de Interpretación Territorial)**: produce el Estado Territorial Evolutivo
  a partir del EvidenceStore, con dimensión diagnóstica (LT1), áreas de intervención
  territorial y dimensión longitudinal.
- **Motor de Reconciliación Interpretativa**: detecta conflictos entre fuentes y estados;
  escala las tensiones relevantes a Áreas de Intervención Territorial.
- **Perfil de Salud Local (PSL)**: objeto canónico del Nivel 2. Ciclo de vida:
  `generated` → `validated` (con persistencia y detección de desactualización).
- **Plan de Acción** (borrador técnico): generado exclusivamente a partir del PSL.
- **Agenda** y **Seguimiento** como borradores técnicos iniciales.
- **Ciclo de Planificación Local**: componente institucional permanente, siempre visible,
  que representa el estado del expediente municipal en las 7 fases del ciclo RELAS.
- **Bloqueo de Nivel 3**: EPVSA, Plan de Acción, Agenda y Seguimiento requieren PSL
  validado. Sin PSL validado, estos paneles muestran estado bloqueado con requisitos.
- Municipio piloto: Atarfe. Verificado end-to-end con seis estudios cargados.

### Contratos arquitectónicos completados en Sprint 0

| Contrato | Fecha |
|---|---|
| `CONTRACT-REPOSITORY.md` | 2026-06-22 |
| `CONTRACT-EVIDENCE.md` | 2026-06-22 |
| `CONTRACT-PERSISTENCE.md` | 2026-06-27 |
| `CONTRACT-COMPLEMENTARY-STUDIES.md` | 2026-06-27 |
| `CONTRACT-MIT-PSL.md` | 2026-06-24 |
| `CONTRACT-ACTION-PLAN.md` | 2026-06-24 |
| `CONTRACT-COMPILER.md` | 2026-06-24 (reserva arquitectónica) |
| `CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md` | 2026-06-27 (investigación futura) |
| `CONTRACT-INTERPRETATION.md` | 2026-06-27 (nuevo — cierre Sprint 0) |

---

## Hito 1 — Consolidación del Repositorio Documental Municipal ✓ COMPLETADO

**Objetivo completado en Sprint 0.**

El Repositorio Documental Municipal está funcional con:
- Modelo `MunicipalDocument` completo con metadatos de procedencia.
- Visualización con agrupamiento por categoría (Fuente primaria / Estudios
  complementarios / Activos comunitarios / Otras fuentes).
- Eliminación manual de documentos individuales con purga automática de evidencias.
- MunicipalInventoryPanel como inventario legible del estado documental.
- Canonicidad por `kind` (health-report, community-asset) y por `tag`
  (estudios complementarios y priorización temática).

---

## Hito 2 — Soporte para Informe de Salud en PDF ✓ COMPLETADO

**Objetivo completado en Sprint 0.**

El Informe de Salud es cargable como DOCX y PDF mediante la interfaz de carga.
- DOCX: texto extraído vía Mammoth, renderizado como HTML en el visor.
- PDF: texto extraído (OCR) disponible para el pipeline de evidencias.
  El visor muestra ficha institucional; el texto extraído es capa técnica no visible.
- Pendiente futuro: visor PDF nativo en interfaz para el Informe de Salud en PDF.

**Deuda documentada:** El PDF original no se persiste en localStorage (limitación de
cuota). El texto extraído se usa como representación de trabajo. El documento fuente
debe conservarse fuera del sistema por el equipo técnico.

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

## Hito 4 — Consolidación de Estudios Complementarios ✓ COMPLETADO

**Objetivo completado en commits `0bf5026`, `9aad479`, `7f47034`, `20080cd`, `9c73fa0`.**

Los seis Estudios Complementarios están implementados con dominio, parser, EvidenceAtoms,
panel UI, workspace y persistencia. El Hito 4 se considera cerrado.

| Estudio | Fuente | Parser | Estado |
|---|---|---|---|
| IBSE | REDCap CSV | `IBSECSVParser` | ✓ Implementado |
| DUKE-EAS | EAS CSV | `DUKECSVParser` | ✓ Implementado |
| PREDIMED-EAS | EAS CSV | `PREDIMEDCSVParser` | ✓ Implementado |
| SF-12 EAS | EAS CSV | `SF12CSVParser` | ✓ Implementado |
| Sueño EAS | EAS CSV | `SuenoCSVParser` | ✓ Implementado |
| CAGE-EAS | EAS CSV | `CAGECSVParser` | ✓ Implementado |

**Deuda técnica residual** (documentada en `CONTRACT-COMPLEMENTARY-STUDIES.md §9a`):
DUKE, PREDIMED, SF-12, Sueño y CAGE carecen de `MethodologicalModule` en la Biblioteca
Metodológica. Sus parsers hardcodean los nombres de columna en lugar de derivarlos del
módulo. No bloquea el uso en producción. Necesario antes de transitar al estado `Validado`.

**Restricción vigente:** Ningún estudio activa automáticamente recomendaciones ni modifica
el Plan de Acción.

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

- **Compilador del Plan Local de Salud**: producto documental compilado a partir del
  Plan de Acción validado. El Plan de Acción actual es un borrador técnico, no el Plan Local de Salud definitivo.
- Flujos de aprobación institucional, firmas o permisos.
- Conexión con Variables EAS o CMI sin intervención técnica.
- Despliegue en producción con datos reales sin revisión de seguridad.

---

## Componentes UI pendientes de integración

Los siguientes componentes existen en el código (`src/ui/components/`) pero no están
en el flujo principal de usuario. Tienen propósito futuro documentado.

| Componente | Estado | Propósito | Referencia |
|---|---|---|---|
| `QuestionnaireBuilderPanel` | Pendiente de integración | Constructor metodológico de cuestionarios municipales REDCap | VISUAL-CONTRACT §12.1 |
| `LocalHealthProfilePanel` | Pendiente de integración | Generador PSL sintético (inspirado en NHS Health Profiles) | VISUAL-CONTRACT §12.2 |
| `StrategicFrameworkPanel` | Pendiente de integración | Traductor estratégico PSL → EPVSA / ESCA / RELAS | VISUAL-CONTRACT §12.3 |

Ninguno de estos componentes debe activarse en producción hasta Sprint 1.

---

*Última revisión: 2026-06-27 — Sprint 0 cierre definitivo: Gate 1 cerrado.*

---

## Línea futura — Memoria endocualitativa del proceso local

COMPÁS NG incorporará progresivamente una capacidad endocualitativa orientada a conservar y analizar documentación narrativa del proceso local de salud.

Ejemplos:

- actas del Grupo Motor;
- reuniones técnicas;
- entrevistas;
- grupos focales;
- talleres participativos;
- presentaciones de resultados;
- actos de priorización ciudadana;
- jornadas comunitarias;
- documentos de seguimiento;
- hitos, acuerdos, desacuerdos y cambios de orientación.

Esta línea no se implementará como automatización decisoria, sino como infraestructura para construir memoria longitudinal, trazabilidad del proceso y contexto interpretativo para profesionales de salud pública.

No se abordará antes de consolidar el Repositorio Documental Municipal, los contratos documentales y la arquitectura de Estudios Complementarios.

================================================================
FILE: audit/sprint-0-1-certification-input/FOUNDATIONS.md
================================================================
# COMPÁS NG — Fundamentos arquitectónicos

> Documento de referencia permanente. No debe modificarse sin decisión explícita.

---

## 1. Naturaleza del proyecto

COMPÁS NG es una reconstrucción arquitectónica desde cero de la herramienta COMPÁS.
No es una refactorización de la SPA monolítica anterior (`index.html`), sino un sistema
independiente con arquitectura modular, tipado estricto y separación clara de
responsabilidades.

La reconstrucción persigue dos objetivos simultáneos:

- **Corrección**: cada módulo hace exactamente lo que debe, sin efectos colaterales.
- **Sostenibilidad**: cualquier desarrollador puede auditar, reparar o extender el
  sistema con seguridad.

---

## 2. El municipio como unidad canónica de trabajo

Toda operación en COMPÁS NG tiene un municipio como contexto obligatorio.

- No existe estado global desligado de un municipio.
- El workspace de cada municipio se persiste de forma independiente.
- Cambiar de municipio carga un espacio de trabajo completamente distinto.
- Los municipios de demostración no comparten estado entre sí.

---

## 3. El Repositorio Documental Municipal

El **Repositorio Documental Municipal** es el núcleo del sistema. Contiene los documentos
oficiales de un municipio: informes de salud, estudios complementarios, activos
comunitarios, datos REDCap, etc.

Principios del repositorio:

- Cada documento tiene un tipo (`kind`), un identificador único y metadatos de procedencia.
- Existen **tipos canónicos** (una sola versión activa por municipio) y **tipos acumulables**
  (pueden coexistir múltiples documentos del mismo tipo).
- Tipos canónicos actuales: `health-report`, `community-asset`.
- La sustitución de un documento canónico elimina el anterior del repositorio **y** purga
  sus representaciones derivadas del `evidenceStore`.

---

## 4. El documento original como fuente de verdad

El documento original es **siempre** la fuente de verdad. Las representaciones derivadas
(átomos de evidencia, entidades estructuradas, snapshots) son **secundarias y regenerables**.

Principios:

- El documento original se preserva íntegro en el repositorio.
- Ninguna operación de análisis, síntesis o interpretación modifica el documento fuente.
- Si una representación derivada resulta incorrecta, se regenera a partir del documento
  original, nunca al revés.
- Los documentos de tipo `health-report` se preservan además como `HealthReportDocument`
  estructurado, separado del repositorio de documentos planos.

---

## 5. Representaciones derivadas

Las representaciones derivadas son estructuras generadas **a partir** de los documentos:

| Representación | Descripción |
|---|---|
| `EvidenceAtom` | Unidad mínima de evidencia estructurada extraída de un documento |
| `EvidenceStore` | Colección de átomos de evidencia de un municipio |
| `MunicipalSnapshot` | Vista agregada del estado documental de un municipio |
| `MunicipalInventory` | Inventario diagnóstico derivado del snapshot |

Estas estructuras **nunca sustituyen al documento original** y pueden ser purgadas y
regeneradas sin pérdida de información. Si un documento es sustituido, sus derivados
se eliminan junto con él.

---

## 6. Tipos canónicos frente a tipos acumulables

| Comportamiento | Tipos |
|---|---|
| **Canónico** — una sola versión activa | `health-report`, `community-asset` |
| **Acumulable** — pueden coexistir múltiples | Resto de tipos documentales |

Al ingestar un documento canónico:

1. Se elimina el documento anterior del mismo tipo del repositorio.
2. Se purgan del `evidenceStore` los átomos cuyo `provenance.origin` corresponde a ese tipo.
3. Se registra el nuevo documento y se generan sus representaciones derivadas.

Para documentos de tipo `redcap-export` cuya identidad se discrimina por tag —por ejemplo IBSE o Priorización Temática—, la canonicidad opera por `tag` mediante `removeDocumentsByTag`, no por `kind`. Véase `CONTRACT-REPOSITORY.md §4.2`.

---

## 7. Arquitectura en capas

```
domain/          Entidades, contratos y lógica de negocio pura. Sin dependencias externas.
application/     Casos de uso. Orquesta dominio. Sin acceso directo a UI ni infraestructura.
infrastructure/  Adaptadores externos: persistencia localStorage, parsers de ficheros.
ui/              Componentes React. Solo presenta datos; no contiene lógica de negocio.
```

Restricciones:

- `domain/` no importa de `application/`, `infrastructure/` ni `ui/`.
- `application/` no importa de `ui/`.
- `ui/` no importa de `infrastructure/` directamente.
- Los contratos entre capas se definen mediante interfaces TypeScript en `domain/`.

---

## 8. Trazabilidad y preservación documental

Todo `EvidenceAtom` incluye metadatos de procedencia (`provenance`):

- `origin`: tipo de fuente (`community-assets`, `health-report`, `redcap`, etc.).
- `documentId`: identificador del documento que generó el átomo.
- `sourceLabel`: título legible del documento fuente.
- `extractedAt`: marca temporal de la extracción.

Esta trazabilidad permite auditar de dónde proviene cada unidad de evidencia y regenerarla
si el documento fuente es sustituido.

---

## 9. Restricciones de generación automática

COMPÁS NG **no genera automáticamente decisiones institucionales**. Los siguientes
resultados son siempre producto de deliberación y validación humana explícita:

- Prioridades definitivas de salud del municipio.
- Aprobaciones del Plan de Acción o del Plan Local de Salud.
- Síntesis diagnósticas definitivas con carácter institucional.

COMPÁS NG **sí genera borradores técnicos orientativos**, marcados con
`requiresHumanValidation: true`, a partir del Perfil de Salud Local (PSL):

- Sugerencias de encaje con líneas estratégicas EPVSA.
- Objetivos, actuaciones e indicadores preliminares del Plan de Acción.
- Candidatos a priorización derivados de las áreas de intervención territorial.

Un borrador técnico no es una decisión. Toda propuesta del sistema requiere
revisión y validación explícita del equipo de salud pública antes de incorporarse
al proceso. Los motores analíticos son módulos deliberativos auxiliares, nunca
fuentes de decisión autónoma.

---

## 10. Principio de mínima intervención

Cada cambio en COMPÁS NG debe ser:

- **Mínimo**: acotado al bloque afectado, sin refactorizaciones no solicitadas.
- **Auditable**: con diff claro y reversible mediante los backups de sesión.
- **Verificable**: comprobado en la interfaz antes de darse por cerrado.
- **Trazable**: registrado en git con mensaje que explique el porqué, no el qué.

---

---

## Documentos relacionados

| Documento | Cubre |
|---|---|
| `ARCHITECTURE-CONSTITUTION.md` | Principios de diseño permanentes (Arts. 1–14) |
| `VISUAL-CONTRACT.md` | Identidad institucional, gramática visual de capas, ciclo institucional |
| `docs/architecture/OPERATING-CONSTITUTION.md` | Gate 1, Sprint 0, proceso de aprobación de IA, criterios de aceptación |
| `docs/contracts/CONTRACT-REPOSITORY.md` | Ciclo de vida documental, canonicidad, operaciones, invariantes |
| `docs/contracts/CONTRACT-EVIDENCE.md` | EvidenceAtom, EvidenceStore, IntegrityGuard |
| `docs/contracts/CONTRACT-PERSISTENCE.md` | localStorage, rehidratación, migraciones |
| `docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md` | Estudios Complementarios, taxonomía, patrón de implementación |
| `docs/contracts/CONTRACT-INTERPRETATION.md` | Naturaleza y límites de la interpretación territorial, capas del conocimiento, papel de la IA |
| `docs/contracts/CONTRACT-MIT-PSL.md` | Motor de Interpretación Territorial y Perfil de Salud Local |
| `docs/contracts/CONTRACT-ACTION-PLAN.md` | Plan de Acción, Agenda y Seguimiento (Nivel 3) |
| `docs/contracts/CONTRACT-COMPILER.md` | Compilador del Plan Local de Salud (reserva arquitectónica) |
| `docs/contracts/CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md` | Inferencia Estructural Territorial (investigación futura) |

---

*Última revisión: 2026-06-23 — §9 actualizado para distinguir borradores técnicos de decisiones institucionales.*
*Revisado: 2026-06-27 — Añadidos documentos relacionados.*
*Revisado: 2026-06-27 — Cierre Sprint 0: tabla de documentos relacionados ampliada con todos los contratos vigentes.*

---

## Principio endocualitativo

COMPÁS NG debe ser capaz de integrar evidencia cuantitativa, documental y endocualitativa.

Se entiende por evidencia endocualitativa la información narrativa generada dentro del propio proceso local de salud: actas, entrevistas, grupos focales, talleres, jornadas, reuniones del Grupo Motor, presentaciones de resultados, hitos, acuerdos, desacuerdos, rupturas, cambios de criterio y otros documentos del proceso.

Esta información debe preservarse como fuente original dentro del Repositorio Documental Municipal y podrá alimentar, en el futuro, una memoria longitudinal trazable del proceso local.

La información endocualitativa no debe utilizarse para generar automáticamente decisiones, recomendaciones ni conclusiones institucionales. Su función será contextualizar, explicar y documentar el proceso, siempre bajo validación profesional.

================================================================
FILE: audit/sprint-0-1-certification-input/ARCHITECTURE-CONSTITUTION.md
================================================================
# COMPÁS NG — Constitución Arquitectónica

> Documento fundacional permanente.
> Establece los principios que gobiernan toda decisión de diseño, implementación
> y evolución del sistema.
> No debe modificarse sin deliberación explícita del equipo responsable.

---

## Preámbulo

COMPÁS NG es una infraestructura para apoyar la planificación, el seguimiento
y la evaluación de la salud pública local.

Su finalidad no es automatizar decisiones, sino **preservar conocimiento,
organizar información heterogénea y proporcionar soporte técnico trazable
a los profesionales**.

La arquitectura debe perseguir siempre el **máximo rigor científico con la
mínima complejidad metodológica y técnica necesaria**.

---

## Artículo 1. Principio de simplicidad

La simplicidad es un objetivo arquitectónico.

No se introducirán capas, jerarquías, infraestructuras o abstracciones cuya
utilidad no esté demostrada por necesidades reales del proyecto.

Cuando existan varias soluciones válidas, se preferirá la más sencilla.

---

## Artículo 2. Primacía del dominio

La arquitectura debe responder a problemas reales de salud pública local.

Las decisiones de diseño no deben estar guiadas por patrones informáticos
generales, sino por las necesidades funcionales de COMPÁS NG.

---

## Artículo 3. El municipio como unidad de trabajo

Toda la información gestionada por COMPÁS NG pertenece a un contexto
municipal. No existe información global desligada de un municipio concreto.

Las distintas fuentes de información deben entenderse como componentes
de la realidad documental y analítica de ese municipio.

---

## Artículo 4. Primacía del documento original

Siempre que exista un documento fuente:

* el documento original constituye la referencia canónica;
* las representaciones derivadas **deben ser reconstruibles** desde el
  documento original cuando éste se preserve;
* ningún proceso derivado sustituye al documento original.

---

## Artículo 5. Separación entre evidencia, interpretación y propuesta

La evidencia, la interpretación y la propuesta son categorías distintas
que nunca deben mezclarse.

**Evidencia** es lo que el documento original contiene. Se preserva literal
e íntegramente.

**Interpretación** es lo que el sistema infiere de la evidencia. Se marca
siempre como provisional y requiere validación profesional antes de
incorporarse a cualquier decisión.

**Propuesta** es lo que los motores analíticos sugieren al profesional. Una
propuesta no puede presentarse como decisión institucional ni sustituir el
acto deliberativo de las personas competentes.

Las conclusiones, sugerencias o propuestas nunca deben alterar ni reemplazar
la información de origen.

---

## Artículo 6. Papel de la inteligencia artificial

La inteligencia artificial es una herramienta de asistencia.

Puede ayudar a localizar, resumir, comparar o explicar información.

No sustituye el criterio profesional ni adopta decisiones institucionales
de manera autónoma.

---

## Artículo 7. Evolución incremental

Las infraestructuras compartidas solo deberán aparecer cuando existan casos
reales que las justifiquen.

Se evitarán generalizaciones diseñadas para escenarios hipotéticos futuros.

---

## Artículo 8. Conservación del conocimiento

Las decisiones arquitectónicas relevantes no deben eliminarse sin una
revisión específica de su propósito y utilidad.

Antes de eliminar una pieza, debe clasificarse como:

* **consolidada**: funcional y conectada al flujo activo;
* **experimental**: en prueba con alcance acotado y reversible;
* **pendiente de integración**: decisión de diseño válida cuya integración
  depende de una condición real identificable;
* **obsoleta**: superada por una decisión posterior o por la evolución
  del modelo de dominio.

Solo las piezas clasificadas como obsoletas deben eliminarse.

Una pieza clasificada como *pendiente de integración* debe indicar
explícitamente qué condición real debe satisfacerse para integrarla.
Cuando una revisión arquitectónica concluya que esa condición apunta a
un modelo diferente al propuesto, la pieza debe reclasificarse como
obsoleta.

---

## Artículo 9. Transparencia metodológica

COMPÁS NG debe dejar claro qué información procede de fuentes originales,
qué ha sido derivada y qué resultados requieren validación profesional.

El sistema no debe presentar como conocimiento consolidado aquello que sea
provisional o inferido.

---

## Artículo 10. Trazabilidad

Toda transformación relevante debe poder explicarse desde su origen hasta
su resultado.

La trazabilidad tiene prioridad sobre optimizaciones prematuras o
soluciones opacas.

---

## Artículo 11. Prudencia frente a la complejidad

No se crearán modelos, taxonomías o mecanismos generales únicamente por
elegancia técnica.

La carga cognitiva que introduzca una solución debe estar justificada por
un beneficio observable para el proyecto.

---

## Artículo 12. Criterio de decisión

Ante cualquier propuesta de cambio arquitectónico deberá responderse:

1. ¿Resuelve un problema real existente en COMPÁS NG?
2. ¿Es coherente con el estado actual del repositorio y con los documentos
   fundacionales?
3. ¿Mantiene o reduce la complejidad global del sistema?
4. ¿Preserva la trazabilidad y el rigor científico?
5. Si existe una alternativa más sencilla que consiga el mismo resultado,
   ¿por qué no se elige?

Si la respuesta es negativa a alguna de las primeras cuatro cuestiones, la
modificación debe reconsiderarse. Si la quinta no tiene respuesta clara,
la alternativa más sencilla debe adoptarse por defecto.

---

## Artículo 13. Regla de creación estructural

Antes de crear una nueva capa, abstracción, infraestructura compartida,
jerarquía, colección genérica o mecanismo transversal, debe responderse:

> ¿Qué problema real del municipio resuelve hoy?

Si no existe una respuesta concreta, observable y verificable en el estado
actual del proyecto, no se implementa.

---

## Artículo 14. La EAS como referencia metodológica primaria

La **VI Encuesta Andaluza de Salud** es la fuente metodológica de referencia de COMPÁS NG
para la clasificación sociodemográfica y la definición de variables de salud.

Cuando exista una variable equivalente en la EAS, debe utilizarse su definición, codificación,
categorías y lógica de salto. No deben crearse versiones alternativas sin justificación técnica
expresa y documentada.

Las demás fuentes oficiales (INE, IECA, CIS) son complementarias y se utilizan únicamente
cuando la EAS no recoge la variable necesaria o cuando existe una necesidad de armonización
externa debidamente documentada.

Esta primacía rige tanto para los módulos de la Biblioteca Metodológica Canónica como para
el futuro Constructor de Cuestionarios y cualquier Encuesta Municipal de Salud generada con
COMPÁS NG.

---

---

## Documento complementario

Este documento establece los principios de diseño permanentes.

Las reglas operativas —Gate 1, Sprint 0, proceso de aprobación de IA, criterios de
aceptación, criterios de rechazo— están en:

```
docs/architecture/OPERATING-CONSTITUTION.md
```

La Constitución Arquitectónica y la Constitución Operativa son documentos distintos
con propósitos complementarios. La primera fija el qué y el porqué del sistema;
la segunda fija el cómo y el cuándo del trabajo sobre él.

---

*Primera versión aprobada: 2026-06-21*
*Revisada: 2026-06-22 — Art. 13 añadido.*
*Revisada: 2026-06-22 — Art. 14 añadido — primacía de la EAS como referencia metodológica.*
*Revisada: 2026-06-27 — Añadida referencia a OPERATING-CONSTITUTION.md.*
*Basada en el Borrador V0 y en las auditorías arquitectónicas de junio 2026.*

================================================================
FILE: audit/sprint-0-1-certification-input/OPERATING-CONSTITUTION.md
================================================================
# COMPÁS NG — Constitución Operativa

> Documento normativo permanente.
> Establece las reglas de proceso, los criterios de aceptación y los mecanismos
> de control que gobiernan la evolución de COMPÁS NG.
> Complementa `ARCHITECTURE-CONSTITUTION.md`, que fija los principios de diseño.
> Este documento fija las reglas de trabajo.
> No debe modificarse sin deliberación explícita del equipo responsable.
> Última revisión: 2026-06-27

---

## Preámbulo

COMPÁS NG es una plataforma de apoyo a la planificación local de salud.
Su arquitectura y su proceso de desarrollo están bajo la misma exigencia:
**rigor, determinismo y mínima complejidad necesaria**.

Este documento establece:

- la arquitectura canónica del sistema en tres niveles;
- el pipeline oficial y sus restricciones de flujo;
- el objetivo en curso (Sprint 0, Gate 1);
- los criterios que determinan si el sistema puede avanzar;
- las reglas que gobiernan cómo se introducen cambios;
- el papel de los asistentes de IA en el proceso de desarrollo.

---

## 1. Arquitectura canónica

COMPÁS NG opera en tres niveles. Cada nivel tiene responsabilidades
exclusivas y no puede consumir directamente los outputs de un nivel
que no sea el inmediatamente anterior.

```
Nivel 1 — Preservación y evidencia
  │
  │   Repositorio Documental Municipal
  │   → EvidenceStore (EvidenceAtom[])
  │   → IntegrityGuard (saneamiento de la evidencia)
  │
  ▼
Nivel 2 — Interpretación territorial
  │
  │   Motor de Interpretación Territorial (MIT)
  │   → Estado Territorial Evolutivo (ETE)
  │   → Motor de Reconciliación Interpretativa
  │   → Perfil de Salud Local (PSL)  ← único puente al Nivel 3
  │
  ▼
Nivel 3 — Decisión y planificación
  │
  │   Priorización técnica
  │   → Encaje estratégico EPVSA
  │   → Plan de Acción (borrador técnico)
  │   → Agenda
  │   → Seguimiento
```

### 1.1 Restricciones de flujo entre niveles

- **Ningún motor del Nivel 3** puede consumir directamente outputs del MIT
  ni del EvidenceStore. El **PSL validado** es el único objeto autorizado
  a cruzar la frontera Nivel 2 → Nivel 3.

- **El MIT y los motores del Nivel 2** no modifican el Repositorio Documental
  ni los documentos del Nivel 1. Solo leen el EvidenceStore saneado.

- **La evidencia no contiene interpretación**. Los `EvidenceAtom` son
  representaciones estructuradas de documentos, no conclusiones del sistema.

- **La interpretación no contiene decisiones**. El PSL es una propuesta técnica
  que requiere validación humana antes de alimentar el Nivel 3.

### 1.2 Fuentes de documentos del Nivel 1

| Tipo de fuente | `kind` canónico | Canonicidad |
|---|---|---|
| Informe de Salud | `health-report` | Por `kind` (uno por municipio) |
| Activos Comunitarios | `community-asset` | Por `kind` (uno por municipio) |
| IBSE (REDCap) | `redcap-export` + tag `"ibse"` | Por `tag` (uno por municipio) |
| Priorización Temática (REDCap) | `redcap-export` + tag `"thematic-prioritisation"` | Por `tag` (uno por municipio) |
| Estudios EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `complementary-study` + tag propio | Acumulable por tag |
| Documentación territorial, material cualitativo, otros | tipo propio | Acumulable |

---

## 2. Pipeline oficial

El pipeline analítico de COMPÁS NG es determinista y tiene un único punto
de entrada (EvidenceStore saneado) y un único puente autorizado al Nivel 3 (PSL).

```
EvidenceStore
  → IntegrityGuard.sanitizedStore
    → MIT → ETE
      → Motor de Reconciliación
        → PSL (generado o validado)
          → Priorización técnica
            → EPVSA
              → Plan de Acción
                → Agenda
                  → Seguimiento
```

El pipeline es **de solo lectura**: ninguna etapa escribe en las etapas anteriores.

Los resultados del MIT, la Reconciliación, el PSL no validado, el Plan de Acción,
la Agenda y el Seguimiento **no se persisten en localStorage**. Se recalculan en
cada sesión a partir del EvidenceStore persisitido. Solo el **PSL validado** por el
equipo técnico se persiste como excepción deliberada.

---

## 3. Separación entre evidencia, interpretación y decisión

Esta separación es un invariante arquitectónico. No puede relajarse.

| Capa | Qué es | Quién la genera | Quién la valida |
|---|---|---|---|
| **Evidencia** | Contenido de documentos en formato estructurado | Parsers, pipelines de extracción | Trazabilidad al documento fuente |
| **Interpretación** | Lectura territorial del conjunto de evidencia | MIT, Reconciliación, PSL | El equipo técnico mediante validación explícita |
| **Decisión** | Actos de priorización, planificación y compromiso institucional | Los profesionales de salud pública | El proceso institucional, nunca el sistema |

El sistema puede sugerir. No puede decidir.

Toda propuesta del sistema lleva `requiresHumanValidation: true`. Esta marca
no es opcional ni puede eliminarse.

---

## 4. Sprint 0 — Objetivo vigente

**Sprint 0 es el objetivo en curso. No se desarrollarán motores nuevos hasta
que este sprint esté completamente cerrado.**

El Sprint 0 cierra la deuda técnica acumulada y garantiza que la plataforma
existente funciona de forma completamente determinista antes de incorporar
el Motor de Interpretación Territorial, el PSL, el Plan de Acción, la Agenda,
el Seguimiento y el Compilador como objetos productivos.

### 4.1 Alcance del Sprint 0

Los seis bloques que debe cerrar el Sprint 0:

**Bloque A — Repositorio Documental** *(alta, media y baja prioridad)*
- Ciclo de vida completo: alta, sustitución, eliminación, persistencia, restauración.
- Deduplicación de tipos canónicos.
- Migraciones y rehidratación en localStorage.
- Ningún estado imposible.
- Toda evidencia referencia un documento existente.

**Bloque B — Estudios Complementarios**
- Los seis estudios (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS, CAGE-EAS)
  siguen exactamente el mismo contrato de ciclo de vida.
- Sin excepciones. Sin estudios "especiales".
- UI: estado, fichero, registros, cargar, sustituir, eliminar. Todo visible.

**Bloque C — EvidenceStore**
- `documentId` siempre válido.
- `municipalityId` correcto.
- Sin huérfanos.
- Sin duplicados.
- Limpieza de estados heredados.

**Bloque D — Persistencia**
- Flujo `vacío → carga → recarga → municipio → vuelta → estado idéntico`.

**Bloque E — UX institucional**
- Apariencia de producto institucional consolidado.
- Sin badges pastel, sin sensación de prototipo.
- Jerarquía documental clara y coherente.

**Bloque F — Terminología**
- Un único nombre para cada concepto.
- Sin duplicidades entre contratos, documentación y UI.

---

## 5. Gate 1 — Criterio de paso a motores

El Gate 1 es la condición de cierre del Sprint 0 y la condición de apertura
del desarrollo de motores. No puede superarse parcialmente.

### 5.1 Criterios de aceptación

El Gate 1 se considera superado cuando todas las siguientes afirmaciones son
verdaderas sin excepción:

1. **El Repositorio Documental es completamente determinista.**
   No existe ningún estado imposible conocido. Todo ciclo de vida de documento
   (alta, sustitución, eliminación, persistencia, restauración) funciona correctamente
   para todos los tipos documentales sin excepción.

2. **Los seis Estudios Complementarios siguen exactamente el mismo contrato.**
   IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS tienen el mismo
   ciclo de vida, el mismo patrón de UI y la misma integración con el Repositorio y
   el EvidenceStore. No existen estudios "especiales".

3. **Toda evidencia tiene documento.**
   Todo `EvidenceAtom` en el EvidenceStore activo tiene un `provenance.documentId`
   que apunta a un documento existente en el Repositorio del mismo municipio.
   No existen átomos huérfanos.

4. **Toda carga genera exactamente el mismo ciclo de vida.**
   Cargar un estudio complementario siempre produce: (a) un documento en el repositorio,
   (b) un estudio interpretado en el workspace, (c) los EvidenceAtom correspondientes
   con `documentId` correcto, (d) persistencia inmediata en localStorage.

5. **La persistencia resiste cualquier recarga.**
   El workspace cargado tras un cierre y reapertura del navegador es idéntico
   al workspace guardado. Ningún campo se pierde, ningún estudio desaparece,
   ningún átomo queda huérfano.

6. **La interfaz parece un producto institucional consolidado.**
   Sin badges pastel, sin tarjetas innecesarias, sin sensación de prototipo.
   Los paneles de Repositorio Documental, Estudios Complementarios, EvidenceStore
   e Inventario pertenecen visualmente al mismo producto.

7. **No quedan estados imposibles conocidos.**
   Los estados listados en la auditoría del Sprint 0 están todos resueltos o
   documentados como riesgos aceptados con justificación explícita.

8. **La plataforma está preparada para soportar los motores sin aumentar deuda.**
   Añadir el MIT, el PSL o cualquier motor del Nivel 3 no requiere refactorizar
   nada del Nivel 1. El contrato de interfaz entre niveles es claro y estable.

### 5.2 Criterios de rechazo

El Gate 1 **no puede superarse** si alguna de las siguientes condiciones es verdadera:

- Existe un átomo huérfano conocido (sin `documentId` válido) que no está
  cubierto por el mecanismo de reparación en `loadWorkspaceFromLocalStorage`.
- Un estudio complementario tiene un ciclo de vida diferente al resto sin
  justificación técnica documentada en el contrato.
- El Repositorio puede quedar en estado inconsistente mediante una secuencia
  de operaciones reproducible.
- La persistencia pierde datos en algún escenario de recarga documentado.
- Cualquier prueba obligatoria del Bloque G (Tests, §4.1) falla.

---

## 6. Criterio anti-sobreingeniería

Antes de introducir cualquier cambio en COMPÁS NG, deben responderse estas
preguntas. Si alguna respuesta es negativa, el cambio no debe realizarse:

1. ¿Resuelve un fallo observado, una incoherencia demostrada o una mejora
   objetiva de robustez en el Sprint 0?

2. ¿Está acotado al bloque afectado, sin refactorizaciones colaterales?

3. ¿La solución más sencilla que resuelve el problema ya ha sido descartada
   explícitamente, con motivo documentado?

4. ¿El cambio es reversible?

5. ¿Puede verificarse su corrección con los tests existentes o con un nuevo
   test mínimo?

================================================================
FILE: audit/sprint-0-1-certification-input/contracts/CONTRACT-INDEX.md
================================================================
# CONTRACT-INDEX — Índice maestro de contratos arquitectónicos

> COMPÁS NG — Referencia de arquitectura contractual
> Última actualización: Sprint 1 — 2026-06-27

Este documento es la puerta de entrada a la arquitectura contractual de COMPÁS NG.
No duplica contenido de los contratos. Cada entrada contiene: propósito, alcance, estado y relaciones.

---

## Cómo usar este índice

Los contratos se ordenan por **nivel arquitectónico**, de infraestructura base a motores superiores.

**Estados posibles:**
- `VIGENTE` — Implementado y en producción. Modificar solo con revisión explícita.
- `CONCEPTUAL` — Diseñado pero sin implementación activa. Define el qué, no el cómo.
- `FUTURO` — Investiga o reserva una línea para sprints posteriores.

---

## Nivel 1 — Repositorio y persistencia

### CONTRACT-REPOSITORY
**Estado:** VIGENTE

Contrato del Repositorio Documental Municipal (`MunicipalDocumentRepository`). Define los 11 tipos de documento (`DocumentKind`), el ciclo de vida de un documento y la regla de trazabilidad: todo átomo de evidencia debe poder rastrear su documento de origen.

**Productores:** UI (carga de documentos por el equipo técnico).
**Consumidores:** EvidenceStore, MIT.
**Relacionado con:** CONTRACT-EVIDENCE, CONTRACT-PERSISTENCE.

---

### CONTRACT-PERSISTENCE
**Estado:** VIGENTE

Contrato de persistencia y rehidratación del workspace municipal en localStorage. Define el esquema de serialización (versión 1.0.0), las reglas de migración inline y las garantías de consistencia al recargar.

**Productores:** `LocalStorageWorkspacePersistence`.
**Consumidores:** UI (rehidratación al arrancar).
**Relacionado con:** CONTRACT-REPOSITORY.

---

## Nivel 1 tardío — Evidencia estructurada

### CONTRACT-EVIDENCE
**Estado:** VIGENTE

Contrato de `EvidenceAtom`, `EvidenceStore` y `EvidenceStoreIntegrityGuard`. Define los tipos de átomo (`EvidenceAtomKind`), los niveles de confianza, la clave estable de deduplicación, y las 5 reglas de integridad (A–E) que el Guard aplica antes de exponer el store al MIT.

**Productores:** Parsers de estudios complementarios, motor de extracción del Informe de Salud.
**Consumidores:** MIT, PSL.
**Relacionado con:** CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-EVIDENCE-QUALITY, CONTRACT-MIT-PSL.

---

### CONTRACT-COMPLEMENTARY-STUDIES
**Estado:** VIGENTE

Contrato de los estudios complementarios como pipeline. Define el flujo canónico (CSV → Parser → Study → EvidenceAtoms → EvidenceStore), los 6 instrumentos admitidos, los invariantes de aislamiento municipal y la regla de no almacenamiento de registros individuales.

**Productores:** Parsers CSV (IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE).
**Consumidores:** EvidenceStore, CONTRACT-SCALE-PANELS (gramática visual).
**Relacionado con:** CONTRACT-SCALE-PANELS, CONTRACT-EVIDENCE.

---

### CONTRACT-SCALE-PANELS
**Estado:** VIGENTE

Gramática editorial de los paneles de estudios complementarios. Distingue tres categorías: bloques obligatorios en UI (metadatos, barras, referencias, recordatorio), bloques condicionales (interpretación asistida, cautelas) y bloques de referencia de sistema (identidad, integraciones). Define también para qué instrumentos aplica la interpretación asistida (solo IBSE entre los actuales).

**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
**Consumidores:** Equipo técnico (UI).
**Relacionado con:** CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-EVIDENCE-QUALITY.

---

### CONTRACT-EVIDENCE-QUALITY
**Estado:** VIGENTE

Define las cuatro dimensiones de calidad de la evidencia: documental, muestral, metodológica e inferencial. Establece cómo se mapean a `confidence: "high" | "medium" | "low"` en EvidenceAtom y justifica mantener `kind: "sample-quality"` sin evolucionar a `EvidenceQualityAssessment` en Sprint 1.

**Productores:** Parsers de estudios (calculan confianza), CONTRACT-DYNAMIC-TRIPYRAMID (calidad muestral futura).
**Consumidores:** MIT (priorización por confianza), PSL (validación de capítulos).
**Relacionado con:** CONTRACT-EVIDENCE, CONTRACT-DYNAMIC-TRIPYRAMID.

---

## Nivel 2 — Interpretación territorial

### CONTRACT-INTERPRETATION
**Estado:** VIGENTE

Contrato de qué significa "interpretar" dentro de COMPÁS NG. Define los límites epistemológicos del sistema: qué constituye una interpretación válida, qué nunca lo constituye, y la distinción entre interpretación asistida y decisión territorial.

**Productores:** No tiene productor de código directo (es un contrato normativo).
**Consumidores:** MIT, PSL, equipo técnico como referencia.
**Relacionado con:** CONTRACT-MIT-PSL.

---

### CONTRACT-MIT-PSL
**Estado:** VIGENTE

Contrato del Motor de Interpretación Territorial (MIT) y del Perfil de Salud Local (PSL). Define LT1, OIT, Reconciliación Interpretativa, los 7 capítulos del PSL, los 6 estados del PSL y la regla PSL-C1 (el Nivel 3 solo consume PSL, nunca EvidenceStore directamente).

**Productores:** `TerritorialInterpretationEngine`, `buildLocalHealthProfile`.
**Consumidores:** Priorización temática, Motor de Traducción Estratégica, Plan de Acción.
**Relacionado con:** CONTRACT-EVIDENCE, CONTRACT-ACTION-PLAN, CONTRACT-STRATEGIC-TRANSLATION.

---

## Nivel 3 — Planificación y acción

### CONTRACT-ACTION-PLAN
**Estado:** VIGENTE

Contrato del bloque de Nivel 3: Priorización temática, Motor de Traducción Estratégica (versión inicial), Plan de Acción, Agenda y Seguimiento. Define que ningún motor del Nivel 3 puede producir documentos definitivos sin validación humana explícita.

**Productores:** `ThematicPrioritisation`, Plan de Acción.
**Consumidores:** Compiler (futuro).
**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-COMPILER, CONTRACT-STRATEGIC-TRANSLATION.

---

### CONTRACT-COMPILER
**Estado:** VIGENTE (declarado, sin implementación activa)

Contrato del Compilador del Plan Local de Salud. Define los gates obligatorios (`G-C1`: PSL en estado `"approved"`) y la posición como último stage del pipeline. El compiler no implementado bloquea el estado `"approved"` del PSL.

**Productores:** Sin implementación activa.
**Consumidores:** Equipo técnico (exportación documental futura).
**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-ACTION-PLAN.

---

## Infraestructura metodológica futura (Sprint 2+)

### CONTRACT-DYNAMIC-TRIPYRAMID
**Estado:** CONCEPTUAL

Define el modelo conceptual de la Tripirámide Dinámica de calidad muestral: Población → Muestra teórica → Muestra observada → Calidad → Interpretación. Establece SAM (Sistema de Auditoría Muestral) como metodología separada. Sin implementación en Sprint 1.

**Productores futuros:** SAM engine.
**Consumidores futuros:** EvidenceStore (átomos `kind: "sample-quality"`), paneles de estudios.
**Relacionado con:** CONTRACT-EVIDENCE-QUALITY, CONTRACT-EVIDENCE.

---

### CONTRACT-STRATEGIC-REPOSITORY
**Estado:** CONCEPTUAL

Define el Repositorio Estratégico Territorial: recursos normativos supramunicipales con denominaciones canónicas fijadas (ESCA = Estrategia de Salud Comunitaria de Andalucía 2026–2030; RELAS = Red Local de Acción en Salud; RELAS-G, EBE, PSMA, PEM, EPVSA). Establece la diferencia respecto al MunicipalDocumentRepository. Sin implementación en Sprint 1.

**Productores futuros:** Carga manual por el equipo técnico.
**Consumidores futuros:** Motor de Traducción Estratégica.
**Relacionado con:** CONTRACT-STRATEGIC-TRANSLATION, CONTRACT-REPOSITORY.

---

### CONTRACT-STRATEGIC-TRANSLATION
**Estado:** CONCEPTUAL

Define el Motor de Traducción Estratégica (MTE): flujo PSL validado → Priorizaciones → Repositorio Estratégico → Borrador Plan de Acción. Establece 6 restricciones explícitas de no-sustitución y el invariante de trazabilidad completa. `StrategicDerivationTrace` pendiente de especificación en el sprint de implementación.

**Productores futuros:** MTE engine.
**Consumidores futuros:** Plan de Acción, Compiler.
**Relacionado con:** CONTRACT-STRATEGIC-REPOSITORY, CONTRACT-MIT-PSL, CONTRACT-ACTION-PLAN.

---

### CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE
**Estado:** FUTURO

Investiga la posibilidad de construir hipótesis estructurales sobre determinantes territoriales de salud. No autoriza implementación hasta Gate 1. Preserva la línea de investigación para fundamentar futuras capacidades interpretativas.

**Productores futuros:** Investigación metodológica pendiente.
**Consumidores futuros:** MIT (extensión futura).
**Relacionado con:** CONTRACT-INTERPRETATION, CONTRACT-MIT-PSL.

---

## Mapa de dependencias

```
CONTRACT-REPOSITORY
    ↓
CONTRACT-PERSISTENCE
CONTRACT-EVIDENCE
    ↓
CONTRACT-COMPLEMENTARY-STUDIES → CONTRACT-SCALE-PANELS
                                 CONTRACT-EVIDENCE-QUALITY
    ↓
CONTRACT-INTERPRETATION
CONTRACT-MIT-PSL
    ↓
CONTRACT-ACTION-PLAN → CONTRACT-COMPILER
    ↓
CONTRACT-STRATEGIC-TRANSLATION → CONTRACT-STRATEGIC-REPOSITORY
                                 CONTRACT-DYNAMIC-TRIPYRAMID
```

---

## Reglas de mantenimiento

1. Cualquier nuevo contrato debe registrarse aquí antes de que otro contrato lo referencie.
2. Un contrato no puede pasar de `CONCEPTUAL` a `VIGENTE` sin una revisión arquitectónica explícita.
3. Los contratos `VIGENTE` no se modifican sin revisión deliberada y registro de la versión.
4. Las referencias cruzadas entre contratos deben ser simétricas: si A referencia B, B debe mencionar A en "Relacionado con".
5. Los productores y consumidores deben actualizarse cuando cambie la implementación.

---

*Este índice es el punto de entrada obligatorio antes de crear o modificar cualquier contrato en COMPÁS NG.*

================================================================
FILE: audit/sprint-0-1-certification-input/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md
================================================================
# COMPÁS NG — Contrato de Estudios Complementarios

> Documento normativo permanente.
> Define el comportamiento garantizado, los invariantes, la taxonomía y los
> límites de los Estudios Complementarios en COMPÁS NG.
> No debe modificarse sin revisión explícita y deliberada.
> Última revisión: 2026-06-27

---

## 1. Propósito

Los **Estudios Complementarios** son instrumentos de medición cuantitativa o
semiestructurada que aportan dimensiones del estado de salud de la población
municipal que el Informe de Salud puede no cubrir, o cubrir solo de forma
agregada. Se administran sobre la población municipal mediante exportaciones de
REDCap u otros sistemas de captura y producen datos procesados localmente.

Dentro de COMPÁS NG, los Estudios Complementarios:

- enriquecen el `EvidenceStore` con indicadores, factores y hallazgos que
  las fuentes documentales primarias no incluyen;
- son siempre datos de contexto: complementan el diagnóstico territorial, no
  lo determinan ni lo sustituyen;
- no generan automáticamente decisiones de priorización ni actuaciones del
  Plan de Acción;
- preservan la privacidad: los registros individuales de cada participante no
  se almacenan; solo sobreviven los agregados municipales.

---

## 2. Taxonomía

### 2.1 Categoría arquitectónica: Estudios Complementarios

La categoría arquitectónica es **Estudios Complementarios**. Es la única
denominación autorizada para referirse al conjunto de instrumentos de
medición cuantitativa o semiestructurada que complementan el Informe de Salud
dentro del sistema.

IBSE, SF-12, DUKE, PREDIMED, CAGE, ESCA y cualquier otro instrumento que se
incorpore en el futuro son **implementaciones concretas** de esta categoría.
Ninguno de ellos tiene rango arquitectónico propio. El mayor desarrollo actual
de IBSE en COMPÁS NG no le otorga una categoría distinta al resto.

### 2.2 Estado de implementación por instrumento

| Instrumento | Categoría | Estado actual |
|---|---|---|
| **IBSE** — Índice de Bienestar Socioemocional | `validated-scale` | Implementado (módulo en `draft`; ver §9) |
| **DUKE-EAS** — Apoyo social funcional (Duke-UNC-11 sobre EAS) | `validated-scale` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
| **PREDIMED-EAS** — Adherencia a Dieta Mediterránea (PREDIMED-14 sobre EAS) | `validated-scale` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
| **SF-12 EAS** — Salud percibida (PCS/MCS sobre EAS) | `validated-scale` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
| **Sueño EAS** — Duración y calidad subjetiva del sueño (P33_R / P33A sobre EAS) | `eas-official-block` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
| **CAGE-EAS** — Riesgo de alcoholismo (CAGE_R / CAGE sobre EAS) | `eas-official-block` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
| **ESCA** — Escalas propias | `municipal-module` | Conceptual |
| Otros instrumentos futuros | — | Sin definir |

El estado "conceptual" significa que el instrumento está reconocido en el
dominio (DOMAIN-MODEL.md §5.3) pero no tiene módulo registrado, tipos de
dominio propios, parser ni pipeline de evidencia.

### 2.3 Fuentes de captura

Los Estudios Complementarios pueden provenir de:

- **REDCap**: sistema de captura habitual. La exportación CSV de REDCap es el
  documento fuente.
- **Sistemas equivalentes**: cualquier sistema que produzca registros
  individuales en formato tabular, siempre que el instrumento tenga un módulo
  metodológico con adaptador para ese sistema.
- **Agregados externos**: en casos excepcionales, un estudio puede incorporar
  agregados ya calculados sin acceso a los individuales (p. ej., resultados
  de un estudio publicado). En ese caso, la trazabilidad al instrumento
  individual es limitada y debe documentarse explícitamente.

### 2.4 Cuestionarios compuestos

Un cuestionario puede agregarse a partir de múltiples instrumentos
(por ejemplo: bloque sociodemográfico EAS + IBSE + PREDIMED). En ese caso,
cada instrumento conserva su identidad metodológica propia. El cuestionario
compuesto no crea un instrumento nuevo: es un contenedor de instrumentos
existentes. La trazabilidad de cada ítem debe poder rastrearse hasta su
módulo de origen.

---

## 3. Relación con el Repositorio Documental

### 3.1 Registro en el repositorio

Toda importación de un Estudio Complementario produce un documento en el
repositorio. El `kind` del documento depende del origen del instrumento:

| Familia | `kind` canónico | Tag discriminante | Canonicidad |
|---|---|---|---|
| IBSE (exportación REDCap municipal) | `"redcap-export"` | `"ibse"` | Por tag (uno por municipio) |
| Instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `"complementary-study"` | Tag propio del instrumento | Por tag (uno por municipio) |
| Futuros instrumentos REDCap | `"redcap-export"` | Tag propio del instrumento | Por tag (uno por municipio) |

Atributos comunes a todos los documentos de Estudios Complementarios:

| Campo | Valor |
|---|---|
| `id` | UUID generado en el momento de la importación |
| `sourceFileName` | Nombre del fichero CSV importado |
| `canGenerateEvidence` | `true` (por defecto) |
| `tags` | Al menos el tag discriminante del instrumento |

**Razón de la distinción `redcap-export` vs `complementary-study`:** IBSE
es una exportación REDCap de un cuestionario municipal administrado directamente
por el equipo. Los instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) son
variables derivadas de los microdatos oficiales de la Encuesta Andaluza de Salud,
no exportaciones de REDCap municipal. Esta distinción refleja el origen diferente
de cada fuente, aunque ambas familias pertenecen a la misma categoría arquitectónica
de Estudios Complementarios.

### 3.2 Discriminación entre instrumentos

Cada instrumento tiene un tag canónico único. La correspondencia actual es:

| Instrumento | `kind` | Tag discriminante |
|---|---|---|
| IBSE | `redcap-export` | `"ibse"` |
| Priorización Temática | `redcap-export` | `"thematic-prioritisation"` |
| DUKE-EAS | `complementary-study` | `"duke-eas"` |
| PREDIMED-EAS | `complementary-study` | `"predimed-eas"` |
| SF-12 EAS | `complementary-study` | `"sf12-eas"` |
| Sueño EAS | `complementary-study` | `"sueno-eas"` |
| CAGE-EAS | `complementary-study` | `"cage-eas"` |

**Nota:** La Priorización Temática comparte `kind: "redcap-export"` con IBSE
pero no es un Estudio Complementario; es una familia documental distinta con
contrato propio. Aparece aquí solo para completar la tabla de discriminación.

### 3.3 Canonicidad por tag

Cada instrumento de estudio complementario es **canónico por tag**: solo puede
existir un documento activo con su tag discriminante en el repositorio de cada
municipio. Al importar una nueva exportación del mismo instrumento, el
documento anterior se sustituye y su evidencia derivada se purga.

Esta canonicidad es por tag, no por `kind`. Distintos instrumentos con el mismo
`kind` no se sustituyen entre sí.

### 3.4 Trazabilidad: `documentId`

El `id` del documento en el repositorio se propaga a los `EvidenceAtom` que el
estudio genera, como `provenance.documentId`. Esto permite purgar exactamente
los átomos de ese instrumento cuando el documento es eliminado o sustituido.
Véase `CONTRACT-EVIDENCE.md`.

---

## 4. Relación con EvidenceAtom

### 4.1 Qué genera cada tipo de evidencia

Un Estudio Complementario puede generar las siguientes categorías de átomo:

| Categoría de átomo | `kind` | Descripción |
|---|---|---|
| Indicadores cuantitativos | `indicator` | Medias municipales de factores e índices |
| Resumen interpretativo derivado | `qualitative-observation` | Síntesis automática del instrumento; marcada como derivada |
| Cautelas metodológicas | `methodological-caution` | Limitaciones del instrumento o la muestra |

El caso IBSE ilustra la distinción:

- **IBSE_FACTORES** (5 átomos, `kind: "indicator"`): evidencia cuantitativa
  primaria. Índice total y 4 factores (Vínculo, Situación, Control, Persona).
- **IBSE_RESUMEN** (1 átomo, `kind: "qualitative-observation"`, tag
  `"ibse-derived"`): síntesis automática derivada de IBSE_FACTORES. No es
  evidencia primaria. No debe prevalecer sobre los datos cuantitativos cuando
  exista discrepancia.

Los futuros instrumentos deben mantener esta misma distinción entre evidencia
primaria y resumen derivado cuando sea aplicable.

### 4.2 Nivel de confianza

La confianza de los átomos generados refleja la calidad de la muestra:

| Condición de la muestra | `confidence` |
|---|---|
| `nValid >= 30` (o criterio equivalente del instrumento) | `"medium"` |
| `nValid < 30` | `"low"` |

Ningún Estudio Complementario genera átomos con `confidence: "high"`.

### 4.3 Validación humana

Todos los átomos generados por Estudios Complementarios tienen
`requiresHumanValidation: true`. El sistema no produce evidencia de estudios
complementarios que se presente como automáticamente validada.

### 4.4 Privacidad: no persistencia de registros individuales

Los registros individuales de los participantes no se almacenan en ningún
momento. El parser lee el CSV fila a fila, calcula los agregados municipales y
descarta los individuales. Solo los agregados sobreviven en `IBSEAggregates`
(y en los equivalentes de futuros instrumentos). Esta garantía es parte del
contrato de cada instrumento, no solo de IBSE.

---

## 5. Biblioteca Metodológica

### 5.1 `MethodologicalModule` como fuente única de verdad

Cada instrumento de Estudio Complementario debe tener una definición canónica
en la **Biblioteca Metodológica** (`domain/methodology/`). Esta definición es
la fuente única de verdad para:

- la estructura de ítems y opciones de respuesta;
- las dimensiones y sus composiciones;
- el algoritmo de cálculo canónico;
- la interpretación de resultados y sus umbrales;
- los adaptadores para sistemas de captura (REDCap, SAV, etc.).

Los parsers, los motores de evidencia y el Constructor de Cuestionarios derivan
su comportamiento de esta definición. No deben replicar ni redefinir ninguno
de estos elementos fuera del módulo.

El parser IBSE ilustra esta dependencia: lee sus nombres de columna directamente
desde `IBSE_MODULE.adapters.redcap.columns`, no los tiene hardcoded.

### 5.2 Estructura de un `MethodologicalModule`

Un módulo canónico incluye:

| Componente | Descripción |
|---|---|
| `identity` | ID, versión, estado, categoría, nombre, descripción, propósito, población objetivo |
| `source` | Autores, año, publicación, DOI, URL, organismo, notas |
| `items` | Ítems del instrumento: texto, dimensión, tipo de respuesta, opciones, inversión de escala, campo REDCap |
| `dimensions` | Dimensiones o factores: ítems que los componen, campo de salida canónico |
| `algorithm` | Tipo de algoritmo, nivel de entrada canónico, pasos, nivel de agregación, criterio de completitud, notas de implementación |
| `interpretation` | Escala (mín/máx/dirección), umbrales optativos, valores de referencia, notas contextuales |
| `limitations` | Limitaciones metodológicas conocidas del instrumento |
| `bibliography` | Referencias bibliográficas de la fuente primaria |
| `adapters` | Adaptadores opcionales para REDCap, SAV u otros sistemas |

### 5.3 Categorías de módulo (`ModuleCategory`)

| Categoría | Descripción |
|---|---|
| `eas-sociodemographic` | Variables de clasificación de la VI Encuesta Andaluza de Salud |
| `eas-official-block` | Bloque oficial completo de la EAS |
| `validated-scale` | Escala psicométrica o epidemiológica con validación publicada |
| `municipal-module` | Módulo propio de un proyecto o municipio |
| `external-official-module` | Módulo externo excepcional (INE, IECA, CIS) con justificación |
| `custom` | Uso específico no encuadrable en los anteriores |

Los instrumentos de Estudios Complementarios validados (IBSE, SF-12, DUKE,
PREDIMED) son `validated-scale`. Los módulos específicos del municipio son
`municipal-module`.

### 5.4 Estados de módulo (`ModuleStatus`)

| Estado | Significado |

================================================================
FILE: audit/sprint-0-1-certification-input/contracts/CONTRACT-MIT-PSL.md
================================================================
# COMPÁS NG — Contrato del Motor de Interpretación Territorial y el Perfil de Salud Local

> Documento normativo permanente.
> Define el comportamiento garantizado, los invariantes y los límites del
> Motor de Interpretación Territorial (MIT), la Reconciliación Interpretativa
> y el Perfil de Salud Local (PSL) en COMPÁS NG.
> No debe modificarse sin revisión explícita y deliberada.
> Última revisión: 2026-06-24

---

## 1. Propósito

Este contrato establece el paso de evidencia trazable a interpretación
territorial (Nivel 2) y de interpretación territorial a decisión planificada
(Nivel 3). Es el contrato más crítico del sistema porque regula la única
frontera donde la información cambia de naturaleza: de datos analíticos a
propuestas que pueden influir en decisiones institucionales.

El **Motor de Interpretación Territorial (MIT)** transforma el `EvidenceStore`
saneado en un Estado Territorial Evolutivo: una lectura estructurada,
versionada y trazable del municipio.

El **Perfil de Salud Local (PSL)** sintetiza ese estado y actúa como **único
puente autorizado** entre el Nivel 2 analítico y el Nivel 3 de decisión.
Ningún motor del Nivel 3 puede consumir directamente los outputs del MIT.

---

## 2. Principios

### El MIT interpreta, no decide

El MIT organiza, clasifica y relaciona evidencia. No adopta conclusiones
institucionales, no establece prioridades municipales ni produce compromisos
de planificación. Todo output del MIT es una propuesta analítica que requiere
validación técnica y comunitaria explícita.

### LT1 organiza evidencia, no concluye institucionalmente

La dimensión diagnóstica (LT1) es la clasificación del `EvidenceStore` por
tipo semántico de átomo: determinantes, activos, indicadores, hallazgos
cualitativos y cautelas metodológicas. No establece causalidad, no pondera
la importancia relativa de las fuentes y no produce rankings automáticos.

### El OIT propone áreas de intervención, no actuaciones definitivas

Las Áreas de Intervención Territorial (OIT) son candidaturas analíticas
derivadas de la lectura territorial y de la Reconciliación. Son el producto
de heurísticas del sistema, no de deliberación técnica. Requieren revisión
y validación antes de traducirse en actuaciones concretas del Plan de Acción.

### La Reconciliación identifica tensiones, no las resuelve

El Motor de Reconciliación Interpretativa detecta y clasifica tensiones entre
fuentes, escalas y estados históricos. El sistema nunca resuelve un conflicto
interpretativo de forma automática. Toda tensión detectada queda marcada como
`"no-resuelta"` y es responsabilidad del equipo técnico gestionarla.

### El PSL es el objeto canónico del Nivel 2

El PSL sintetiza el análisis territorial en un objeto validable, versionado y
con ciclo de vida explícito. Es la única representación del Nivel 2 que el
Nivel 3 tiene autorizado a consumir.

### Ningún motor del Nivel 3 consume directamente el Nivel 2

Esta es la regla PSL-C1. Los motores del Nivel 3 (Priorización, EPVSA,
Plan de Acción, Agenda, Seguimiento) solo pueden operar sobre el PSL. No
pueden consumir `LT1Result`, `OITResult`, `ReconciliacionResult` ni
`EstadoTerritorialEvolutivo` directamente.

---

## 3. Entradas del MIT

El MIT acepta como entrada un `EvidenceStore` **ya saneado** por el
`EvidenceStoreIntegrityGuard`. No opera sobre el store original.

Las fuentes documentales que pueden contribuir evidencia al store son:

| Fuente | `EvidenceOrigin` | Estado de implementación |
|---|---|:---:|
| Informe de Salud | `health-report` | Implementado |
| Activos Comunitarios | `community-assets` | Implementado |
| Localiza Salud | `localiza-salud` | Implementado |
| IBSE | `ibse` | Implementado |
| Priorización Temática | `citizen-participation` | Implementado |
| Estudio Complementario | `complementary-study` | Implementado |
| Evidencia longitudinal | `longi` | Implementado (atoms) |
| EAS | `eas` | Origen reconocido; parser pendiente |
| CMI | `cmi` | Origen reconocido; parser pendiente |
| SAM | `sam` | Origen reservado; sin implementación |
| Entrada manual | `manual-entry` | Origen reconocido; flujo directo |

El MIT no distingue entre fuentes implementadas y pendientes: procesa los
átomos que encuentre en el store, independientemente de su procedencia. La
responsabilidad de garantizar que el store contiene evidencia de calidad es
del repositorio y del IntegrityGuard.

El Informe de Salud es la **fuente diagnóstica primaria recomendada**. Su
ausencia no impide la ejecución del MIT, pero el PSL la señala explícitamente
en el Capítulo II y en el resumen ejecutivo.

---

## 4. Motor de Interpretación Territorial (MIT)

### 4.1 Producto: `EstadoTerritorialEvolutivo`

El MIT produce un `EstadoTerritorialEvolutivo`, que incluye:

- **`version`**: igual a `evidenceStore.updatedAt`. Estable mientras la
  evidencia no cambia; determinista entre re-ejecuciones.
- **`dimensionDiagnostica`** (LT1): clasificación de átomos por tipo semántico.
- **`areasDeIntervencion`** (OIT): candidaturas de intervención territorial.
- **`dimensionLongitudinal`**: presencia y nota sobre evidencia evolutiva.
- **`tensionesEstructurales`**: contradicciones heurísticas detectadas entre
  fuentes.
- **`marcosAplicados`**: marcos interpretativos presentes (EPVSA, ESCA, RELAS
  y otros), con conteo de elementos por marco.
- **`origenesPresentes`**: lista ordenada de orígenes con al menos un átomo.
- **`totalEvidencias`**: número total de átomos en el store saneado.
- **`requiresHumanValidation: true`**: invariante tipado.

### 4.2 Dimensión diagnóstica (LT1)

LT1 es una sub-rutina interna del MIT, no una etapa de pipeline independiente.
Clasifica los átomos del store por `kind`:

| `kind` del átomo | Grupo LT1 |
|---|---|
| `determinant` | `determinants` |
| `asset` | `assets` |
| `indicator` | `indicators` |
| `qualitative-observation`, `participation` | `qualitativeFindings` |
| `methodological-caution` | `methodologicalCautions` |
| otros | no incluidos en ningún grupo LT1 |

LT1 produce además:
- **`summary`**: párrafo narrativo no causal que describe la base documental.
- **`preliminaryOpportunities`**: orientaciones preliminares heurísticas cuando
  se detectan combinaciones de determinantes y activos, hallazgos participativos
  e indicadores, o cautelas metodológicas sin determinantes.
- **`supportingEvidenceIds`**: IDs de todos los átomos del store.

**Límites de LT1:**
LT1 no establece causalidad. No produce rankings. No prioriza automáticamente.
No concluye cuáles son los problemas más graves del municipio. Su output es
una organización de la evidencia disponible, no un diagnóstico validado.

### 4.3 Áreas de Intervención Territorial (OIT)

OIT es otra sub-rutina interna del MIT. Transforma el resultado de LT1 en
áreas de intervención cuando detecta condiciones suficientes:

| Condición | Área generada |
|---|---|
| `determinants.length > 0` y `assets.length > 0` | Conectar determinantes con activos comunitarios |
| `qualitativeFindings.length > 0` y `indicators.length > 0` | Contrastar hallazgos participativos con indicadores |
| `methodologicalCautions.length > 0` | Revisar cautelas antes de priorizar |
| Ninguna condición cumplida | Área de fallback: ampliar la base de evidencia |

Cada área tiene: `id`, `title`, `rationale`, `relatedEvidenceIds`, `cautions` y
`requiresHumanValidation: true`.

**Límites del OIT:**
Las áreas son heurísticas del sistema. Reflejan posibilidades analíticas,
no compromisos de intervención. No deben traducirse directamente a actuaciones
del Plan de Acción sin pasar por el PSL y la deliberación técnica.

### 4.4 Dimensión longitudinal

La dimensión longitudinal es activa cuando el store contiene átomos con
`provenance.origin === "longi"`. Si está activa, el MIT genera una nota
sobre el número de evidencias longitudinales. Si no hay evidencia longitudinal,
el MIT señala que la interpretación se basa en el estado actual sin contexto
histórico comparativo.

La dimensión longitudinal no es equivalente a la Memoria Longitudinal del
proceso (concepto del dominio pendiente de implementar).

### 4.5 Tensiones estructurales

El MIT detecta heurísticamente las siguientes tensiones:

1. Base documental con cautelas metodológicas y sin determinantes.
2. Activos comunitarios presentes pero sin determinantes documentados.
3. Hallazgos participativos sin respaldo de indicadores cuantitativos.
4. Base documental insuficiente para articular áreas de intervención específicas.

Estas tensiones son señales del sistema, no conclusiones técnicas. Su ausencia
no garantiza que la base documental sea completa; su presencia no garantiza que
el municipio tenga ese problema específico.

### 4.6 Marcos interpretativos

Los marcos interpretativos (EPVSA, ESCA, RELAS, BUENA_EDAD, MAYORES y otros
registrados en `StrategicFrameworkRegistry`) son **guías de lectura**, no
módulos computacionales ejecutables. El MIT los aplica leyendo los elementos
del registro y contabilizando cuántos pertenecen a cada marco. No traduce
automáticamente la evidencia a líneas EPVSA; eso es responsabilidad del motor
EPVSA del Nivel 3, que opera sobre el PSL.

---

## 5. Reconciliación Interpretativa

La Reconciliación es un motor que actúa **entre** el Nivel 2 (MIT) y el Nivel 3
(PSL → Priorización). No forma parte del MIT ni del PSL; es el puente que
determina qué tensiones del MIT tienen suficiente consistencia para convertirse
en Áreas de Intervención Territorial del PSL.

### 5.1 Entradas

- `EstadoTerritorialEvolutivo` producido por el MIT en la ejecución actual.
- `historialEstadosTerritorial`: array de `TerritorialStateRecord`, snapshots
  compactos de estados anteriores del municipio.

### 5.2 Conflictos detectados

El motor detecta cinco tipos de conflicto interpretativo:

| Tipo | Condición de activación |
|---|---|
| `tendencia` | Dimensión longitudinal activa en el estado actual y en el historial |
| `fuente` | Coexistencia de fuentes con escalas o poblaciones distintas (IBSE + Informe de Salud; ciudadanía + técnica) |
| `escala` | IBSE (escala individual) + indicadores poblacionales |
| `temporal` | Cambios significativos entre el estado actual y el anterior (pérdida de determinantes; variación >50% en volumen de evidencia) |
| `interpretativo` | Tensiones estructurales presentes; activos sin determinantes |

Todo conflicto tiene `resolucion: "no-resuelta"`. Este campo es un invariante
tipado: el sistema no puede generar conflictos con cualquier otro valor.

### 5.3 Filtro de Relevancia

Las tensiones estructurales del MIT pasan por un Filtro de Relevancia antes
de ser escaladas. Una tensión es relevante si cumple **≥2 de 3 criterios**:

1. **Impacto estructural potencial**: la tensión menciona determinantes,
   activos, desigualdad, inequidad, vulnerabilidad o contexto territorial.
2. **Persistencia interpretativa**: la tensión conceptualmente similar aparece
   en ≥2 estados históricos, **o** hay ≥2 orígenes gobernados presentes.
3. **Divergencia de fuente significativa**: coexistencia de IBSE e Informe
   de Salud, o de participación ciudadana e indicadores cuantitativos.

Si la tensión no supera el filtro, se clasifica como **ruido estructural** y
no se escala a Área de Intervención Territorial.

### 5.4 Criterios de Escalado

Las tensiones que superan el Filtro de Relevancia se evalúan con tres
criterios adicionales, **todos obligatorios** para el escalado:

1. **Persistencia temporal**: la tensión conceptualmente similar aparece en
   ≥2 estados históricos.
2. **Convergencia de fuentes**: ≥2 orígenes gobernados presentes.
3. **Coherencia estructural**: la tensión menciona estructura sanitaria
   fundamental (determinantes, activos, indicadores, participación,
   desigualdad, vulnerabilidad) y no es la tensión de fallback por base

================================================================
FILE: audit/sprint-0-1-certification-input/contracts/CONTRACT-STRATEGIC-REPOSITORY.md
================================================================
# CONTRACT-STRATEGIC-REPOSITORY

> Contrato del Repositorio Estratégico Territorial de COMPÁS NG.
> Versión 1.1 — Sprint 1 — 2026-06-27

---

## Estado

**Diseño conceptual. No implementar en Sprint 1.**

Este contrato define la estructura, las responsabilidades y los contratos de datos del Repositorio Estratégico Territorial. La implementación se realizará cuando el Motor de Traducción Estratégica esté listo para consumirlo.

---

## Propósito

El Repositorio Estratégico Territorial almacena los recursos normativos, estratégicos y programáticos que sirven de referencia para la elaboración de Planes Locales de Salud.

No es una base de conocimiento general. Es el conjunto de recursos estratégicos que el equipo técnico reconoce como marcos de referencia para su territorio.

---

## Denominaciones canónicas en COMPÁS NG

Los siguientes acrónimos tienen un único significado válido dentro de COMPÁS NG, independientemente de cualquier uso externo al proyecto. El contrato fija estas denominaciones.

| Acrónimo | Denominación oficial canónica |
|---|---|
| ESCA | Estrategia de Salud Comunitaria de Andalucía (2026–2030) |
| RELAS | Red Local de Acción en Salud |
| RELAS-G | Guías metodológicas de la Red Local de Acción en Salud |
| EBE | En Buena Edad |
| PSMA | Plan de Salud Mental de Andalucía |
| PEM | Plan Estratégico de Personas Mayores de Andalucía |
| EPVSA | Estrategia de Promoción de una Vida Saludable en Andalucía |

---

## Recursos que puede albergar

| Recurso | Acrónimo | Tipo |
|---|---|---|
| Estrategia de Salud Comunitaria de Andalucía (2026–2030) | ESCA | Estrategia de salud |
| Red Local de Acción en Salud | RELAS | Marco estratégico-programático |
| Guías metodológicas RELAS | RELAS-G | Guía metodológica |
| En Buena Edad | EBE | Marco programático |
| Plan de Salud Mental de Andalucía | PSMA | Plan estratégico |
| Plan Estratégico de Personas Mayores de Andalucía | PEM | Plan estratégico |
| Estrategia de Promoción de una Vida Saludable en Andalucía | EPVSA | Referencia epidemiológica |
| Otros | — | A determinar por el equipo técnico |

---

## Contrato de datos de un recurso estratégico

```typescript
// Diseño conceptual — no implementar todavía

interface StrategicResource {
  id: string;
  name: string;
  acronym: string;
  type: "strategy" | "strategic-plan" | "epidemiological-reference" | "programmatic-guide" | "normative-framework";
  issuer: string;              // institución emisora
  year: number;
  version?: string;

  lines: StrategicLine[];
  objectives: StrategicObjective[];
  indicators: StrategicIndicator[];
  actions: StrategicAction[];
  programmes: StrategicProgramme[];

  targetPopulation: string[];  // grupos poblacionales diana
  determinants: string[];      // determinantes de salud abordados
  communityAssets: string[];   // activos comunitarios referenciados
  references: string[];        // bibliografía y normativa base

  // Metadatos de carga
  loadedAt: string;
  loadedBy?: string;
  sourceDocumentId?: string;
}

interface StrategicLine {
  id: string;
  code: string;
  title: string;
  description?: string;
}

interface StrategicObjective {
  id: string;
  lineId: string;
  code: string;
  title: string;
  description?: string;
  indicators: string[];  // referencias a StrategicIndicator.id
}

interface StrategicIndicator {
  id: string;
  objectiveId: string;
  title: string;
  measurementUnit?: string;
  baseline?: number;
  target?: number;
}

interface StrategicAction {
  id: string;
  objectiveId: string;
  title: string;
  description?: string;
  targetPopulation?: string[];
}

interface StrategicProgramme {
  id: string;
  title: string;
  description?: string;
  actionIds: string[];
  targetPopulation?: string[];
}
```

---

## Responsabilidades del Repositorio

1. **Almacenar** recursos estratégicos validados por el equipo técnico.
2. **Indexar** líneas, objetivos, indicadores y actuaciones para su recuperación.
3. **Exponer** la estructura a los motores de nivel superior (Motor de Traducción Estratégica).
4. **No inferir** ninguna correspondencia automática entre el PSL y los recursos estratégicos. Esa es la función del Motor de Traducción Estratégica.

---

## Lo que el Repositorio no hace

- No evalúa si un recurso es aplicable al municipio.
- No sugiere actuaciones.
- No pondera objetivos.
- No genera texto narrativo.
- No establece alineaciones automáticas con el PSL.

Toda lógica de aplicación territorial pertenece al Motor de Traducción Estratégica.

---

## Diferencia respecto al MunicipalDocumentRepository

| | MunicipalDocumentRepository | StrategicRepository |
|---|---|---|
| Contenido | Documentos del municipio concreto | Recursos estratégicos supramunicipales |
| Alcance | Específico por municipio | Compartido por todos los municipios |
| Estructura | Documentos sin esquema fijo | Recursos con esquema estructurado |
| Función | Trazabilidad documental | Referencia para traducción estratégica |

---

## Ciclo de vida de un recurso

```
Carga manual por el equipo técnico
    ↓
Revisión de estructura (validación de campos obligatorios)
    ↓
Registro en el Repositorio
    ↓
Disponibilidad para el Motor de Traducción Estratégica
    ↓
[Actualización o sustitución por versión posterior]
```

---

## Referencia cruzada

- Motor de Traducción Estratégica → CONTRACT-STRATEGIC-TRANSLATION.md
- Documentos municipales → CONTRACT-REPOSITORY.md
- Perfil de Salud Local → CONTRACT-MIT-PSL.md

---

*La decisión territorial corresponde siempre al equipo técnico.*

================================================================
FILE: audit/sprint-0-1-certification-input/contracts/CONTRACT-STRATEGIC-TRANSLATION.md
================================================================
# CONTRACT-STRATEGIC-TRANSLATION

> Contrato del Motor de Traducción Estratégica de COMPÁS NG.
> Versión 1.0 — Sprint 1 — 2026-06-27

---

## Estado

**Diseño conceptual. No implementar en Sprint 1.**

Este contrato define el flujo, las responsabilidades y las restricciones del Motor de Traducción Estratégica. La implementación requiere que estén disponibles el PSL validado, las Priorizaciones y el Repositorio Estratégico Territorial.

---

## Propósito

El Motor de Traducción Estratégica (MTE) transforma el diagnóstico territorial validado en un borrador de Plan de Acción alineado con los marcos estratégicos del Repositorio Estratégico Territorial.

No produce planes definitivos. Produce borradores que requieren validación y ajuste por parte del equipo técnico.

---

## Flujo canónico

```
PSL validado
    ↓
Priorizaciones (temas seleccionados por el equipo técnico)
    ↓
Repositorio Estratégico Territorial
    ↓
Motor de Traducción Estratégica
    ↓
Borrador de Plan de Acción
    ↓
Revisión y validación técnica
    ↓
Plan de Acción aprobado
```

Ningún paso puede saltarse. El MTE no puede consumir un PSL sin validar.

---

## Contrato de entrada

```typescript
// Diseño conceptual — no implementar todavía

interface StrategicTranslationInput {
  psl: LocalHealthProfile;                       // PSL en estado "validated" o "approved"
  prioritization: PSLPriorizacion;               // temas priorizados por el equipo técnico
  strategicRepository: StrategicRepository;      // recursos disponibles para alineación
  municipalityContext: MunicipalContext;          // contexto del municipio
}
```

**Precondiciones obligatorias:**

1. `psl.status` debe ser `"validated"` o `"approved"`. El MTE rechaza PSLs en estado `"generated"` o `"review"`.
2. `prioritization` debe contener al menos un tema prioritario seleccionado.
3. `strategicRepository` debe contener al menos un recurso estratégico cargado.

---

## Contrato de salida

```typescript
// Diseño conceptual — no implementar todavía

interface StrategicTranslationOutput {
  municipalityId: MunicipalityId;
  generatedAt: string;
  pslVersion: string;

  alignments: StrategicAlignment[];           // correspondencias detectadas
  proposedActions: ProposedAction[];          // acciones candidatas
  unaddressedPriorities: string[];            // prioridades sin recursos estratégicos identificados

  derivationTrace: StrategicDerivationTrace; // trazabilidad completa
  requiresHumanValidation: true;
  validationWarnings: string[];
}

interface StrategicAlignment {
  priorityTopic: string;
  resourceId: string;                         // recurso del repositorio
  lineId?: string;
  objectiveId?: string;
  alignmentStrength: "direct" | "thematic";
  rationale: string;
}

interface ProposedAction {
  id: string;
  title: string;
  priorityTopic: string;
  alignedObjectiveId?: string;
  alignedActionId?: string;
  sourceRationale: string;
  targetPopulation?: string[];
  requiresHumanValidation: true;
}
```

---

## Responsabilidades del Motor

1. **Identificar** correspondencias entre los temas priorizados del PSL y los recursos del Repositorio Estratégico.
2. **Proponer** acciones candidatas derivadas de esas correspondencias.
3. **Señalar** las prioridades del PSL que no tienen correspondencia en el Repositorio.
4. **Trazar** de forma completa y auditable el origen de cada propuesta.
5. **Marcar** toda salida como `requiresHumanValidation: true`.

---

## Restricciones explícitas

El Motor de Traducción Estratégica **no puede**:

1. Generar un Plan de Acción definitivo sin validación técnica humana.
2. Ponderar automáticamente la importancia de los recursos estratégicos.
3. Descartar prioridades del PSL porque no tengan recursos identificados.
4. Inferir que una acción del Repositorio es obligatoria para el municipio.
5. Producir texto narrativo sin que el equipo técnico lo revise y apruebe.
6. Establecer plazos, responsables o presupuestos sin intervención humana.

**Invariante de no sustitución:**

> Ninguna salida del Motor de Traducción Estratégica puede presentarse como decisión territorial. Todo output es una propuesta que requiere validación, ajuste y aprobación por parte del equipo técnico municipal o autonómico responsable.

Este invariante debe estar presente en toda interfaz que muestre resultados del MTE.

---

## Trazabilidad

Cada propuesta del MTE incluye una cadena de trazabilidad completa:

```
Átomo de evidencia (EvidenceStore)
    ↑
Capítulo del PSL
    ↑
Tema priorizado (Priorizaciones)
    ↑
Correspondencia estratégica (Repositorio Estratégico)
    ↑
Acción propuesta (Output del MTE)
```

Toda propuesta sin trazabilidad completa es inválida.

---

## Diferencia respecto a las inferencias del MIT

| | MIT (Motor Interpretación Territorial) | MTE (Motor Traducción Estratégica) |
|---|---|---|
| Entrada | EvidenceStore | PSL validado + Repositorio Estratégico |
| Salida | LT1, OIT, PSL borrador | Borrador de Plan de Acción |
| Nivel | Diagnóstico | Planificación |
| Comparación | Interna (muestra municipal) | Externa (marcos normativos) |

---

## Referencia cruzada

- Repositorio Estratégico → CONTRACT-STRATEGIC-REPOSITORY.md
- PSL → CONTRACT-MIT-PSL.md
- Plan de Acción → CONTRACT-ACTION-PLAN.md
- EvidenceStore → CONTRACT-EVIDENCE.md

---

*La decisión territorial corresponde siempre al equipo técnico.*

================================================================
FILE: audit/sprint-0-1-certification-input/contracts/CONTRACT-ACTION-PLAN.md
================================================================
# COMPÁS NG — Contrato del Nivel 3: Priorización, Traducción Estratégica y Plan de Acción

> Documento normativo permanente.
> Define el comportamiento garantizado, los invariantes y los límites del
> bloque de decisión del Nivel 3 en COMPÁS NG: Priorización técnica,
> Motor de Traducción Estratégica, Plan de Acción, Agenda tipo y Seguimiento.
> No debe modificarse sin revisión explícita y deliberada.
> Última revisión: 2026-06-24

---

## 1. Propósito

Este contrato establece el comportamiento del **Nivel 3** de COMPÁS NG: el
conjunto de motores que transforman el Perfil de Salud Local (PSL) validado
en propuestas técnicas estructuradas que el equipo de salud pública puede
revisar, ajustar y validar antes de formalizarlas institucionalmente.

El Nivel 3 no toma decisiones. Genera borradores técnicos. Toda propuesta
del Nivel 3 requiere validación humana explícita antes de poder constituir
un compromiso institucional o una actuación municipal.

---

## 2. Alcance

Este contrato regula los siguientes objetos y motores:

| Motor / Objeto | Entrada | Salida |
|---|---|---|
| `PrioritizationEngine` | `LocalHealthProfile` | `PrioritizationResult` |
| `StrategicTranslationEngine` (`EPVSATranslator` en código actual) | `PrioritizationResult` | `StrategicTranslationResult` (`EPVSATranslationResult` en código actual) |
| `ActionPlanEngine` | `StrategicTranslationResult` + frameworks + `LocalHealthProfile` | `ActionPlanDraft` |
| `AgendaEngine` | `ActionPlanDraft` | `AgendaDraft` |
| `MonitoringEngine` | `AgendaDraft` | `MonitoringDraft` |

Los stages `evaluation` y `compiler` están declarados en `PipelineStage`
pero **no tienen implementación activa en el runtime**. No generan ningún
output en la ejecución actual y quedan fuera del alcance operativo de este
contrato (véase §14).

---

## 3. Posición en el pipeline

```
EvidenceStore (saneado por IntegrityGuard)
    └─▶ MIT → EstadoTerritorialEvolutivo
            └─▶ ReconciliacionInterpretativa
                    └─▶ PSL (LocalHealthProfile)  ←── único puente autorizado
                            │
                    ┌───────┴────────────────────────────────────┐
                    │               NIVEL 3                      │
                    ▼                                            │
            PrioritizationEngine                                 │
                    │                                            │
                    ▼                                            │
            StrategicTranslationEngine                           │
                    │                                            │
                    ▼                                            │
            ActionPlanEngine ◄── PSL (PSLReference) ────────────┘
                    │
                    ▼
            AgendaEngine
                    │
                    ▼
            MonitoringEngine
```

**Regla PSL-C1 (obligatoria en todo el Nivel 3):** ningún motor del Nivel 3
puede consumir directamente `LT1Result`, `OITResult`, `EstadoTerritorialEvolutivo`
ni `ReconciliacionResult`. La única fuente autorizada es el PSL.

---

## 4. Trazabilidad de la cadena completa

La trazabilidad de cada elemento del Nivel 3 puede rastrearse hasta su origen
de evidencia mediante la cadena siguiente:

```
MonitoringItem.agendaItemId
    └─▶ AgendaItemDraft.linkedActionId
            └─▶ ActionPlanAction.linkedObjectiveId
                    └─▶ ActionPlanObjective.linkedStrategicLine  (EPVSA)
                            └─▶ StrategicLineSuggestion.candidatePriorityId
                                    └─▶ CandidatePriority.sourceAreaId
                                            └─▶ PSLAreaIntervencion.id
                                                    └─▶ relatedEvidenceIds[]
                                                            └─▶ EvidenceAtom.id
                                                                    └─▶ provenance.documentId
                                                                            └─▶ MunicipalDocument
```

Esta cadena es **completa y verificable**. Ningún objeto del Nivel 3 puede
existir sin un origen trazable en el EvidenceStore a través del PSL.

---

## 5. Entradas del Nivel 3

### 5.1 PSL como puente obligatorio

El `LocalHealthProfile` es la única entrada autorizada para iniciar el Nivel 3.
El motor de Priorización consume `psl.areasDeIntervencion` directamente.
El motor de Plan de Acción recibe adicionalmente una `PSLReference` (snapshot
ligero del estado del PSL en el momento de generación del plan).

### 5.2 Marcos estratégicos

Los marcos interpretativos del registro (`StrategicFrameworkRegistry`) son
consultados por el motor de Plan de Acción para construir `FrameworkAlignment`.
Los marcos actuales registrados son: EPVSA, ESCA, MAYORES, BUENA_EDAD, RELAS.

**Regla MTE-1 — EPVSA no es el único marco estratégico.** La EPVSA es un marco central, pero no exclusivo. El Motor de Traducción Estratégica debe considerar de forma explícita otros marcos oficiales pertinentes, incluyendo al menos ESCA y el Plan Estratégico Integral para Personas Mayores de Andalucía 2020–2023 y sus documentos asociados, cuando el PSL contenga hallazgos relacionados con salud comunitaria, activos, participación, intersectorialidad, envejecimiento, fragilidad, autonomía, soledad no deseada o participación social.

**Regla MTE-2 — Registro de marcos estratégicos.** Los marcos estratégicos deben tratarse como un registro versionado y consultable (`StrategicFrameworkRegistry`), no como lógica rígida codificada en el motor. Cada marco debe poder declarar líneas, objetivos, indicadores, palabras clave, poblaciones diana, determinantes relacionados, vigencia, fuente documental y cautelas de uso.

**Regla MTE-3 — Traducción sin decisión automática.** El Motor de Traducción Estratégica propone alineaciones entre áreas del PSL y marcos oficiales. No selecciona prioridades, no aprueba líneas, no impone objetivos ni activa indicadores sin deliberación humana.



### StrategicFrameworkRegistry (contrato conceptual)

El `StrategicFrameworkRegistry` constituye el catálogo versionado de marcos
estratégicos utilizados por el Motor de Traducción Estratégica.

Cada marco registrado deberá poder declarar, como mínimo:

- identificador único;
- nombre oficial;
- versión y vigencia;
- documento(s) fuente;
- líneas estratégicas;
- objetivos;
- indicadores;
- poblaciones diana;
- determinantes relacionados;
- palabras clave o conceptos asociados;
- cautelas metodológicas.

El registro es una infraestructura de conocimiento y no implica que todos sus
elementos se apliquen automáticamente a cada Perfil de Salud Local.


Estos marcos son **guías de lectura institucional**, no motores computacionales.
Su inclusión en el plan es orientativa y requiere revisión técnica antes de
cualquier formalización.

---

## 6. Priorización técnica (`PrioritizationEngine`)

### 6.1 Propósito

Transforma las áreas de intervención territorial del PSL en candidaturas a
priorización. Una candidatura es una propuesta del sistema para que el equipo
técnico considere, valide o descarte.

### 6.2 Reglas de generación

- Una candidata por área de intervención territorial (`PSLAreaIntervencion`).
- El título de la candidata es el título del área.
- El `sourceAreaId` preserva el enlace con el área del PSL de origen.
- El `rationale` indica que la candidata deriva de un área de intervención
  territorial del PSL y debe revisarse técnicamente.
- Los `cautions` se heredan de `area.cautions`.
- Los `relatedEvidenceIds` se heredan de `area.relatedEvidenceIds`.

### 6.3 Criterios de revisión expuestos al equipo

El motor proporciona cuatro criterios orientativos para que el equipo los
aplique al revisar las candidaturas:

1. Magnitud o relevancia territorial sugerida por la evidencia.
2. Posibilidad de intervención desde el ámbito local.
3. Existencia de activos comunitarios o capacidades institucionales relacionadas.
4. Necesidad de validación técnica, política y comunitaria antes de decidir.

Estos criterios no ponderan automáticamente las candidatas ni las ordenan
por importancia. Son orientaciones para la deliberación humana.

### 6.4 Lo que la Priorización no hace

- No ordena las candidatas por prioridad.
- No descarta ninguna candidata automáticamente.
- No traduce las candidatas a líneas estratégicas EPVSA.
- No constituye la priorización formal del municipio.
- No sustituye el proceso participativo con la ciudadanía.

---

## 7. Motor de Traducción Estratégica (`StrategicTranslationEngine`; `EPVSATranslator` en código actual)

### 7.1 Propósito

Sugiere, de forma prudente, una línea estratégica de la EPVSA 2024–2030 para
cada candidata de priorización. El resultado es una sugerencia de encaje, no
una asignación definitiva.

### 7.2 Líneas estratégicas disponibles

| Código | Nombre |
|---|---|
| `LE1` | Acción local en salud y comunidad |
| `LE2` | Entornos y estilos de vida saludables |
| `LE3` | Equidad, determinantes sociales y vulnerabilidades |
| `LE4` | Gobernanza, evaluación y conocimiento para la salud |
| `pending-review` | Pendiente de revisión técnica (fallback) |

### 7.3 Mecanismo de inferencia: heurística de palabras clave

La inferencia opera sobre una concatenación del `title` y el `rationale` de
cada candidata, normalizada a minúsculas. Las palabras clave de cada línea son:

| Línea | Palabras clave activadoras (extracto) |
|---|---|
| LE1 | activo, comunitario, participación, ciudadanía, red |
| LE2 | alimenta, actividad física, bienestar emocional, salud mental, consumo, entorno, estilo de vida, hábito |
| LE3 | determinante, desigualdad, vulnerabilidad, renta, empleo, vivienda |
| LE4 | indicador, evaluación, seguimiento, cautela, metodológica |

Si ninguna palabra clave activa una línea, la candidata recibe `pending-review`.

**Esta heurística es textual, no semántica.** Una candidata puede recibir una
línea incorrecta si su texto no contiene las palabras clave pertinentes. La
asignación final debe revisarse técnicamente e institucionalmente por el equipo.

### 7.4 Cautelas del motor EPVSA

El motor produce cuatro cautelas generales invariables:

1. La traducción EPVSA es orientativa y no sustituye deliberación técnica,
   institucional ni comunitaria.
2. Una misma prioridad puede relacionarse con más de una línea estratégica.
3. No debe usarse esta traducción como selección automática de líneas EPVSA.
4. La asignación final debe revisar políticas autonómicas, competencias locales,
   activos disponibles y factibilidad.

### 7.5 Lo que la traducción EPVSA no hace

- No valida que la candidata sea coherente con la línea asignada.
- No comprueba si el municipio tiene competencia sobre la línea asignada.
- No establece que la línea asignada sea la única relevante.
- No sustituye el conocimiento institucional del equipo técnico.

---

## 8. Plan de Acción (`ActionPlanEngine`)

### 8.1 Propósito

Transforma el resultado de la traducción EPVSA en un borrador inicial de
Plan de Acción con objetivos, actuaciones e indicadores preliminares, todos
trazables al PSL de origen mediante `PSLReference`.

### 8.2 `PSLReference`: trazabilidad al PSL de origen

`PSLReference` es un snapshot ligero del estado del PSL en el momento de
generación del plan. Contiene:

================================================================
FILE: audit/sprint-0-1-certification-input/contracts/CONTRACT-COMPILER.md
================================================================
# COMPÁS NG — Contrato del Compilador del Plan Local de Salud

> Documento normativo permanente.
> Define la posición arquitectónica, los gates obligatorios, los límites y
> los criterios de implementación futura del stage `compiler` en COMPÁS NG.
> Este stage está **declarado pero sin implementación activa en el runtime**.
> No debe modificarse sin revisión explícita y deliberada.
> Última revisión: 2026-06-24

---

## 1. Propósito

El **Compilador del Plan Local de Salud** es el último stage del pipeline de
COMPÁS NG. Su función futura es ensamblar y exportar el Plan Local de Salud
de un municipio como documento institucional, a partir de los objetos
validados de los niveles anteriores del sistema.

El compilador no analiza evidencia, no genera propuestas ni produce
interpretaciones analíticas. Es un **motor de exportación documental**:
toma como entradas los productos ya validados por el equipo técnico y los
organiza en un artefacto exportable con estructura, formato y trazabilidad
verificables.

---

## 2. Estado actual: reserva arquitectónica

El stage `compiler` está declarado en el sistema pero **no tiene
implementación activa**:

- Existe como valor del tipo `PipelineStage`
  (`domain/pipeline/CompasPipeline.ts`).
- Tiene una etiqueta de visualización ("Compilador") en `PipelineTracePanel`.
- **No existe ningún motor, función ni clase** que lo ejecute en
  `MunicipalityRuntime`.
- **No aparece en la traza de ejecución** que el runtime genera en cada
  sesión.
- **No produce ningún output** en el pipeline actual.

El ROADMAP lo clasifica explícitamente fuera del alcance hasta nueva
decisión:

> «Compilador del Plan Local de Salud: producto documental compilado a
> partir del Plan de Acción validado. El Plan de Acción actual es un
> borrador técnico, no el PLS definitivo.»

Ninguna funcionalidad activa del sistema depende de este stage.

---

## 3. Distinción fundamental: Plan de Acción ≠ Plan Local de Salud compilado

Esta distinción es el fundamento del contrato. Son dos objetos distintos
en niveles distintos del sistema:

| Concepto | Naturaleza | Estado actual |
|---|---|---|
| `ActionPlanDraft` | Borrador técnico del Nivel 3. Objetivos, actuaciones e indicadores preliminares. Requiere validación humana | Implementado |
| Plan Local de Salud compilado | Documento institucional exportable. Producto del stage `compiler`. Requiere PSL aprobado y plan validado como gate | No implementado |

El Plan de Acción **no es** el Plan Local de Salud. El Plan Local de Salud
compilado es el producto documental final del proceso de planificación, que
integra el diagnóstico territorial (PSL), las decisiones de priorización,
las actuaciones validadas, la agenda y el seguimiento en un único artefacto
exportable.

---

## 4. Posición en el pipeline

```
Nivel 1: EvidenceStore (IntegrityGuard)
    └─▶ Nivel 2: MIT → Reconciliación → PSL
            └─▶ Nivel 3: Priorización → EPVSA → Plan de Acción → Agenda → Seguimiento
                    │
                    │   (gates obligatorios — véase §6)
                    │
                    ▼
            stage: compiler  ◄── RESERVA ARQUITECTÓNICA (sin implementación activa)
                    │
                    ▼
            Plan Local de Salud compilado
            (artefacto exportable institucional)
```

El compilador es el punto terminal del pipeline. Ningún motor posterior
consume su output dentro del sistema. Su salida está destinada a ser
exportada y preservada fuera de COMPÁS NG como documento institucional.

---

## 5. Entradas futuras mínimas

Antes de que el compilador pueda ejecutarse, deben existir y estar
validados los siguientes objetos:

### 5.1 PSL en estado `"approved"`

El ciclo de vida del `LocalHealthProfile` define el estado `"approved"` como
la condición de aprobación institucional del Perfil de Salud Local, posterior
a `"validated"`. Sus metadatos asociados son:
- `approvedAt: string` — fecha de aprobación.
- `approvedBy: string` — responsable institucional de la aprobación.
- Condición necesaria según el dominio: capítulo VII (`priorizacionStatus`)
  en estado `"complete"` (deliberación y consenso documentados).

**La transición `validated → approved` no tiene implementación activa en la
UI.** El tipo y los campos existen en `LocalHealthProfile`, pero ningún
handler en la capa de aplicación ejecuta esta transición actualmente.

### 5.2 Plan de Acción revisado técnicamente

El `ActionPlanDraft` generado por el Nivel 3, revisado por el equipo técnico
con responsables, calendarios y recursos asignados. El borrador técnico
producido automáticamente no es suficiente; se requiere validación explícita.

### 5.3 Agenda revisada

El `AgendaDraft` con distribución trimestral ajustada a ciclos municipales
reales, responsables concretos y condiciones de ejecución definidas.

### 5.4 Seguimiento inicial

El `MonitoringDraft` con el estado inicial de las actuaciones y los campos
requeridos completados por el equipo.

### 5.5 Fuentes trazables

El compilador debe poder acceder a la cadena de trazabilidad completa que
conecta cada elemento del Plan Local de Salud con su origen en el
`EvidenceStore` a través del PSL. Sin esta trazabilidad, el documento
compilado no puede afirmar que sus contenidos son verificables.

---

## 6. Gates obligatorios

Los siguientes gates deben cumplirse **todos** antes de que el stage
`compiler` pueda activarse. Son condiciones previas, no recomendaciones:

| Gate | Condición | Estado actual en el sistema |
|---|---|---|
| G-C1 | PSL en estado `"approved"` | Estado definido en el tipo; sin transición implementada en UI |
| G-C2 | `priorizacion.consensoDocumentado === true` | Implementado: `handleDocumentarDeliberacion` en App.tsx |
| G-C3 | `priorizacionStatus === "complete"` | Implementado: se activa al documentar el consenso |
| G-C4 | Capítulos V y VI del PSL en estado `"authored"` | Implementado: `PSLChapterEditor` en UI |
| G-C5 | Plan de Acción técnicamente revisado | Sin mecanismo de validación formal implementado |
| G-C6 | Agenda con responsables y calendarios reales asignados | Sin mecanismo de asignación implementado |
| G-C7 | El PSL no está obsoleto (`pslIsStale === false`) | Implementado: detectado en `MunicipalityRuntime` |

El gate G-C1 es el más crítico y actualmente el menos avanzado en
implementación. Los gates G-C5 y G-C6 requieren diseño previo de los
flujos de validación del Nivel 3. Hasta que exista ese mecanismo formal,
este gate bloquea cualquier activación del compiler.

---

## 7. Salidas futuras

### 7.1 Artefacto principal

El compilador producirá un único artefacto por ejecución:

```
Plan Local de Salud de [Nombre del municipio]
Período: [período de planificación, p. ej. 2027–2030]
```

### 7.2 Estructura mínima del artefacto

El Plan Local de Salud compilado debe incluir, como mínimo, los mismos
capítulos del PSL enriquecidos con los elementos del Nivel 3:

| Capítulo | Contenido | Origen |
|---|---|---|
| I | Marco Estratégico | PSL Cap. I + marcos registrados |
| II | Informe de Salud | PSL Cap. II (referencia al documento fuente) |
| III | Diagnóstico integrado | PSL Cap. III |
| IV | Interpretación territorial | PSL Cap. IV |
| V | Conclusiones | PSL Cap. V (texto de autoría humana) |
| VI | Recomendaciones | PSL Cap. VI (texto de autoría humana) |
| VII | Priorización y consenso | PSL Cap. VII + consenso documentado |
| VIII | Plan de Acción | Objetivos, actuaciones e indicadores revisados |
| IX | Agenda | Distribución temporal validada |
| X | Seguimiento | Ítems de seguimiento con estado inicial |

### 7.3 Formatos posibles

Los formatos de exportación a considerar en el diseño futuro son:
- **DOCX**: editable por el equipo técnico para revisión final.
- **PDF**: para distribución institucional y archivo.
- **HTML institucional**: para publicación web con estructura navegable.

El formato definitivo debe decidirse con el equipo institucional antes de
implementar el motor.

### 7.4 Trazabilidad en el artefacto

El documento compilado debe incluir, de forma explícita o en anexo:
- Fecha de generación y versión del sistema.
- ID y estado del PSL que lo originó.
- Lista de fuentes documentales del repositorio que contribuyeron al
  diagnóstico.
- Estado de validación de cada sección.
- Nota clara de que el documento requiere aprobación institucional antes
  de su uso oficial.

---

## 8. Invariantes

**I-C1 — El compilador no analiza evidencia**

El compilador no ejecuta el IntegrityGuard, no procesa el `EvidenceStore`,
no genera `EvidenceAtom` y no produce ningún output analítico. Su función
es exclusivamente de ensamblaje y exportación documental.

**I-C2 — El compilador no genera PSL**

El compilador recibe el PSL como entrada ya existente y validada. No crea
ni modifica el PSL. Un PSL no puede ser generado durante la ejecución del
compilador.

**I-C3 — El compilador no prioriza**

Las prioridades municipales deben estar decididas antes de activar el
compilador. El compilador las registra y exporta; no las calcula ni las
sugiere.

**I-C4 — El compilador no decide institucionalmente**

El documento compilado es una propuesta técnica de exportación, no una
decisión institucional. La aprobación institucional del Plan Local de Salud
es un acto humano externo al sistema. El compilador no puede aprobar el
documento que produce.

**I-C5 — El compilador requiere PSL aprobado, no solo validado**

`"validated"` es la condición mínima para el Nivel 3 (Plan de Acción,
Agenda, Seguimiento). El compilador requiere `"approved"`: una condición
superior que implica deliberación, consenso documentado y aprobación
institucional explícita.

**I-C6 — El documento compilado no modifica el workspace**

La ejecución del compilador no altera el `EvidenceStore`, el repositorio
documental, el PSL ni ningún otro objeto del workspace. Es una operación
de solo lectura que produce un artefacto externo.

**I-C7 — El documento compilado preserva la trazabilidad**

Cada elemento del Plan Local de Salud compilado debe ser trazable hasta
su origen en la cadena de evidencia. Un compilador que no pueda garantizar
esta trazabilidad no cumple el contrato.

**I-C8 — El compilador no es el stage `evaluation`**

`evaluation` y `compiler` son stages distintos del pipeline. La evaluación
de impacto (comparación pre/post intervención) es una actividad posterior

================================================================
FILE: audit/sprint-0-1-certification-input/VISUAL-CONTRACT.md
================================================================
# COMPÁS NG — Contrato de Identidad Visual

> Contrato arquitectónico de producto. No es una guía CSS ni un catálogo de componentes.
> Define la identidad institucional de COMPÁS NG y los principios visuales permanentes
> que deben respetarse en cualquier interfaz, cuaderno, informe o documentación.
> Los valores de color, tipografía y composición son la expresión material de estos
> principios, no reglas técnicas de implementación.
> Última revisión: 2026-06-27 — Sprint 0 cierre definitivo: referencias institucionales añadidas, §5 gramática visual de capas, §11 LocalHealthPlanningCycle, §12 componentes pendientes.

---

## Naturaleza de este documento

Este documento es un **contrato de identidad institucional**, no una guía de estilos CSS.

Establece qué debe transmitir visualmente COMPÁS NG y qué no. Define principios permanentes
que evolucionarán junto con la plataforma pero nunca se abandonarán.

La implementación concreta de estos principios (valores CSS, nombres de clase, estructura de componentes)
está en `src/App.css` y los componentes de `src/ui/components/`. Esos ficheros son la
traducción técnica de este contrato; no lo definen ni lo sustituyen.

---

## 0. Referencias institucionales

El diseño visual de COMPÁS NG se inspira en dos referencias institucionales canónicas:

### NHS Health Profiles (England)

Los NHS Local Health Profiles de Public Health England son el modelo de referencia
para la presentación de datos de salud territorial. Sus características visuales
son aplicables a COMPÁS NG:

- Alta densidad informativa en espacio compacto
- Tipografía como elemento estructural primario
- Tablas y bloques de datos en lugar de charts decorativos
- Indicadores simples (colores binarios: favorable / desfavorable)
- Presentación editorial, no de dashboard
- El documento de datos parece un documento institucional, no una aplicación

### Formularios REDCap

REDCap es el sistema de captura de datos habitual en los Estudios Complementarios.
Sus principios de presentación de formularios son aplicables a las interfaces de
revisión y validación de COMPÁS NG:

- Formulario estructurado con campos etiquetados
- Estado visible de cumplimentación por sección
- Jerarquía de grupos → campos → validación
- Sin decoración innecesaria; el formulario es el contenido

### Lo que NO es COMPÁS NG

COMPÁS NG no es ninguna de estas cosas:

- **No es SaaS**: no tiene features, plans, dashboards ni onboarding.
- **No es producto IA**: no tiene chat, copilot widget ni sugerencias animadas.
- **No es aplicación React**: no tiene tarjetas flotantes, gradientes de fondo ni transiciones de showcase.
- **No es dashboard corporativo**: no tiene KPIs circulares, barras de progreso decorativas ni métricas de vanidad.

Si la interfaz en algún momento recuerda a cualquiera de estos cuatro tipos, ese
elemento debe revisarse antes de mergear.

---

## 1. Principio rector

COMPÁS NG es una herramienta institucional de salud pública. Su apariencia visual debe
transmitir **rigor, confianza y claridad documental**.

La identidad visual es institucional y sobria. COMPÁS NG no es una aplicación de consumo,
no es una startup y no es un prototipo experimental. Cualquier elemento visual que evoque
esas categorías debe eliminarse.

### Test de identidad

COMPÁS NG debe reconocerse como tal aunque desaparezcan todos los textos. Si eliminar
todos los textos hace que la interfaz sea indistinguible de un dashboard SaaS genérico,
la identidad visual es insuficiente.

---

## 2. Paleta de color

### Gradiente institucional COMPÁS

```
linear-gradient(90deg,
  #0074c8  0%,
  #00acd9 20%,
  #94d40b 40%,
  #ffb61b 60%,
  #ff6600 80%,
  #dc143c 100%)
```

**Uso autorizado:** franja de identidad en cabeceras principales, portadas de cuadernos,
bordes decorativos de fichas técnicas e informes institucionales.

**Uso prohibido:** fondos de pantalla completa, fondos de cards, elementos interactivos,
textos, iconos.

### Colores primarios

| Token | Valor | Uso |
|---|---|---|
| Azul institucional | `#0074c8` | Acento primario, enlaces activos |
| Azul claro | `#00acd9` | Acento secundario, destacados |
| Verde salud | `#94d40b` | Indicadores positivos, confirmaciones |
| Ámbar | `#ffb61b` | Alertas, cautelas metodológicas |
| Naranja | `#ff6600` | Prioridades, énfasis de acción |
| Rojo | `#dc143c` | Errores, indicadores críticos |

### Neutros

| Uso | Valor |
|---|---|
| Fondo principal | `#f8fafc` |
| Fondo secundario | `#f1f5f9` |
| Bordes | `#e2e8f0` |
| Texto principal | `#1e293b` |
| Texto secundario | `#64748b` |
| Blanco | `#ffffff` |

---

## 3. Tipografía

- **Jerarquía clara**: h1 → h2 → h3 → cuerpo con diferenciación visible entre niveles.
- **Sin fuentes decorativas**: solo tipografía del sistema o fuentes sans-serif neutras.
- **Cuerpo legible**: tamaño mínimo 14 px en pantalla, interlineado generoso (1.5–1.6).
- **Peso semibold** para títulos de panel y etiquetas institucionales.
- **Mayúsculas pequeñas** (`eyebrow`) solo para epígrafes de sección, nunca en cuerpo.
- **Monospace** exclusivamente para código, identificadores técnicos y valores de datos.

---

## 4. Composición y densidad visual

- Predominio de **blanco y grises claros** como fondo dominante.
- **Baja densidad visual**: espacio en blanco generoso, márgenes amplios.
- Los paneles de contenido tienen fondo blanco sobre fondo de página gris muy claro.
- Los cards no usan sombras pronunciadas: máximo `box-shadow` sutil (1–2 px, opacidad baja).
- El color se usa **de forma contenida**: un acento por componente, no múltiples colores
  compitiendo.
- Las listas de documentos y evidencias usan separadores finos, no franjas de color.

---

## 5. Gramática visual de las capas del conocimiento

COMPÁS NG trabaja con seis capas conceptuales distintas. La interfaz debe
representar visualmente estas capas de forma que el usuario pueda distinguirlas
sin ambigüedad. Esta distinción no es estética: es epistémica.

### 5.1 Documento (Capa 1)

**Qué representa**: fuente primaria original preservada en el repositorio.

**Tratamiento visual**:
- Identificado con el tipo canónico ("Informe de Salud", "Estudio complementario",
  "Activo comunitario") como etiqueta primaria.
- Badge "Documento fuente principal" para el Informe de Salud.
- El texto completo del documento fuente no se muestra directamente; se accede
  a través de un acordeón o visor con indicación explícita de su naturaleza
  primaria.
- Nunca mezclado con unidades de evidencia derivadas.

### 5.2 Evidencia (Capa 2)

**Qué representa**: representación estructurada de contenidos del documento,
en forma de `EvidenceAtom`.

**Tratamiento visual**:
- Presentada en sección separada del repositorio documental ("Evidencias
  estructuradas"), nunca en la misma lista que los documentos.
- Identificada por su tipo semántico (Indicador, Determinante, Activo
  comunitario, etc.), no por su estructura técnica interna.
- Acompañada de su fuente de origen en lenguaje institucional
  ("Informe de Salud", "IBSE", "Participación ciudadana"), nunca de
  identificadores técnicos internos (`health-report`, `ibse`, etc.).
- No muestra campos técnicos de implementación (`provenance.documentId`,
  `requiresHumanValidation`) en la vista normal del usuario.

### 5.3 Interpretación (Capa 3)

**Qué representa**: lectura estructurada del conjunto de evidencia,
producida por el MIT y la Reconciliación.

**Tratamiento visual**:
- Presentada en la pestaña "Análisis territorial", separada del repositorio.
- Siempre acompañada de indicación de que requiere revisión técnica.
- Los resultados de interpretación (lectura territorial, áreas de
  intervención) se muestran antes que el estado del proceso interno.
- Los términos técnicos del motor (MIT, LT1, OIT, MIR) no aparecen en
  la interfaz principal. Se usan lenguaje institucional equivalente.

### 5.4 Hipótesis y deliberación (Capas 4–5)

**Qué representa**: proposiciones técnicas y proceso de consenso.

**Tratamiento visual**:
- Las propuestas asistidas del sistema (candidaturas técnicas, sugerencias
  de priorización) llevan siempre el badge "Propuesta asistida · Pendiente
  de revisión técnica" o equivalente.
- El espacio de deliberación (capítulos V, VI, VII del PSL) se distingue
  visualmente del contenido generado mediante la zona de edición del equipo
  técnico.
- Nunca se presenta una propuesta asistida como si fuera el resultado de
  una deliberación ya realizada.

### 5.5 Decisión institucional (Capa 6)

**Qué representa**: compromisos formales validados institucionalmente.

**Tratamiento visual**:
- El estado `validated` del PSL se representa con indicador visual diferenciado
  (fondo, borde o etiqueta de validación con nombre y fecha del responsable).
- Los paneles del Nivel 3 (EPVSA, Plan de Acción, Agenda, Seguimiento) están
  visualmente bloqueados hasta que el PSL está validado.
- Un PSL en estado `generated` nunca tiene apariencia de documento aprobado.

### 5.6 Principio de separación visual

La interfaz de COMPÁS NG debe impedir que el usuario confunda:

- un documento fuente con una unidad de evidencia derivada;
- una lectura asistida del sistema con un diagnóstico técnico validado;
- una propuesta de priorización con una decisión deliberada;
- un borrador técnico con un Plan de Acción aprobado.

Cuando exista ambigüedad visual entre capas, debe resolverse siempre
a favor de la mayor cautela: marcar como provisional, no como definitivo.

---

## 6. Elementos prohibidos

Los siguientes elementos están explícitamente excluidos del sistema visual de COMPÁS NG:

- Gradientes como fondos de pantalla o de cards.
- Animaciones de entrada/salida llamativas (fade-in largo, slide-up, bounce).
- Iconos decorativos sin función semántica.
- Colores de acento múltiples en un mismo componente.
- Tipografía de display o editorial.
- Estilos que recuerden a dashboards de BI, herramientas SaaS o apps móviles de consumo.
- Badges, pills o etiquetas en colores saturados como decoración.
- Efectos de glassmorphism, neumorphism o similares.

---

## 7. Animaciones y transiciones

Las animaciones solo están justificadas cuando **aportan significado funcional**:

- Indicar que un proceso está en curso (spinner de carga, indicador de progreso).
- Confirmar que una acción se ha completado (transición de estado suave).
- Orientar la atención del usuario hacia un cambio de estado relevante.

