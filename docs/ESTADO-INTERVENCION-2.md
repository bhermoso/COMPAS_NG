# Estado de la Intervención 2 — Unificación documental del Perfil de Salud Local

**Fecha de cierre parcial:** 2026-07-15
**Último commit:** 4fc5eba · rama master, sincronizada con origin

## Objetivo de la intervención

Un solo modelo canónico del Perfil (I-LHPM-8, Art. 17 bis del contrato
metodológico v1.1): pantalla, visor, DOCX, PDF e impresión sirven el mismo
documento. Se elimina la triple composición detectada en la Fase 0
(lectura canónica en pantalla / capítulos legados / export propio).

## Completado

**Paso 1 (f0d3525).** El artefacto PSL-C congela un documento canónico
sellado: tipo `PSLCSealedCanonicalDocument` (schemaVersion 2, payload
serializado, canonicalHash con prefijo `pslc-`) + instantánea de
DiagnosticAnswers como procedencia interna. Verificación de pureza de los
seis motores de la vista editorial: puros; única impureza (generatedDate
vía toLocaleDateString, dependiente de ICU/TZ) neutralizada con
formatCanonicalDate (UTC). Compilar dos veces → hash idéntico; mutar el
workspace después → artefacto inalterado.

**Paso 2 (4fc5eba).** El proyector (`pslcDocumentModel`, `pslcDocx`,
`pslcPdf`, `PSLCArtifactViewer`) consume exclusivamente el artefacto.
Eliminado el parámetro `answers`: muere la doble forma (el mismo hash ya
no puede producir documentos distintos). Camino legacy intacto: artefactos
sin canonicalDocument exportan desde conclusiones.content.
`psl-c-documento-visual.test.tsx` reescrito a fuente única (artefacto
canónico vs artefacto legacy). Verificado de forma independiente por
segundo agente: APTO. Suite 2221/2221.

## Decisiones tomadas (no reabrir sin causa)

- **Path A** en el paso 2: proyector desde el snapshot congelado; los
  tests de capítulo (docx:130, pdf:135, institutional-contract:284,
  compiler:267) siguen verdes por diseño y caen en el paso 5.
- **Payload opaco al dominio** (serializado, con schemaVersion interna):
  domain no importa application. Promoción a campo estructurado posible
  en el futuro, sin urgencia.
- **canonicalHash propio** (`pslc-`) sin tocar computePSLHash ni sus tests.
- Artefactos v1 antiguos: material de desarrollo, invalidables; el sistema
  los declarará ilegibles con dignidad (paso 5).

## Pendiente (en orden)

- **Paso 3** — Pantalla y export leen la misma editorialView congelada.
  Incluye la paridad fina de cabecera y la cautela anotada: test que mute
  el workspace tras compilar y verifique export idéntico.
- **Paso 4** — Gates nuevos (G-LHC-2/6 → gate estructural; G-LHC-3/7 se
  conservan sobre el cierre), discriminador `readingStatus`
  ("integrated" | "prioritization-pending"), reconciliación del gate de
  átomos. Zagra (N+1 por priorización) compila con documento digno;
  0 átomos sin ningún +1 se bloquea.
- **Paso 5** — Retirar conclusiones.content/cierre del artefacto. Caen y
  se reescriben los cuatro tests de capítulo. Guard de esquema para v1.
- **Paso 6** — Actualizar tabla de gates en
  CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER.md. Requiere aprobación del
  responsable y revisión del diff antes de commit.

## Líneas paralelas abiertas

- **Fase 3 — Priorización ciudadana como evidencia.** Auditoría completada
  (2026-07-15): el corte está en DiagnosticAnswers (sin campo participativo)
  y en LT1 (excluye átomos strategic-priority, con test). La frontera
  evidencia/decisión existe en el dato: ThematicPrioritisationStudy
  (ranking, votos, cautelas) es la evidencia; selectedTopicIds es la
  decisión — la lectura canónica debe beber solo del Study. Datos reales:
  export REDCap de Atarfe 2026-07-15 con sexo y edad (n=164, 158 completos;
  muestra sesgada a mujeres 65% y mayores de 50, 59% — cautela de
  representatividad declarable con datos) y export REDCap real de Zagra.
  AMBOS PENDIENTES DE SUBIR a municipalities/*/prioritisation/ (git add -f,
  *.csv está ignorado).
- **NHS.** Deuda D4-05 (6→13 estudios, arrastre histórico) y exportación
  PDF/HTML de máx. 4 páginas (D4-04, invariante P4-I10). Después del
  Perfil canónico.
- **Deuda visual** registrada en CONTRACT-INDEX (dos escalas de grises,
  1.400+ colores hardcodeados, tokens sin uso).

## Cómo retomar

Leer CLAUDE.md y este fichero. Reconstruir estado con Git. El diseño
completo de la Fase 1 (qué se congela, gates, migración, orden) está
aprobado y sus decisiones aquí; los pasos 3-6 se ejecutan de uno en uno,
con verificación y sin encadenar. Trabajable desde GitHub Codespaces:
todo corre con fixtures, los microdatos EAS solo son necesarios para
derivar referencias nuevas (D4-05 ampliada).
