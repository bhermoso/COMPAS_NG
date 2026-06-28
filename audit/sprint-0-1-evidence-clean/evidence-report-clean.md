# COMPÁS NG — Auditoría limpia de evidencia Sprint 0/1

## Fecha
Sun Jun 28 06:28:55     2026

## Git
?? audit/
master
a25c02b chore(branding): organizar recursos institucionales
165f924 chore(sprint-1): consolidar arquitectura contractual y estudios complementarios
f73e6e0 chore(sprint-0): consolidar expediente territorial de Atarfe
9c73fa0 feat(cage): integrar CAGE-EAS como estudio complementario
20080cd feat(sueno): integrar Sueño EAS como estudio complementario
aef0650 data(sueno): preparar fixture EAS Granada reproducible
ae77729 fix(repository): clasificar estudios EAS como complementarios
7f47034 feat(sf12+ingesta): implementar SF-12 EAS y corregir trazabilidad documental
87a2db9 data(fixtures): consolidar exportaciones EAS provinciales Granada
b7ba68e test(methodology): añadir integridad estructural de la biblioteca
9aad479 refactor(predimed-eas): derivar campos desde PREDIMED_EAS_MODULE
0bf5026 refactor(duke-eas): derivar campos desde DUKE_EAS_MODULE
4f4238d test(smoke): cubrir Home y Estudios Complementarios
30b3255 feat(methodology): registrar PREDIMED_EAS_MODULE como definición declarativa
6de5120 feat(methodology): registrar DUKE_EAS_MODULE como definición declarativa
8ca5b19 docs(fixtures): documentar origen de fixtures EAS
552ab27 data(predimed): regenerar fixture provincial Granada desde microdatos EAS
57275d9 test(duke-eas,predimed-eas): añadir batería de regresión con fixtures reales
4e14986 docs(contracts): actualizar DUKE-EAS y PREDIMED-EAS
fa7a2e5 docs(visual): añadir referencia visual institucional basada en REDCap
cfd1221 docs(psl): reforzar principios metodológicos del Perfil de Salud Local
2ab5689 docs(action-plan): formalizar traducción estratégica multinorma
c7e2e95 docs(action-plan): ampliar traducción estratégica a marcos multinorma
9ebdc3b feat(ui): hacer colapsable el Informe de Salud y añadir Fuentes de evidencia
4468df8 feat(ui): reorganizar Estudios Complementarios en acordeón jerárquico
5cf96d0 feat(territorio): adaptar UI de municipio hacia ámbito territorial
6e18b57 fix(predimed): usar score EAS canónico y añadir fixture Granada
9c17805 feat(predimed): implementar PREDIMED-EAS como estudio complementario
1236221 feat(duke): mostrar DUKE en snapshot, inventario y PSL
29c5d53 feat(duke-eas): implementar DUKE como estudio complementario EAS

## Documentos fundacionales
./ARCHITECTURE-CONSTITUTION.md
./FOUNDATIONS.md
./ROADMAP.md
./VISUAL-CONTRACT.md
./docs/architecture/OPERATING-CONSTITUTION.md
./docs/contracts/CONTRACT-ACTION-PLAN.md
./docs/contracts/CONTRACT-COMPILER.md
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md
./docs/contracts/CONTRACT-EVIDENCE-QUALITY.md
./docs/contracts/CONTRACT-EVIDENCE.md
./docs/contracts/CONTRACT-INDEX.md
./docs/contracts/CONTRACT-INTERPRETATION.md
./docs/contracts/CONTRACT-MIT-PSL.md
./docs/contracts/CONTRACT-PERSISTENCE.md
./docs/contracts/CONTRACT-REPOSITORY.md
./docs/contracts/CONTRACT-SCALE-PANELS.md
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md
./docs/contracts/CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md

## Contratos
./VISUAL-CONTRACT.md
./docs/contracts/CONTRACT-ACTION-PLAN.md
./docs/contracts/CONTRACT-COMPILER.md
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md
./docs/contracts/CONTRACT-EVIDENCE-QUALITY.md
./docs/contracts/CONTRACT-EVIDENCE.md
./docs/contracts/CONTRACT-INDEX.md
./docs/contracts/CONTRACT-INTERPRETATION.md
./docs/contracts/CONTRACT-MIT-PSL.md
./docs/contracts/CONTRACT-PERSISTENCE.md
./docs/contracts/CONTRACT-REPOSITORY.md
./docs/contracts/CONTRACT-SCALE-PANELS.md
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md
./docs/contracts/CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md

## Código fuente
src/App.tsx
src/application/action-plan/ActionPlanEngine.ts
src/application/action-plan/index.ts
src/application/agenda/AgendaEngine.ts
src/application/agenda/index.ts
src/application/cage/CAGECSVParser.ts
src/application/cage/CAGEStudyToEvidenceAtoms.ts
src/application/cage/index.ts
src/application/csv-utils/splitRow.ts
src/application/document-ingestion/ManualDocumentIngestionService.ts
src/application/document-ingestion/index.ts
src/application/duke/DUKECSVParser.ts
src/application/duke/DUKEStudyToEvidenceAtoms.ts
src/application/duke/index.ts
src/application/epvsa/EPVSATranslator.ts
src/application/epvsa/index.ts
src/application/evidence-pipeline/DocumentToEvidencePipeline.ts
src/application/evidence-pipeline/index.ts
src/application/evidence/EvidenceStoreIntegrityGuard.ts
src/application/evidence/index.ts
src/application/health-profile/buildLocalHealthProfile.ts
src/application/health-profile/index.ts
src/application/health-report/DocxToHealthReport.ts
src/application/health-report/HealthReportSectionParser.ts
src/application/health-report/HealthReportToEvidencePipeline.ts
src/application/health-report/PdfToHealthReport.ts
src/application/health-report/index.ts
src/application/ibse/IBSECSVParser.ts
src/application/ibse/IBSEStudyToEvidenceAtoms.ts
src/application/ibse/index.ts
src/application/lt1/LT1Engine.ts
src/application/lt1/index.ts
src/application/monitoring/MonitoringEngine.ts
src/application/monitoring/index.ts
src/application/municipal-inventory/createMunicipalInventory.ts
src/application/municipal-inventory/index.ts
src/application/oit/OITEngine.ts
src/application/oit/index.ts
src/application/predimed/PREDIMEDCSVParser.ts
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts
src/application/predimed/index.ts
src/application/prioritization/PrioritizationEngine.ts
src/application/prioritization/index.ts
src/application/questionnaire/GenerateRedcapDictionaryArtifact.ts
src/application/questionnaire/QuestionnaireBuilder.ts
src/application/questionnaire/index.ts
src/application/questionnaire/redcap/RedcapDictionaryBuilder.ts
src/application/questionnaire/redcap/RedcapDictionaryCsvExporter.ts
src/application/questionnaire/redcap/RedcapDictionaryDefinition.ts
src/application/questionnaire/redcap/index.ts
src/application/reconciliation/ReconciliacionEngine.ts
src/application/reconciliation/index.ts
src/application/runtime/MunicipalityRuntime.ts
src/application/runtime/index.ts
src/application/sf12/SF12CSVParser.ts
src/application/sf12/SF12StudyToEvidenceAtoms.ts
src/application/sf12/index.ts
src/application/sueno/SuenoCSVParser.ts
src/application/sueno/SuenoStudyToEvidenceAtoms.ts
src/application/sueno/index.ts
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts
src/application/territorial-interpretation/index.ts
src/application/thematic-prioritisation/ThematicPrioritisationCSVParser.ts
src/application/thematic-prioritisation/ThematicPrioritisationToEvidenceAtoms.ts
src/application/thematic-prioritisation/index.ts
src/application/workspace/CreateMunicipalityWorkspace.ts
src/application/workspace/index.ts
src/contracts/workspace/WorkspacePersistence.ts
src/contracts/workspace/index.ts
src/domain/cage/CAGEAggregates.ts
src/domain/cage/CAGEStudy.ts
src/domain/cage/index.ts
src/domain/duke/DUKEAggregates.ts
src/domain/duke/DUKEStudy.ts
src/domain/duke/index.ts
src/domain/evidence/EvidenceAtom.ts
src/domain/evidence/EvidenceStore.ts
src/domain/evidence/index.ts
src/domain/health-profile/LocalHealthProfile.ts
src/domain/health-profile/index.ts
src/domain/health-report/HealthReportDocument.ts
src/domain/health-report/index.ts
src/domain/ibse/IBSEAggregates.ts
src/domain/ibse/IBSEStudy.ts
src/domain/ibse/index.ts
src/domain/methodology/MethodologicalModule.ts
src/domain/methodology/adapters/EASHouseholdDomainModel.ts
src/domain/methodology/adapters/EASSavAdapter.ts
src/domain/methodology/definitions/duke-eas.ts
src/domain/methodology/definitions/ibse.ts
src/domain/methodology/definitions/predimed-eas.ts
src/domain/methodology/index.ts
src/domain/methodology/registry.ts
src/domain/municipality-context/MunicipalityContext.ts
src/domain/municipality-context/createMunicipalityContext.ts
src/domain/municipality-context/index.ts
src/domain/municipality/MunicipalityContext.ts
src/domain/municipality/index.ts
src/domain/pipeline/CompasPipeline.ts
src/domain/pipeline/index.ts
src/domain/predimed/PREDIMEDAggregates.ts
src/domain/predimed/PREDIMEDStudy.ts
src/domain/predimed/index.ts
src/domain/questionnaire/ClassificationBlockRegistry.ts
src/domain/questionnaire/QuestionnaireDefinition.ts
src/domain/questionnaire/QuestionnaireProject.ts
src/domain/questionnaire/artifacts/QuestionnaireArtifact.ts
src/domain/questionnaire/artifacts/index.ts
src/domain/questionnaire/index.ts
src/domain/repository/MunicipalDocumentRepository.ts
src/domain/repository/index.ts
src/domain/sf12/SF12Aggregates.ts
src/domain/sf12/SF12Study.ts
src/domain/sf12/index.ts
src/domain/strategic-framework/StrategicFramework.ts
src/domain/strategic-framework/createStrategicFramework.ts
src/domain/strategic-framework/index.ts
src/domain/strategy/StrategicFrameworkRegistry.ts
src/domain/strategy/index.ts
src/domain/sueno/SuenoAggregates.ts
src/domain/sueno/SuenoStudy.ts
src/domain/sueno/index.ts
src/domain/thematic-prioritisation/ThematicPrioritisation.ts
src/domain/thematic-prioritisation/ThematicPrioritisationStudy.ts
src/domain/thematic-prioritisation/ThematicTopic.ts
src/domain/thematic-prioritisation/index.ts
src/domain/workspace/MunicipalityWorkspace.ts
src/domain/workspace/index.ts
src/infrastructure/persistence/local-storage/LocalStorageWorkspacePersistence.ts
src/infrastructure/persistence/local-storage/index.ts
src/infrastructure/persistence/memory/InMemoryWorkspacePersistence.ts
src/infrastructure/persistence/memory/index.ts
src/main.tsx
src/types/mammoth.d.ts
src/ui/components/ActionPlanPanel.tsx
src/ui/components/AgendaPanel.tsx
src/ui/components/CAGEPanel.tsx
src/ui/components/DUKEPanel.tsx
src/ui/components/DocumentIngestionPanel.tsx
src/ui/components/DocumentRepositoryPanel.tsx
src/ui/components/EPVSAPanel.tsx
src/ui/components/EstudiosComplementariosPanel.tsx
src/ui/components/EvidenceStorePanel.tsx
src/ui/components/HealthReportViewer.tsx
src/ui/components/IBSEPanel.tsx
src/ui/components/LT1Panel.tsx
src/ui/components/LocalHealthPlanningCycle.tsx
src/ui/components/LocalHealthProfilePanel.tsx
src/ui/components/LocalHealthProfileView.tsx
src/ui/components/MonitoringPanel.tsx
src/ui/components/MunicipalInventoryPanel.tsx
src/ui/components/OITPanel.tsx
src/ui/components/PREDIMEDPanel.tsx
src/ui/components/PipelineTracePanel.tsx
src/ui/components/PrioritizationPanel.tsx
src/ui/components/QuestionnaireBuilderPanel.tsx
src/ui/components/ReconciliacionPanel.tsx
src/ui/components/SF12Panel.tsx
src/ui/components/StrategicFrameworkPanel.tsx
src/ui/components/SuenoPanel.tsx
src/ui/components/ThematicPrioritisationModal.tsx
src/ui/components/ThematicPrioritisationPanel.tsx
src/ui/components/index.ts
tests/atarfe-complementary-studies.test.ts
tests/atarfe-workspace.test.ts
tests/cage.test.ts
tests/duke.test.ts
tests/ibse.test.ts
tests/methodology-registry.test.ts
tests/predimed.test.ts
tests/psl-human-content.test.ts
tests/sf12.test.ts
tests/sueno.test.ts
tests/thematic-prioritisation-traceability.test.ts

## CSV / fixtures metodológicos
./Alfacar/conclusiones_alfacar.csv
./Alfacar/determinantes_alfacar.csv
./Alfacar/indicadores_alfacar.csv
./Alfacar/priorizacion_alfacar.csv
./Alfacar/recomendaciones_alfacar.csv
./Atarfe/Atarfe/conclusiones_atarfe.csv
./Atarfe/Atarfe/determinantes_atarfe.csv
./Atarfe/Atarfe/indicadores_atarfe.csv
./Atarfe/Atarfe/priorizacion_atarfe.csv
./Atarfe/Atarfe/recomendaciones_atarfe.csv
./Atarfe/MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv
./Atarfe/MonitorIBSEATARFE202_DATA_2026-06-20_0929.csv
./Atarfe/MonitorIBSEATARFE202_DATA_2026-06-22_1943.csv
./Atarfe/conclusiones_atarfe.csv
./Atarfe/determinantes_atarfe.csv
./Atarfe/indicadores_atarfe.csv
./Atarfe/priorizacion_atarfe.csv
./Atarfe/recomendaciones_atarfe.csv
./Churriana/Churriana_pack/conclusiones_churriana.csv
./Churriana/Churriana_pack/determinantes_churriana.csv
./Churriana/Churriana_pack/indicadores_churriana.csv
./Churriana/Churriana_pack/priorizacion_churriana.csv
./Churriana/Churriana_pack/recomendaciones_churriana.csv
./DesconectaParaConectar_DataDictionary_2026-06-26.csv
./Diccionario_EAS_Adultos.csv
./EAS_COMPLETO.csv
./EAS_microdatos_adulto_READY.csv
./EAS_microdatos_adulto_READY_PESOS.csv
./Padul/conclusiones_padul.csv
./Padul/determinantes_padul.csv
./Padul/indicadores_padul.csv
./Padul/priorizacion_padul.csv
./Padul/recomendaciones_padul.csv
./R ZAGRA/PriorizacinCiudadanaZagra_DataDictionary_2026-06-20.csv
./R ZAGRA/activos-zagra.csv
./Reconecta_DataDictionary_v17.csv
./audit_eas/eas_sav_metadata_first_200.csv
./audit_eas_variables.csv
./duke-eas-granada.csv
./fixtures/cage-eas-granada.csv
./fixtures/duke-eas-granada.csv
./fixtures/ibse-atarfe.csv
./fixtures/predimed-eas-granada.csv
./fixtures/sf12-eas-granada.csv
./fixtures/sueno-eas-granada.csv
./ibse-eas-atarfe.csv

## Deuda técnica explícita
./ARCHITECTURE-CONSTITUTION.md:74:siempre como provisional y requiere validación profesional antes de
./ARCHITECTURE-CONSTITUTION.md:115:* **pendiente de integración**: decisión de diseño válida cuya integración
./ARCHITECTURE-CONSTITUTION.md:122:Una pieza clasificada como *pendiente de integración* debe indicar
./ARCHITECTURE-CONSTITUTION.md:136:provisional o inferido.
./AUDIT-IBSE-METHODOLOGY-20260622.md:55:## Decisión pendiente
./audit_eas_variables.csv:551:P29;P.29. Ahora quisiera hacerle unas preguntas respecto al consumo de bebidas alcohólicas, es decir, cualquier tipo de bebida que contenga alcohol, independiente de su graduación. ¿Consume Vd. algún tipo de bebida alcohólica con una frecuencia de al menos una;labels470;1.0=Sí | 2.0=No, menos de una vez al mes | 3.0=No, no consume bebidas alcohólicas | 994.0=No procede | 995.0=No recogida en oleada | 996.0=No recogida en edición | 999.0=Ns/Nc
./audit_eas_variables.csv:811:P64;P.64. ¿Qué tipo de contrato tiene usted?;labels724;1.0=Trabaja por su cuenta o no es asalariado | 2.0=Funcionario/estatutario | 3.0=Contrato indefinido | 4.0=Contrato temporal de menos de 6 meses | 5.0=Contrato temporal de 6 meses a 1 año | 6.0=Contrato temporal de más de 1 a 2 años | 7.0=Contrato temporal de más de 2 años | 8.0=Contrato temporal sin especificar duración | 9.0=Sin contrato | 10.0=Otra relación | 994.0=No procede | 999.0=Ns/Nc
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:115:igds_8,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Juegas para escapar temporalmente o aliviar un estado de ánimo negativo (por ejemplo, desesperanza, tristeza, culpa o ansiedad)?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./docs/contracts/CONTRACT-ACTION-PLAN.md:209:| `pending-review` | Pendiente de revisión técnica (fallback) |
./docs/contracts/CONTRACT-COMPILER.md:185:| IX | Agenda | Distribución temporal validada |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:262:| `draft` | Definición en construcción o pendiente de contraste con fuente primaria |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:288:> (`MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv`). Pendiente el
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:295:El adaptador SAV está pendiente de contraste con el fichero de referencia.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:409:ausencia del Informe de Salud independientemente de cuántos estudios
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:453:implementación está pendiente. El contrato de la categoría se aplica a todos
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:459:pendiente de contraste completo con la fuente primaria. El parser puede
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:484:| **IBSE** | **Implementado** (módulo en `draft`; pendiente de `validated`) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:500:Esta situación es conocida y aceptada en la implementación actual. No bloquea el uso en producción. La formalización de los módulos en la Biblioteca queda como tarea pendiente explícita antes de que los instrumentos puedan transitar al estado `Validado`.
./docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:34:La calidad de la evidencia se articula en cuatro dimensiones independientes.
./docs/contracts/CONTRACT-EVIDENCE.md:59:| `longitudinal-snapshot` | Dato de evolución temporal |
./docs/contracts/CONTRACT-INDEX.md:167:Define el Motor de Traducción Estratégica (MTE): flujo PSL validado → Priorizaciones → Repositorio Estratégico → Borrador Plan de Acción. Establece 6 restricciones explícitas de no-sustitución y el invariante de trazabilidad completa. `StrategicDerivationTrace` pendiente de especificación en el sprint de implementación.
./docs/contracts/CONTRACT-INDEX.md:180:**Productores futuros:** Investigación metodológica pendiente.
./docs/contracts/CONTRACT-INTERPRETATION.md:298:Toda propuesta de IA lleva indicación explícita de su naturaleza provisional.
./docs/contracts/CONTRACT-INTERPRETATION.md:396:**I-INT-1 — La interpretación siempre está marcada como provisional**
./docs/contracts/CONTRACT-INTERPRETATION.md:400:de output, independientemente de la cantidad de evidencia disponible.
./docs/contracts/CONTRACT-INTERPRETATION.md:432:El documento fuente permanece íntegro e independiente de cualquier lectura
./docs/contracts/CONTRACT-MIT-PSL.md:91:| EAS | `eas` | Origen reconocido; parser pendiente |
./docs/contracts/CONTRACT-MIT-PSL.md:92:| CMI | `cmi` | Origen reconocido; parser pendiente |
./docs/contracts/CONTRACT-MIT-PSL.md:96:El MIT no distingue entre fuentes implementadas y pendientes: procesa los
./docs/contracts/CONTRACT-MIT-PSL.md:97:átomos que encuentre en el store, independientemente de su procedencia. La
./docs/contracts/CONTRACT-MIT-PSL.md:128:LT1 es una sub-rutina interna del MIT, no una etapa de pipeline independiente.
./docs/contracts/CONTRACT-MIT-PSL.md:181:proceso (concepto del dominio pendiente de implementar).
./docs/contracts/CONTRACT-MIT-PSL.md:229:| `temporal` | Cambios significativos entre el estado actual y el anterior (pérdida de determinantes; variación >50% en volumen de evidencia) |
./docs/contracts/CONTRACT-MIT-PSL.md:255:1. **Persistencia temporal**: la tensión conceptualmente similar aparece en
./docs/contracts/CONTRACT-MIT-PSL.md:586:  del proceso finalizado; pendiente de diseño e implementación.
./docs/contracts/CONTRACT-PERSISTENCE.md:85:   (formularios, mensajes de carga, selecciones pendientes).
./docs/contracts/CONTRACT-REPOSITORY.md:121:de cada uno es independiente y opera sobre su tag, no sobre el `kind`.
./docs/contracts/CONTRACT-REPOSITORY.md:229:- `extractedAt`: marca temporal de la extracción.
./docs/contracts/CONTRACT-REPOSITORY.md:287:   así como los mensajes de interfaz pendientes relacionados con ese documento.
./docs/contracts/CONTRACT-REPOSITORY.md:332:**I-R6 — IBSE y Priorización Temática son independientes**
./docs/contracts/CONTRACT-SCALE-PANELS.md:88:**Aplica a:** IBSE (4 factores comparables). No aplica a SF-12 (2 componentes independientes), Sueño (2 variables independientes), CAGE (distribución ordinal), ni DUKE (3 dimensiones superpuestas).
./docs/contracts/CONTRACT-SCALE-PANELS.md:189:- **Interpretación asistida (B.1):** no aplica (dimensiones superpuestas, no independientes).
./docs/contracts/CONTRACT-SCALE-PANELS.md:203:- **Interpretación asistida (B.1):** no aplica (los componentes son independientes y no comparables entre sí).
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:26:Los siguientes acrónimos tienen un único significado válido dentro de COMPÁS NG, independientemente de cualquier uso externo al proyecto. El contrato fija estas denominaciones.
./docs/visual/references/reconecta-reference.css:74: * Aplicada a TODO el body mediante regla !important en encuesta.
./docs/visual/references/reconecta-reference.css:402:   7. NOTA METODOLÓGICA (campo "ficha_metodologica")
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:16:Extraídos de los estilos inline del campo descriptivo `presentacion`. Son los únicos colores definidos por el diseñador del proyecto, independientemente de la plataforma REDCap.
./DOMAIN-MODEL.md:196:marcada esa naturaleza provisional.
./DOMAIN-MODEL.md:204:| Extracción controlada | Interpretación provisional | Sí (con validación) | Sí |
./DOMAIN-MODEL.md:303:- Cada instrumento es **independiente**: sus resultados coexisten sin conflicto
./DOMAIN-MODEL.md:378:no una versión que sustituye a la anterior. Forman una secuencia temporal que
./DOMAIN-MODEL.md:434:del proceso en su secuencia temporal.
./DOMAIN-MODEL.md:499:especializan mediante **instrumentos independientes**.
./DOMAIN-MODEL.md:527:Los Estudios Complementarios son independientes de las variables EAS (Evaluación
./DOMAIN-MODEL.md:639:  carácter provisional.
./fixtures/README.md:233:independientes (personas que duermen suficiente pero no descansan, y personas
./FOUNDATIONS.md:11:independiente con arquitectura modular, tipado estricto y separación clara de
./FOUNDATIONS.md:27:- El workspace de cada municipio se persiste de forma independiente.
./FOUNDATIONS.md:125:- `extractedAt`: marca temporal de la extracción.
./package-lock.json:1468:    "node_modules/@vitest/mocker": {
./package-lock.json:1470:      "resolved": "https://registry.npmjs.org/@vitest/mocker/-/mocker-4.1.9.tgz",
./package-lock.json:3476:        "@vitest/mocker": "4.1.9",
./Reconecta_DataDictionary_v17.csv:54:igds_8,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Juegas para escapar temporalmente o aliviar un estado de ánimo negativo (por ejemplo, desesperanza, tristeza, culpa o ansiedad)?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./ROADMAP.md:11:Los cambios pendientes son de consolidación arquitectónica, contractual y de interfaz.
./ROADMAP.md:81:- Pendiente futuro: visor PDF nativo en interfaz para el Informe de Salud en PDF.
./ROADMAP.md:102:Tareas pendientes:
./ROADMAP.md:148:Pendiente de decisión:
./ROADMAP.md:168:- Toda propuesta de un motor queda pendiente de validación técnica explícita.
./ROADMAP.md:169:- El documento original permanece íntegro e inmodificable independientemente de lo que
./ROADMAP.md:172:Tareas pendientes:
./ROADMAP.md:192:## Componentes UI pendientes de integración
./ROADMAP.md:199:| `QuestionnaireBuilderPanel` | Pendiente de integración | Constructor metodológico de cuestionarios municipales REDCap | VISUAL-CONTRACT §12.1 |
./ROADMAP.md:200:| `LocalHealthProfilePanel` | Pendiente de integración | Generador PSL sintético (inspirado en NHS Health Profiles) | VISUAL-CONTRACT §12.2 |
./ROADMAP.md:201:| `StrategicFrameworkPanel` | Pendiente de integración | Traductor estratégico PSL → EPVSA / ESCA / RELAS | VISUAL-CONTRACT §12.3 |
./scripts/export-sueno-granada.mjs:37: *   No es un error de datos; refleja dimensiones independientes del sueño.
./src/App.css:3964:.psl-doc-conflict-card--temporal       { border-left-color: #ff6600; }
./src/App.tsx:1706:                      <span className="exp-source__status">{hrLoaded ? "Presente" : "Pendiente"}</span>
./src/App.tsx:1714:                      <span className="exp-source__status">{hasAssets ? "Registrados" : "Pendiente"}</span>
./src/App.tsx:1718:                      <span className="exp-source__status">{prioLoaded ? "Realizada" : "Pendiente"}</span>
./src/App.tsx:1859:            {/* Participación ciudadana — proceso independiente de selección temática */}
./src/application/epvsa/EPVSATranslator.ts:127:    "pending-review": "Pendiente de revisión técnica",
./src/application/health-profile/buildLocalHealthProfile.ts:13: *  - Los capítulos V y VI son scaffold marcados como "authored" pendiente.
./src/application/health-profile/buildLocalHealthProfile.ts:111:      "Pendiente de autoría humana. El equipo técnico, la ciudadanía y las " +
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:147:      "Se recomienda revisar cada factor de forma independiente."
./src/application/reconciliation/ReconciliacionEngine.ts:31:  | "temporal"
./src/application/reconciliation/ReconciliacionEngine.ts:58:  persistenciaTemporal: boolean;
./src/application/reconciliation/ReconciliacionEngine.ts:100:    ...detectarConflictosTemporales(mit, historial),
./src/application/reconciliation/ReconciliacionEngine.ts:226:  // Persistencia temporal: tensión conceptualmente similar en ≥2 registros históricos
./src/application/reconciliation/ReconciliacionEngine.ts:227:  const persistenciaTemporal =
./src/application/reconciliation/ReconciliacionEngine.ts:243:    persistenciaTemporal,
./src/application/reconciliation/ReconciliacionEngine.ts:246:    escalado: persistenciaTemporal && convergenciaFuentes && coherenciaEstructural,
./src/application/reconciliation/ReconciliacionEngine.ts:272:        "La evolución temporal puede contradecir la lectura sincrónica actual.",
./src/application/reconciliation/ReconciliacionEngine.ts:343:function detectarConflictosTemporales(
./src/application/reconciliation/ReconciliacionEngine.ts:357:      id: "conflicto-temporal-perdida-determinantes",
./src/application/reconciliation/ReconciliacionEngine.ts:358:      tipo: "temporal",
./src/application/reconciliation/ReconciliacionEngine.ts:371:        id: "conflicto-temporal-cambio-volumen",
./src/application/reconciliation/ReconciliacionEngine.ts:372:        tipo: "temporal",
./src/application/reconciliation/ReconciliacionEngine.ts:429:      `y los Criterios de Escalado (persistencia temporal, convergencia de fuentes, ` +
./src/application/runtime/MunicipalityRuntime.ts:92:  // Aplica la Regla de Escalado: solo las tensiones con persistencia temporal,
./src/application/runtime/MunicipalityRuntime.ts:277:        : "Sin evidencia real. Sugerencia EPVSA pendiente de revisión por ausencia de base documental.",
./src/application/runtime/MunicipalityRuntime.ts:292:        ? `${stages.agenda.annualItems.length} ítem(s) de agenda anual propuesto(s). Pendiente de validación.`
./src/application/runtime/MunicipalityRuntime.ts:300:        ? `${stages.monitoring.trackedItems.length} actuación(es) en seguimiento inicial. Estado: pendiente de validación.`
./src/application/sueno/SuenoCSVParser.ts:7:// Son dimensiones independientes: se espera ~29 % de discordancia entre ambas.
./src/application/sueno/SuenoCSVParser.ts:40:      "Son dimensiones independientes: no deben sumarse ni compararse directamente.",
./src/application/sueno/SuenoStudyToEvidenceAtoms.ts:61:          "Mide percepción de descanso, complementaria e independiente de P33_R (duración).",
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:8: *  - Dimensión longitudinal: evolución temporal del territorio (antes "LONGI")
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:17: * No son etapas de pipeline independientes ni sistemas computacionales separados.
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:28:// La evolución temporal del municipio es una dimensión interna del análisis,
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:29:// no un módulo independiente con pipeline propio.
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:55:  // Dimensión longitudinal — contexto de evolución temporal del municipio
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:86:  // Sub-rutinas internas (no son etapas de pipeline independientes)
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:128:        "La evolución temporal está disponible para orientar la interpretación.",
./src/domain/health-profile/LocalHealthProfile.ts:21:  | "temporal"
./src/domain/methodology/definitions/duke-eas.ts:10:// - Bibliografía: referencias identificadas; contraste completo con texto original pendiente.
./src/domain/methodology/definitions/duke-eas.ts:282:    "con el instrumento original (Broadhead, 1988) está pendiente.",
./src/domain/methodology/definitions/ibse.ts:43:  // Pendiente aún el contraste bibliográfico completo con la fuente primaria Bericat (2014).
./src/domain/methodology/definitions/ibse.ts:322:      notes: "Referencia bibliográfica completa pendiente de contraste con la fuente primaria.",
./src/domain/methodology/definitions/ibse.ts:363:    // sav: pendiente de contraste con EAS_dif_Adultos.sav
./src/domain/methodology/definitions/predimed-eas.ts:12://   primaria pendiente de verificación.
./src/domain/methodology/definitions/predimed-eas.ts:14://   original pendiente.
./src/domain/methodology/definitions/predimed-eas.ts:50:      "instrumento PREDIMED-14 y sus umbrales está pendiente de contraste. " +
./src/domain/methodology/definitions/predimed-eas.ts:353:    "el contraste con la publicación primaria de referencia está pendiente.",
./src/domain/methodology/definitions/predimed-eas.ts:366:        "La publicación específica está pendiente de identificación exacta.",
./src/domain/thematic-prioritisation/ThematicPrioritisationStudy.ts:2:// Es independiente de ThematicPrioritisation (la decisión técnica).
./src/ui/components/IBSEPanel.tsx:164:                  Se recomienda revisar cada factor de forma independiente.
./src/ui/components/LocalHealthPlanningCycle.tsx:39:  pending:                "Pendiente",
./src/ui/components/LocalHealthPlanningCycle.tsx:72:  // Mientras el PSL no está validado, la priorización formal permanece pendiente,
./src/ui/components/LocalHealthProfileView.tsx:34:  temporal:       "Temporal",
./src/ui/components/LocalHealthProfileView.tsx:153:            <ScaffoldBadge text="Propuesta asistida por COMPÁS NG · Pendiente de revisión técnica" />
./src/ui/components/LocalHealthProfileView.tsx:233:            <ScaffoldBadge text="Deliberación pendiente · Autoría humana requerida" />
./src/ui/components/LocalHealthProfileView.tsx:663:                <span className="psl-doc-source-flag__status">{psl.thematicPrioritisationPresent ? "Realizada" : "Pendiente"}</span>
./src/ui/components/LocalHealthProfileView.tsx:809:            <ScaffoldBadge text="Propuesta asistida por COMPÁS NG · Pendiente de revisión técnica" />
./src/ui/components/LocalHealthProfileView.tsx:831:            <ScaffoldBadge text="Propuesta asistida por COMPÁS NG · Pendiente de revisión técnica" />
./src/ui/components/LocalHealthProfileView.tsx:890:            <ScaffoldBadge text="Deliberación pendiente · Autoría humana requerida" />
./src/ui/components/LT1Panel.tsx:164:          Cada sección colapsa/expande de forma independiente.
./src/ui/components/MonitoringPanel.tsx:4:  "pending-validation": "Pendiente de validación",
./src/ui/components/MonitoringPanel.tsx:72:                <span className="status-pill">pendiente</span>
./src/ui/components/PipelineTracePanel.tsx:36:  pending:   "pendiente",
./src/ui/components/ReconciliacionPanel.tsx:15:  temporal:       "Temporal",
./src/ui/components/ReconciliacionPanel.tsx:89:        tension.criterios.persistenciaTemporal,
./src/ui/components/ReconciliacionPanel.tsx:95:    ? `Persistencia temporal: ${tension.criterios.persistenciaTemporal ? "sí" : "no"} · ` +
./src/ui/components/ReconciliacionPanel.tsx:172:          pendientes y qué conflictos entre fuentes no han podido resolverse.
./src/ui/components/ReconciliacionPanel.tsx:185:            {tensionesNoEscaladas.length} pendiente{tensionesNoEscaladas.length !== 1 ? "s" : ""}
./src/ui/components/ReconciliacionPanel.tsx:239:          pendientes de seguimiento técnico.
./src/ui/components/ThematicPrioritisationModal.tsx:236:                  Top 5 aplicado. No hay cambios pendientes que guardar.
./src/ui/components/ThematicPrioritisationPanel.tsx:22:          independiente del análisis automático de evidencia.
./tests/atarfe-workspace.test.ts:17: * Pendiente de implementación (fuera de alcance de esta intervención):
./tests/psl-human-content.test.ts:22:    deliberacionNota: "Pendiente de autoría humana.",
./tests/psl-human-content.test.ts:102:      priorizacion: { ...basePriorizacion(), consensoDocumentado: false, deliberacionNota: "Pendiente de autoría humana." },
./VISUAL-CONTRACT.md:8:> Última revisión: 2026-06-27 — Sprint 0 cierre definitivo: referencias institucionales añadidas, §5 gramática visual de capas, §11 LocalHealthPlanningCycle, §12 componentes pendientes.
./VISUAL-CONTRACT.md:205:  de priorización) llevan siempre el badge "Propuesta asistida · Pendiente
./VISUAL-CONTRACT.md:234:a favor de la mayor cautela: marcar como provisional, no como definitivo.
./VISUAL-CONTRACT.md:315:- qué fases están completadas, en curso o pendientes;
./VISUAL-CONTRACT.md:335:| Pendiente | La fase aún no ha comenzado |
./VISUAL-CONTRACT.md:398:## 12. Componentes UI pendientes de integración
./VISUAL-CONTRACT.md:467:pendientes de integración; §10 renumerado §13.*

## Referencias Sprint
./ARCHITECTURE-CONSTITUTION.md:215:Las reglas operativas —Gate 1, Sprint 0, proceso de aprobación de IA, criterios de
./docs/architecture/OPERATING-CONSTITUTION.md:23:- el objetivo en curso (Sprint 0, Gate 1);
./docs/architecture/OPERATING-CONSTITUTION.md:133:## 4. Sprint 0 — Objetivo vigente
./docs/architecture/OPERATING-CONSTITUTION.md:135:**Sprint 0 es el objetivo en curso. No se desarrollarán motores nuevos hasta
./docs/architecture/OPERATING-CONSTITUTION.md:138:El Sprint 0 cierra la deuda técnica acumulada y garantiza que la plataforma
./docs/architecture/OPERATING-CONSTITUTION.md:143:### 4.1 Alcance del Sprint 0
./docs/architecture/OPERATING-CONSTITUTION.md:145:Los seis bloques que debe cerrar el Sprint 0:
./docs/architecture/OPERATING-CONSTITUTION.md:183:El Gate 1 es la condición de cierre del Sprint 0 y la condición de apertura
./docs/architecture/OPERATING-CONSTITUTION.md:222:   Los estados listados en la auditoría del Sprint 0 están todos resueltos o
./docs/architecture/OPERATING-CONSTITUTION.md:250:   objetiva de robustez en el Sprint 0?
./docs/architecture/OPERATING-CONSTITUTION.md:388:| Contrato de Inferencia Estructural | `docs/contracts/CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md` | Marco para investigación futura; bloquea implementación durante Sprint 0 |
./docs/architecture/OPERATING-CONSTITUTION.md:393:*Primera versión: 2026-06-27 — Creado en Sprint 0 para formalizar criterios
./docs/architecture/OPERATING-CONSTITUTION.md:395:*Revisado: 2026-06-27 — Cierre Sprint 0: añadido CONTRACT-INTERPRETATION y referencia a CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.*
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:568:| 2026-06-27 | Sprint 0: SF-12 EAS, Sueño EAS y CAGE-EAS pasan de «Conceptual» a «Implementado» (implementados en commits `7f47034`, `20080cd` y `9c73fa0` respectivamente). §3.1 y §3.2 actualizados para reflejar la distinción real entre `kind: "redcap-export"` (IBSE) y `kind: "complementary-study"` (instrumentos EAS). Nota §9a ampliada para incluir los cinco instrumentos EAS sin `MethodologicalModule`. |
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:4:> Versión 1.0 — Sprint 1 — 2026-06-27
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:10:**Diseño conceptual. No implementar en Sprint 1.**
./docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:4:> Versión 1.0 — Sprint 1 — 2026-06-27
./docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:75:Una evolución hacia `EvidenceQualityAssessment` (que integre las cuatro dimensiones en un único átomo estructurado) solo procede si en el futuro se requiere evaluación transversal automática de la calidad. En el Sprint 1 no se realizará esa evolución: añadiría complejidad sin beneficio inmediato demostrable.
./docs/contracts/CONTRACT-INDEX.md:4:> Última actualización: Sprint 1 — 2026-06-27
./docs/contracts/CONTRACT-INDEX.md:84:Define las cuatro dimensiones de calidad de la evidencia: documental, muestral, metodológica e inferencial. Establece cómo se mapean a `confidence: "high" | "medium" | "low"` en EvidenceAtom y justifica mantener `kind: "sample-quality"` sin evolucionar a `EvidenceQualityAssessment` en Sprint 1.
./docs/contracts/CONTRACT-INDEX.md:140:## Infraestructura metodológica futura (Sprint 2+)
./docs/contracts/CONTRACT-INDEX.md:145:Define el modelo conceptual de la Tripirámide Dinámica de calidad muestral: Población → Muestra teórica → Muestra observada → Calidad → Interpretación. Establece SAM (Sistema de Auditoría Muestral) como metodología separada. Sin implementación en Sprint 1.
./docs/contracts/CONTRACT-INDEX.md:156:Define el Repositorio Estratégico Territorial: recursos normativos supramunicipales con denominaciones canónicas fijadas (ESCA = Estrategia de Salud Comunitaria de Andalucía 2026–2030; RELAS = Red Local de Acción en Salud; RELAS-G, EBE, PSMA, PEM, EPVSA). Establece la diferencia respecto al MunicipalDocumentRepository. Sin implementación en Sprint 1.
./docs/contracts/CONTRACT-PERSISTENCE.md:434:| 2026-06-27 | Sprint 0: §2 actualizado para incluir `dukeStudy`, `predimedStudy`, `sf12Study`, `suenoStudy` y `cageStudy`, añadidos al workspace en commits `0bf5026`, `9aad479`, `7f47034`, `20080cd` y `9c73fa0` respectivamente y omitidos en la primera redacción. |
./docs/contracts/CONTRACT-SCALE-PANELS.md:4:> Versión 1.1 — COMPÁS NG Sprint 1 — 2026-06-27
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:4:> Versión 1.1 — Sprint 1 — 2026-06-27
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:10:**Diseño conceptual. No implementar en Sprint 1.**
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:4:> Versión 1.0 — Sprint 1 — 2026-06-27
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:10:**Diseño conceptual. No implementar en Sprint 1.**
./docs/contracts/CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md:7:Este contrato **no autoriza implementación** durante Sprint 0 ni Gate 1.
./FOUNDATIONS.md:174:| `docs/architecture/OPERATING-CONSTITUTION.md` | Gate 1, Sprint 0, proceso de aprobación de IA, criterios de aceptación |
./FOUNDATIONS.md:189:*Revisado: 2026-06-27 — Cierre Sprint 0: tabla de documentos relacionados ampliada con todos los contratos vigentes.*
./ROADMAP.md:8:## Estado actual (2026-06-27 — Sprint 0 cierre)
./ROADMAP.md:10:**Sprint 0 — en cierre.** La infraestructura del conocimiento está completada.
./ROADMAP.md:42:### Contratos arquitectónicos completados en Sprint 0
./ROADMAP.md:54:| `CONTRACT-INTERPRETATION.md` | 2026-06-27 (nuevo — cierre Sprint 0) |
./ROADMAP.md:60:**Objetivo completado en Sprint 0.**
./ROADMAP.md:75:**Objetivo completado en Sprint 0.**
./ROADMAP.md:203:Ninguno de estos componentes debe activarse en producción hasta Sprint 1.
./ROADMAP.md:207:*Última revisión: 2026-06-27 — Sprint 0 cierre definitivo: Gate 1 cerrado.*
./VISUAL-CONTRACT.md:8:> Última revisión: 2026-06-27 — Sprint 0 cierre definitivo: referencias institucionales añadidas, §5 gramática visual de capas, §11 LocalHealthPlanningCycle, §12 componentes pendientes.
./VISUAL-CONTRACT.md:364:de proceso**, sin autorizar su implementación hasta Sprint 1.
./VISUAL-CONTRACT.md:464:*Revisado: 2026-06-27 — Sprint 0B: §9 Ciclo de Planificación Local.*
./VISUAL-CONTRACT.md:465:*Revisado: 2026-06-27 — Sprint 0 cierre definitivo: §0 Referencias institucionales

## Referencias metodológicas clave
./Alfacar/conclusiones_alfacar.csv:5:04;El municipio cuenta con activos comunitarios (Centro de salud con Forma Joven, oferta deportiva, Centro Guadalinfo, asociaciones, servicios sociales, entorno natural) que pueden articularse en el marco del II Plan Local de Salud.
./Alfacar/determinantes_alfacar.csv:19:2;P32_CAGE;CAGE positivo (≥2 respuestas);%;1.9;2.4;2.6
./Alfacar/determinantes_alfacar.csv:36:2;PREDIMED;Alta adherencia dieta mediterránea;%;48.5;43.8;42.5
./Alfacar/priorizacion_alfacar.csv:2:Bienestar Emocional;1;La prevalencia de trastornos de ansiedad y depresión (16,9%) justifica establecer el Bienestar Emocional como área prioritaria del Plan Local de Salud de Alfacar.
./Alfacar/priorizacion_alfacar.csv:9:Participación Ciudadana;4;La red de asociaciones y voluntariado activo es un activo para la participación ciudadana en el Plan Local de Salud.
./Alfacar/recomendaciones_alfacar.csv:5:04;Impulsar el Envejecimiento Activo dado el perfil demográfico del municipio (índice de envejecimiento 112,5%), articulando los activos comunitarios disponibles en el marco del II Plan Local de Salud.
./Atarfe/Atarfe/determinantes_atarfe.csv:19:2;P32_CAGE;CAGE positivo (≥2 respuestas);%;2.3;2.4;2.6
./Atarfe/Atarfe/determinantes_atarfe.csv:36:2;PREDIMED;Alta adherencia dieta mediterránea;%;44.5;43.8;42.5
./Atarfe/Atarfe/priorizacion_atarfe.csv:9:Sueño Saludable;1;El descanso y el sueño saludable son componentes esenciales del bienestar emocional y la calidad de vida. El 26,5% de la población presenta problemas de sueño frecuentes.
./Atarfe/Atarfe/recomendaciones_atarfe.csv:3:02;Acompasar el Plan Local de Salud a la Estrategia de Promoción de Vida Saludable en Andalucía, incorporando líneas estratégicas e indicadores que permitan seguimiento y comparación territorial.
./Atarfe/determinantes_atarfe.csv:19:2;P32_CAGE;CAGE positivo (≥2 respuestas);%;2.3;2.4;2.6
./Atarfe/determinantes_atarfe.csv:36:2;PREDIMED;Alta adherencia dieta mediterránea;%;44.5;43.8;42.5
./Atarfe/MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv:5:ibse_info,monitor_ibse,,descriptive,"<div style='background:#e3f2fd;padding:1.5rem;border-radius:8px;border-left:4px solid #1976d2;margin:1.5rem 0;'><h3 style='color:#1565c0;margin-top:0;'>📊 Índice de Bienestar Socioemocional (IBSE) - Metodología Bericat 2014</h3><p style='line-height:1.6;'><strong>Autor:</strong> Eduardo Bericat, Universidad de Sevilla. Validado en Encuesta Andaluza de Salud 2023.</p><hr style='border:none;border-top:1px solid #90caf9;margin:1rem 0;'><h4 style='color:#1565c0;'>📐 Estructura: 8 Preguntas → 4 Factores → 1 Índice</h4><p style='line-height:1.6;'><strong>Las 8 preguntas se distribuyen así:</strong></p><table style='width:100%;border-collapse:collapse;margin:1rem 0;'><tr style='background:#bbdefb;'><th style='padding:0.5rem;text-align:left;border:1px solid #90caf9;'>Factor</th><th style='padding:0.5rem;text-align:left;border:1px solid #90caf9;'>Preguntas</th><th style='padding:0.5rem;text-align:left;border:1px solid #90caf9;'>Escala</th></tr><tr><td style='padding:0.5rem;border:1px solid #e3f2fd;'><strong style='color:#10b981;'>🤝 VÍNCULO</strong>
./Atarfe/MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv:17:(acuerdo)</td></tr></table><hr style='border:none;border-top:1px solid #90caf9;margin:1rem 0;'><h4 style='color:#1565c0;'>🧮 Proceso de Cálculo Automático (REDCap)</h4><p style='line-height:1.7;'><strong>El IBSE se calcula en tres pasos secuenciales:</strong></p><div style='background:#fff;padding:1rem;border-radius:6px;border:1px solid #90caf9;margin:1rem 0;'><h5 style='color:#1565c0;margin-top:0;'>PASO 1: Homogeneización de escalas</h5><p style='line-height:1.7;'>Las 8 preguntas usan dos escalas diferentes que primero hay que homogeneizar:</p><p style='line-height:1.7;'><strong>Para preguntas 1-6 (escala 1-4 de frecuencia):</strong></p><ul style='line-height:1.7;margin-left:1.5rem;'><li><strong>Emociones negativas</strong> (deprimido, solo): Se invierten porque valores altos indican malestar. Si alguien responde 4 (todo el tiempo deprimido), se convierte en 1 (5 menos 4). Así, valores altos siempre significan mayor bienestar.</li><li><strong>Emociones positivas</strong> (feliz, disfrutar, energía, tranquilo): Se estandarizan sumando 1 para convertir la escala 1-4 en escala 2-5, equiparándola con las preguntas de acuerdo.</li></ul><p style='line-height:1.7;'><strong>Para preguntas 7-8 (escala 1-5 de acuerdo):</strong></p><ul style='line-height:1.7;margin-left:1.5rem;'><li><strong>Autovaloración positiva</strong> (optimista, bien conmigo): Se invierten porque la escala original va de muy de acuerdo (1) a muy en desacuerdo (5). Al invertir (6 menos el valor), un 1 (muy de acuerdo con ser optimista) se convierte en 5, indicando alto bienestar.</li></ul></div><div style='background:#fff;padding:1rem;border-radius:6px;border:1px solid #90caf9;margin:1rem 0;'><h5 style='color:#1565c0;margin-top:0;'>PASO 2: Cálculo de los 4 factores (escala 0-100)</h5><p style='line-height:1.7;'>Cada factor agrupa 2 preguntas relacionadas. El proceso es:</p><p style='line-height:1.7;'><strong>🤝 Factor VÍNCULO (calidad relaciones sociales):</strong>
./Atarfe/MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv:21:Se promedian las respuestas ya invertidas de optimista y bien conmigo. Se resta 1 y se multiplica por 25. Resultado: escala 0-100 donde 100 significa autoestima óptima.</p><p style='line-height:1.7;'><em>La multiplicación por 25 convierte el rango 0-4 en rango 0-100, facilitando la interpretación intuitiva como porcentaje de bienestar.</em></p></div><div style='background:#fff;padding:1rem;border-radius:6px;border:1px solid #90caf9;margin:1rem 0;'><h5 style='color:#1565c0;margin-top:0;'>PASO 3: Cálculo del IBSE Total</h5><p style='line-height:1.7;'>El IBSE Total es simplemente el <strong>promedio aritmético de los 4 factores</strong>:</p><p style='background:#f8f9fa;padding:0.75rem;border-radius:4px;font-family:monospace;text-align:center;margin:0.5rem 0;'><strong>IBSE</strong> = (VÍNCULO + SITUACIÓN + CONTROL + PERSONA) / 4</p><p style='line-height:1.7;'>Esta media integra las cuatro dimensiones fundamentales del bienestar socioemocional en un único índice sintético con escala 0-100.</p><p style='line-height:1.7;'><strong>Ejemplo numérico:</strong> Si una persona obtiene Factor VÍNCULO=75, SITUACIÓN=60, CONTROL=50, PERSONA=80, su IBSE Total será (75+60+50+80)/4 = 66.25 puntos (bienestar moderado, pero con déficit notable en autonomía).</p></div><hr style='border:none;border-top:1px solid #90caf9;margin:1rem 0;'><h4 style='color:#1565c0;'>📈 Interpretación de Resultados</h4><table style='width:100%;border-collapse:collapse;margin:1rem 0;'><tr style='background:#bbdefb;'><th style='padding:0.5rem;border:1px solid #90caf9;'>Puntuación IBSE</th><th style='padding:0.5rem;border:1px solid #90caf9;'>Nivel</th><th style='padding:0.5rem;border:1px solid #90caf9;'>Interpretación</th></tr><tr><td style='padding:0.5rem;border:1px solid #e3f2fd;text-align:center;'>76-100</td><td style='padding:0.5rem;border:1px solid #e3f2fd;'><strong style='color:#10b981;'>Alto</strong></td><td style='padding:0.5rem;border:1px solid #e3f2fd;'>Florecimiento socioemocional</td></tr><tr style='background:#f8f9fa;'><td style='padding:0.5rem;border:1px solid #e3f2fd;text-align:center;'>51-75</td><td style='padding:0.5rem;border:1px solid #e3f2fd;'><strong style='color:#f59e0b;'>Moderado</strong></td><td style='padding:0.5rem;border:1px solid #e3f2fd;'>Nivel poblacional típico</td></tr><tr><td style='padding:0.5rem;border:1px solid #e3f2fd;text-align:center;'>26-50</td><td style='padding:0.5rem;border:1px solid #e3f2fd;'><strong style='color:#f97316;'>Bajo</strong></td><td style='padding:0.5rem;border:1px solid #e3f2fd;'>Requiere atención sociosanitaria</td></tr><tr style='background:#f8f9fa;'><td style='padding:0.5rem;border:1px solid #e3f2fd;text-align:center;'>0-25</td><td style='padding:0.5rem;border:1px solid #e3f2fd;'><strong style='color:#ef4444;'>Muy Bajo</strong></td><td style='padding:0.5rem;border:1px solid #e3f2fd;'>Alerta sociosanitaria</td></tr></table><p style='line-height:1.7;'><strong>Ventaja del IBSE:</strong> Los 4 factores permiten diagnóstico diferencial. Un IBSE bajo con Factor VÍNCULO específicamente bajo indica problemas de aislamiento social. Un IBSE bajo con Factor CONTROL bajo sugiere pérdida de autonomía o estrés. Esta información orienta intervenciones focalizadas.</p><hr style='border:none;border-top:1px solid #90caf9;margin:1rem 0;'><h4 style='color:#1565c0;'>🔬 Validación Científica</h4><ul style='line-height:1.8;margin-left:1.5rem;'><li><strong>Análisis factorial confirmatorio:</strong> Validado en múltiples países europeos</li><li><strong>Invarianza factorial:</strong> Estable entre géneros y grupos de edad</li><li><strong>Comparable:</strong> EAS 2016-2023, European Social Survey (ESS)</li><li><strong>Referencias:</strong> Bericat (2014) Social Indicators Research; Bericat (2018) Excluidos de la Felicidad, CIS</li></ul><p style='background:#fff3cd;padding:1rem;border-radius:4px;margin-top:1.5rem;border-left:4px solid #ffc107;'><strong>⏱️ Tiempo estimado de respuesta:</strong> 3-5 minutos
./Atarfe/MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv:35:ibse_total,monitor_ibse,,calc,"IBSE - Índice de Bienestar Socioemocional (escala 0-100)",([ibse_factor_vinculo]+[ibse_factor_situacion]+[ibse_factor_control]+[ibse_factor_persona])/4,"Índice global de Bienestar Socioemocional de Eduardo Bericat (2014). Rango 0-100 donde 100=óptimo bienestar",,,,,,,,,,," @HIDDEN-SURVEY | Media de 4 factores"
./Atarfe/priorizacion_atarfe.csv:9:Sueño Saludable;1;El descanso y el sueño saludable son componentes esenciales del bienestar emocional y la calidad de vida. El 26,5% de la población presenta problemas de sueño frecuentes.
./Atarfe/recomendaciones_atarfe.csv:3:02;Acompasar el Plan Local de Salud a la Estrategia de Promoción de Vida Saludable en Andalucía, incorporando líneas estratégicas e indicadores que permitan seguimiento y comparación territorial.
./AUDIT-IBSE-METHODOLOGY-20260622.md:1:# Auditoría IBSE — Biblioteca Metodológica
./AUDIT-IBSE-METHODOLOGY-20260622.md:7:El módulo `IBSE_MODULE` está actualmente en estado `draft` y mantiene `items: []`.
./AUDIT-IBSE-METHODOLOGY-20260622.md:9:Sin embargo, el repositorio contiene el diccionario REDCap:
./AUDIT-IBSE-METHODOLOGY-20260622.md:11:`MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv`
./AUDIT-IBSE-METHODOLOGY-20260622.md:13:Este diccionario incluye los 8 ítems IBSE, sus opciones de respuesta y las variables calculadas de factores e índice total.
./AUDIT-IBSE-METHODOLOGY-20260622.md:15:## Ítems IBSE localizados
./AUDIT-IBSE-METHODOLOGY-20260622.md:17:| Variable REDCap | Texto |
./AUDIT-IBSE-METHODOLOGY-20260622.md:45:## Variables calculadas REDCap
./AUDIT-IBSE-METHODOLOGY-20260622.md:57:Completar `IBSE_MODULE.items` usando este diccionario como contrato interno verificado.
./audit_eas_variables.csv:809:P63B_2007;P.63b. ¿Cuál es la ocupación que desempeña en la actualidad o la última que ha desempeñado?;labels722;1.0=FUERZAS ARMADAS: ESCALA SUPERIOR | 2.0=FUERZAS ARMADAS: ESCALA MEDIA | 3.0=FUERZAS ARMADAS: ESCALA BASICA | 102.0=PERSONAL DIRECTIVO DE LA ADMINISTRACION PUBLICA | 103.0=GOBIERNO LOCAL | 111.0=DIRECCION GENERAL Y PRESIDENCIA EJECUTIVA | 112.0=DIRECCION DE DEPARTAMENTO DE PRODUCCION | 113.0=DIRECCION DE AREAS Y DEPARTAMENTOS ESPECIALIZADOS | 121.0=GERENCIA DE EMPRESAS DE COMERCIO AL POR MAYOR CON MENOS DE 1 | 122.0=GERENCIA DE EMPRESAS DE COMERCIO AL POR MENOR CON MENOS DE 1 | 131.0=GERENCIA DE EMPRESAS DE HOSPEDAJE CON MENOS DE 10 ASALARIADO | 132.0=GERENCIA DE EMPRESAS DE RESTAURACION CON MENOS DE 10 ASALARI | 140.0=GERENCIA DE OTRAS EMPRESAS CON MENOS DE 10 ASALARIADOS | 151.0=GERENCIA DE EMPRESAS DE COMERCIO AL POR MAYOR SIN ASALARIADO | 152.0=GERENCIA DE EMPRESAS DE COMERCIO AL POR MENOR SIN ASALARIADO | 161.0=GERENCIA DE EMPRESAS DE HOSPEDAJE SIN ASALARIADOS | 162.0=GERENCIA DE EMPRESAS DE RESTAURACION SIN ASALARIADOS | 170.0=GERENCIA DE OTRAS EMPRESAS SIN ASALARIADOS | 201.0=FISICOS, QUIMICOS Y ASIMILADOS | 202.0=MATEMATICOS, ESTADISTICOS Y ASIMILADOS | 203.0=PROFESIONALES DE LA INFORMATICA DE NIVEL SUPERIOR | 204.0=ARQUITECTOS Y ASIMILADOS | 205.0=INGENIEROS SUPERIORES Y ASIMILADOS | 211.0=PROFESIONALES EN CIENCIAS NATURALES | 212.0=MEDICOS Y ODONTOLOGOS | 213.0=VETERINARIOS | 214.0=FARMACEUTICOS | 219.0=OTROS PROFESIONALES DE NIVEL SUPERIOR DE LA SANIDAD | 221.0=PROFESORES DE UNIVERSIDADES Y OTROS CENTROS DE ENSEÑANZA SUP | 222.0=PROFESORES DE ENSEÑANZA SECUNDARIA | 223.0=OTROS PROFESORES DE LA ENSAÑANZA | 231.0=ABOGADOS Y FISCALES | 239.0=OTROS PROFESIONALES DEL DERECHO | 241.0=PROFESIONALES EN ORGANIZACION Y ADMINISTRACION DE EMPRESAS | 242.0=ECONOMISTAS | 243.0=SOCIOLOGOS, HISTORIADORES, FILOSOFOS, FILOLOGOS, PSICOLOGOS | 251.0=ESCRITORES Y ARTISTAS DE LA CREACION O DE LA INTERPRETACION | 252.0=ARCHIVEROS, BIBLIOTECARIOS Y PROFESIONALES ASIMILADOS | 253.0=DIVERSOS PROFESIONALES DE LA ADMINISTRACION PUBLICA QUE NO P | 261.0=PROFESIONALES ASOCIADOS A UNA TITULACION DE 1 CICLO UNIVERSI | 262.0=PROFESIONALES ASOCIADOS A UNA TITULACION DE 1 CICLO UNIVERSI | 263.0=PROFESIONALES DE NIVEL MEDIO DE INFORMATICA | 264.0=ARQUITECTOS TECNICOS | 265.0=INGENIEROS TECNICOS Y ASIMILADOS | 271.0=PROFESIONALES ASOCIADOS A UNA TITULACION DE 1 CICLO UNIVERSI | 272.0=ENFERMEROS | 281.0=PROFESORES DE ENSEÑANZA PRIMARIA E INFANTIL | 282.0=PROFESORES DE EDUCACION ESPECIAL | 283.0=PROFESORADO TECNICO DE FORMACION PROFESIONAL | 291.0=DIPLOMADOS EN CONTABILIDAD Y GRADUADOS SOCIALES Y TECNICOS D | 292.0=AYUDANTES DE ARCHIVO, BIBLIOTECA Y ASIMILADOS | 293.0=DIPLOMADOS EN TRABAJO SOCIAL | 294.0=SACERDOTES DE LAS DITINTAS RELIGIONES | 295.0=OTROS PROFESIONALES DE LA ADMINISTRACION PUBLICA QUE NO PUED | 301.0=DELINEANTES Y DISEÑADORES TECNICOS | 302.0=TECNICOS DE LAS CIENCIAS FISICAS, QUIMICAS Y DE LAS INGENIER | 303.0=PROFESIONALES TECNICOS DE LA INFORMATICA | 304.0=OPERADORES DE EQUIPOS OPTICOS Y ELECTRONICOS | 305.0=PROFESIONALES EN NAVEGACION MARITIMA | 306.0=PROFESIONALES EN NAVEGACION AERONAUTICA | 307.0=TECNICOS EN EDIFICACION, SEGURIDAD EN EL TRABAJO Y CONTROL D | 311.0=TECNICOS DE LAS CIENCIAS NATURALES Y PROFESIONALES AUXILIARE | 312.0=TECNICOS DE SANIDAD | 313.0=DIVERSOS TECNICOS DE SANIDAD NO CLASIFICADOS EN RUBRICAS ANT | 321.0=TECNICOS EN EDUCACION INFANTIL Y EDUCACION ESPECIAL | 322.0=INSTRUCTORES DE VUELO, NAVEGACION Y CONDUCCION DE VEHICULOS | 331.0=PROFESIONALES DE APOYO EN OPERACIONES FINANCIERAS Y ALGUNAS | 332.0=REPRESENTANTES DE COMERCIO Y TECNICOS DE VENTA | 341.0=PROFESIONALES DE APOYO DE LA GESTION ADMINISTRATIVA, CON TAR | 342.0=PROFESIONALES DE CARACTER ADMINISTRATIVO DE ADUANAS, DE TRIB | 351.0=CONSIGNATARIOS Y AGENTES EN LA CONTRATACION DE MANO DE OBRA | 352.0=INSPECTORES DE POLICIA Y DETECTIVES | 353.0=PROFESIONALES DE APOYO DE PROMOCION SOCIAL | 354.0=PROFESIONALES DEL MUNDO ARTISTICO, DEL ESPECTACULO Y DE LOS | 401.0=AUXILIARES CONTABLES Y FINANCIEROS | 410.0=EMPLEADOS DE BIBLIOTECAS, SERVICIOS DE CORREOS Y ASIMILADOS | 430.0=AUXILIARES ADMINISTRATIVOS (SIN TAREAS DE ATENCION AL PUBLIC | 440.0=AUXILIARES ADMINISTRATIVOS (CON TAREAS DE ATENCION AL PUBLIC | 451.0=EMPLEADOS DE INFORMACION Y RECEPCIONISTAS EN OFICINAS | 452.0=EMPLEADOS DE AGENCIAS DE VIAJES, RECEPCIONISTAS EN ESTABLECI | 460.0=CAJEROS, TAQUILLEROS Y OTROS EMPLEADOS ASIMILADOS EN TRATO D | 501.0=COCINEROS Y OTROS PREPARADORES DE COMIDAS | 502.0=CAMAREROS, BARMANES Y ASIMILADOS | 503.0=JEFES DE COCINEROS, CAMAREROS Y ASIMILADOS | 511.0=AUXILIARES DE ENFERMERIA Y ASIMILADOS | 512.0=TRABAJADORES QUE SE DEDICAN AL CUIDADO DE PERSONAS Y ASIMILA | 513.0=PELUQUEROS, ESPECIALISTAS EN TRATAMIENTO DE BELLEZA Y TRABAJ | 514.0=TRABAJADORES QUE ATIENDEN A VIAJEROS Y ASIMILADOS | 521.0=POLICIAS | 522.0=BOMBEROS | 523.0=FUNCIONARIO DE PRISIONES | 524.0=GUARDIAS JURADOS Y PERSONAL DE SEGURIDAD PRIVADO | 529.0=OTROS TRABAJADORES DE LOS SERVICIOS DE PROTECCION Y SEGURIDA | 531.0=MODELOS DE MODA, ARTE Y PUBLICIDAD | 532.0=ENCARGADO DE SECCION DENTRO DE UN COMERCIO Y ASIMILADOS | 533.0=DEPENDIENTES Y EXHIBIDORES EN TIENDAS, ALMACENES, QUIOSCOS Y | 601.0=TRABAJADORES CUALIFICADOS POR CUENTA PROPIA EN EXPLOTACIONES | 602.0=TRABAJADORES CUALIFICADOS POR CUENTA AJENA EN EXPLOTACIONES | 611.0=TRABAJADORES CUALIFICADOS POR CUENTA PROPIA EN ACTIVIDADES G | 612.0=TRABAJADORES CUALIFICADOS POR CUENTA AJENA EN ACTIVIDADES GA | 621.0=TRABAJADORES CUALIFICADOS POR CUENTA PROPIA EN EXPLOTACIONES | 622.0=TRABAJADORES CUALIFICADOS POR CUENTA PROPIA EN EXPLOTACIONES | 623.0=TRABAJADORES CUALIFICADOS POR CUENTA AJENA EN EXPLOTACIONES | 624.0=TRABAJADORES CUALIFICADOS POR CUENTA AJENA EN EXPLOTACIONES | 631.0=PESCADORES Y TRABAJADORES CUALIFICADOS POR CUENTA PROPIA DE | 632.0=PESCADORES Y TRABAJADORES CUALIFICADOS POR CUENTA AJENA DE L | 701.0=ENCARGADOS Y JEFES DE EQUIPO EN OBRAS ESTRUCTURALES DE LA CO | 702.0=JEFES DE TALLER Y ENCARGADOS DE TRABAJADORES DE ACABADO DE E | 711.0=ALBAÑILES Y MAMPOSTEROS | 712.0=TRABAJADORES EN HORMIGON ARMADO, ENFOSCADORES FERRALLISTAS Y | 713.0=CARPINTEROS (EXCEPTO CARPINTEROS DE ESTRUCTURAS METALICAS) | 714.0=OTROS TRABAJADORES DE LAS OBRAS ESTRUCTURALES DE CONSTRUCCIO | 721.0=REVOCADORES,ESCAYOLISTAS Y ESTUQUISTAS | 722.0=FONTANEROS E INSTALADORES DE TUBERIAS | 723.0=ELECTRICISTAS DE CONSTRUCCION Y ASIMILADOS | 724.0=PINTORES, BARNIZADORES, EMPAPELADORES Y ASIMILADOS | 729.0=OTROS TRABAJADORES DE ACABADO DE CONSTRUCCION Y ASIMILADOS | 731.0=JEFES DE TALLER Y ENCARGADOS DE MOLDEADORES, SOLDADORES, MON | 732.0=JEFES DE TALLER DE VEHICULOS DE MOTOR | 733.0=JEFES DE TALLER DE MAQUINAS AGRICOLAS E INDUSTRIALES Y MOTOR | 734.0=JEFES DE EQUIPOS DE MECANICOS Y AJUSTADORES DE EQUIPOS ELECT | 741.0=ENCARGADOS Y CAPATACES DE LA MINERIA | 742.0=MINEROS, CANTEROS, PICADORES Y LABRANTES DE PIEDRA | 751.0=MOLDEADORES, SOLDADORES, CHAPISTAS, MONTADORES DE ESTRUCTURA | 752.0=HERREROS, ELABORADORES DE HERRAMIENTAS Y ASIMILADOS | 761.0=MECANICOS Y AJUSTADORES DE MAQUINARIA | 762.0=MECANICOS Y AJUSTADORES DE EQUIPOS ELECTRICOS Y ELECTRONICOS | 771.0=MECANICOS DE PRECISION EN METALES Y MATERIALES SIMILARES | 772.0=TRABAJADORES DE ARTES GRAFICAS Y ASIMILADOS | 773.0=CERAMISTAS, VIDRIEROS Y ASIMILADOS | 774.0=ARTESANOS DE LA MADERA, DE TEXTILES, DEL CUERO Y MATERIALES | 780.0=TRABAJADORES DE LA INDUSTRIA DE LA ALIMENTACION, BEBIDAS Y T | 792.0=EBANISTAS Y TRABAJADORES ASIMILADOS | 793.0=TRABAJADORES DE LA INDUSTRIA TEXTIL, LA CONFECCION Y ASIMILA | 794.0=TRABAJADORES DE LA INDUSTRIA DE LA PIEL, DEL CUERO Y DEL CAL | 802.0=ENCARGADOS EN INSTALACIONES DE PROCESAMIENTO DE METALES | 804.0=ENCARGADOS DE TALLERES DE MADERA Y JEFES DE EQUIPO EN LA FAB | 806.0=JEFES DE EQUIPO EN INSTALACIONES DE PRODUCCION DE ENERGIA Y | 812.0=OPERADORES EN INSTALACIONES PARA LA OBTENCION Y TRANSFORMACI | 813.0=OPERADORES EN INSTALACIONES PARA LA OBTENCION, TRANSFORMACIO | 814.0=OPERADORES EN INSTALACIONES PARA EL TRABAJO DE LA MADERA Y L | 815.0=OPERADORES EN PLANTAS INDUSTRIALES QUIMICAS | 816.0=OPERADORES DE PLANTAS PARA PRODUCCION DE ENERGIA Y SIMILARES | 821.0=ENCARGADO DE OPERADORES DE MAQUINAS PARA TRABAJAR METALES | 822.0=ENCARGADO DE OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS | 823.0=ENCARGADO DE OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS | 825.0=JEFES DE TALLER DE IMPRENTA, ENCUADERNACION Y FABRICACION DE | 826.0=ENCARGADO DE OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS | 827.0=ENCARGADO DE OPERADORES DE MAQUINAS PARA ELABORAR PRODUCTOS | 831.0=OPERADORES DE MAQUINAS PARA TRABAJAR METALES Y OTROS PRODUCT | 832.0=OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS QUIMICOS | 833.0=OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS DE CAUCHO Y P | 834.0=OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS DE MADERA | 835.0=OPERADORES DE MAQUINAS PARA IMPRIMIR, ENCUADERNAR Y PARA FAB | 836.0=OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS TEXTILES Y AR | 837.0=OPERADORES DE MAQUINAS PARA ELABORAR PRODUCTOS ALIMENTICIOS, | 841.0=MONTADORES Y ENSAMBLADORES | 849.0=OTROS MONTADORES Y ENSAMBLADORES | 851.0=MAQUINISTAS DE LOCOMOTORAS Y ASIMILADOS | 852.0=ENCARGADO DE OPERADORES DE MAQUINARIA DE MOVIMIENTO DE TIERR | 853.0=OPERADORES DE MAQUINARIA AGRICOLA MOVIL | 854.0=OPERADORES DE OTRAS MAQUINAS MOVILES | 855.0=MARINEROS DE CUBIERTA DE BARCO Y ASIMILADOS | 861.0=TAXISTAS Y CONDUCTORES DE AUTOMOVILES Y FURGONETAS | 862.0=CONDUCTORES DE AUTOBUSES | 863.0=CONDUCTORES DE CAMIONES | 864.0=CONDUCTORES DE MOTOCICLETAS Y CICLOMOTORES | 900.0=VENDEDORES AMBULANTES Y ASIMILADOS | 911.0=EMPLEADOS DEL HOGAR | 912.0=PERSONAL DE LIMPIEZA DE OFICINAS, HOTELES Y OTROS TRABAJADOR | 921.0=CONSERJES DE EDIFICIOS, LIMPIACRISTALES Y ASIMILADOS | 922.0=VIGILANTES, GUARDIANES Y ASIMILADOS | 932.0=ORDENANZAS | 934.0=LECTORES DE CONTADORES (AGUA...) Y RECOLECTORES DE DINERO DE | 935.0=RECOGEDORES DE BASURA Y OBREROS ASIMILADOS | 941.0=PEONES AGRICOLAS | 942.0=PEONES GANADEROS | 943.0=PEONES AGROPECUARIOS | 944.0=PEONES FORESTALES | 950.0=PEONES DE LA MINERIA | 960.0=PEONES DE LA CONSTRUCCION | 970.0=PEONES DE INDUSTRIAS MANUFACTURERAS | 980.0=PEONES DEL TRANSPORTE Y DESCARGADORES | 991.0=No pertenece a edición | 997.0=No ha trabajado | 999.0=Ns/Nc
./audit_eas_variables.csv:878:P69$problemSueño;P.69. ¿De qué forma afecta su trabajo a su salud? Tiene problemas de sueño;labels790;0.0=No | 1.0=Sí | 994.0=No procede | 996.0=No recogida en edición | 999.0=Ns/Nc
./audit_eas_variables.csv:910:P74D_2007;P.74d. ¿Cuál es la ocupación que desempeña en la actualidad o la última que ha desempeñado su esposo/a y/o pareja?;labels822;1.0=FUERZAS ARMADAS: ESCALA SUPERIOR | 2.0=FUERZAS ARMADAS: ESCALA MEDIA | 3.0=FUERZAS ARMADAS: ESCALA BASICA | 101.0=PODER EJECUTIVO Y LEGISLATIVO Y CONSEJO GENERAL DEL PODER JU | 103.0=GOBIERNO LOCAL | 104.0=DIRECCION DE ORGANIZACIONES DE INTERES | 111.0=DIRECCION GENERAL Y PRESIDENCIA EJECUTIVA | 112.0=DIRECCION DE DEPARTAMENTO DE PRODUCCION | 113.0=DIRECCION DE AREAS Y DEPARTAMENTOS ESPECIALIZADOS | 121.0=GERENCIA DE EMPRESAS DE COMERCIO AL POR MAYOR CON MENOS DE 1 | 122.0=GERENCIA DE EMPRESAS DE COMERCIO AL POR MENOR CON MENOS DE 1 | 131.0=GERENCIA DE EMPRESAS DE HOSPEDAJE CON MENOS DE 10 ASALARIADO | 132.0=GERENCIA DE EMPRESAS DE RESTAURACION CON MENOS DE 10 ASALARI | 140.0=GERENCIA DE OTRAS EMPRESAS CON MENOS DE 10 ASALARIADOS | 151.0=GERENCIA DE EMPRESAS DE COMERCIO AL POR MAYOR SIN ASALARIADO | 152.0=GERENCIA DE EMPRESAS DE COMERCIO AL POR MENOR SIN ASALARIADO | 162.0=GERENCIA DE EMPRESAS DE RESTAURACION SIN ASALARIADOS | 170.0=GERENCIA DE OTRAS EMPRESAS SIN ASALARIADOS | 201.0=FISICOS, QUIMICOS Y ASIMILADOS | 203.0=PROFESIONALES DE LA INFORMATICA DE NIVEL SUPERIOR | 204.0=ARQUITECTOS Y ASIMILADOS | 205.0=INGENIEROS SUPERIORES Y ASIMILADOS | 211.0=PROFESIONALES EN CIENCIAS NATURALES | 212.0=MEDICOS Y ODONTOLOGOS | 213.0=VETERINARIOS | 214.0=FARMACEUTICOS | 219.0=OTROS PROFESIONALES DE NIVEL SUPERIOR DE LA SANIDAD | 221.0=PROFESORES DE UNIVERSIDADES Y OTROS CENTROS DE ENSEÑANZA SUP | 222.0=PROFESORES DE ENSEÑANZA SECUNDARIA | 223.0=OTROS PROFESORES DE LA ENSAÑANZA | 231.0=ABOGADOS Y FISCALES | 239.0=OTROS PROFESIONALES DEL DERECHO | 242.0=ECONOMISTAS | 243.0=SOCIOLOGOS, HISTORIADORES, FILOSOFOS, FILOLOGOS, PSICOLOGOS | 251.0=ESCRITORES Y ARTISTAS DE LA CREACION O DE LA INTERPRETACION | 252.0=ARCHIVEROS, BIBLIOTECARIOS Y PROFESIONALES ASIMILADOS | 253.0=DIVERSOS PROFESIONALES DE LA ADMINISTRACION PUBLICA QUE NO P | 261.0=PROFESIONALES ASOCIADOS A UNA TITULACION DE 1 CICLO UNIVERSI | 263.0=PROFESIONALES DE NIVEL MEDIO DE INFORMATICA | 264.0=ARQUITECTOS TECNICOS | 265.0=INGENIEROS TECNICOS Y ASIMILADOS | 271.0=PROFESIONALES ASOCIADOS A UNA TITULACION DE 1 CICLO UNIVERSI | 272.0=ENFERMEROS | 281.0=PROFESORES DE ENSEÑANZA PRIMARIA E INFANTIL | 282.0=PROFESORES DE EDUCACION ESPECIAL | 283.0=PROFESORADO TECNICO DE FORMACION PROFESIONAL | 291.0=DIPLOMADOS EN CONTABILIDAD Y GRADUADOS SOCIALES Y TECNICOS D | 292.0=AYUDANTES DE ARCHIVO, BIBLIOTECA Y ASIMILADOS | 293.0=DIPLOMADOS EN TRABAJO SOCIAL | 295.0=OTROS PROFESIONALES DE LA ADMINISTRACION PUBLICA QUE NO PUED | 301.0=DELINEANTES Y DISEÑADORES TECNICOS | 302.0=TECNICOS DE LAS CIENCIAS FISICAS, QUIMICAS Y DE LAS INGENIER | 303.0=PROFESIONALES TECNICOS DE LA INFORMATICA | 304.0=OPERADORES DE EQUIPOS OPTICOS Y ELECTRONICOS | 306.0=PROFESIONALES EN NAVEGACION AERONAUTICA | 311.0=TECNICOS DE LAS CIENCIAS NATURALES Y PROFESIONALES AUXILIARE | 312.0=TECNICOS DE SANIDAD | 321.0=TECNICOS EN EDUCACION INFANTIL Y EDUCACION ESPECIAL | 322.0=INSTRUCTORES DE VUELO, NAVEGACION Y CONDUCCION DE VEHICULOS | 331.0=PROFESIONALES DE APOYO EN OPERACIONES FINANCIERAS Y ALGUNAS | 332.0=REPRESENTANTES DE COMERCIO Y TECNICOS DE VENTA | 341.0=PROFESIONALES DE APOYO DE LA GESTION ADMINISTRATIVA, CON TAR | 351.0=CONSIGNATARIOS Y AGENTES EN LA CONTRATACION DE MANO DE OBRA | 352.0=INSPECTORES DE POLICIA Y DETECTIVES | 353.0=PROFESIONALES DE APOYO DE PROMOCION SOCIAL | 354.0=PROFESIONALES DEL MUNDO ARTISTICO, DEL ESPECTACULO Y DE LOS | 401.0=AUXILIARES CONTABLES Y FINANCIEROS | 410.0=EMPLEADOS DE BIBLIOTECAS, SERVICIOS DE CORREOS Y ASIMILADOS | 430.0=AUXILIARES ADMINISTRATIVOS (SIN TAREAS DE ATENCION AL PUBLIC | 440.0=AUXILIARES ADMINISTRATIVOS (CON TAREAS DE ATENCION AL PUBLIC | 452.0=EMPLEADOS DE AGENCIAS DE VIAJES, RECEPCIONISTAS EN ESTABLECI | 460.0=CAJEROS, TAQUILLEROS Y OTROS EMPLEADOS ASIMILADOS EN TRATO D | 501.0=COCINEROS Y OTROS PREPARADORES DE COMIDAS | 502.0=CAMAREROS, BARMANES Y ASIMILADOS | 503.0=JEFES DE COCINEROS, CAMAREROS Y ASIMILADOS | 511.0=AUXILIARES DE ENFERMERIA Y ASIMILADOS | 512.0=TRABAJADORES QUE SE DEDICAN AL CUIDADO DE PERSONAS Y ASIMILA | 513.0=PELUQUEROS, ESPECIALISTAS EN TRATAMIENTO DE BELLEZA Y TRABAJ | 514.0=TRABAJADORES QUE ATIENDEN A VIAJEROS Y ASIMILADOS | 515.0=MAYORDOMOS, ECONOMOS Y ASIMILADOS | 519.0=OTROS TRABAJADORES DE SERVICIOS PERSONALES | 521.0=POLICIAS | 522.0=BOMBEROS | 523.0=FUNCIONARIO DE PRISIONES | 524.0=GUARDIAS JURADOS Y PERSONAL DE SEGURIDAD PRIVADO | 529.0=OTROS TRABAJADORES DE LOS SERVICIOS DE PROTECCION Y SEGURIDA | 531.0=MODELOS DE MODA, ARTE Y PUBLICIDAD | 532.0=ENCARGADO DE SECCION DENTRO DE UN COMERCIO Y ASIMILADOS | 533.0=DEPENDIENTES Y EXHIBIDORES EN TIENDAS, ALMACENES, QUIOSCOS Y | 601.0=TRABAJADORES CUALIFICADOS POR CUENTA PROPIA EN EXPLOTACIONES | 602.0=TRABAJADORES CUALIFICADOS POR CUENTA AJENA EN EXPLOTACIONES | 611.0=TRABAJADORES CUALIFICADOS POR CUENTA PROPIA EN ACTIVIDADES G | 612.0=TRABAJADORES CUALIFICADOS POR CUENTA AJENA EN ACTIVIDADES GA | 623.0=TRABAJADORES CUALIFICADOS POR CUENTA AJENA EN EXPLOTACIONES | 624.0=TRABAJADORES CUALIFICADOS POR CUENTA AJENA EN EXPLOTACIONES | 632.0=PESCADORES Y TRABAJADORES CUALIFICADOS POR CUENTA AJENA DE L | 701.0=ENCARGADOS Y JEFES DE EQUIPO EN OBRAS ESTRUCTURALES DE LA CO | 702.0=JEFES DE TALLER Y ENCARGADOS DE TRABAJADORES DE ACABADO DE E | 711.0=ALBAÑILES Y MAMPOSTEROS | 712.0=TRABAJADORES EN HORMIGON ARMADO, ENFOSCADORES FERRALLISTAS Y | 713.0=CARPINTEROS (EXCEPTO CARPINTEROS DE ESTRUCTURAS METALICAS) | 714.0=OTROS TRABAJADORES DE LAS OBRAS ESTRUCTURALES DE CONSTRUCCIO | 721.0=REVOCADORES,ESCAYOLISTAS Y ESTUQUISTAS | 722.0=FONTANEROS E INSTALADORES DE TUBERIAS | 723.0=ELECTRICISTAS DE CONSTRUCCION Y ASIMILADOS | 724.0=PINTORES, BARNIZADORES, EMPAPELADORES Y ASIMILADOS | 729.0=OTROS TRABAJADORES DE ACABADO DE CONSTRUCCION Y ASIMILADOS | 731.0=JEFES DE TALLER Y ENCARGADOS DE MOLDEADORES, SOLDADORES, MON | 732.0=JEFES DE TALLER DE VEHICULOS DE MOTOR | 733.0=JEFES DE TALLER DE MAQUINAS AGRICOLAS E INDUSTRIALES Y MOTOR | 734.0=JEFES DE EQUIPOS DE MECANICOS Y AJUSTADORES DE EQUIPOS ELECT | 742.0=MINEROS, CANTEROS, PICADORES Y LABRANTES DE PIEDRA | 751.0=MOLDEADORES, SOLDADORES, CHAPISTAS, MONTADORES DE ESTRUCTURA | 752.0=HERREROS, ELABORADORES DE HERRAMIENTAS Y ASIMILADOS | 761.0=MECANICOS Y AJUSTADORES DE MAQUINARIA | 762.0=MECANICOS Y AJUSTADORES DE EQUIPOS ELECTRICOS Y ELECTRONICOS | 771.0=MECANICOS DE PRECISION EN METALES Y MATERIALES SIMILARES | 772.0=TRABAJADORES DE ARTES GRAFICAS Y ASIMILADOS | 773.0=CERAMISTAS, VIDRIEROS Y ASIMILADOS | 774.0=ARTESANOS DE LA MADERA, DE TEXTILES, DEL CUERO Y MATERIALES | 780.0=TRABAJADORES DE LA INDUSTRIA DE LA ALIMENTACION, BEBIDAS Y T | 791.0=TRABAJADORES QUE TRATAN LA MADERA Y ASIMILADOS | 792.0=EBANISTAS Y TRABAJADORES ASIMILADOS | 793.0=TRABAJADORES DE LA INDUSTRIA TEXTIL, LA CONFECCION Y ASIMILA | 804.0=ENCARGADOS DE TALLERES DE MADERA Y JEFES DE EQUIPO EN LA FAB | 806.0=JEFES DE EQUIPO EN INSTALACIONES DE PRODUCCION DE ENERGIA Y | 811.0=OPERADORES EN INSTALACIONES DE LA EXTRACCION Y EXPLOTACION D | 812.0=OPERADORES EN INSTALACIONES PARA LA OBTENCION Y TRANSFORMACI | 813.0=OPERADORES EN INSTALACIONES PARA LA OBTENCION, TRANSFORMACIO | 814.0=OPERADORES EN INSTALACIONES PARA EL TRABAJO DE LA MADERA Y L | 815.0=OPERADORES EN PLANTAS INDUSTRIALES QUIMICAS | 816.0=OPERADORES DE PLANTAS PARA PRODUCCION DE ENERGIA Y SIMILARES | 821.0=ENCARGADO DE OPERADORES DE MAQUINAS PARA TRABAJAR METALES | 822.0=ENCARGADO DE OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS | 825.0=JEFES DE TALLER DE IMPRENTA, ENCUADERNACION Y FABRICACION DE | 827.0=ENCARGADO DE OPERADORES DE MAQUINAS PARA ELABORAR PRODUCTOS | 831.0=OPERADORES DE MAQUINAS PARA TRABAJAR METALES Y OTROS PRODUCT | 832.0=OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS QUIMICOS | 833.0=OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS DE CAUCHO Y P | 834.0=OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS DE MADERA | 835.0=OPERADORES DE MAQUINAS PARA IMPRIMIR, ENCUADERNAR Y PARA FAB | 836.0=OPERADORES DE MAQUINAS PARA FABRICAR PRODUCTOS TEXTILES Y AR | 837.0=OPERADORES DE MAQUINAS PARA ELABORAR PRODUCTOS ALIMENTICIOS, | 841.0=MONTADORES Y ENSAMBLADORES | 849.0=OTROS MONTADORES Y ENSAMBLADORES | 851.0=MAQUINISTAS DE LOCOMOTORAS Y ASIMILADOS | 852.0=ENCARGADO DE OPERADORES DE MAQUINARIA DE MOVIMIENTO DE TIERR | 853.0=OPERADORES DE MAQUINARIA AGRICOLA MOVIL | 854.0=OPERADORES DE OTRAS MAQUINAS MOVILES | 855.0=MARINEROS DE CUBIERTA DE BARCO Y ASIMILADOS | 861.0=TAXISTAS Y CONDUCTORES DE AUTOMOVILES Y FURGONETAS | 862.0=CONDUCTORES DE AUTOBUSES | 863.0=CONDUCTORES DE CAMIONES | 900.0=VENDEDORES AMBULANTES Y ASIMILADOS | 911.0=EMPLEADOS DEL HOGAR | 912.0=PERSONAL DE LIMPIEZA DE OFICINAS, HOTELES Y OTROS TRABAJADOR | 921.0=CONSERJES DE EDIFICIOS, LIMPIACRISTALES Y ASIMILADOS | 922.0=VIGILANTES, GUARDIANES Y ASIMILADOS | 932.0=ORDENANZAS | 934.0=LECTORES DE CONTADORES (AGUA...) Y RECOLECTORES DE DINERO DE | 935.0=RECOGEDORES DE BASURA Y OBREROS ASIMILADOS | 941.0=PEONES AGRICOLAS | 943.0=PEONES AGROPECUARIOS | 944.0=PEONES FORESTALES | 960.0=PEONES DE LA CONSTRUCCION | 970.0=PEONES DE INDUSTRIAS MANUFACTURERAS | 980.0=PEONES DEL TRANSPORTE Y DESCARGADORES | 991.0=No pertenece a edición | 994.0=No procede | 997.0=No ha trabajado | 999.0=Ns/Nc
./audit_eas_variables.csv:978:IBSE;Bienestar Emocional (Bericat);labels888;991.0=No pertenece a edición | 994.0=No procede | 999.0=Ns/Nc
./audit_eas_variables.csv:979:IBSE_100;None;labels889;991.0=No pertenece a edición | 994.0=No procede | 999.0=Ns/Nc
./audit_eas_variables.csv:981:CAGE;Sospecha de alcoholismo del miembro entrevistado;labels891;1.0=Bebedor social | 2.0=Consumo riesgo | 3.0=Consumo perjudicial | 4.0=Dependencia alcohólica | 994.0=No procede
./audit_eas_variables.csv:991:LAWTONB_2023R;ESCALA-DE-LAWTON-Y-BRODY 2023;labels901;1.0=Dependencia total 0-1 | 2.0=Dependencia grave 2-3 | 3.0=Dependencia moderada 4-5 | 4.0=Dependencia ligera 6-7 | 5.0=Autónoma 8 | 991.0=No pertenece a edición | 994.0=No procede | 999.0=Ns/Nc
./audit_eas_variables.csv:993:LAWTONB_R;ESCALA-DE-LAWTON-Y-BRODY ediciones 2007,2012,2015;labels903;1.0=0-1 Dependencia total | 2.0=2-3 Dependencia grave | 3.0=4-5 Dependencia moderada | 4.0=6-7 Dependencia ligera | 5.0=8 Autónoma | 991.0=No pertenece a edición | 994.0=No procede | 999.0=Ns/Nc
./audit_eas_variables.csv:1001:P33_1_R;Sueño recomendado;labels911;0.0=No | 1.0=Sí | 996.0=No recogida en edición | 999.0=Ns/Nc
./audit_eas_variables.csv:1002:P33_R;Población que no duerme las horas de sueño recomendadas (Sociedad Española del Sueño);labels912;0.0=No | 1.0=Sí | 996.0=No recogida en edición | 999.0=Ns/Nc
./audit_eas_variables.csv:1003:P33_1_R2;Sueño recomendado (Sí/Más/Menos);labels913;1.0=Sí | 2.0=Menos | 3.0=Más | 996.0=No recogida en edición | 999.0=Ns/Nc
./audit_eas_variables.csv:1324:LAWTONB_2R;ESCALA-DE-LAWTON-Y-BRODY ediciones 2007,2012,2015,2023;labels1226;1.0=0-1 Dependencia total | 2.0=2-3 Dependencia grave | 3.0=4-5 Dependencia moderada | 4.0=6-7 Dependencia ligera | 5.0=8 Autónoma | 994.0=No procede
./audit_eas_variables.csv:1337:CAGE_R;Riesgo de alcoholismo;labels1239;0.0=No | 1.0=Sí | 994.0=No procede | 995.0=No recogida en oleada | 996.0=No recogida en edición | 999.0=Ns/Nc
./Churriana/Churriana_pack/determinantes_churriana.csv:19:2;P32_CAGE;CAGE positivo (≥2 respuestas);%;2.5;2.4;2.6
./Churriana/Churriana_pack/determinantes_churriana.csv:36:2;PREDIMED;Alta adherencia dieta mediterránea;%;42.8;43.8;42.5
./Churriana/Churriana_pack/priorizacion_churriana.csv:9:Sueño Saludable;1;El descanso y el sueño saludable son componentes esenciales del bienestar emocional y la calidad de vida. El 27,2% de la población presenta problemas de sueño frecuentes, área de mejora.
./Churriana/Churriana_pack/recomendaciones_churriana.csv:3:02;Acompasar el Plan Local de Salud a la Estrategia de Promoción de Vida Saludable en Andalucía, incorporando indicadores que permitan seguimiento y comparación territorial.
./color-check/audit.mjs:8:await page.locator('button').filter({ hasText: /Perfil de Salud Local/i }).click();
./color-check/audit.mjs:16:// Captura: Marco Estratégico (cap I reformado)
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:2:record_id,cuestionario_pantallas,,text,"Record ID",,,,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:3:encuesta_activa,cuestionario_pantallas,,calc,,0,,,,,,,,,,,," @HIDDEN"
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:4:presentacion,cuestionario_pantallas,,descriptive,"<div style=""font-family:Georgia,'Times New Roman',serif;max-width:620px;margin:0 auto;color:#1a1a1a;"">
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:14:<div style=""font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.72em;letter-spacing:1.5px;text-transform:uppercase;color:#4A4A4A;"">Distrito Granada-Metropolitano · Plan Local de Salud de Huétor Tájar</div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:22:<p style=""margin:0 0 16px 0;"">Este cuestionario se dirige a chicos y chicas de 12 a 17 años residentes en Huétor Tájar. Es anónimo: ninguna persona, ni en tu familia ni en tu centro educativo, podrá ver tus respuestas individuales.</p>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:35:<div style=""font-size:.78em;letter-spacing:.5px;text-transform:uppercase;color:#b9740a;margin-bottom:4px;"">Qué no es este cuestionario</div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:41:<p style=""margin:0;"">Los datos, tratados de forma agregada y anónima, contribuyen a que el Plan Local de Salud de Huétor Tájar conozca mejor los hábitos de uso de pantallas entre la población adolescente del municipio, con el fin de orientar sus actuaciones de promoción de la salud.</p>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:51:ficha_metodologica,cuestionario_pantallas,,descriptive,"<div style=""background:#f8f9fa;border:1px dashed #999;border-radius:10px;padding:10px;margin:10px 0;font-size:.75em;color:#555;font-family:'Segoe UI',sans-serif;"">
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:53:edad,cuestionario_pantallas,"<div style=""border-top:1px solid #e0e0e0;border-bottom:2px solid #1E7FC2;background:#fafafa;padding:14px 18px;margin:20px 0 10px 0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;"">
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:59:sexo,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Con qué sexo te identificas?</div></div>","1, Chico | 2, Chica | 3, Otro",,,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:60:juega_videojuegos,cuestionario_pantallas,,yesno,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Juegas a videojuegos de forma habitual (al menos ocasionalmente), en consola, ordenador, móvil o tablet?</div></div>",,"Ítem de cribado: determina si se muestra el bloque de videojuegos (IGDS9-SF, al final del cuestionario).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:61:pantalla_tv_semana,cuestionario_pantallas,"<div style=""border-top:1px solid #e0e0e0;border-bottom:2px solid #1E7FC2;background:#fafafa;padding:14px 18px;margin:20px 0 10px 0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;"">
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:67:pantalla_ordenador_semana,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Cuánto tiempo sueles dedicar a usar el ordenador o la tablet (sin contar videojuegos), un día entre semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas","Ítem adaptado de ""Tardes con Plan"" (Ministerio de Sanidad) y del Estudio HBSC (OMS). El código de cada opción es el punto medio en minutos del intervalo.",,,,,,y,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:68:pantalla_videojuegos_semana,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Cuánto tiempo sueles dedicar a jugar a videojuegos (consola, PC o móvil), un día entre semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas","Ítem adaptado de ""Tardes con Plan"" (Ministerio de Sanidad) y del Estudio HBSC (OMS). El código de cada opción es el punto medio en minutos del intervalo.",,,,,,y,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:69:pantalla_movil_semana,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Cuánto tiempo sueles dedicar a usar el teléfono móvil (redes sociales, mensajería, vídeos), un día entre semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas","Ítem adaptado de ""Tardes con Plan"" (Ministerio de Sanidad) y del Estudio HBSC (OMS). El código de cada opción es el punto medio en minutos del intervalo.",,,,,,y,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:70:pantalla_tv_finde,cuestionario_pantallas,"<div style=""border-top:1px solid #e0e0e0;border-bottom:2px solid #1E7FC2;background:#fafafa;padding:14px 18px;margin:20px 0 10px 0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;"">
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:76:pantalla_ordenador_finde,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Cuánto tiempo sueles dedicar a usar el ordenador o la tablet (sin contar videojuegos), un día de fin de semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas","Ítem adaptado de ""Tardes con Plan"" (Ministerio de Sanidad) y del Estudio HBSC (OMS). El código de cada opción es el punto medio en minutos del intervalo.",,,,,,y,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:77:pantalla_videojuegos_finde,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Cuánto tiempo sueles dedicar a jugar a videojuegos (consola, PC o móvil), un día de fin de semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas","Ítem adaptado de ""Tardes con Plan"" (Ministerio de Sanidad) y del Estudio HBSC (OMS). El código de cada opción es el punto medio en minutos del intervalo.",,,,,,y,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:78:pantalla_movil_finde,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Cuánto tiempo sueles dedicar a usar el teléfono móvil (redes sociales, mensajería, vídeos), un día de fin de semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas","Ítem adaptado de ""Tardes con Plan"" (Ministerio de Sanidad) y del Estudio HBSC (OMS). El código de cada opción es el punto medio en minutos del intervalo.",,,,,,y,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:79:actividad_principal,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">De todo lo que haces con las pantallas, ¿cuál dirías que es tu actividad principal?</div></div>","1, Redes sociales | 2, Vídeos o series (streaming) | 3, Videojuegos | 4, Mensajería o chats | 5, Estudiar o hacer tareas","Categorización descriptiva de elaboración propia, sin escala validada de referencia.",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:80:uso_antes_dormir,cuestionario_pantallas,"<div style=""border-top:1px solid #e0e0e0;border-bottom:2px solid #1E7FC2;background:#fafafa;padding:14px 18px;margin:20px 0 10px 0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;"">
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:86:movil_en_habitacion_noche,cuestionario_pantallas,,yesno,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Duermes con el móvil en tu habitación por la noche?</div></div>",,,,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:87:intro_ids9sf,cuestionario_pantallas,"<div style=""border-top:1px solid #e0e0e0;border-bottom:2px solid #1E7FC2;background:#fafafa;padding:14px 18px;margin:20px 0 10px 0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;"">
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:93:crit_preocupacion,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Te sientes preocupado/a por tu comportamiento online (piensas en sesiones anteriores, anticipas la próxima vez que vas a conectarte, o sientes que estar conectado/a se ha convertido en la actividad dominante de tu día)?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 1 (preocupación / saliencia cognitiva).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:94:crit_abstinencia,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Sientes más irritabilidad, ansiedad o tristeza cuando intentas reducir o dejar de usar pantallas/internet?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 2 (síntomas de abstinencia).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:95:crit_tolerancia,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Sientes la necesidad de pasar cada vez más tiempo conectado/a para conseguir satisfacción o placer?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 3 (tolerancia).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:96:crit_perdida_control,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Tienes dificultades para intentar controlar, reducir o dejar tu uso de pantallas/internet?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 4 (pérdida de control).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:97:crit_perdida_interes,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Has perdido interés por aficiones anteriores u otras actividades de ocio por estar conectado/a?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 5 (pérdida de interés por otras actividades).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:98:crit_uso_pese_problemas,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Has seguido conectándote a pesar de saber que te estaba causando problemas con otras personas?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 6 (continuación a pesar de las consecuencias negativas).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:99:crit_engano,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Has engañado a algún familiar u otra persona sobre el tiempo que pasas conectado/a?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 7 (engaño/ocultación).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:100:crit_evasion_animo,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Te conectas para escapar o sentirte mejor cuando tienes un estado de ánimo negativo (por ejemplo, desesperanza, culpa o ansiedad)?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 8 (uso para regular el estado de ánimo).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:101:crit_relaciones_perjudicadas,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Has comprometido o perdido una relación importante, una oportunidad educativa o algo similar por tu uso de pantallas/internet?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente","Traducción razonada NO OFICIAL al español de uno de los 9 ítems de la IDS9-SF (Pontes, H.M. y Griffiths, M.D. (2016). The development and psychometric properties of the Internet Disorder Scale–Short Form (IDS9-SF). Addicta: The Turkish Journal on Addictions, 3(3), 303-318. doi:10.15805/addicta.2016.3.0102). El artículo no declara licencia de reproducción tipo CC BY, por lo que esta NO es una reproducción literal autorizada, sino una traducción/paráfrasis razonada con fines de investigación, fielmente alineada al constructo original. Corresponde al ítem: Ítem 9 (perjuicio a relaciones/oportunidades).",,,,,,,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:102:intro_igds9sf,cuestionario_pantallas,"<div style=""border-top:1px solid #e0e0e0;border-bottom:2px solid #1E7FC2;background:#fafafa;padding:14px 18px;margin:20px 0 10px 0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;"">
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:108:igds_1,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Te sientes preocupado por tu comportamiento con el juego? (Algunos ejemplos: ¿Piensas en exceso cuando no estás jugando o anticipas en exceso a la próxima sesión de juego?, ¿Crees que el juego se ha convertido en la actividad dominante en tu vida diaria?)</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:109:igds_2,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Sientes irritabilidad, ansiedad o incluso tristeza cuando intentas reducir o detener tu actividad de juego?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:110:igds_3,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Sientes la necesidad de pasar cada vez más tiempo jugando para lograr satisfacción o placer?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:111:igds_4,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Fallas sistemáticamente al intentar controlar o terminar tu actividad de juego?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:112:igds_5,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Has perdido intereses en aficiones anteriores y otras actividades de entretenimiento como resultado de tu compromiso con el juego?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:113:igds_6,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Has continuado jugando a pesar de saber que te estaba causando problemas con otras personas? (pareja, amistad o familia)</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:114:igds_7,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Has engañado a alguno de tus familiares, terapeutas o amigos sobre el tiempo que pasas jugando?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:115:igds_8,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Juegas para escapar temporalmente o aliviar un estado de ánimo negativo (por ejemplo, desesperanza, tristeza, culpa o ansiedad)?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:116:igds_9,cuestionario_pantallas,,radio,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿Has comprometido o perdido una relación importante, un trabajo o una oportunidad educativa debido a tu actividad de juego?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo","Ítem literal de la versión española validada de la IGDS9-SF (Pontes y Griffiths, 2015; validación española: Beranuy, Machimbarrena, Vega-Osés, Carbonell, Griffiths, Pontes y González-Cabrera, 2020, Int. J. Environ. Res. Public Health, 17(5), 1562, doi:10.3390/ijerph17051562). Artículo de acceso abierto bajo licencia Creative Commons Attribution (CC BY 4.0); ítem reproducido del Apéndice A con atribución, según permite la licencia. Referido específicamente a videojuegos durante los últimos 12 meses.",,,,,"[juega_videojuegos] = 1",,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:117:tiempo_aire_libre,cuestionario_pantallas,,text,"<div style=""background:white;border:2px solid #0066cc;border-radius:12px;padding:12px;margin:10px 0;box-shadow:0 3px 10px rgba(0,102,204,.12);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.92em;line-height:1.4;""><div style=""color:#0066cc;font-weight:bold;font-size:.95em;margin-bottom:6px;"">¿En cuántos días de la última semana has jugado, hecho deporte o quedado al aire libre sin pantallas?</div></div>",,,integer,0,7,,,y,,,,,
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:126:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:137:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:148:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:159:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:182:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:193:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:204:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:215:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:239:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:250:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:261:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:272:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:286:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:297:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:308:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:319:<p style=""margin:0;font-size:.85em;opacity:.95;"">Desconecta para conectar · Plan Local de Salud de Huétor Tájar</p></div>
./DesconectaParaConectar_DataDictionary_2026-06-26.csv:350:<p style=""margin:6px 0 0 0;font-size:.9em;"">Plan Local de Salud de Huétor Tájar · Desconecta para conectar</p></div>
./docs/architecture/OPERATING-CONSTITUTION.md:49:  │   → Perfil de Salud Local (PSL)  ← único puente al Nivel 3
./docs/architecture/OPERATING-CONSTITUTION.md:55:  │   → Encaje estratégico EPVSA
./docs/architecture/OPERATING-CONSTITUTION.md:56:  │   → Plan de Acción (borrador técnico)
./docs/architecture/OPERATING-CONSTITUTION.md:82:| IBSE (REDCap) | `redcap-export` + tag `"ibse"` | Por `tag` (uno por municipio) |
./docs/architecture/OPERATING-CONSTITUTION.md:83:| Priorización Temática (REDCap) | `redcap-export` + tag `"thematic-prioritisation"` | Por `tag` (uno por municipio) |
./docs/architecture/OPERATING-CONSTITUTION.md:84:| Estudios EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `complementary-study` + tag propio | Acumulable por tag |
./docs/architecture/OPERATING-CONSTITUTION.md:101:            → EPVSA
./docs/architecture/OPERATING-CONSTITUTION.md:102:              → Plan de Acción
./docs/architecture/OPERATING-CONSTITUTION.md:109:Los resultados del MIT, la Reconciliación, el PSL no validado, el Plan de Acción,
./docs/architecture/OPERATING-CONSTITUTION.md:140:el Motor de Interpretación Territorial, el PSL, el Plan de Acción, la Agenda,
./docs/architecture/OPERATING-CONSTITUTION.md:155:- Los seis estudios (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS, CAGE-EAS)
./docs/architecture/OPERATING-CONSTITUTION.md:197:   IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS tienen el mismo
./docs/architecture/OPERATING-CONSTITUTION.md:385:| Contrato del Plan de Acción | `docs/contracts/CONTRACT-ACTION-PLAN.md` | Plan de Acción, Agenda, Seguimiento |
./docs/architecture/OPERATING-CONSTITUTION.md:386:| Contrato del Compiler | `docs/contracts/CONTRACT-COMPILER.md` | Compilador del Plan Local de Salud |
./docs/contracts/CONTRACT-ACTION-PLAN.md:1:# COMPÁS NG — Contrato del Nivel 3: Priorización, Traducción Estratégica y Plan de Acción
./docs/contracts/CONTRACT-ACTION-PLAN.md:6:> Motor de Traducción Estratégica, Plan de Acción, Agenda tipo y Seguimiento.
./docs/contracts/CONTRACT-ACTION-PLAN.md:15:conjunto de motores que transforman el Perfil de Salud Local (PSL) validado
./docs/contracts/CONTRACT-ACTION-PLAN.md:32:| `StrategicTranslationEngine` (`EPVSATranslator` en código actual) | `PrioritizationResult` | `StrategicTranslationResult` (`EPVSATranslationResult` en código actual) |
./docs/contracts/CONTRACT-ACTION-PLAN.md:85:                    └─▶ ActionPlanObjective.linkedStrategicLine  (EPVSA)
./docs/contracts/CONTRACT-ACTION-PLAN.md:106:El motor de Plan de Acción recibe adicionalmente una `PSLReference` (snapshot
./docs/contracts/CONTRACT-ACTION-PLAN.md:112:consultados por el motor de Plan de Acción para construir `FrameworkAlignment`.
./docs/contracts/CONTRACT-ACTION-PLAN.md:113:Los marcos actuales registrados son: EPVSA, ESCA, MAYORES, BUENA_EDAD, RELAS.
./docs/contracts/CONTRACT-ACTION-PLAN.md:115:**Regla MTE-1 — EPVSA no es el único marco estratégico.** La EPVSA es un marco central, pero no exclusivo. El Motor de Traducción Estratégica debe considerar de forma explícita otros marcos oficiales pertinentes, incluyendo al menos ESCA y el Plan Estratégico Integral para Personas Mayores de Andalucía 2020–2023 y sus documentos asociados, cuando el PSL contenga hallazgos relacionados con salud comunitaria, activos, participación, intersectorialidad, envejecimiento, fragilidad, autonomía, soledad no deseada o participación social.
./docs/contracts/CONTRACT-ACTION-PLAN.md:119:**Regla MTE-3 — Traducción sin decisión automática.** El Motor de Traducción Estratégica propone alineaciones entre áreas del PSL y marcos oficiales. No selecciona prioridades, no aprueba líneas, no impone objetivos ni activa indicadores sin deliberación humana.
./docs/contracts/CONTRACT-ACTION-PLAN.md:126:estratégicos utilizados por el Motor de Traducción Estratégica.
./docs/contracts/CONTRACT-ACTION-PLAN.md:143:elementos se apliquen automáticamente a cada Perfil de Salud Local.
./docs/contracts/CONTRACT-ACTION-PLAN.md:187:- No traduce las candidatas a líneas estratégicas EPVSA.
./docs/contracts/CONTRACT-ACTION-PLAN.md:193:## 7. Motor de Traducción Estratégica (`StrategicTranslationEngine`; `EPVSATranslator` en código actual)
./docs/contracts/CONTRACT-ACTION-PLAN.md:197:Sugiere, de forma prudente, una línea estratégica de la EPVSA 2024–2030 para
./docs/contracts/CONTRACT-ACTION-PLAN.md:229:### 7.4 Cautelas del motor EPVSA
./docs/contracts/CONTRACT-ACTION-PLAN.md:233:1. La traducción EPVSA es orientativa y no sustituye deliberación técnica,
./docs/contracts/CONTRACT-ACTION-PLAN.md:236:3. No debe usarse esta traducción como selección automática de líneas EPVSA.
./docs/contracts/CONTRACT-ACTION-PLAN.md:240:### 7.5 Lo que la traducción EPVSA no hace
./docs/contracts/CONTRACT-ACTION-PLAN.md:249:## 8. Plan de Acción (`ActionPlanEngine`)
./docs/contracts/CONTRACT-ACTION-PLAN.md:253:Transforma el resultado de la traducción EPVSA en un borrador inicial de
./docs/contracts/CONTRACT-ACTION-PLAN.md:254:Plan de Acción con objetivos, actuaciones e indicadores preliminares, todos
./docs/contracts/CONTRACT-ACTION-PLAN.md:274:### 8.3 Estructura del Plan de Acción
./docs/contracts/CONTRACT-ACTION-PLAN.md:278:Un objetivo por sugerencia EPVSA. Campos:
./docs/contracts/CONTRACT-ACTION-PLAN.md:281:- `linkedStrategicLine`: etiqueta de la línea EPVSA asignada.
./docs/contracts/CONTRACT-ACTION-PLAN.md:293:- `cautions`: cautelas metodológicas (heredadas de la sugerencia EPVSA).
./docs/contracts/CONTRACT-ACTION-PLAN.md:311:**Encaje directo** (`alignmentType: "direct"`): la línea EPVSA asignada tiene
./docs/contracts/CONTRACT-ACTION-PLAN.md:312:un elemento registrado en el registro (p. ej., `EPVSA-LE2`). Se vincula
./docs/contracts/CONTRACT-ACTION-PLAN.md:316:de EPVSA (ESCA, MAYORES, BUENA_EDAD, RELAS), se busca por palabras clave
./docs/contracts/CONTRACT-ACTION-PLAN.md:317:de la línea EPVSA en los textos de los elementos de los otros marcos. Solo
./docs/contracts/CONTRACT-ACTION-PLAN.md:331:### 8.5 Cautelas fijas del Plan de Acción
./docs/contracts/CONTRACT-ACTION-PLAN.md:345:### 8.6 Lo que el Plan de Acción no hace
./docs/contracts/CONTRACT-ACTION-PLAN.md:349:- No aprueba el Plan Local de Salud del municipio.
./docs/contracts/CONTRACT-ACTION-PLAN.md:359:Transforma el Plan de Acción en un borrador de agenda anual con distribución
./docs/contracts/CONTRACT-ACTION-PLAN.md:367:- `annualItems`: uno por actuación del Plan de Acción.
./docs/contracts/CONTRACT-ACTION-PLAN.md:474:> «Este borrador de Plan de Acción ha sido generado sobre un pipeline sin
./docs/contracts/CONTRACT-ACTION-PLAN.md:528:**I-N3-4 — La heurística EPVSA no es determinista por semántica**
./docs/contracts/CONTRACT-ACTION-PLAN.md:530:La línea EPVSA asignada a una candidata depende exclusivamente de las palabras
./docs/contracts/CONTRACT-ACTION-PLAN.md:548:**I-N3-7 — `pslIsStale` se propaga al Plan de Acción**
./docs/contracts/CONTRACT-ACTION-PLAN.md:551:`pslReference.isStale === true`. El motor de Plan de Acción lo propaga
./docs/contracts/CONTRACT-ACTION-PLAN.md:559:entre la línea EPVSA y elementos de otros marcos (ESCA, RELAS, etc.) mediante
./docs/contracts/CONTRACT-ACTION-PLAN.md:580:- **`compiler`**: compilador del Plan Local de Salud como producto documental
./docs/contracts/CONTRACT-ACTION-PLAN.md:582:  y el Plan de Acción. Está explícitamente fuera del alcance actual según el
./docs/contracts/CONTRACT-ACTION-PLAN.md:598:**R-N3-2 — Heurística EPVSA puede asignar líneas incorrectas**
./docs/contracts/CONTRACT-ACTION-PLAN.md:609:equipo no lo regenera, el Plan de Acción se genera sobre un diagnóstico
./docs/contracts/CONTRACT-ACTION-PLAN.md:647:2. Los indicadores del Plan de Acción han sido concretados y tienen fuentes
./docs/contracts/CONTRACT-ACTION-PLAN.md:676:  institucional del Plan Local de Salud, compromisos presupuestarios.
./docs/contracts/CONTRACT-ACTION-PLAN.md:686:| 2026-06-24 | Primera redacción. Documenta el estado del código a partir del commit `1e582f5`. Formaliza PSL-C1 en el Nivel 3, la cadena de trazabilidad completa, la heurística EPVSA, `PSLReference`, `FrameworkAlignment`, la distinción Agenda/ejecución y Seguimiento/evaluación, los riesgos conocidos y los criterios de evolución para los stages `evaluation` y `compiler`. |
./docs/contracts/CONTRACT-COMPILER.md:1:# COMPÁS NG — Contrato del Compilador del Plan Local de Salud
./docs/contracts/CONTRACT-COMPILER.md:14:El **Compilador del Plan Local de Salud** es el último stage del pipeline de
./docs/contracts/CONTRACT-COMPILER.md:15:COMPÁS NG. Su función futura es ensamblar y exportar el Plan Local de Salud
./docs/contracts/CONTRACT-COMPILER.md:19:El compilador no analiza evidencia, no genera propuestas ni produce
./docs/contracts/CONTRACT-COMPILER.md:44:> «Compilador del Plan Local de Salud: producto documental compilado a
./docs/contracts/CONTRACT-COMPILER.md:45:> partir del Plan de Acción validado. El Plan de Acción actual es un
./docs/contracts/CONTRACT-COMPILER.md:52:## 3. Distinción fundamental: Plan de Acción ≠ Plan Local de Salud compilado
./docs/contracts/CONTRACT-COMPILER.md:60:| Plan Local de Salud compilado | Documento institucional exportable. Producto del stage `compiler`. Requiere PSL aprobado y plan validado como gate | No implementado |
./docs/contracts/CONTRACT-COMPILER.md:62:El Plan de Acción **no es** el Plan Local de Salud. El Plan Local de Salud
./docs/contracts/CONTRACT-COMPILER.md:75:            └─▶ Nivel 3: Priorización → EPVSA → Plan de Acción → Agenda → Seguimiento
./docs/contracts/CONTRACT-COMPILER.md:83:            Plan Local de Salud compilado
./docs/contracts/CONTRACT-COMPILER.md:87:El compilador es el punto terminal del pipeline. Ningún motor posterior
./docs/contracts/CONTRACT-COMPILER.md:95:Antes de que el compilador pueda ejecutarse, deben existir y estar
./docs/contracts/CONTRACT-COMPILER.md:101:la condición de aprobación institucional del Perfil de Salud Local, posterior
./docs/contracts/CONTRACT-COMPILER.md:112:### 5.2 Plan de Acción revisado técnicamente
./docs/contracts/CONTRACT-COMPILER.md:130:El compilador debe poder acceder a la cadena de trazabilidad completa que
./docs/contracts/CONTRACT-COMPILER.md:131:conecta cada elemento del Plan Local de Salud con su origen en el
./docs/contracts/CONTRACT-COMPILER.md:148:| G-C5 | Plan de Acción técnicamente revisado | Sin mecanismo de validación formal implementado |
./docs/contracts/CONTRACT-COMPILER.md:163:El compilador producirá un único artefacto por ejecución:
./docs/contracts/CONTRACT-COMPILER.md:166:Plan Local de Salud de [Nombre del municipio]
./docs/contracts/CONTRACT-COMPILER.md:172:El Plan Local de Salud compilado debe incluir, como mínimo, los mismos
./docs/contracts/CONTRACT-COMPILER.md:177:| I | Marco Estratégico | PSL Cap. I + marcos registrados |
./docs/contracts/CONTRACT-COMPILER.md:184:| VIII | Plan de Acción | Objetivos, actuaciones e indicadores revisados |
./docs/contracts/CONTRACT-COMPILER.md:213:**I-C1 — El compilador no analiza evidencia**
./docs/contracts/CONTRACT-COMPILER.md:215:El compilador no ejecuta el IntegrityGuard, no procesa el `EvidenceStore`,
./docs/contracts/CONTRACT-COMPILER.md:219:**I-C2 — El compilador no genera PSL**
./docs/contracts/CONTRACT-COMPILER.md:221:El compilador recibe el PSL como entrada ya existente y validada. No crea
./docs/contracts/CONTRACT-COMPILER.md:223:compilador.
./docs/contracts/CONTRACT-COMPILER.md:225:**I-C3 — El compilador no prioriza**
./docs/contracts/CONTRACT-COMPILER.md:228:compilador. El compilador las registra y exporta; no las calcula ni las
./docs/contracts/CONTRACT-COMPILER.md:231:**I-C4 — El compilador no decide institucionalmente**
./docs/contracts/CONTRACT-COMPILER.md:234:decisión institucional. La aprobación institucional del Plan Local de Salud
./docs/contracts/CONTRACT-COMPILER.md:235:es un acto humano externo al sistema. El compilador no puede aprobar el
./docs/contracts/CONTRACT-COMPILER.md:238:**I-C5 — El compilador requiere PSL aprobado, no solo validado**
./docs/contracts/CONTRACT-COMPILER.md:240:`"validated"` es la condición mínima para el Nivel 3 (Plan de Acción,
./docs/contracts/CONTRACT-COMPILER.md:241:Agenda, Seguimiento). El compilador requiere `"approved"`: una condición
./docs/contracts/CONTRACT-COMPILER.md:247:La ejecución del compilador no altera el `EvidenceStore`, el repositorio
./docs/contracts/CONTRACT-COMPILER.md:253:Cada elemento del Plan Local de Salud compilado debe ser trazable hasta
./docs/contracts/CONTRACT-COMPILER.md:254:su origen en la cadena de evidencia. Un compilador que no pueda garantizar
./docs/contracts/CONTRACT-COMPILER.md:257:**I-C8 — El compilador no es el stage `evaluation`**
./docs/contracts/CONTRACT-COMPILER.md:261:y diferente a la compilación del plan inicial. El compilador produce el
./docs/contracts/CONTRACT-COMPILER.md:269:**R-C1 — Confundir el Plan de Acción con el Plan Local de Salud**
./docs/contracts/CONTRACT-COMPILER.md:272:presenta como el Plan Local de Salud oficial, el municipio puede tomar
./docs/contracts/CONTRACT-COMPILER.md:273:compromisos sobre una base técnica insuficiente. El compilador, cuando
./docs/contracts/CONTRACT-COMPILER.md:277:**R-C2 — Activar el compilador sin PSL aprobado**
./docs/contracts/CONTRACT-COMPILER.md:279:Si el compilador se implementa sin el gate G-C1 (PSL `"approved"`),
./docs/contracts/CONTRACT-COMPILER.md:280:podría producir documentos basados en borradores. Un Plan Local de Salud
./docs/contracts/CONTRACT-COMPILER.md:287:El formato del Plan Local de Salud tiene requisitos institucionales
./docs/contracts/CONTRACT-COMPILER.md:288:específicos de la Junta de Andalucía y del marco RELAS. Un formato
./docs/contracts/CONTRACT-COMPILER.md:297:pierde su auditabilidad. Un Plan Local de Salud no auditable tiene valor
./docs/contracts/CONTRACT-COMPILER.md:303:cuota de localStorage (~5 MB). El compilador debe diseñarse para exportar
./docs/contracts/CONTRACT-COMPILER.md:318:- Debe existir un mecanismo de validación formal del Plan de Acción que
./docs/contracts/CONTRACT-COMPILER.md:341:El Plan Local de Salud compilado debe ser coherente con los requisitos
./docs/contracts/CONTRACT-COMPILER.md:342:formales del marco RELAS y de la Consejería de Salud y Consumo de la
./docs/contracts/CONTRACT-COMPILER.md:350:| Contrato | Relación con el compilador |
./docs/contracts/CONTRACT-COMPILER.md:352:| `CONTRACT-REPOSITORY.md` | Los documentos del repositorio son fuente trazable del Plan compilado. El compilador los referencia; no los modifica |
./docs/contracts/CONTRACT-COMPILER.md:353:| `CONTRACT-EVIDENCE.md` | Los `EvidenceAtom` son la base de trazabilidad del diagnóstico que el compilador incluye. El compilador no genera ni modifica átomos |
./docs/contracts/CONTRACT-COMPILER.md:354:| `CONTRACT-MIT-PSL.md` | El PSL en estado `"approved"` es la entrada principal del compilador. PSL-I1 (el PSL referencia el Informe de Salud; no lo contiene) aplica también al documento compilado |
./docs/contracts/CONTRACT-COMPILER.md:355:| `CONTRACT-COMPLEMENTARY-STUDIES.md` | Los estudios complementarios contribuyen evidencia al PSL. El documento compilado debe referenciar qué estudios estuvieron presentes en el diagnóstico |
./docs/contracts/CONTRACT-COMPILER.md:356:| `CONTRACT-PERSISTENCE.md` | El compilador no debe persistir el artefacto compilado en localStorage. La exportación es una operación de lectura del workspace seguida de descarga directa |
./docs/contracts/CONTRACT-COMPILER.md:357:| `CONTRACT-ACTION-PLAN.md` | El Plan de Acción, la Agenda y el Seguimiento del Nivel 3 son capítulos del Plan Local de Salud compilado. El compilador toma como entrada el PSL aprobado y los objetos validados del Nivel 3 derivados de ese PSL |
./docs/contracts/CONTRACT-COMPILER.md:370:- **Priorización, EPVSA, Plan de Acción, Agenda y Seguimiento**: véase
./docs/contracts/CONTRACT-COMPILER.md:373:  stage distinto del compilador, también sin implementación activa.
./docs/contracts/CONTRACT-COMPILER.md:374:- **Aprobación institucional** del Plan Local de Salud: es un acto humano
./docs/contracts/CONTRACT-COMPILER.md:386:| 2026-06-24 | Primera redacción. Documenta el stage `compiler` como reserva arquitectónica sin implementación activa. Establece los gates obligatorios, la distinción Plan de Acción / Plan Local de Salud compilado, los invariantes y los criterios mínimos de implementación futura. |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:17:REDCap u otros sistemas de captura y producen datos procesados localmente.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:26:  Plan de Acción;
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:41:IBSE, SF-12, DUKE, PREDIMED, CAGE, ESCA y cualquier otro instrumento que se
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:44:de IBSE en COMPÁS NG no le otorga una categoría distinta al resto.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:50:| **IBSE** — Índice de Bienestar Socioemocional | `validated-scale` | Implementado (módulo en `draft`; ver §9) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:52:| **PREDIMED-EAS** — Adherencia a Dieta Mediterránea (PREDIMED-14 sobre EAS) | `validated-scale` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:53:| **SF-12 EAS** — Salud percibida (PCS/MCS sobre EAS) | `validated-scale` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:54:| **Sueño EAS** — Duración y calidad subjetiva del sueño (P33_R / P33A sobre EAS) | `eas-official-block` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:55:| **CAGE-EAS** — Riesgo de alcoholismo (CAGE_R / CAGE sobre EAS) | `eas-official-block` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:56:| **ESCA** — Escalas propias | `municipal-module` | Conceptual |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:67:- **REDCap**: sistema de captura habitual. La exportación CSV de REDCap es el
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:79:Un cuestionario puede agregarse a partir de múltiples instrumentos
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:80:(por ejemplo: bloque sociodemográfico EAS + IBSE + PREDIMED). En ese caso,
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:81:cada instrumento conserva su identidad metodológica propia. El cuestionario
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:97:| IBSE (exportación REDCap municipal) | `"redcap-export"` | `"ibse"` | Por tag (uno por municipio) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:98:| Instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `"complementary-study"` | Tag propio del instrumento | Por tag (uno por municipio) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:99:| Futuros instrumentos REDCap | `"redcap-export"` | Tag propio del instrumento | Por tag (uno por municipio) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:110:**Razón de la distinción `redcap-export` vs `complementary-study`:** IBSE
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:111:es una exportación REDCap de un cuestionario municipal administrado directamente
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:112:por el equipo. Los instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) son
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:114:no exportaciones de REDCap municipal. Esta distinción refleja el origen diferente
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:124:| IBSE | `redcap-export` | `"ibse"` |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:127:| PREDIMED-EAS | `complementary-study` | `"predimed-eas"` |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:128:| SF-12 EAS | `complementary-study` | `"sf12-eas"` |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:129:| Sueño EAS | `complementary-study` | `"sueno-eas"` |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:130:| CAGE-EAS | `complementary-study` | `"cage-eas"` |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:132:**Nota:** La Priorización Temática comparte `kind: "redcap-export"` con IBSE
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:167:El caso IBSE ilustra la distinción:
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:169:- **IBSE_FACTORES** (5 átomos, `kind: "indicator"`): evidencia cuantitativa
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:171:- **IBSE_RESUMEN** (1 átomo, `kind: "qualitative-observation"`, tag
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:172:  `"ibse-derived"`): síntesis automática derivada de IBSE_FACTORES. No es
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:200:descarta los individuales. Solo los agregados sobreviven en `IBSEAggregates`
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:202:contrato de cada instrumento, no solo de IBSE.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:218:- los adaptadores para sistemas de captura (REDCap, SAV, etc.).
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:224:El parser IBSE ilustra esta dependencia: lee sus nombres de columna directamente
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:225:desde `IBSE_MODULE.adapters.redcap.columns`, no los tiene hardcoded.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:235:| `items` | Ítems del instrumento: texto, dimensión, tipo de respuesta, opciones, inversión de escala, campo REDCap |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:241:| `adapters` | Adaptadores opcionales para REDCap, SAV u otros sistemas |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:254:Los instrumentos de Estudios Complementarios validados (IBSE, SF-12, DUKE,
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:255:PREDIMED) son `validated-scale`. Los módulos específicos del municipio son
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:277:4. El adaptador REDCap (cuando existe) está verificado contra un diccionario
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:278:   REDCap real del instrumento.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:282:### 5.6 Estado actual de IBSE en la Biblioteca
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:284:El módulo `IBSE_MODULE` está en estado `"draft"` por la siguiente razón
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:287:> Los 8 ítems han sido verificados contra el diccionario REDCap interno
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:288:> (`MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv`). Pendiente el
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:291:Los ítems, dimensiones, algoritmo y adaptador REDCap están completos y son
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:304:cuestionarios municipales a partir de módulos de la Biblioteca Metodológica y
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:308:Un cuestionario construido con el Constructor puede convertirse en la fuente
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:312:2. Se genera un diccionario REDCap o equivalente.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:318:- Valida que cada `ModuleId` declarado en el cuestionario exista en el
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:320:- Genera el diccionario REDCap (`RedcapDictionaryDefinition`) iterando los
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:330:  primero en la Biblioteca antes de poder incluirse en un cuestionario.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:332:  algoritmos de cada instrumento son propiedad del módulo, no del cuestionario.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:333:- No genera parsers automáticamente. Un cuestionario compuesto requiere un
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:339:sociodemográficos o de contexto que pueden añadirse al cuestionario junto a
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:357:## 7. REDCap y fuentes externas
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:359:### 7.1 REDCap como sistema de captura
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:361:REDCap es el sistema de captura de datos habitual para los Estudios
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:362:Complementarios en COMPÁS NG. La exportación CSV de REDCap es el
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:370:| **Formulario REDCap** | Instrumento digital con el que los participantes responden. No es gestionado por COMPÁS NG |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:371:| **Exportación REDCap** | Fichero CSV que REDCap genera con los registros de cada participante. Es el documento fuente importado en COMPÁS NG |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:372:| **Estudio interpretado** | Objeto de dominio (`IBSEStudy` o equivalente) que contiene los agregados municipales calculados a partir de la exportación. Es la representación interna del estudio en COMPÁS NG |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:374:La exportación REDCap contiene datos individuales. El estudio interpretado
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:380:IBSE; instrumento SF-12 original; etc.), el módulo metodológico de COMPÁS NG
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:385:Cuando REDCap calcula internamente valores intermedios (como hace con los
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:386:factores IBSE), el adaptador REDCap del módulo debe documentar esta desviación
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:387:del flujo canónico, indicando qué pasos del algoritmo ejecuta REDCap y qué
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:394:**I-CE-1 — IBSE no es una categoría arquitectónica**
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:396:IBSE es una implementación concreta de la categoría Estudios Complementarios.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:401:desarrollo actual de IBSE en el código no le confiere ningún privilegio
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:422:determinan las prioridades del Plan Local de Salud. Las candidaturas de
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:450:SF-12, DUKE, PREDIMED, CAGE y otros instrumentos reconocidos en DOMAIN-MODEL.md
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:458:`IBSE_MODULE.identity.status === "draft"` indica que la definición está
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:460:utilizarlo porque la estructura operativa (columnas REDCap, dimensiones,
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:475:| **Implementado parcialmente** | Módulo con ítems y/o adaptador REDCap, pero sin parser ni pipeline de evidencia operativos | Módulo parcialmente completado |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:484:| **IBSE** | **Implementado** (módulo en `draft`; pendiente de `validated`) |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:486:| **PREDIMED-EAS** | **Implementado** — dominio, parser, EvidenceAtoms, panel, workspace, inventario. Sin `MethodologicalModule` en Biblioteca (véase nota §9a). |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:487:| **SF-12 EAS** | **Implementado** — dominio, parser, EvidenceAtoms, panel, workspace, inventario. Sin `MethodologicalModule` en Biblioteca (véase nota §9a). |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:488:| **Sueño EAS** | **Implementado** — dominio, parser, EvidenceAtoms, panel, workspace, inventario. Sin `MethodologicalModule` en Biblioteca (véase nota §9a). |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:489:| **CAGE-EAS** | **Implementado** — dominio, parser, EvidenceAtoms, panel, workspace, inventario. Sin `MethodologicalModule` en Biblioteca (véase nota §9a). |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:490:| ESCA y otros propios | Conceptual |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:492:### Nota §9a — Deuda técnica: DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS sin MethodologicalModule
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:497:- Sus parsers **hardcodean los nombres de columna** (p. ej. `P5701`–`P5711` en DUKE; `Predimed` con fallback a ítems en PREDIMED; `PCS12_SP`/`MCS12_SP` en SF-12; `P33_R`/`P33A` en Sueño; `CAGE_R`/`CAGE` en CAGE), en lugar de derivarlos de un módulo metodológico como hace el parser de IBSE.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:502:Adicionalmente, DUKE-EAS tiene un `MethodologicalModule` parcial en `domain/methodology/definitions/duke-eas.ts` que **sí está registrado** en el registry y del que el parser DUKE deriva su configuración de columnas. El resto de instrumentos EAS (PREDIMED, SF-12, Sueño, CAGE) no tienen módulo registrado.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:509:seguir el mismo patrón que IBSE:
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:555:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:556:- **Compilador del Plan Local de Salud**: producto de exportación documental.
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:566:| 2026-06-24 | Primera redacción. Establece la taxonomía correcta (Estudios Complementarios como categoría; IBSE como implementación). Documenta el estado actual de IBSE en la Biblioteca Metodológica, el patrón de implementación para futuros instrumentos y los invariantes de privacidad y trazabilidad. |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:567:| 2026-06-25 | Actualización de estado: DUKE-EAS y PREDIMED-EAS pasan de «Conceptual» a «Implementado» en §2.2 y §9. Se añade nota §9a documentando la deuda técnica por ausencia de `MethodologicalModule` en la Biblioteca Metodológica y la desviación de parsers respecto al patrón §10. |
./docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:568:| 2026-06-27 | Sprint 0: SF-12 EAS, Sueño EAS y CAGE-EAS pasan de «Conceptual» a «Implementado» (implementados en commits `7f47034`, `20080cd` y `9c73fa0` respectivamente). §3.1 y §3.2 actualizados para reflejar la distinción real entre `kind: "redcap-export"` (IBSE) y `kind: "complementary-study"` (instrumentos EAS). Nota §9a ampliada para incluir los cinco instrumentos EAS sin `MethodologicalModule`. |
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:19:La Tripirámide Dinámica es el instrumento metodológico para evaluar la calidad muestral de los estudios complementarios en el contexto de la planificación local de salud.
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:84:- IBSE: n observado = 811 válidos de 811 totales (muestra específica Atarfe)
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:86:- PREDIMED-EAS: n válido = 712
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:87:- SF-12 EAS: n válido PCS = 3.047
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:88:- Sueño EAS: n válido P33_R = 3.004
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:89:- CAGE-EAS: n válido CAGE_R = 2.513
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:155:SAM (Sistema de Auditoría Muestral) es la metodología de evaluación de calidad muestral de COMPÁS NG. No es un módulo IBSE.
./docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:166:Un IBSE con muestra baja sigue produciendo sus átomos con sus valores reales.
./docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:73:El tipo `kind: "sample-quality"` en EvidenceAtom es el mecanismo actual para registrar la calidad muestral. Su uso es correcto para los estudios complementarios actuales.
./docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:146:El Perfil de Salud Local incluye la calidad de la evidencia en cada capítulo mediante la trazabilidad al EvidenceStore.
./docs/contracts/CONTRACT-EVIDENCE.md:68:| `low` | Evidencia metodológicamente débil: muestra insuficiente (IBSE con menos de 30 registros válidos), fuente no verificada o limitaciones conocidas graves |
./docs/contracts/CONTRACT-EVIDENCE.md:99:| `ibse` | Estudio IBSE (Índice de Bienestar Socioemocional) |
./docs/contracts/CONTRACT-EVIDENCE.md:101:| `redcap` | Exportación REDCap genérica |
./docs/contracts/CONTRACT-EVIDENCE.md:200:**Regla D — Completitud IBSE**
./docs/contracts/CONTRACT-EVIDENCE.md:201:Si el store contiene átomos IBSE con `kind: "indicator"`, deben ser
./docs/contracts/CONTRACT-EVIDENCE.md:253:### 5.2 Pipeline IBSE (`IBSEStudyToEvidenceAtoms`)
./docs/contracts/CONTRACT-EVIDENCE.md:255:**Origen:** `"ibse"` · **Activación:** explícita (importación CSV REDCap IBSE)
./docs/contracts/CONTRACT-EVIDENCE.md:259:**IBSE_FACTORES — 5 átomos, `kind: "indicator"`**
./docs/contracts/CONTRACT-EVIDENCE.md:268:**IBSE_RESUMEN — 1 átomo, `kind: "qualitative-observation"`**
./docs/contracts/CONTRACT-EVIDENCE.md:270:Síntesis automática derivada de IBSE_FACTORES. Identifica el factor de menor
./docs/contracts/CONTRACT-EVIDENCE.md:273:**IBSE_RESUMEN no es evidencia primaria.** Es un derivado del sistema. No debe
./docs/contracts/CONTRACT-EVIDENCE.md:274:prevalecer sobre los datos cuantitativos (IBSE_FACTORES) cuando exista
./docs/contracts/CONTRACT-EVIDENCE.md:277:metodológicas del instrumento IBSE (Bericat, 2014).
./docs/contracts/CONTRACT-EVIDENCE.md:399:**I-E7 — IBSE_RESUMEN es siempre secundario**
./docs/contracts/CONTRACT-EVIDENCE.md:402:su contenido y los datos de IBSE_FACTORES (`kind: "indicator"`), los datos
./docs/contracts/CONTRACT-EVIDENCE.md:425:- **PSL (Perfil de Salud Local)**: estructura, ciclo de vida, invariantes
./docs/contracts/CONTRACT-EVIDENCE.md:427:- **Priorización técnica, EPVSA, Plan de Acción, Agenda y Seguimiento**.
./docs/contracts/CONTRACT-EVIDENCE.md:431:  (IBSE, SF-12, DUKE, PREDIMED y otros).
./docs/contracts/CONTRACT-EVIDENCE.md:439:| 2026-06-24 | Primera redacción. Documenta el estado del código a partir del commit `1e582f5`. Incluye la distinción IBSE_FACTORES / IBSE_RESUMEN, las reglas A–E del IntegrityGuard y la correspondencia DocumentKind → EvidenceOrigin del pipeline genérico. |
./docs/contracts/CONTRACT-INDEX.md:53:**Productores:** Parsers de estudios complementarios, motor de extracción del Informe de Salud.
./docs/contracts/CONTRACT-INDEX.md:62:Contrato de los estudios complementarios como pipeline. Define el flujo canónico (CSV → Parser → Study → EvidenceAtoms → EvidenceStore), los 6 instrumentos admitidos, los invariantes de aislamiento municipal y la regla de no almacenamiento de registros individuales.
./docs/contracts/CONTRACT-INDEX.md:64:**Productores:** Parsers CSV (IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE).
./docs/contracts/CONTRACT-INDEX.md:73:Gramática editorial de los paneles de estudios complementarios. Distingue tres categorías: bloques obligatorios en UI (metadatos, barras, referencias, recordatorio), bloques condicionales (interpretación asistida, cautelas) y bloques de referencia de sistema (identidad, integraciones). Define también para qué instrumentos aplica la interpretación asistida (solo IBSE entre los actuales).
./docs/contracts/CONTRACT-INDEX.md:75:**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
./docs/contracts/CONTRACT-INDEX.md:108:Contrato del Motor de Interpretación Territorial (MIT) y del Perfil de Salud Local (PSL). Define LT1, OIT, Reconciliación Interpretativa, los 7 capítulos del PSL, los 6 estados del PSL y la regla PSL-C1 (el Nivel 3 solo consume PSL, nunca EvidenceStore directamente).
./docs/contracts/CONTRACT-INDEX.md:111:**Consumidores:** Priorización temática, Motor de Traducción Estratégica, Plan de Acción.
./docs/contracts/CONTRACT-INDEX.md:121:Contrato del bloque de Nivel 3: Priorización temática, Motor de Traducción Estratégica (versión inicial), Plan de Acción, Agenda y Seguimiento. Define que ningún motor del Nivel 3 puede producir documentos definitivos sin validación humana explícita.
./docs/contracts/CONTRACT-INDEX.md:123:**Productores:** `ThematicPrioritisation`, Plan de Acción.
./docs/contracts/CONTRACT-INDEX.md:124:**Consumidores:** Compiler (futuro).
./docs/contracts/CONTRACT-INDEX.md:132:Contrato del Compilador del Plan Local de Salud. Define los gates obligatorios (`G-C1`: PSL en estado `"approved"`) y la posición como último stage del pipeline. El compiler no implementado bloquea el estado `"approved"` del PSL.
./docs/contracts/CONTRACT-INDEX.md:156:Define el Repositorio Estratégico Territorial: recursos normativos supramunicipales con denominaciones canónicas fijadas (ESCA = Estrategia de Salud Comunitaria de Andalucía 2026–2030; RELAS = Red Local de Acción en Salud; RELAS-G, EBE, PSMA, PEM, EPVSA). Establece la diferencia respecto al MunicipalDocumentRepository. Sin implementación en Sprint 1.
./docs/contracts/CONTRACT-INDEX.md:159:**Consumidores futuros:** Motor de Traducción Estratégica.
./docs/contracts/CONTRACT-INDEX.md:167:Define el Motor de Traducción Estratégica (MTE): flujo PSL validado → Priorizaciones → Repositorio Estratégico → Borrador Plan de Acción. Establece 6 restricciones explícitas de no-sustitución y el invariante de trazabilidad completa. `StrategicDerivationTrace` pendiente de especificación en el sprint de implementación.
./docs/contracts/CONTRACT-INDEX.md:170:**Consumidores futuros:** Plan de Acción, Compiler.
./docs/contracts/CONTRACT-INTERPRETATION.md:41:- sintetiza la lectura en un Perfil de Salud Local revisable y validable.
./docs/contracts/CONTRACT-INTERPRETATION.md:74:Municipal (Informe de Salud, exportaciones REDCap, activos comunitarios,
./docs/contracts/CONTRACT-INTERPRETATION.md:75:estudios complementarios, documentación territorial).
./docs/contracts/CONTRACT-INTERPRETATION.md:78:(REDCap), los organismos productores del documento.
./docs/contracts/CONTRACT-INTERPRETATION.md:93:(Nivel 1: parsers de Informe de Salud, estudios complementarios, activos).
./docs/contracts/CONTRACT-INTERPRETATION.md:142:y las actuaciones del Plan Local de Salud.
./docs/contracts/CONTRACT-INTERPRETATION.md:160:de Acción, el Plan Local de Salud aprobado.
./docs/contracts/CONTRACT-INTERPRETATION.md:225:## 4. El Perfil de Salud Local como síntesis interpretativa
./docs/contracts/CONTRACT-INTERPRETATION.md:229:El Perfil de Salud Local (PSL) es el objeto canónico que sintetiza la
./docs/contracts/CONTRACT-INTERPRETATION.md:234:No es el Informe de Salud. No es el Plan Local de Salud compilado.
./docs/contracts/CONTRACT-INTERPRETATION.md:254:| I — Marco Estratégico | Referencia normativa | Sistema (contenido fijo) |
./docs/contracts/CONTRACT-MIT-PSL.md:1:# COMPÁS NG — Contrato del Motor de Interpretación Territorial y el Perfil de Salud Local
./docs/contracts/CONTRACT-MIT-PSL.md:6:> y el Perfil de Salud Local (PSL) en COMPÁS NG.
./docs/contracts/CONTRACT-MIT-PSL.md:24:El **Perfil de Salud Local (PSL)** sintetiza ese estado y actúa como **único
./docs/contracts/CONTRACT-MIT-PSL.md:51:y validación antes de traducirse en actuaciones concretas del Plan de Acción.
./docs/contracts/CONTRACT-MIT-PSL.md:68:Esta es la regla PSL-C1. Los motores del Nivel 3 (Priorización, EPVSA,
./docs/contracts/CONTRACT-MIT-PSL.md:69:Plan de Acción, Agenda, Seguimiento) solo pueden operar sobre el PSL. No
./docs/contracts/CONTRACT-MIT-PSL.md:87:| IBSE | `ibse` | Implementado |
./docs/contracts/CONTRACT-MIT-PSL.md:120:- **`marcosAplicados`**: marcos interpretativos presentes (EPVSA, ESCA, RELAS
./docs/contracts/CONTRACT-MIT-PSL.md:170:del Plan de Acción sin pasar por el PSL y la deliberación técnica.
./docs/contracts/CONTRACT-MIT-PSL.md:198:Los marcos interpretativos (EPVSA, ESCA, RELAS, BUENA_EDAD, MAYORES y otros
./docs/contracts/CONTRACT-MIT-PSL.md:202:automáticamente la evidencia a líneas EPVSA; eso es responsabilidad del motor
./docs/contracts/CONTRACT-MIT-PSL.md:203:EPVSA del Nivel 3, que opera sobre el PSL.
./docs/contracts/CONTRACT-MIT-PSL.md:227:| `fuente` | Coexistencia de fuentes con escalas o poblaciones distintas (IBSE + Informe de Salud; ciudadanía + técnica) |
./docs/contracts/CONTRACT-MIT-PSL.md:228:| `escala` | IBSE (escala individual) + indicadores poblacionales |
./docs/contracts/CONTRACT-MIT-PSL.md:244:3. **Divergencia de fuente significativa**: coexistencia de IBSE e Informe
./docs/contracts/CONTRACT-MIT-PSL.md:283:## 6. Perfil de Salud Local (PSL)
./docs/contracts/CONTRACT-MIT-PSL.md:296:### 6.1.1 Principios metodológicos del Perfil de Salud Local
./docs/contracts/CONTRACT-MIT-PSL.md:298:El Perfil de Salud Local (PSL) constituye una síntesis analítica del estado
./docs/contracts/CONTRACT-MIT-PSL.md:302:andaluz, RELAS y COMPÁS NG.
./docs/contracts/CONTRACT-MIT-PSL.md:310:- estudios complementarios;
./docs/contracts/CONTRACT-MIT-PSL.md:321:**Capítulo I — Marco Estratégico**
./docs/contracts/CONTRACT-MIT-PSL.md:323:Referencia los marcos normativos y metodológicos aplicables: EPVSA, RELAS,
./docs/contracts/CONTRACT-MIT-PSL.md:342:IDs de átomos activos, presencia de fuentes relevantes (IBSE, Priorización
./docs/contracts/CONTRACT-MIT-PSL.md:343:Temática, estudios complementarios), errores y avisos del IntegrityGuard.
./docs/contracts/CONTRACT-MIT-PSL.md:461:(`psl.areasDeIntervencion`). El motor EPVSA consume el resultado de la
./docs/contracts/CONTRACT-MIT-PSL.md:462:Priorización. El motor de Plan de Acción consume EPVSA y el PSL (para la
./docs/contracts/CONTRACT-MIT-PSL.md:463:referencia `PSLReference`). La Agenda consume el Plan de Acción. El Seguimiento
./docs/contracts/CONTRACT-MIT-PSL.md:497:**I-PSL-2 — El PSL no es el Plan Local de Salud compilado**
./docs/contracts/CONTRACT-MIT-PSL.md:501:generado a partir del PSL aprobado y del Plan de Acción validado. Son objetos
./docs/contracts/CONTRACT-MIT-PSL.md:540:- El Plan de Acción, la Agenda y el Seguimiento son generados a partir del PSL
./docs/contracts/CONTRACT-MIT-PSL.md:581:- **Motor EPVSA y traducción a líneas estratégicas**: motor del Nivel 3.
./docs/contracts/CONTRACT-MIT-PSL.md:582:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.
./docs/contracts/CONTRACT-MIT-PSL.md:585:- **Compilador del Plan Local de Salud**: producto de exportación documental
./docs/contracts/CONTRACT-PERSISTENCE.md:38:| `ibseStudy` | Estudio complementario IBSE procesado, si existe |
./docs/contracts/CONTRACT-PERSISTENCE.md:40:| `predimedStudy` | Estudio PREDIMED-EAS procesado, si existe |
./docs/contracts/CONTRACT-PERSISTENCE.md:41:| `sf12Study` | Estudio SF-12 EAS procesado, si existe |
./docs/contracts/CONTRACT-PERSISTENCE.md:42:| `suenoStudy` | Estudio Sueño EAS procesado, si existe |
./docs/contracts/CONTRACT-PERSISTENCE.md:43:| `cageStudy` | Estudio CAGE-EAS procesado, si existe |
./docs/contracts/CONTRACT-PERSISTENCE.md:154:(MIT, Reconciliación, PSL no validado, Plan de Acción, Agenda, Seguimiento):
./docs/contracts/CONTRACT-PERSISTENCE.md:214:Esta migración garantiza que el tipo `IBSEStudy` sea estructuralmente válido
./docs/contracts/CONTRACT-PERSISTENCE.md:421:- **Plan de Acción, Agenda, Seguimiento y Compilador**: motores del Nivel 3.
./docs/contracts/CONTRACT-REPOSITORY.md:23:de Salud Local (PSL) o el Plan de Acción— modifica los documentos del
./docs/contracts/CONTRACT-REPOSITORY.md:60:El Perfil de Salud Local (PSL) es un objeto analítico del Nivel 2, generado a
./docs/contracts/CONTRACT-REPOSITORY.md:66:### Separación entre documento y Plan Local de Salud compilado
./docs/contracts/CONTRACT-REPOSITORY.md:68:El Plan Local de Salud compilado, cuando exista, es un producto de exportación
./docs/contracts/CONTRACT-REPOSITORY.md:69:generado a partir del PSL aprobado y del Plan de Acción validado. No es un
./docs/contracts/CONTRACT-REPOSITORY.md:72:en el Plan Local de Salud compilado.
./docs/contracts/CONTRACT-REPOSITORY.md:92:| `redcap-export` | Exportación REDCap | Por `tag` (IBSE, TP) o acumulable | Sí |
./docs/contracts/CONTRACT-REPOSITORY.md:108:### IBSE y Priorización Temática dentro de `redcap-export`
./docs/contracts/CONTRACT-REPOSITORY.md:110:IBSE (Índice de Bienestar Socioemocional) y la Priorización Temática son
./docs/contracts/CONTRACT-REPOSITORY.md:116:| IBSE | `redcap-export` | `"ibse"` |
./docs/contracts/CONTRACT-REPOSITORY.md:119:**El `kind` compartido no implica sustitución mutua.** Registrar un nuevo IBSE
./docs/contracts/CONTRACT-REPOSITORY.md:124:para identificar o sustituir documentos IBSE o de Priorización Temática.
./docs/contracts/CONTRACT-REPOSITORY.md:159:| `"ibse"` | IBSE — Índice de Bienestar Socioemocional |
./docs/contracts/CONTRACT-REPOSITORY.md:188:de CSV IBSE, importación de CSV de Priorización Temática, ingesta manual de
./docs/contracts/CONTRACT-REPOSITORY.md:258:IBSE y Priorización Temática. La purga de evidencia derivada asociada es
./docs/contracts/CONTRACT-REPOSITORY.md:324:**I-R4 — Unicidad del documento IBSE**
./docs/contracts/CONTRACT-REPOSITORY.md:332:**I-R6 — IBSE y Priorización Temática son independientes**
./docs/contracts/CONTRACT-REPOSITORY.md:333:La existencia, sustitución o eliminación de un documento IBSE no afecta al
./docs/contracts/CONTRACT-REPOSITORY.md:356:Salud Local ni en el Plan Local de Salud compilado. Estos son objetos analíticos
./docs/contracts/CONTRACT-REPOSITORY.md:379:- **Perfil de Salud Local (PSL)**: el objeto analítico del Nivel 2 que sintetiza
./docs/contracts/CONTRACT-REPOSITORY.md:384:- **Encaje estratégico EPVSA**: traducción de prioridades a líneas estratégicas.
./docs/contracts/CONTRACT-REPOSITORY.md:385:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.
./docs/contracts/CONTRACT-REPOSITORY.md:389:- **Compilador del Plan Local de Salud**: producto de exportación documental.
./docs/contracts/CONTRACT-REPOSITORY.md:391:  (IBSE, SF-12, DUKE, PREDIMED y otros).
./docs/contracts/CONTRACT-SCALE-PANELS.md:3:> Contrato editorial de paneles de escalas para estudios complementarios.
./docs/contracts/CONTRACT-SCALE-PANELS.md:20:| IBSE | IBSEPanel |
./docs/contracts/CONTRACT-SCALE-PANELS.md:22:| PREDIMED-EAS | PREDIMEDPanel |
./docs/contracts/CONTRACT-SCALE-PANELS.md:23:| SF-12 EAS | SF12Panel |
./docs/contracts/CONTRACT-SCALE-PANELS.md:24:| Sueño EAS | SuenoPanel |
./docs/contracts/CONTRACT-SCALE-PANELS.md:25:| CAGE-EAS | CAGEPanel |
./docs/contracts/CONTRACT-SCALE-PANELS.md:88:**Aplica a:** IBSE (4 factores comparables). No aplica a SF-12 (2 componentes independientes), Sueño (2 variables independientes), CAGE (distribución ordinal), ni DUKE (3 dimensiones superpuestas).
./docs/contracts/CONTRACT-SCALE-PANELS.md:175:### IBSE
./docs/contracts/CONTRACT-SCALE-PANELS.md:182:- **Cautela de recodificación:** no aplica (exportación REDCap directa).
./docs/contracts/CONTRACT-SCALE-PANELS.md:192:### PREDIMED-EAS
./docs/contracts/CONTRACT-SCALE-PANELS.md:199:### SF-12 EAS
./docs/contracts/CONTRACT-SCALE-PANELS.md:206:### Sueño EAS
./docs/contracts/CONTRACT-SCALE-PANELS.md:213:### CAGE-EAS
./docs/contracts/CONTRACT-SCALE-PANELS.md:215:- **Variable:** CAGE_R (riesgo alcoholismo, proporción positiva) y CAGE ordinal (1–4).
./docs/contracts/CONTRACT-SCALE-PANELS.md:218:- **Cautela:** el CAGE es un cribado, no un diagnóstico. Resultados requieren confirmación clínica.
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:12:Este contrato define la estructura, las responsabilidades y los contratos de datos del Repositorio Estratégico Territorial. La implementación se realizará cuando el Motor de Traducción Estratégica esté listo para consumirlo.
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:30:| ESCA | Estrategia de Salud Comunitaria de Andalucía (2026–2030) |
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:31:| RELAS | Red Local de Acción en Salud |
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:32:| RELAS-G | Guías metodológicas de la Red Local de Acción en Salud |
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:36:| EPVSA | Estrategia de Promoción de una Vida Saludable en Andalucía |
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:44:| Estrategia de Salud Comunitaria de Andalucía (2026–2030) | ESCA | Estrategia de salud |
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:45:| Red Local de Acción en Salud | RELAS | Marco estratégico-programático |
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:46:| Guías metodológicas RELAS | RELAS-G | Guía metodológica |
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:50:| Estrategia de Promoción de una Vida Saludable en Andalucía | EPVSA | Referencia epidemiológica |
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:134:3. **Exponer** la estructura a los motores de nivel superior (Motor de Traducción Estratégica).
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:135:4. **No inferir** ninguna correspondencia automática entre el PSL y los recursos estratégicos. Esa es la función del Motor de Traducción Estratégica.
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:147:Toda lógica de aplicación territorial pertenece al Motor de Traducción Estratégica.
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:171:Disponibilidad para el Motor de Traducción Estratégica
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:180:- Motor de Traducción Estratégica → CONTRACT-STRATEGIC-TRANSLATION.md
./docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:182:- Perfil de Salud Local → CONTRACT-MIT-PSL.md
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:3:> Contrato del Motor de Traducción Estratégica de COMPÁS NG.
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:12:Este contrato define el flujo, las responsabilidades y las restricciones del Motor de Traducción Estratégica. La implementación requiere que estén disponibles el PSL validado, las Priorizaciones y el Repositorio Estratégico Territorial.
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:18:El Motor de Traducción Estratégica (MTE) transforma el diagnóstico territorial validado en un borrador de Plan de Acción alineado con los marcos estratégicos del Repositorio Estratégico Territorial.
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:33:Motor de Traducción Estratégica
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:35:Borrador de Plan de Acción
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:39:Plan de Acción aprobado
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:121:El Motor de Traducción Estratégica **no puede**:
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:123:1. Generar un Plan de Acción definitivo sin validación técnica humana.
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:132:> Ninguna salida del Motor de Traducción Estratégica puede presentarse como decisión territorial. Todo output es una propuesta que requiere validación, ajuste y aprobación por parte del equipo técnico municipal o autonómico responsable.
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:163:| Salida | LT1, OIT, PSL borrador | Borrador de Plan de Acción |
./docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:173:- Plan de Acción → CONTRACT-ACTION-PLAN.md
./docs/contracts/CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md:79:Las hipótesis estructurales, si llegan a existir, formarán parte del Perfil de Salud Local como capa interpretativa revisable.
./docs/contracts/CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md:91:El futuro Motor de Interpretación Territorial deberá entenderse como constructor asistido de hipótesis estructurales plausibles, no como generador automático de causalidad.
./docs/visual/references/reconecta-custom-v3.css:2:   Pegar en el campo Custom CSS de REDCap, SIN etiquetas <style></style>. */
./docs/visual/references/reconecta-reference.css:3: * CONTRATO VISUAL EXTRAÍDO — Encuesta REDCap "Desconecta para conectar"
./docs/visual/references/reconecta-reference.css:5: * Contexto: Distrito Granada-Metropolitano · Plan Local de Salud de Huétor Tájar
./docs/visual/references/reconecta-reference.css:8: * Fuentes: survey.css (REDCap v17.1.4), <style> inline del proyecto, estilos inline de campos descriptivos
./docs/visual/references/reconecta-reference.css:12: * Los selectores REDCap son propios de la plataforma y no deben
./docs/visual/references/reconecta-reference.css:22:   y del bloque <style> del tema REDCap configurado en la encuesta.
./docs/visual/references/reconecta-reference.css:47:  /* --- Colores estructurales del tema REDCap configurado (bloque <style> inline) --- */
./docs/visual/references/reconecta-reference.css:55:  /* --- Colores estructurales de survey.css (REDCap estándar) --- */
./docs/visual/references/reconecta-reference.css:68:   Fuente REDCap global: 'Open Sans' (forzada via body * !important)
./docs/visual/references/reconecta-reference.css:73: * Tipografía 1: Open Sans — REDCap global
./docs/visual/references/reconecta-reference.css:276: * Texto: "Distrito Granada-Metropolitano · Plan Local de Salud de Huétor Tájar"
./docs/visual/references/reconecta-reference.css:363: * Label: "Qué no es este cuestionario" en #b9740a (derivado oscuro de #F5A623)
./docs/visual/references/reconecta-reference.css:423:   8. TABLA DE PREGUNTAS (REDCap structural)
./docs/visual/references/reconecta-reference.css:487:   9. BOTONES DE NAVEGACIÓN (REDCap survey)
./docs/visual/references/reconecta-reference.css:520:   10. SECCIÓN HEADER (REDCap — solo si se usan section headers)
./docs/visual/references/reconecta-reference.css:524: * Cabecera de sección REDCap
./docs/visual/references/reconecta-reference.html:41:<script type="text/javascript" src="/DSGM/redcap_v17.1.4/Resources/js/Survey.js?1781809545"></script>
./docs/visual/references/reconecta-reference.html:69:					"<p>The module mentioned in the error below is preventing REDCap from working properly.  It is recommended to disable this module until it can be updated to avoid this error:</p><pre style='max-height: 50vh; white-space: pre-wrap;'>" + response + "</pre>",
./docs/visual/references/reconecta-reference.html:115:lang.system_config_874='The current REDCap webpage was able to load faster because it utilized REDCap\'s Rapid Retrieval feature. Rapid Retrieval is an automated internal feature that allows REDCap to store      certain pages in a temporary holding cache. When utilizing Rapid Retrieval, if no data or metadata has changed in the project recently, REDCap will output the stored cache of the page from when it was previously loaded.      This means that REDCap does not have to do all the work of normally loading the page but instead can load the page much faster by using the cache. The time that the current page was last cached was';
./docs/visual/references/reconecta-reference.html:116:lang.global_324='What is REDCap+?';
./docs/visual/references/reconecta-reference.html:166:lang.global_147='Advertencia de Auto logout de REDCap';
./docs/visual/references/reconecta-reference.html:169:lang.global_150='Su sesión en REDCap terminará automáticamente en <b>2 MINUTOS</b> debido a inactividad. Dé clic en el botón abajo para prevenir la desconexión automática.';
./docs/visual/references/reconecta-reference.html:170:lang.global_151='Su sesión en REDCap terminará automáticamente en <b>30 SEGUNDOS</b> debido a inactividad. Dé clic en el botón abajo para prevenir la desconexión automática.';
./docs/visual/references/reconecta-reference.html:171:lang.global_152='<b>Debido a inactividad, su sesión REDCap ha expirado.</b> Dé clic en el botón abajo para iniciar otra sesión.';
./docs/visual/references/reconecta-reference.html:187:lang.global_274='NOTE: Any files uploaded here using the rich text editor will be given a <b>publicly accessible download link</b> that will be placed into the text,  in which anyone in possession of that link (including people not logged into REDCap) will be able to download the file at any time.  Files containing <b>confidential or sensitive information (e.g., PHI or PII) should *not* be uploaded here</b>.  Additionally, all files uploaded here can be later accessed and/or deleted in the File Repository\'s "Miscellaneous File Attachments" folder,  whose contents does not count against the total amount of file storage used in the project. ';
./docs/visual/references/reconecta-reference.html:192:lang.global_312='<b><u>Use with caution.</u> Please note that targeting internal REDCap elements (e.g., specific classes or IDs) may break without notice, as updates to REDCap can change or remove these elements at any time. Stability of these selectors across versions is not guaranteed, and any changes to them will not be announced in advance.</b>';
./docs/visual/references/reconecta-reference.html:210:lang.bottom_122='The file has the wrong encoding and thus cannot be read by REDCap correctly. Please <b>re-save the file with UTF-8 encoding</b>, and then try uploading it again.';
./docs/visual/references/reconecta-reference.html:339:			isRTL: REDCap.MultiLanguage && typeof REDCap.MultiLanguage.isRTL == 'function' ? REDCap.MultiLanguage.isRTL() : false
./docs/visual/references/reconecta-reference.html:370:		if (typeof window.REDCap == 'undefined') {
./docs/visual/references/reconecta-reference.html:371:			window.REDCap = {};
./docs/visual/references/reconecta-reference.html:373:		window.REDCap.validations = {};
./docs/visual/references/reconecta-reference.html:374:				window.REDCap.validations['postalcode_french'] = {"datatype":"postal_code","regex":"\/^((0?[1-9])|([1-8][0-9])|(9[0-8]))[0-9]{3}$\/"};
./docs/visual/references/reconecta-reference.html:375:				window.REDCap.validations['date_dmy'] = {"datatype":"date","regex":"\/^((29([-\\\/])02\\3(\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00)))|((((0[1-9]|1\\d|2[0-8])([-\\\/])(0[1-9]|1[012]))|((29|30)([-\\\/])(0[13-9]|1[012]))|(31([-\\\/])(0[13578]|1[02])))(\\11|\\15|\\18)\\d{4}))$\/"};
./docs/visual/references/reconecta-reference.html:376:				window.REDCap.validations['date_mdy'] = {"datatype":"date","regex":"\/^((02([-\\\/])29\\3(\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00)))|((((0[1-9]|1[012])([-\\\/])(0[1-9]|1\\d|2[0-8]))|((0[13-9]|1[012])([-\\\/])(29|30))|((0[13578]|1[02])([-\\\/])31))(\\11|\\15|\\19)\\d{4}))$\/"};
./docs/visual/references/reconecta-reference.html:377:				window.REDCap.validations['date_ymd'] = {"datatype":"date","regex":"\/^(((\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00))([-\\\/])02(\\6)29)|(\\d{4}([-\\\/])((0[1-9]|1[012])(\\9)(0[1-9]|1\\d|2[0-8])|((0[13-9]|1[012])(\\9)(29|30))|((0[13578]|1[02])(\\9)31))))$\/"};
./docs/visual/references/reconecta-reference.html:378:				window.REDCap.validations['datetime_dmy'] = {"datatype":"datetime","regex":"\/^((29([-\\\/])02\\3(\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00)))|((((0[1-9]|1\\d|2[0-8])([-\\\/])(0[1-9]|1[012]))|((29|30)([-\\\/])(0[13-9]|1[012]))|(31([-\\\/])(0[13578]|1[02])))(\\11|\\15|\\18)\\d{4})) (\\d|[0-1]\\d|[2][0-3]):[0-5]\\d$\/"};
./docs/visual/references/reconecta-reference.html:379:				window.REDCap.validations['datetime_mdy'] = {"datatype":"datetime","regex":"\/^((02([-\\\/])29\\3(\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00)))|((((0[1-9]|1[012])([-\\\/])(0[1-9]|1\\d|2[0-8]))|((0[13-9]|1[012])([-\\\/])(29|30))|((0[13578]|1[02])([-\\\/])31))(\\11|\\15|\\19)\\d{4})) (\\d|[0-1]\\d|[2][0-3]):[0-5]\\d$\/"};
./docs/visual/references/reconecta-reference.html:380:				window.REDCap.validations['datetime_ymd'] = {"datatype":"datetime","regex":"\/^(((\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00))([-\\\/])02(\\6)29)|(\\d{4}([-\\\/])((0[1-9]|1[012])(\\9)(0[1-9]|1\\d|2[0-8])|((0[13-9]|1[012])(\\9)(29|30))|((0[13578]|1[02])(\\9)31)))) (\\d|[0-1]\\d|[2][0-3]):[0-5]\\d$\/"};
./docs/visual/references/reconecta-reference.html:381:				window.REDCap.validations['datetime_seconds_dmy'] = {"datatype":"datetime_seconds","regex":"\/^((29([-\\\/])02\\3(\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00)))|((((0[1-9]|1\\d|2[0-8])([-\\\/])(0[1-9]|1[012]))|((29|30)([-\\\/])(0[13-9]|1[012]))|(31([-\\\/])(0[13578]|1[02])))(\\11|\\15|\\18)\\d{4})) (\\d|[0-1]\\d|[2][0-3])(:[0-5]\\d){2}$\/"};
./docs/visual/references/reconecta-reference.html:382:				window.REDCap.validations['datetime_seconds_mdy'] = {"datatype":"datetime_seconds","regex":"\/^((02([-\\\/])29\\3(\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00)))|((((0[1-9]|1[012])([-\\\/])(0[1-9]|1\\d|2[0-8]))|((0[13-9]|1[012])([-\\\/])(29|30))|((0[13578]|1[02])([-\\\/])31))(\\11|\\15|\\19)\\d{4})) (\\d|[0-1]\\d|[2][0-3])(:[0-5]\\d){2}$\/"};
./docs/visual/references/reconecta-reference.html:383:				window.REDCap.validations['datetime_seconds_ymd'] = {"datatype":"datetime_seconds","regex":"\/^(((\\d{2}([13579][26]|[2468][048]|04|08)|(1600|2[048]00))([-\\\/])02(\\6)29)|(\\d{4}([-\\\/])((0[1-9]|1[012])(\\9)(0[1-9]|1\\d|2[0-8])|((0[13-9]|1[012])(\\9)(29|30))|((0[13578]|1[02])(\\9)31)))) (\\d|[0-1]\\d|[2][0-3])(:[0-5]\\d){2}$\/"};
./docs/visual/references/reconecta-reference.html:384:				window.REDCap.validations['email'] = {"datatype":"email","regex":"\/^(?!\\.)((?!.*\\.{2})[a-zA-Z0-9\\u0080-\\u02AF\\u0300-\\u07FF\\u0900-\\u18AF\\u1900-\\u1A1F\\u1B00-\\u1B7F\\u1D00-\\u1FFF\\u20D0-\\u214F\\u2C00-\\u2DDF\\u2F00-\\u2FDF\\u2FF0-\\u2FFF\\u3040-\\u319F\\u31C0-\\uA4CF\\uA700-\\uA71F\\uA800-\\uA82F\\uA840-\\uA87F\\uAC00-\\uD7AF\\uF900-\\uFAFF!#$%&'*+\\-\/=?^_`{|}~\\d]+)(\\.[a-zA-Z0-9\\u0080-\\u02AF\\u0300-\\u07FF\\u0900-\\u18AF\\u1900-\\u1A1F\\u1B00-\\u1B7F\\u1D00-\\u1FFF\\u20D0-\\u214F\\u2C00-\\u2DDF\\u2F00-\\u2FDF\\u2FF0-\\u2FFF\\u3040-\\u319F\\u31C0-\\uA4CF\\uA700-\\uA71F\\uA800-\\uA82F\\uA840-\\uA87F\\uAC00-\\uD7AF\\uF900-\\uFAFF!#$%&'*+\\-\/=?^_`{|}~\\d]+)*@(?!\\.)([a-zA-Z0-9\\u0080-\\u02AF\\u0300-\\u07FF\\u0900-\\u18AF\\u1900-\\u1A1F\\u1B00-\\u1B7F\\u1D00-\\u1FFF\\u20D0-\\u214F\\u2C00-\\u2DDF\\u2F00-\\u2FDF\\u2FF0-\\u2FFF\\u3040-\\u319F\\u31C0-\\uA4CF\\uA700-\\uA71F\\uA800-\\uA82F\\uA840-\\uA87F\\uAC00-\\uD7AF\\uF900-\\uFAFF\\-\\.\\d]+)((\\.([a-zA-Z\\u0080-\\u02AF\\u0300-\\u07FF\\u0900-\\u18AF\\u1900-\\u1A1F\\u1B00-\\u1B7F\\u1D00-\\u1FFF\\u20D0-\\u214F\\u2C00-\\u2DDF\\u2F00-\\u2FDF\\u2FF0-\\u2FFF\\u3040-\\u319F\\u31C0-\\uA4CF\\uA700-\\uA71F\\uA800-\\uA82F\\uA840-\\uA87F\\uAC00-\\uD7AF\\uF900-\\uFAFF]){2,63})+)$\/i"};
./docs/visual/references/reconecta-reference.html:385:				window.REDCap.validations['integer'] = {"datatype":"integer","regex":"\/^[-+]?\\b\\d+\\b$\/"};
./docs/visual/references/reconecta-reference.html:386:				window.REDCap.validations['alpha_only'] = {"datatype":"text","regex":"\/^[a-z]+$\/i"};
./docs/visual/references/reconecta-reference.html:387:				window.REDCap.validations['mrn_10d'] = {"datatype":"mrn","regex":"\/^\\d{10}$\/"};
./docs/visual/references/reconecta-reference.html:388:				window.REDCap.validations['mrn_generic'] = {"datatype":"mrn","regex":"\/^[a-z0-9-_]+$\/i"};
./docs/visual/references/reconecta-reference.html:389:				window.REDCap.validations['number'] = {"datatype":"number","regex":"\/^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$\/"};
./docs/visual/references/reconecta-reference.html:390:				window.REDCap.validations['number_1dp_comma_decimal'] = {"datatype":"number_comma_decimal","regex":"\/^-?\\d+,\\d$\/"};
./docs/visual/references/reconecta-reference.html:391:				window.REDCap.validations['number_1dp'] = {"datatype":"number","regex":"\/^-?\\d+\\.\\d$\/"};
./docs/visual/references/reconecta-reference.html:392:				window.REDCap.validations['number_2dp_comma_decimal'] = {"datatype":"number_comma_decimal","regex":"\/^-?\\d+,\\d{2}$\/"};
./docs/visual/references/reconecta-reference.html:393:				window.REDCap.validations['number_2dp'] = {"datatype":"number","regex":"\/^-?\\d+\\.\\d{2}$\/"};
./docs/visual/references/reconecta-reference.html:394:				window.REDCap.validations['number_3dp_comma_decimal'] = {"datatype":"number_comma_decimal","regex":"\/^-?\\d+,\\d{3}$\/"};
./docs/visual/references/reconecta-reference.html:395:				window.REDCap.validations['number_3dp'] = {"datatype":"number","regex":"\/^-?\\d+\\.\\d{3}$\/"};
./docs/visual/references/reconecta-reference.html:396:				window.REDCap.validations['number_4dp_comma_decimal'] = {"datatype":"number_comma_decimal","regex":"\/^-?\\d+,\\d{4}$\/"};
./docs/visual/references/reconecta-reference.html:397:				window.REDCap.validations['number_4dp'] = {"datatype":"number","regex":"\/^-?\\d+\\.\\d{4}$\/"};
./docs/visual/references/reconecta-reference.html:398:				window.REDCap.validations['number_comma_decimal'] = {"datatype":"number_comma_decimal","regex":"\/^[-+]?[0-9]*,?[0-9]+([eE][-+]?[0-9]+)?$\/"};
./docs/visual/references/reconecta-reference.html:399:				window.REDCap.validations['phone_australia'] = {"datatype":"phone","regex":"\/^(\\(0[2-8]\\)|0[2-8])\\s*\\d{4}\\s*\\d{4}$\/"};
./docs/visual/references/reconecta-reference.html:400:				window.REDCap.validations['phone_france'] = {"datatype":"phone","regex":"\/^(?:(?:\\+|00)(?:33|262|508|590|594|596|687)[\\s.-]{0,3}(?:\\(0\\)[\\s.-]{0,3})?|0)[1-9](?:(?:[\\s.-]?\\d{2}){4}|\\d{2}(?:[\\s.-]?\\d{3}){2})$\/"};
./docs/visual/references/reconecta-reference.html:401:				window.REDCap.validations['phone'] = {"datatype":"phone","regex":"\/^(?:\\(?([2-9]0[1-9]|[2-9]1[02-9]|[2-9][2-9][0-9]|800|811)\\)?)\\s*(?:[.-]\\s*)?([0-9]{3})\\s*(?:[.-]\\s*)?([0-9]{4})(?:\\s*(?:#|x\\.?|ext\\.?|extension)\\s*(\\d+))?$\/"};
./docs/visual/references/reconecta-reference.html:402:				window.REDCap.validations['phone_uk'] = {"datatype":"phone","regex":"\/^((((\\+44|0044)\\s?\\d{4}|\\(?0\\d{4}\\)?)\\s?\\d{3}\\s?\\d{3})|(((\\+44|0044)\\s?\\d{3}|\\(?0\\d{3}\\)?)\\s?\\d{3}\\s?\\d{4})|(((\\+44|0044)\\s?\\d{2}|\\(?0\\d{2}\\)?)\\s?\\d{4}\\s?\\d{4}))(\\s?\\#(\\d{4}|\\d{3}))?$\/"};
./docs/visual/references/reconecta-reference.html:403:				window.REDCap.validations['postalcode_australia'] = {"datatype":"postal_code","regex":"\/^\\d{4}$\/"};
./docs/visual/references/reconecta-reference.html:404:				window.REDCap.validations['postalcode_canada'] = {"datatype":"postal_code","regex":"\/^[ABCEGHJKLMNPRSTVXY]{1}\\d{1}[A-Z]{1}\\s*\\d{1}[A-Z]{1}\\d{1}$\/i"};
./docs/visual/references/reconecta-reference.html:405:				window.REDCap.validations['postalcode_germany'] = {"datatype":"postal_code","regex":"\/^(0[1-9]|[1-9]\\d)\\d{3}$\/"};
./docs/visual/references/reconecta-reference.html:406:				window.REDCap.validations['postalcode_uk'] = {"datatype":"postal_code","regex":"\/^(([A-Z]{1,2}\\d{1,2})|([A-Z]{1,2}\\d[A-Z])) \\d[ABD-HJLNP-Z]{2}$\/"};
./docs/visual/references/reconecta-reference.html:407:				window.REDCap.validations['ssn'] = {"datatype":"ssn","regex":"\/^\\d{3}-\\d\\d-\\d{4}$\/"};
./docs/visual/references/reconecta-reference.html:408:				window.REDCap.validations['time_hh_mm_ss'] = {"datatype":"time","regex":"\/^(\\d|[01]\\d|(2[0-3]))(:[0-5]\\d){2}$\/"};
./docs/visual/references/reconecta-reference.html:409:				window.REDCap.validations['time'] = {"datatype":"time","regex":"\/^([0-9]|[0-1][0-9]|[2][0-3]):([0-5][0-9])$\/"};
./docs/visual/references/reconecta-reference.html:410:				window.REDCap.validations['time_mm_ss'] = {"datatype":"time","regex":"\/^[0-5]\\d:[0-5]\\d$\/"};
./docs/visual/references/reconecta-reference.html:411:				window.REDCap.validations['vmrn'] = {"datatype":"mrn","regex":"\/^[0-9]{4,9}$\/"};
./docs/visual/references/reconecta-reference.html:412:				window.REDCap.validations['zipcode'] = {"datatype":"postal_code","regex":"\/^\\d{5}(-\\d{4})?$\/"};
./docs/visual/references/reconecta-reference.html:512:	checkReservedSurveyParams(new Array('s','hash','page','event_id','pid','pnid','preview','id','sq'));
./docs/visual/references/reconecta-reference.html:527:        <!-- Language, Voice, Font Controls; Return & Survey Queue Links -->
./docs/visual/references/reconecta-reference.html:562:<button id="enable_text-to-speech" class="btn btn-link btn-sm" data-rc-lang-attrs="data-bs-original-title=survey_997 aria-label=survey_997" title="Activar la voz" aria-label="Activar la voz" data-toggle="tooltip" style="display:none;" onclick="addSpeakIconsToSurveyViaBtnClick(1);"><i class="fas fa-volume-up"></i></button>
./docs/visual/references/reconecta-reference.html:563:<button id="disable_text-to-speech" class="btn btn-link btn-sm" data-rc-lang-attrs="data-bs-original-title=survey_998 aria-label=survey_998" title="Desactivar la voz" aria-label="Desactivar la voz" data-toggle="tooltip" style="display:none;" onclick="addSpeakIconsToSurveyViaBtnClick(0);"><i class="fas fa-volume-mute"></i></button>
./docs/visual/references/reconecta-reference.html:653:<div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:.72em;letter-spacing:1.5px;text-transform:uppercase;color:#4A4A4A;">Distrito Granada-Metropolitano · Plan Local de Salud de Huétor Tájar</div><br role="presentation">
./docs/visual/references/reconecta-reference.html:661:<p style="margin:0 0 16px 0;">Este cuestionario se dirige a chicos y chicas de 12 a 17 años residentes en Huétor Tájar. Es anónimo: ninguna persona, ni en tu familia ni en tu centro educativo, podrá ver tus respuestas individuales.</p><br role="presentation">
./docs/visual/references/reconecta-reference.html:674:<div style="font-size:.78em;letter-spacing:.5px;text-transform:uppercase;color:#b9740a;margin-bottom:4px;">Qué no es este cuestionario</div><br role="presentation">
./docs/visual/references/reconecta-reference.html:680:<p style="margin:0;">Los datos, tratados de forma agregada y anónima, contribuyen a que el Plan Local de Salud de Huétor Tájar conozca mejor los hábitos de uso de pantallas entre la población adolescente del municipio, con el fin de orientar sus actuaciones de promoción de la salud.</p><br role="presentation">
./docs/visual/references/reconecta-reference.html:698:<input type='hidden' name='cuestionario_pantallas_complete'   value=''><tr  class='surveysubmit' ><td class='labelrc col-12' style='padding:5px;' colspan='3'><table cellspacing="0">
./docs/visual/references/reconecta-reference.html:746:<script type='text/javascript'>var pageFields = ['encuesta_activa','presentacion','ficha_metodologica'];</script><script  type="text/javascript" src="/DSGM/redcap_v17.1.4/Resources/js/DataEntrySurveyCommon.js?1781809545"></script>
./docs/visual/references/reconecta-reference.html:770:	if (typeof REDCap?.MultiLanguage?.onLangChanged == 'function') {
./docs/visual/references/reconecta-reference.html:771:		REDCap.MultiLanguage.onLangChanged(function() {
./docs/visual/references/reconecta-reference.html:1172:lang.form_renderer_45='Lo sentimos, pero Apple no admite la carga de archivos en páginas web en su navegador Mobile Safari para dispositivos iOS (iPhones, iPads y iPod Touch) que ejecutan iOS versión 5.1 y anteriores. Debido a que parece que está utilizando un dispositivo iOS en una versión tan antigua, no podrá cargar un archivo aquí. Esto no es un problema en REDCap, sino simplemente una limitación impuesta por Apple. NOTA: iOS versión 6 y superior *sí* admite la carga de imágenes y videos (pero no otros tipos de archivo).';
./docs/visual/references/reconecta-reference.html:1210:</div></div><div id="footer" class="d-none d-sm-block col-md-12"><a href="https://projectredcap.org" tabindex="-1" target="_blank">Powered by REDCap</a><span class="mx-2">-</span><a href="javascript:;" onclick="showCookieUsagePolicy();"><span data-rc-lang="global_304">Cookie policy</span></a></div></div>
./docs/visual/references/reconecta-reference.html:1214:lang.global_305='<h4>REDCap Cookie Usage Policy</h4><br>              <b>1. What Are Cookies?</b><br><br>Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.<br><br>              <b>2. Types of Cookies Used</b><br><br>REDCap uses two primary types of cookies: Necessary Cookies and Functional Cookies. Details about each type and their purposes are provided below.<br><br>              <b>3. Necessary Cookies</b><br><br>Necessary cookies are essential for the proper functioning of this web application (REDCap). These cookies ensure basic functionalities and security features of the website.              Without these cookies, certain features and services may not be available. Example of necessary cookies: Session cookies that keep you logged in while you navigate through different pages.<br><br>              <b>4. Functional Cookies</b><br><br>Functional cookies enable the web application to provide enhanced functionality and personalization. If you do not allow these cookies,              some or all of these services may not function properly. Examples of functional cookies: 1) Cookies that remember your preferences, such as language, and 2) Cookies that provide enhanced features,              such as remembering your desired custom size of text on survey pages.<br><br>              <b>5. Managing Cookies</b><br><br>You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to delete or decline cookies if you prefer.              Please note that if you choose to decline cookies, you will not be able to experience all features of this web application (REDCap).';
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:1:# Contrato visual extraído — Encuesta REDCap "Desconecta para conectar"
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:5:**Contexto:** Distrito Granada-Metropolitano · Plan Local de Salud de Huétor Tájar  
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:6:**Plataforma:** REDCap v17.1.4  
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:16:Extraídos de los estilos inline del campo descriptivo `presentacion`. Son los únicos colores definidos por el diseñador del proyecto, independientemente de la plataforma REDCap.
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:26:| `--brand-amber-dark` | `#b9740a` | Derivado oscuro de `#F5A623`. Usado en el label uppercase de "Qué no es este cuestionario". |
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:31:### 1.2 Colores estructurales del tema REDCap (configurados para esta encuesta)
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:33:Estos colores están en el bloque `<style>` inline del `<head>` de la encuesta. Son la personalización del tema REDCap para el proyecto, diferentes de los colores del diseñador.
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:43:**Nota metodológica:** `#0b5394` y `#1E7FC2` coexisten en la misma encuesta. El primero es el color del tema REDCap; el segundo es el color de identidad del proyecto. Son azules distintos y no equivalentes.
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:45:### 1.3 Colores estructurales REDCap estándar (survey.css v17.1.4)
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:47:Estos son los colores propios del motor REDCap, sin personalización del proyecto.
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:57:| `#000066` | Links por defecto (dark navy, estilo antiguo de REDCap) |
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:75:### 2.1 Open Sans (REDCap global)
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:81:Aplicada a **todo el body** mediante `body * { font-family: ... !important }`. Es la fuente base de REDCap. Tamaño base: **12px** (survey.css). Título de encuesta: **20px**, peso normal.
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:106:Declarada en el div raíz del campo `presentacion`. Es efectivamente invisible porque Open Sans la sobreescribe. Se interpreta como una intención serif de diseño que no llega a materializarse en REDCap.
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:232:| Elemento | Encuesta REDCap | COMPÁS NG |
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:245:**Observación:** Los colores de ambos proyectos son temáticamente similares (azul + verde + naranja + rojo) pero con valores hex distintos. El banner arcoíris de REDCap y el `gradient-bar` de COMPÁS NG son el mismo patrón conceptual aplicado con paletas propias.
./docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:257:Los archivos `survey.css`, `style.css` y `survey_text_large.css` de REDCap v17.1.4 se descargaron en `/tmp/` durante la extracción pero **no se incluyen** en esta carpeta porque son CSS de la plataforma REDCap, no del proyecto. Solo son relevantes para entender el contexto estructural.
./DOCUMENT-ARCHITECTURE.md:45:Ejemplos: IBSE, SF-12, DUKE, PREDIMED.
./DOMAIN-MODEL.md:61:Incluye el repositorio documental, los estudios complementarios, la evidencia
./DOMAIN-MODEL.md:82:de datos REDCap o cualquier otro material que el equipo de salud pública
./DOMAIN-MODEL.md:113:activas. Los estudios complementarios, los documentos del proceso participativo
./DOMAIN-MODEL.md:115:cada exportación REDCap es un documento nuevo que convive con los anteriores sin
./DOMAIN-MODEL.md:243:Territorial. Véase la entrada **Perfil de Salud Local (PSL)** en el glosario.
./DOMAIN-MODEL.md:294:municipal mediante exportaciones REDCap y producen datos procesados localmente.
./DOMAIN-MODEL.md:308:#### IBSE — Índice de Bienestar Socioemocional
./DOMAIN-MODEL.md:310:El IBSE mide el bienestar socioemocional de la población escolar mediante
./DOMAIN-MODEL.md:316:#### SF-12 — Salud percibida (versión corta)
./DOMAIN-MODEL.md:318:El SF-12 mide la salud percibida en dos componentes: salud física (PCS-12) y
./DOMAIN-MODEL.md:328:#### PREDIMED — Adherencia a la Dieta Mediterránea
./DOMAIN-MODEL.md:330:PREDIMED mide el grado de adherencia a la dieta mediterránea mediante un
./DOMAIN-MODEL.md:331:cuestionario de 14 ítems. Sus resultados son la puntuación media municipal y la
./DOMAIN-MODEL.md:338:especificar: su origen (REDCap o equivalente), sus columnas de datos, sus
./DOMAIN-MODEL.md:364:propio proceso de planificación participativa del Plan Local de Salud. Incluyen:
./DOMAIN-MODEL.md:397:- Talleres RELAS o similares de diagnóstico participativo.
./DOMAIN-MODEL.md:441:municipio a lo largo del tiempo: datos IBSE de años sucesivos, evoluciones del
./DOMAIN-MODEL.md:442:Perfil de Salud, resultados de PREDIMED en distintos ciclos, etc. La evolución
./DOMAIN-MODEL.md:505:- El mismo ciclo de vida: importación CSV REDCap → cómputo de agregados →
./DOMAIN-MODEL.md:519:- Su propio parser para la estructura de columnas de su exportación REDCap.
./DOMAIN-MODEL.md:589:  preguntas, opciones de respuesta y lógica de salto fieles al cuestionario oficial.
./DOMAIN-MODEL.md:598:- pregunta oficial (texto exacto del cuestionario);
./DOMAIN-MODEL.md:615:3. escalas complementarias validadas (IBSE, SF-12, DUKE, CAGE, PREDIMED, IPAQ y otras);
./DOMAIN-MODEL.md:701:| **MIT (Motor de Interpretación Territorial)** | Motor analítico del Nivel 2. Transforma el EvidenceStore en un Estado Territorial Evolutivo: dimensión diagnóstica (determinantes, activos, indicadores, hallazgos), dimensión longitudinal y áreas de intervención territorial. Produce el Perfil de Salud Local. |
./DOMAIN-MODEL.md:702:| **Perfil de Salud Local (PSL)** | Objeto canónico del Nivel 2 de COMPÁS NG, generado por el MIT a partir del EvidenceStore. No es el Informe de Salud del municipio ni un documento del repositorio: es una síntesis analítica validable que actúa como único puente autorizado hacia el nivel de decisión. Ciclo de vida: `generated` → `validated`. |
./DOMAIN-MODEL.md:703:| **Plan de Acción** | Borrador técnico del Nivel 3, generado a partir del PSL validado (o en borrador). Contiene objetivos, actuaciones e indicadores preliminares con trazabilidad explícita al PSL origen (`pslReference`). Requiere validación humana antes de devenir decisión institucional. |
./DOMAIN-MODEL.md:714:y «Perfil de Salud Local» (objeto analítico generado por el MIT). Glosario ampliado con
./DOMAIN-MODEL.md:715:MIT, PSL y Plan de Acción.*
./EAS_COMPLETO.csv:1:PROV,hab,TAM_HOG,SEX_01,ED_01,ME_01,SEX_02,ED_02,ME_02,SEX_03,ED_03,ME_03,SEX_04,ED_04,ME_04,SEX_05,ED_05,ME_05,SEX_06,ED_06,ME_06,SEX_07,ED_07,ME_07,SEX_08,ED_08,ME_08,SEX_09,ED_09,ME_09,SEX_10,ED_10,ME_10,CF,ENT1,PAR_01,LAB_01,PAR_02,LAB_02,PAR_03,LAB_03,PAR_04,LAB_04,PAR_05,LAB_05,PAR_06,LAB_06,PAR_07,LAB_07,PAR_08,LAB_08,PAR_09,LAB_09,PAR_10,LAB_10,LIM_01S1,LIM_01S2,LIM_01S3,LIM_01S4,LIM_01S5,RLIM_01,LIM_02S1,LIM_02S2,LIM_02S3,LIM_02S4,LIM_02S5,RLIM_02,LIM_03S1,LIM_03S2,LIM_03S3,LIM_03S4,LIM_03S5,RLIM_03,LIM_04S1,LIM_04S2,LIM_04S3,LIM_04S4,LIM_04S5,RLIM_04,LIM_05S1,LIM_05S2,LIM_05S3,LIM_05S4,LIM_05S5,RLIM_05,LIM_06S1,LIM_06S2,LIM_06S3,LIM_06S4,LIM_06S5,RLIM_06,LIM_07S1,LIM_07S2,LIM_07S3,LIM_07S4,LIM_07S5,RLIM_07,LIM_08S1,LIM_08S2,LIM_08S3,LIM_08S4,LIM_08S5,RLIM_08,LIM_09S1,LIM_09S2,LIM_09S3,LIM_09S4,LIM_09S5,RLIM_09,LIM_10S1,LIM_10S2,LIM_10S3,LIM_10S4,LIM_10S5,RLIM_10,LIMS01,LIMS02,LIMS03,LIMS04,LIMS05,LIMS06,LIMS07,LIMS08,LIMS09,LIMS10,CUI_01,RCUI_1_S01,CUI_H01,CUI_02,RCUI_2_S01,CUI_H02,CUI_03,RCUI_3_S01,CUI_H03,CUI_04,RCUI_4_S01,CUI_H04,CUI_05,RCUI_5_S01,CUI_H05,CUI_06,RCUI_6_S01,CUI_H06,CUI_07,RCUI_7_S01,CUI_H07,CUI_08,RCUI_8_S01,CUI_H08,CUI_09,RCUI_9_S01,CUI_H09,CUI_10,RCUI_10_S01,CUI_H10,Q02D_LAB,Q02D_FES,P02F,Q02G_LAB,Q02G_FES,Q03,Q03B_LAB,Q03B_FES,P03C,P04A,P04A_2023,Q04B,P04C01,P04C02,P04C03,P04C04,P04C05,P04C201,P04C02_2007,P04C202,P04C03_2007,P04C203,P04C204,P04C05_2007,P04C205,P04C06,P04C206,P04C07,P04C207,P04C08,P04C208,P04C09,P04C209,P04C10,P04C210,P04C211,P04C212,P04C01_2007,Q04C_2023,Q04C1_2023,P04C04_2023,P04C05_2023,P04B1_1_2023,P04B1_2_2023,P04B3_1_2023,P04E,P04B3_2_2023,P04B3_3_2023,P04F,P05A01,P05A02,P05A03,P05A04,P05A05,P05A06,P05A07,P05B,P06,AIRE_1,AIRE_2,RUIDO_1,RUIDO_2,P07,P07B_2023,P0801,P0802,P0901,P0902,P1001,P1002,P11,P1201,P1202,P1203,P13,P13A_2023,P13A_1_2023,P1401,P14A01,P14B01,P14C01,P1402,P14A02,P14B02,P14C02,P1403,P14A03,P14B03,P14C03,P1404,P14A04,P14B04,P14C04,P1405,P14A05,P14B05,P14C05,P1406,P14A06,P14B06,P14C06,P1407,P14A07,P14B07,P14C07,P1408,P14A08,P14B08,P14C08,P1409,P14A09,P14B09,P14C09,P1410,P14A10,P14B10,P14C10,P1411,P14A11,P14B11,P14C11,P1412,P14A12,P14B12,P14C12,P1413,P14A13,P14B13,P14C13,P1414,P14A14,P14B14,P14C14,P1415,P14A15,P14B15,P14C15,P1416,P14A16,P14B16,P14C16,P1417,P14A17,P14B17,P14C17,P1418,P14A18,P14B18,P14C18,P1419,P14A19,P14B19,P14C19,P1420,P14A20,P14B20,P14C20,P1421,P14A21,P14B21,P14C21,P1422,P14A22,P14B22,P14C22,P1423_2016_2023,P14A23_2016_2023,P14B23_2016_2023,P14C23_2016,P1424_2016_2023,P14A24_2016_2023,P14B24_2016_2023,P14C24_2016,P1425,P14A25,P14B25,P14C25,P1426,P14A26,P14B26,P14C26,P1427,P14A27,P14B27,P14C27,P1428,P14A28,P14B28,P14C28,P1429,P14A29,P14B29,P14C29,P1430,P14A30,P14B30,P14C30,P1431,P14A31,P14B31,P14C31,P1432,P14A32,P14B32,P14C32,P1433,P14A33,P14B33,P14C33,P1434,P14A34,P14B34,P14C34,P1435,P14A35,P14B35,P14C35,P1435_2011_2023,P14A35_2011_2023,P14B35_2011_2023,P1423,P14A23,P14B23,P1438_2023,P14B38_2023,OT1,P1497,P14A97,P14B97,P14C97,OT2,P1498,P14A98,P14B98,P14C98,OT3,P1499,P14A99,P14B99,P14C99,P15,Q15_1,P15A,Q15_2,P15B,P15BOTROS_2023,P15C,P15C_2007,P15C_2023,P15D_2007,P15E_2023,P16,P16A01,P16B01,P16A02,P16B02,P16A03,P16B03,P16A04,P16B04,P16A05,P16B05,P16A06,P16B06,P16A07,P16B07,P16A08,P16B08,P16A09,P16B09,P16A10,P16B10,P16A11,P16B11,P16A12,P16B12,P16A13,P16B13,P16A15,P16B15,P16A17,P16B17,P16A18,P16B18,P16A14_2012,P16B14_2012,P16A19_2023,P16A20,P16A21_2023,OTT1,P16A97,P16B97,OTT2,P16A98,P16B98,OTT3,P16A99,P16B99,P17,P17A,Q17B,P17C,P17D,P17E,P17E_2,Q17F_M,Q17F_D,P17G,P17G_R2,Q17H_A,Q17H_M,P1801_2016_2023,P1802_2016_2023,P1803_2016_2023,P1804_2016_2023,P1805_2016_2023,P1806_2023,P19,P19_2023,Q19A,Q19B_A,Q19B_M,P19C01,P19C02,P19C03,P19C04,P19C05,P19C06,P19C07,P19C08,P19C09,P19C10_2023,P19C11_2023,P19D,P19D_R,P19D_R2,P19E,P20,Q20A,P20B,Q20C,Q20C_R,Q20C_R2,P20D1_2023,P20D2_2023,P21,P21D1_2023,P21D2_2023,P21D3_2023,P21D4_2023,P21D5_2023,P21D6_2023,Q21A,P21B,P21B_R2,P21C,P23,Q23,Q23_R,Q23_R2,P23_1_2016_2023,P23_2_2016,Q23_1_2016_2023,Q23_2_2016,P2401,P2402,P2403,P2404,P2405,P2406,Q24A01,Q24A02,Q24A03,P24B,P24C,P24D,Q24D_2,P24E,P24F,Q25_M,Q25_A,Q25_A_R2,Q25B01,Q25B02,Q25B03,P25D_2023,P25F_2023,P25FOTROS_2023,P26,P26_2007,Q26A_2007,P27_1,P27_2,Q27A_2007,P29,P29_2023,P29A,P29A_2016_2023,P3001,Q30A01,P3002,Q30A02,P3003,Q30A03,P3004,Q30A04,P3005,Q30A05,P3006,Q30A06,P3101,P3102,P3103,P3104,P3105,P3106,Q31A,P32,P32A,P32B,P32C,P32D_2023,Q33,P33A,P33_1_2023,P33_2_2023,P33_HOR_2023,P33_MIN_2023,P33B1_2023,P33B2_2023,P33B3_2023,P33B4_2023,P33B5_2023,P34,P34A,P34A_R,P34A_2023,P34B01,P34B02,P34B03,P34B04,P34C_2023,P34C1_2023,P34C2_2023,P34C3_2023,P34D1,P34D2H,P34D2M,P34D_2023,P34D1_2023,P34D2_2023,P34D3_2023,P34E1,P34E2H,P34E2M,P34F1,P34F2H,P34F2M,P34G_H,P34G_M,P34G_HOR_2023,P34G_MIN_2023,P35,P35_2023,P35A_2023,P36A,P36B01,P36B02,P36B03,P36B04,P36B05,P36B06,P36B07,P36B08,P36B09,P36B10,P36B11,P36B12,P36B13,P36B14,P36B15,P36BPD01_2023,P36BPD02_2023,P36BPD03_2023,P36BPD04_2023,P36BPD05_2023,P36BPD06_2023,P36BPD07_2023,P36BPD08_2023,P36BPD09_2023,P36BPD10_2023,P36BPD11_2023,P36BPD12_2023,P36BPD13_2023,P36BPD14_2023,P36B16,P36B17,P36B02_R,P36B06_R,P36B08_R,P36B13_R,P36BPD07_R,P37,P37AS1,P37AS2,P37B_2023,P37C1_2023,P37C2_2023,P37C3_2023,P38A,P38B,P38C,P39A,P39A1_2023,P39A2_2023,P39A3_2023,P39A4_2023,P39A5_2023,P39B,P39B_2023,P39C,P40,P41A,P41B,P41B_2007_2012,P41B_2023,P41C_2023,P41C1_AOS_2023,P41C1_MES_2023,P41D_2023,P41E_2023,P41E_2023_R,P42,P42A,P42B,P42C,P42C_R,P43,P43A,P43B,P43C,P43D,P43E,P44,P44_2007,Q44B,P44C,P44D,Q4501,Q4502,Q4503,Q4504,Q4505,Q4506,Q45A,Q45B,Q45B_R,P45C,P45C_R1,P45C_R2,P45D,Q46,Q47,P47A,P48,P48A,P49,P49A,P50_1,P50_2,P50A_1,P50A_2,P51_1,P51_1_2007,P51_2,P51_2_2007,P51A_1_2007,P51A_2_2007,P52_1,P52_1_2007,P52_2,P52_2_2007,P52A_1_2007,P52A_2_2007,P53,P53_2007,Q5401,Q5402,Q5403,Q5404,Q5405,Q5406,Q5407,Q5408,Q5409,Q5410,Q5411,Q5412,Q5413,Q5414,Q5415,Q5416,Q5417,Q5418_2023,Q5419_2023,Q5409A_2023,Q5410A_2023,Q55,Q55_2007,Q56,Q56_2007,Q57,P57_R2,P5701,P5702,P5703,P5704,P5705,P5706,P5707,P5708,P5709,P5710,P5711,P57B1_2023,P57B2_2023,P57B3_2023,P57B4_2023,P57B5_2023,P57B6_2023,P57C1_2023,P57C2_2023,P58,P58_PROV,P58MUNI_ine,P58MUNI_ine_2016,P58_ANIO,P58_PAIS,P58_A_ES,P58_A_AN,P59,P59A,P60,P60_2016,P60_2023,P61,Q61A,P62,P63,P63A,P63A_2007,P63B,P63B_2007,P63C,P64,Q64A_A,Q64A_M,P64B,P64B_2016,Q64C,Q64D_H,Q64D_M,P64E,P65,P6501_2007,P6504_2007,P6507_2007,P6510_2007,P6511_2007,P6512_2007,P6513_2007,P6514_2007,P6515_2007,P6516_2007,P6517_2007,P6519_2007,P6520_2007,P6601,P6602,P6603,P6604,P6605,P6606,P6607,P6601_2007,P6602_2007,P6603_2007,P6604_2007,P6605_2007,P6606_2007,P6607_2007,P6608_2007,P6609_2007,P6610_2007,P6611_2007,P6612_2007,P6613_2007,P6614_2007,P6615_2007,P6701,P6702,P6703,P6704,P6705,P6706,P6707,P6708,P6709,P6710,P6711,P6712,P6713,P6714,P6715,P6716,P68,P69$dolorEspalda,P69$nervioso,P69$agotado,P69$dolorMuscular,P69$dolorCabeza,P69$problemSueño,P6907S1,P69A_OS1_2007,P70A01_2007,P70A02_2007,P70A03_2007,P70A04_2007,P70A05_2007,P70A_2023,P70B_2023,P70C1_2023,P70C2_2023,P70C3_2023,P70D_2023,Q70,P70B_2007,P71,P72,P72_2016,P73,P74,P74_2016,P74A,Q74A2,P74B,P74B2S1,P74B2S2,P74B2S3,P74B2S1_2016,P74C,P74C_2007,P74D,P74D_2007,P74E,P75,P75_P_2012,P75_M_2012,P76_P_2012,P76_M_2012,P77_2023,P78_2023,P78A_2023,P78B_2023,P78C_2023,P79A1_2023,P79A2_2023,P79A3_2023,P79A4_2023,P79A5_2023,P79A6_2023,P79A7_2023,P79A8_2023,P79A9_2023,P79A10_2023,P80_2023,aSEX_01,aSEX_02,aSEX_03,aSEX_04,aSEX_05,aSEX_06,aSEX_07,aSEX_08,aSEX_09,aSEX_10,aED_01,aED_02,aED_03,aED_04,aED_05,aED_06,aED_07,aED_08,aED_09,aED_10,SEXO,edad_c,EDAD_G2,EDAD_G,elevacion,anioencuesta,lab_sat,P6506_2007,estrato,SE_ADU,ED_ADU,RGH1,PF02,PF04,rp2,rp3,RE2,RE3,RBP2,RMH3,RVT2,MH4,SF2,PCS12_SP,MCS12_SP,IBSE,IBSE_100,P57B_R,CAGE,IMC,IMC_R,IMC_R2,Predimed,MET,IPAQ_MET,METnivel,Barthel,Barthel_r,LAWTONB_2023R,LAWTONB_2023R2,LAWTONB_R,LAWTONB_R2,dukeGLOBAL,dukeCONF,dukeAFECT,P57GLOBAL_R,P57_AC_R,P57_AF_R,P33_1_R,P33_R,P33_1_R2,ProblemasDormirP33b,CoPsoQ,CoTrAQ,Hacinamiento,P1_R,P2A_enfcro_R,P2A_ner_R,P2A_fisi_R,P2A_senso_R,P2A_psíq_R,P2A_R,P2B_R,P2C_R,P3A_R,Hacinamiento_R,ProbViv_temp,ProbViv_estruc,P05A_R,P05B_R,AIRE_1_R,RUIDO_1_R,P07_R,P07B_R_2023,P08_1_R,P08_2_R,P11_R,P12_1_R,P12_2_R,P12_3_R,P13_R,P13A_R,P13A_1_R,P14_n_R,P14B_n_R,cron_prev_index,cron_mort_index,cron_index,POLIPATOLOGIA_2,POLIPATOLOGIA_Lim_2,POLIPATOLOGIA_5,POLIPATOLOGIA_Lim_5,DC,DC_R,DCD,DCD_R,P15B_3_R,P15E_R,P16A_n_R,P16A_R,P16A_n_R2,P16A_2_R3,P17G_R,P19E_R,P20D2_R_2023,P21_R,P21B_R,P21D_1_R,P21D_2_R,P21D_3_R,P21D_4_R,P21D_5_R,P21D_6_R,P25D_R_2023,P32D_R,P33B_R1,P33B_R2,P33B_R3,P33B_R4,P33B_R5,P41C_R,BARTHEL_R2,P57_R,P57B3_R,ESTUDIOS,P64D1_R,P70B_R_2023,P70D_R_2023,P71_R,P79_n_R,P79_n_R2,P79A_R,P80_R,Estudios_MAX,Estudios_MAX_LIT,MCS12_SP_R,PCS12_SP_R,Q25_A_R3,P23_R,P23_R2,P23_1_2016_2023_R,P23_2_2016_R,CLASESOCIAL,CLASESOCIAL_MasIngresos,CLASESOCIAL_Hogar,P2A_lim_R,P2C_R1,P2C_R2,P3A_R1,P3A_R2,P04D_R,P15D_R,P22_R,P25C_R_2023,P55S_R,P56S_R,P64S_2023_R,P02E$contratada,P02E$ssociales,P02E$otras,P02E$nadie,P3A$yo,P3A$pareja,P3A$yo_otrapersona,P3A$personadelacasa,P3A$contratada,P3A$otra,P3A$otraNOcobra,P3A$otraSIcobra,P3A$otraSIcobraNOhogar,P04D$colectiva,P04D$individual,P04D$aparatos,P04D$notiene,P15D$ingresado,P15D$urgencias,P15D$consultar,P15D$nada,P19F$mañana,P19F$tarde,P19F$noche,P22$ss,P22$mutaSS,P22$mutuaSPriv,P22$concerIndv,P22$concerEmp,P22$notiene,P22$otro,P25A$medico,P25A$molestias,P25A$preocupacion,P25A$rendimiento,P25A$voluntad,P25A$otro,P25C$parches_2023,P25C$cursos_2023,P25C$smedicoempresa_2023,P25C$otrosprofesionales_2023,P25C$pormicuenta_2023,P25C$productsfarma_2023,P25C$otraforma_2023,P28$madre_2012,P28$padre_2012,P28$yo_2012,P28$otro_2012,P28$nadie_2012,P32E$bar_2023,P32E$casa_2023,P32E$amigos_2023,P32E$calle_2023,P32E$eventos_2023,P36$cafe,P36$pan,P36$fruta,P36$huevo,P36$otros,P36$nada,P44A$analisis,P44A$sangre,P44A$endoscopia,P44A$otras,P56$nadie,P56$pareja,P56$familiarvive,P56$familiar,P56$amigo,P56$privada,P56$auxiliar,P56$enfermera,P56$voluntariado,P56$otro,P55$nadie,P55$pareja,P55$familiarvive,P55$familiar,P55$amigo,P55$privada,P55$auxiliar,P55$enfermera,P55$voluntario,P55$otro,P62A$jubilacion,P62A$viudedad,P62A$invalidez,P62A$otras,P62A$jubilacion_2015_2023,P62A$viudedad_2015_2023,P62A$invalidez_2015_2023,P62A$compensatoria_2015_2023,P62A$orfandad_2015_2023,P62A$nocontributiva_2015_2023,P62A$familiar_2015_2023,P62A$otros_2015_2023,P64D$andando_2023,P64D$bicicleta_2023,P64D$particular_2023,P64D$publico_2023,P64D$otros_2023,P64D$noloshace_2023,P79$hipoteca_2023,P79$alquiler_2023,P79$compras_2023,P79$seguros_2023,P79$impuestos_2023,P79$recibos_2023,P79$autonomos_2023,P79$colegios_2023,P79$extraescolares_2023,P79$otros_2023,P79$ninguna_2023,RCUI_1_2023_S01,RCUI_1_2023_S02,RCUI_1_2023_S03,RCUI_1_2023_S04,RCUI_1_2023_S05,RCUI_1_2023_S06,RCUI_1_2023_S07,RCUI_2_2023_S01,RCUI_2_2023_S02,RCUI_2_2023_S03,RCUI_2_2023_S04,RCUI_2_2023_S05,RCUI_2_2023_S06,RCUI_2_2023_S07,RCUI_3_2023_S01,RCUI_3_2023_S02,RCUI_3_2023_S03,RCUI_3_2023_S04,RCUI_3_2023_S05,RCUI_3_2023_S06,RCUI_3_2023_S07,RCUI_4_2023_S01,RCUI_4_2023_S02,RCUI_4_2023_S03,RCUI_4_2023_S04,RCUI_4_2023_S05,RCUI_4_2023_S06,RCUI_4_2023_S07,RCUI_5_2023_S01,RCUI_5_2023_S02,RCUI_5_2023_S03,RCUI_5_2023_S04,RCUI_5_2023_S05,RCUI_5_2023_S06,RCUI_5_2023_S07,RCUI_6_2023_S01,RCUI_6_2023_S02,RCUI_6_2023_S03,RCUI_6_2023_S04,RCUI_6_2023_S05,RCUI_6_2023_S06,RCUI_6_2023_S07,RCUI_7_2023_S01,RCUI_7_2023_S02,RCUI_7_2023_S03,RCUI_7_2023_S04,RCUI_7_2023_S05,RCUI_7_2023_S06,RCUI_7_2023_S07,RCUI_8_2023_S01,RCUI_8_2023_S02,RCUI_8_2023_S03,RCUI_8_2023_S04,RCUI_8_2023_S05,RCUI_8_2023_S06,RCUI_8_2023_S07,RCUI_9_2023_S01,RCUI_9_2023_S02,RCUI_9_2023_S03,RCUI_9_2023_S04,RCUI_9_2023_S05,RCUI_9_2023_S06,RCUI_9_2023_S07,RCUI_10_2023_S01,RCUI_10_2023_S02,RCUI_10_2023_S03,RCUI_10_2023_S04,RCUI_10_2023_S05,RCUI_10_2023_S06,RCUI_10_2023_S07,CLASESOCIAL_MasIngresos_R,CLASESOCIAL_R,CLASESOCIAL_Hogar_R,CLASESOCIAL_MasIngresos_R2,CLASESOCIAL_R2,CLASESOCIAL_Hogar_R2,Predimed_R,Predimed_R2,Predimed_R3,P36BPD04_R1_2023,PCS12_SP_R2,MCS12_SP_R2,MCS12_SP_R3,PCS12_SP_R3,P16A_n_R3,Q17F_D_R,Q17F_D_R2,Q17F_D_R3,Q02D_R,Q02G_R,Q03B_R,Q19B_R,Q64A_R,Q64D_R,P41A_R,Q25_A_R,hab_R,P71_R2,P36BPD04_R2_2023,P33_MIN_2023_R,P41C1_AOS_2023_R,LAWTONB_2R,LAWTONB_2R2,P3A,LAWTONB_2R3,P34B01_R,P34B02_R,P34B03_R,P34B04_R,P23_1_2016_2023_R2,P25C_R2_2023,Q23_tabaco,Q23_tabaco_R,Q23_tabaco_R2,CAGE_R,P15B_tráfico,P36BPD04_R_2023,P36BPD03_R_2023,Q4501_R,Q4502_R,Q4503_R,Q4504_R,Q4505_R,Q4506_R,Q45A_R,P79_n_R3,P6502_2007,P6503_2007,P6505_2007,P6508_2007,P6509_2007,P6518_2007,P70A_R_2023,P37A$medicoedad,P37A$medicoenfermedad,P37A$vacunaempresa,P37A$vacunapreferencia,P37A$medicootras,P37A$otros,LAWTONBRODY_2023,LAWTONBRODY,IPAQ_DICO,P07_R2,P07B_R2_2023,P40_R,P40_R2,BARTHEL_R3,pesos,G_URBAN,Q02D_R2,P23_1_R_2016_2023,P29_R,P34_R,P11_R2,P14_n_R2,P22_R2,CUI_M1,CUI_M2,CUI_M3,CUI_M4,CUI_M5,CUI_M6,CUI_M7,CUI_M8,CUI_M9,CUI_M10,CUI_GLOB,Viv_Temp_insuf,P42C_R2,P43B_R,P43E_R,P17_R,P17_R2,P58_R,P70C1_R_2023,P70C2_R_2023,P70C3_R_2023,CoPsoQ_R,CoTrAQ_R,CoPsoQ_R2,CoTrAQ_R2,Q17H_R,P20D1_R_2023,P70B_R2_2023,P29_R2_2023,P22_R3,P25D_R2_2023,P22_R4,P41A_R2,P05A05_2023,ID
./EAS_microdatos_adulto_READY.csv:1:PROV,PAR_01,PAR_02,PAR_03,PAR_04,PAR_05,PAR_06,PAR_07,PAR_08,PAR_09,PAR_10,LIM_01S1,LIM_01S2,LIM_01S3,LIM_01S4,LIM_01S5,LIM_02S1,LIM_02S2,LIM_02S3,LIM_02S4,LIM_02S5,LIM_03S1,LIM_03S2,LIM_03S3,LIM_03S4,LIM_03S5,LIM_04S1,LIM_04S2,LIM_04S3,LIM_04S4,LIM_04S5,LIM_05S1,LIM_05S2,LIM_05S3,LIM_05S4,LIM_05S5,LIM_06S1,LIM_06S2,LIM_06S3,LIM_06S4,LIM_06S5,LIM_07S1,LIM_07S2,LIM_07S3,LIM_07S4,LIM_07S5,LIM_08S1,LIM_08S2,LIM_08S3,LIM_08S4,LIM_08S5,LIM_09S1,LIM_09S2,LIM_09S3,LIM_09S4,LIM_09S5,LIM_10S1,LIM_10S2,LIM_10S3,LIM_10S4,LIM_10S5,LIMS01,LIMS02,LIMS03,LIMS04,LIMS05,LIMS06,LIMS07,LIMS08,LIMS09,LIMS10,CUI_01,CUI_H01,CUI_02,CUI_H02,CUI_03,CUI_H03,CUI_04,CUI_H04,CUI_05,CUI_H05,CUI_06,CUI_H06,CUI_07,CUI_H07,CUI_08,CUI_H08,CUI_09,CUI_H09,CUI_10,CUI_H10,Q02D_LAB,Q02D_FES,P02F,Q02G_LAB,Q02G_FES,Q03,Q03B_LAB,Q03B_FES,P03C,P04A,P04A_2023,Q04B,P04C01,P04C02,P04C03,P04C04,P04C05,P04C201,P04C02_2007,P04C202,P04C03_2007,P04C203,P04C204,P04C05_2007,P04C205,P04C06,P04C206,P04C07,P04C207,P04C08,P04C208,P04C09,P04C209,P04C10,P04C210,P04C211,P04C212,P04C01_2007,Q04C_2023,Q04C1_2023,P04C04_2023,P04C05_2023,P04B1_1_2023,P04B1_2_2023,P04B3_1_2023,P04E,P04B3_2_2023,P04B3_3_2023,P04F,P05A01,P05A02,P05A03,P05A04,P05A05,P05A06,P05A07,P05B,P06,P07,P07B_2023,P0801,P0802,P0901,P0902,P1001,P1002,P11,P1201,P1202,P1203,P13,P13A_2023,P13A_1_2023,P1401,P14A01,P14B01,P14C01,P1402,P14A02,P14B02,P14C02,P1403,P14A03,P14B03,P14C03,P1404,P14A04,P14B04,P14C04,P1405,P14A05,P14B05,P14C05,P1406,P14A06,P14B06,P14C06,P1407,P14A07,P14B07,P14C07,P1408,P14A08,P14B08,P14C08,P1409,P14A09,P14B09,P14C09,P1410,P14A10,P14B10,P14C10,P1411,P14A11,P14B11,P14C11,P1412,P14A12,P14B12,P14C12,P1413,P14A13,P14B13,P14C13,P1414,P14A14,P14B14,P14C14,P1415,P14A15,P14B15,P14C15,P1416,P14A16,P14B16,P14C16,P1417,P14A17,P14B17,P14C17,P1418,P14A18,P14B18,P14C18,P1419,P14A19,P14B19,P14C19,P1420,P14A20,P14B20,P14C20,P1421,P14A21,P14B21,P14C21,P1422,P14A22,P14B22,P14C22,P1423_2016_2023,P14A23_2016_2023,P14B23_2016_2023,P14C23_2016,P1424_2016_2023,P14A24_2016_2023,P14B24_2016_2023,P14C24_2016,P1425,P14A25,P14B25,P14C25,P1426,P14A26,P14B26,P14C26,P1427,P14A27,P14B27,P14C27,P1428,P14A28,P14B28,P14C28,P1429,P14A29,P14B29,P14C29,P1430,P14A30,P14B30,P14C30,P1431,P14A31,P14B31,P14C31,P1432,P14A32,P14B32,P14C32,P1433,P14A33,P14B33,P14C33,P1434,P14A34,P14B34,P14C34,P1435,P14A35,P14B35,P14C35,P1435_2011_2023,P14A35_2011_2023,P14B35_2011_2023,P1423,P14A23,P14B23,P1438_2023,P14B38_2023,P1497,P14A97,P14B97,P14C97,P1498,P14A98,P14B98,P14C98,P1499,P14A99,P14B99,P14C99,P15,Q15_1,P15A,Q15_2,P15B,P15BOTROS_2023,P15C,P15C_2007,P15C_2023,P15D_2007,P15E_2023,P16,P16A01,P16B01,P16A02,P16B02,P16A03,P16B03,P16A04,P16B04,P16A05,P16B05,P16A06,P16B06,P16A07,P16B07,P16A08,P16B08,P16A09,P16B09,P16A10,P16B10,P16A11,P16B11,P16A12,P16B12,P16A13,P16B13,P16A15,P16B15,P16A17,P16B17,P16A18,P16B18,P16A14_2012,P16B14_2012,P16A19_2023,P16A20,P16A21_2023,P16A97,P16B97,P16A98,P16B98,P16A99,P16B99,P17,P17A,Q17B,P17C,P17D,P17E,P17E_2,Q17F_M,Q17F_D,P17G,P17G_R2,Q17H_A,Q17H_M,P1801_2016_2023,P1802_2016_2023,P1803_2016_2023,P1804_2016_2023,P1805_2016_2023,P1806_2023,P19,P19_2023,Q19A,Q19B_A,Q19B_M,P19C01,P19C02,P19C03,P19C04,P19C05,P19C06,P19C07,P19C08,P19C09,P19C10_2023,P19C11_2023,P19D,P19D_R,P19D_R2,P19E,P20,Q20A,P20B,Q20C,Q20C_R,Q20C_R2,P20D1_2023,P20D2_2023,P21,P21D1_2023,P21D2_2023,P21D3_2023,P21D4_2023,P21D5_2023,P21D6_2023,Q21A,P21B,P21B_R2,P21C,P23,Q23,Q23_R,Q23_R2,P23_1_2016_2023,P23_2_2016,Q23_1_2016_2023,Q23_2_2016,P2401,P2402,P2403,P2404,P2405,P2406,Q24A01,Q24A02,Q24A03,P24B,P24C,P24D,Q24D_2,P24E,P24F,Q25_M,Q25_A,Q25_A_R2,Q25B01,Q25B02,Q25B03,P25D_2023,P25F_2023,P25FOTROS_2023,P26,P26_2007,Q26A_2007,P27_1,P27_2,Q27A_2007,P29,P29_2023,P29A,P29A_2016_2023,P3001,Q30A01,P3002,Q30A02,P3003,Q30A03,P3004,Q30A04,P3005,Q30A05,P3006,Q30A06,P3101,P3102,P3103,P3104,P3105,P3106,Q31A,P32,P32A,P32B,P32C,P32D_2023,Q33,P33A,P33_1_2023,P33_2_2023,P33_HOR_2023,P33_MIN_2023,P33B1_2023,P33B2_2023,P33B3_2023,P33B4_2023,P33B5_2023,P34,P34A,P34A_R,P34A_2023,P34B01,P34B02,P34B03,P34B04,P34C_2023,P34C1_2023,P34C2_2023,P34C3_2023,P34D1,P34D2H,P34D2M,P34D_2023,P34D1_2023,P34D2_2023,P34D3_2023,P34E1,P34E2H,P34E2M,P34F1,P34F2H,P34F2M,P34G_H,P34G_M,P34G_HOR_2023,P34G_MIN_2023,P35,P35_2023,P35A_2023,P36A,P36B01,P36B02,P36B03,P36B04,P36B05,P36B06,P36B07,P36B08,P36B09,P36B10,P36B11,P36B12,P36B13,P36B14,P36B15,P36BPD01_2023,P36BPD02_2023,P36BPD03_2023,P36BPD04_2023,P36BPD05_2023,P36BPD06_2023,P36BPD07_2023,P36BPD08_2023,P36BPD09_2023,P36BPD10_2023,P36BPD11_2023,P36BPD12_2023,P36BPD13_2023,P36BPD14_2023,P36B16,P36B17,P36B02_R,P36B06_R,P36B08_R,P36B13_R,P36BPD07_R,P37,P37AS1,P37AS2,P37B_2023,P37C1_2023,P37C2_2023,P37C3_2023,P38A,P38B,P38C,P39A,P39A1_2023,P39A2_2023,P39A3_2023,P39A4_2023,P39A5_2023,P39B,P39B_2023,P39C,P40,P41A,P41B,P41B_2007_2012,P41B_2023,P41C_2023,P41C1_AOS_2023,P41C1_MES_2023,P41D_2023,P41E_2023,P41E_2023_R,P42,P42A,P42B,P42C,P42C_R,P43,P43A,P43B,P43C,P43D,P43E,P44,P44_2007,Q44B,P44C,P44D,Q4501,Q4502,Q4503,Q4504,Q4505,Q4506,Q45A,Q45B,Q45B_R,P45C,P45C_R1,P45C_R2,P45D,Q46,Q47,P47A,P48,P48A,P49,P49A,P50_1,P50_2,P50A_1,P50A_2,P51_1,P51_1_2007,P51_2,P51_2_2007,P51A_1_2007,P51A_2_2007,P52_1,P52_1_2007,P52_2,P52_2_2007,P52A_1_2007,P52A_2_2007,P53,P53_2007,Q5401,Q5402,Q5403,Q5404,Q5405,Q5406,Q5407,Q5408,Q5409,Q5410,Q5411,Q5412,Q5413,Q5414,Q5415,Q5416,Q5417,Q5418_2023,Q5419_2023,Q5409A_2023,Q5410A_2023,Q55,Q55_2007,Q56,Q56_2007,Q57,P57_R2,P5701,P5702,P5703,P5704,P5705,P5706,P5707,P5708,P5709,P5710,P5711,P57B1_2023,P57B2_2023,P57B3_2023,P57B4_2023,P57B5_2023,P57B6_2023,P57C1_2023,P57C2_2023,P58,P58_PROV,P58MUNI_ine,P58MUNI_ine_2016,P58_ANIO,P58_PAIS,P58_A_ES,P58_A_AN,P59,P59A,P60,P60_2016,P60_2023,P61,Q61A,P62,P63,P63A,P63A_2007,P63B,P63B_2007,P63C,P64,Q64A_A,Q64A_M,P64B,P64B_2016,Q64C,Q64D_H,Q64D_M,P64E,P65,P6501_2007,P6504_2007,P6507_2007,P6510_2007,P6511_2007,P6512_2007,P6513_2007,P6514_2007,P6515_2007,P6516_2007,P6517_2007,P6519_2007,P6520_2007,P6601,P6602,P6603,P6604,P6605,P6606,P6607,P6601_2007,P6602_2007,P6603_2007,P6604_2007,P6605_2007,P6606_2007,P6607_2007,P6608_2007,P6609_2007,P6610_2007,P6611_2007,P6612_2007,P6613_2007,P6614_2007,P6615_2007,P6701,P6702,P6703,P6704,P6705,P6706,P6707,P6708,P6709,P6710,P6711,P6712,P6713,P6714,P6715,P6716,P68,P69$dolorEspalda,P69$nervioso,P69$agotado,P69$dolorMuscular,P69$dolorCabeza,P69$problemSueño,P6907S1,P69A_OS1_2007,P70A01_2007,P70A02_2007,P70A03_2007,P70A04_2007,P70A05_2007,P70A_2023,P70B_2023,P70C1_2023,P70C2_2023,P70C3_2023,P70D_2023,Q70,P70B_2007,P71,P72,P72_2016,P73,P74,P74_2016,P74A,Q74A2,P74B,P74B2S1,P74B2S2,P74B2S3,P74B2S1_2016,P74C,P74C_2007,P74D,P74D_2007,P74E,P75,P75_P_2012,P75_M_2012,P76_P_2012,P76_M_2012,P77_2023,P78_2023,P78A_2023,P78B_2023,P78C_2023,P79A1_2023,P79A2_2023,P79A3_2023,P79A4_2023,P79A5_2023,P79A6_2023,P79A7_2023,P79A8_2023,P79A9_2023,P79A10_2023,P80_2023,P6506_2007,PF02,PF04,PCS12_SP,P57B_R,Predimed,P57GLOBAL_R,P57_AC_R,P57_AF_R,P33_1_R,P33_R,P33_1_R2,ProblemasDormirP33b,P1_R,P2A_enfcro_R,P2A_ner_R,P2A_fisi_R,P2A_senso_R,P2A_psíq_R,P2A_R,P2B_R,P2C_R,P3A_R,ProbViv_temp,ProbViv_estruc,P05A_R,P05B_R,P07_R,P07B_R_2023,P08_1_R,P08_2_R,P11_R,P12_1_R,P12_2_R,P12_3_R,P13_R,P13A_R,P13A_1_R,P14_n_R,P14B_n_R,POLIPATOLOGIA_2,POLIPATOLOGIA_Lim_2,POLIPATOLOGIA_5,POLIPATOLOGIA_Lim_5,P15B_3_R,P15E_R,P16A_n_R,P16A_R,P16A_n_R2,P16A_2_R3,P17G_R,P19E_R,P20D2_R_2023,P21_R,P21B_R,P21D_1_R,P21D_2_R,P21D_3_R,P21D_4_R,P21D_5_R,P21D_6_R,P25D_R_2023,P32D_R,P33B_R1,P33B_R2,P33B_R3,P33B_R4,P33B_R5,P41C_R,P57_R,P57B3_R,P64D1_R,P70B_R_2023,P70D_R_2023,P71_R,P79_n_R,P79_n_R2,P79A_R,P80_R,PCS12_SP_R,Q25_A_R3,P23_R,P23_R2,P23_1_2016_2023_R,P23_2_2016_R,P2A_lim_R,P2C_R1,P2C_R2,P3A_R1,P3A_R2,P04D_R,P15D_R,P22_R,P25C_R_2023,P55S_R,P56S_R,P64S_2023_R,P02E$contratada,P02E$ssociales,P02E$otras,P02E$nadie,P3A$yo,P3A$pareja,P3A$yo_otrapersona,P3A$personadelacasa,P3A$contratada,P3A$otra,P3A$otraNOcobra,P3A$otraSIcobra,P3A$otraSIcobraNOhogar,P04D$colectiva,P04D$individual,P04D$aparatos,P04D$notiene,P15D$ingresado,P15D$urgencias,P15D$consultar,P15D$nada,P19F$mañana,P19F$tarde,P19F$noche,P22$ss,P22$mutaSS,P22$mutuaSPriv,P22$concerIndv,P22$concerEmp,P22$notiene,P22$otro,P25A$medico,P25A$molestias,P25A$preocupacion,P25A$rendimiento,P25A$voluntad,P25A$otro,P25C$parches_2023,P25C$cursos_2023,P25C$smedicoempresa_2023,P25C$otrosprofesionales_2023,P25C$pormicuenta_2023,P25C$productsfarma_2023,P25C$otraforma_2023,P28$madre_2012,P28$padre_2012,P28$yo_2012,P28$otro_2012,P28$nadie_2012,P32E$bar_2023,P32E$casa_2023,P32E$amigos_2023,P32E$calle_2023,P32E$eventos_2023,P36$cafe,P36$pan,P36$fruta,P36$huevo,P36$otros,P36$nada,P44A$analisis,P44A$sangre,P44A$endoscopia,P44A$otras,P56$nadie,P56$pareja,P56$familiarvive,P56$familiar,P56$amigo,P56$privada,P56$auxiliar,P56$enfermera,P56$voluntariado,P56$otro,P55$nadie,P55$pareja,P55$familiarvive,P55$familiar,P55$amigo,P55$privada,P55$auxiliar,P55$enfermera,P55$voluntario,P55$otro,P62A$jubilacion,P62A$viudedad,P62A$invalidez,P62A$otras,P62A$jubilacion_2015_2023,P62A$viudedad_2015_2023,P62A$invalidez_2015_2023,P62A$compensatoria_2015_2023,P62A$orfandad_2015_2023,P62A$nocontributiva_2015_2023,P62A$familiar_2015_2023,P62A$otros_2015_2023,P64D$andando_2023,P64D$bicicleta_2023,P64D$particular_2023,P64D$publico_2023,P64D$otros_2023,P64D$noloshace_2023,P79$hipoteca_2023,P79$alquiler_2023,P79$compras_2023,P79$seguros_2023,P79$impuestos_2023,P79$recibos_2023,P79$autonomos_2023,P79$colegios_2023,P79$extraescolares_2023,P79$otros_2023,P79$ninguna_2023,Predimed_R,Predimed_R2,Predimed_R3,P36BPD04_R1_2023,PCS12_SP_R2,PCS12_SP_R3,P16A_n_R3,Q17F_D_R,Q17F_D_R2,Q17F_D_R3,Q02D_R,Q02G_R,Q03B_R,Q19B_R,Q64A_R,Q64D_R,P41A_R,Q25_A_R,P71_R2,P36BPD04_R2_2023,P33_MIN_2023_R,P41C1_AOS_2023_R,P3A,P34B01_R,P34B02_R,P34B03_R,P34B04_R,P23_1_2016_2023_R2,P25C_R2_2023,Q23_tabaco,Q23_tabaco_R,Q23_tabaco_R2,P15B_tráfico,P36BPD04_R_2023,P36BPD03_R_2023,Q4501_R,Q4502_R,Q4503_R,Q4504_R,Q4505_R,Q4506_R,Q45A_R,P79_n_R3,P6502_2007,P6503_2007,P6505_2007,P6508_2007,P6509_2007,P6518_2007,P70A_R_2023,P37A$medicoedad,P37A$medicoenfermedad,P37A$vacunaempresa,P37A$vacunapreferencia,P37A$medicootras,P37A$otros,P07_R2,P07B_R2_2023,P40_R,P40_R2,Q02D_R2,P23_1_R_2016_2023,P29_R,P34_R,P11_R2,P14_n_R2,P22_R2,CUI_M1,CUI_M2,CUI_M3,CUI_M4,CUI_M5,CUI_M6,CUI_M7,CUI_M8,CUI_M9,CUI_M10,CUI_GLOB,P42C_R2,P43B_R,P43E_R,P17_R,P17_R2,P58_R,P70C1_R_2023,P70C2_R_2023,P70C3_R_2023,Q17H_R,P20D1_R_2023,P70B_R2_2023,P29_R2_2023,P22_R3,P25D_R2_2023,P22_R4,P41A_R2,P05A05_2023,sexo_ent,edad_ent,PROV,hab
./EAS_microdatos_adulto_READY_PESOS.csv:1:PROV,PAR_01,PAR_02,PAR_03,PAR_04,PAR_05,PAR_06,PAR_07,PAR_08,PAR_09,PAR_10,LIM_01S1,LIM_01S2,LIM_01S3,LIM_01S4,LIM_01S5,LIM_02S1,LIM_02S2,LIM_02S3,LIM_02S4,LIM_02S5,LIM_03S1,LIM_03S2,LIM_03S3,LIM_03S4,LIM_03S5,LIM_04S1,LIM_04S2,LIM_04S3,LIM_04S4,LIM_04S5,LIM_05S1,LIM_05S2,LIM_05S3,LIM_05S4,LIM_05S5,LIM_06S1,LIM_06S2,LIM_06S3,LIM_06S4,LIM_06S5,LIM_07S1,LIM_07S2,LIM_07S3,LIM_07S4,LIM_07S5,LIM_08S1,LIM_08S2,LIM_08S3,LIM_08S4,LIM_08S5,LIM_09S1,LIM_09S2,LIM_09S3,LIM_09S4,LIM_09S5,LIM_10S1,LIM_10S2,LIM_10S3,LIM_10S4,LIM_10S5,LIMS01,LIMS02,LIMS03,LIMS04,LIMS05,LIMS06,LIMS07,LIMS08,LIMS09,LIMS10,CUI_01,CUI_H01,CUI_02,CUI_H02,CUI_03,CUI_H03,CUI_04,CUI_H04,CUI_05,CUI_H05,CUI_06,CUI_H06,CUI_07,CUI_H07,CUI_08,CUI_H08,CUI_09,CUI_H09,CUI_10,CUI_H10,Q02D_LAB,Q02D_FES,P02F,Q02G_LAB,Q02G_FES,Q03,Q03B_LAB,Q03B_FES,P03C,P04A,P04A_2023,Q04B,P04C01,P04C02,P04C03,P04C04,P04C05,P04C201,P04C02_2007,P04C202,P04C03_2007,P04C203,P04C204,P04C05_2007,P04C205,P04C06,P04C206,P04C07,P04C207,P04C08,P04C208,P04C09,P04C209,P04C10,P04C210,P04C211,P04C212,P04C01_2007,Q04C_2023,Q04C1_2023,P04C04_2023,P04C05_2023,P04B1_1_2023,P04B1_2_2023,P04B3_1_2023,P04E,P04B3_2_2023,P04B3_3_2023,P04F,P05A01,P05A02,P05A03,P05A04,P05A05,P05A06,P05A07,P05B,P06,P07,P07B_2023,P0801,P0802,P0901,P0902,P1001,P1002,P11,P1201,P1202,P1203,P13,P13A_2023,P13A_1_2023,P1401,P14A01,P14B01,P14C01,P1402,P14A02,P14B02,P14C02,P1403,P14A03,P14B03,P14C03,P1404,P14A04,P14B04,P14C04,P1405,P14A05,P14B05,P14C05,P1406,P14A06,P14B06,P14C06,P1407,P14A07,P14B07,P14C07,P1408,P14A08,P14B08,P14C08,P1409,P14A09,P14B09,P14C09,P1410,P14A10,P14B10,P14C10,P1411,P14A11,P14B11,P14C11,P1412,P14A12,P14B12,P14C12,P1413,P14A13,P14B13,P14C13,P1414,P14A14,P14B14,P14C14,P1415,P14A15,P14B15,P14C15,P1416,P14A16,P14B16,P14C16,P1417,P14A17,P14B17,P14C17,P1418,P14A18,P14B18,P14C18,P1419,P14A19,P14B19,P14C19,P1420,P14A20,P14B20,P14C20,P1421,P14A21,P14B21,P14C21,P1422,P14A22,P14B22,P14C22,P1423_2016_2023,P14A23_2016_2023,P14B23_2016_2023,P14C23_2016,P1424_2016_2023,P14A24_2016_2023,P14B24_2016_2023,P14C24_2016,P1425,P14A25,P14B25,P14C25,P1426,P14A26,P14B26,P14C26,P1427,P14A27,P14B27,P14C27,P1428,P14A28,P14B28,P14C28,P1429,P14A29,P14B29,P14C29,P1430,P14A30,P14B30,P14C30,P1431,P14A31,P14B31,P14C31,P1432,P14A32,P14B32,P14C32,P1433,P14A33,P14B33,P14C33,P1434,P14A34,P14B34,P14C34,P1435,P14A35,P14B35,P14C35,P1435_2011_2023,P14A35_2011_2023,P14B35_2011_2023,P1423,P14A23,P14B23,P1438_2023,P14B38_2023,P1497,P14A97,P14B97,P14C97,P1498,P14A98,P14B98,P14C98,P1499,P14A99,P14B99,P14C99,P15,Q15_1,P15A,Q15_2,P15B,P15BOTROS_2023,P15C,P15C_2007,P15C_2023,P15D_2007,P15E_2023,P16,P16A01,P16B01,P16A02,P16B02,P16A03,P16B03,P16A04,P16B04,P16A05,P16B05,P16A06,P16B06,P16A07,P16B07,P16A08,P16B08,P16A09,P16B09,P16A10,P16B10,P16A11,P16B11,P16A12,P16B12,P16A13,P16B13,P16A15,P16B15,P16A17,P16B17,P16A18,P16B18,P16A14_2012,P16B14_2012,P16A19_2023,P16A20,P16A21_2023,P16A97,P16B97,P16A98,P16B98,P16A99,P16B99,P17,P17A,Q17B,P17C,P17D,P17E,P17E_2,Q17F_M,Q17F_D,P17G,P17G_R2,Q17H_A,Q17H_M,P1801_2016_2023,P1802_2016_2023,P1803_2016_2023,P1804_2016_2023,P1805_2016_2023,P1806_2023,P19,P19_2023,Q19A,Q19B_A,Q19B_M,P19C01,P19C02,P19C03,P19C04,P19C05,P19C06,P19C07,P19C08,P19C09,P19C10_2023,P19C11_2023,P19D,P19D_R,P19D_R2,P19E,P20,Q20A,P20B,Q20C,Q20C_R,Q20C_R2,P20D1_2023,P20D2_2023,P21,P21D1_2023,P21D2_2023,P21D3_2023,P21D4_2023,P21D5_2023,P21D6_2023,Q21A,P21B,P21B_R2,P21C,P23,Q23,Q23_R,Q23_R2,P23_1_2016_2023,P23_2_2016,Q23_1_2016_2023,Q23_2_2016,P2401,P2402,P2403,P2404,P2405,P2406,Q24A01,Q24A02,Q24A03,P24B,P24C,P24D,Q24D_2,P24E,P24F,Q25_M,Q25_A,Q25_A_R2,Q25B01,Q25B02,Q25B03,P25D_2023,P25F_2023,P25FOTROS_2023,P26,P26_2007,Q26A_2007,P27_1,P27_2,Q27A_2007,P29,P29_2023,P29A,P29A_2016_2023,P3001,Q30A01,P3002,Q30A02,P3003,Q30A03,P3004,Q30A04,P3005,Q30A05,P3006,Q30A06,P3101,P3102,P3103,P3104,P3105,P3106,Q31A,P32,P32A,P32B,P32C,P32D_2023,Q33,P33A,P33_1_2023,P33_2_2023,P33_HOR_2023,P33_MIN_2023,P33B1_2023,P33B2_2023,P33B3_2023,P33B4_2023,P33B5_2023,P34,P34A,P34A_R,P34A_2023,P34B01,P34B02,P34B03,P34B04,P34C_2023,P34C1_2023,P34C2_2023,P34C3_2023,P34D1,P34D2H,P34D2M,P34D_2023,P34D1_2023,P34D2_2023,P34D3_2023,P34E1,P34E2H,P34E2M,P34F1,P34F2H,P34F2M,P34G_H,P34G_M,P34G_HOR_2023,P34G_MIN_2023,P35,P35_2023,P35A_2023,P36A,P36B01,P36B02,P36B03,P36B04,P36B05,P36B06,P36B07,P36B08,P36B09,P36B10,P36B11,P36B12,P36B13,P36B14,P36B15,P36BPD01_2023,P36BPD02_2023,P36BPD03_2023,P36BPD04_2023,P36BPD05_2023,P36BPD06_2023,P36BPD07_2023,P36BPD08_2023,P36BPD09_2023,P36BPD10_2023,P36BPD11_2023,P36BPD12_2023,P36BPD13_2023,P36BPD14_2023,P36B16,P36B17,P36B02_R,P36B06_R,P36B08_R,P36B13_R,P36BPD07_R,P37,P37AS1,P37AS2,P37B_2023,P37C1_2023,P37C2_2023,P37C3_2023,P38A,P38B,P38C,P39A,P39A1_2023,P39A2_2023,P39A3_2023,P39A4_2023,P39A5_2023,P39B,P39B_2023,P39C,P40,P41A,P41B,P41B_2007_2012,P41B_2023,P41C_2023,P41C1_AOS_2023,P41C1_MES_2023,P41D_2023,P41E_2023,P41E_2023_R,P42,P42A,P42B,P42C,P42C_R,P43,P43A,P43B,P43C,P43D,P43E,P44,P44_2007,Q44B,P44C,P44D,Q4501,Q4502,Q4503,Q4504,Q4505,Q4506,Q45A,Q45B,Q45B_R,P45C,P45C_R1,P45C_R2,P45D,Q46,Q47,P47A,P48,P48A,P49,P49A,P50_1,P50_2,P50A_1,P50A_2,P51_1,P51_1_2007,P51_2,P51_2_2007,P51A_1_2007,P51A_2_2007,P52_1,P52_1_2007,P52_2,P52_2_2007,P52A_1_2007,P52A_2_2007,P53,P53_2007,Q5401,Q5402,Q5403,Q5404,Q5405,Q5406,Q5407,Q5408,Q5409,Q5410,Q5411,Q5412,Q5413,Q5414,Q5415,Q5416,Q5417,Q5418_2023,Q5419_2023,Q5409A_2023,Q5410A_2023,Q55,Q55_2007,Q56,Q56_2007,Q57,P57_R2,P5701,P5702,P5703,P5704,P5705,P5706,P5707,P5708,P5709,P5710,P5711,P57B1_2023,P57B2_2023,P57B3_2023,P57B4_2023,P57B5_2023,P57B6_2023,P57C1_2023,P57C2_2023,P58,P58_PROV,P58MUNI_ine,P58MUNI_ine_2016,P58_ANIO,P58_PAIS,P58_A_ES,P58_A_AN,P59,P59A,P60,P60_2016,P60_2023,P61,Q61A,P62,P63,P63A,P63A_2007,P63B,P63B_2007,P63C,P64,Q64A_A,Q64A_M,P64B,P64B_2016,Q64C,Q64D_H,Q64D_M,P64E,P65,P6501_2007,P6504_2007,P6507_2007,P6510_2007,P6511_2007,P6512_2007,P6513_2007,P6514_2007,P6515_2007,P6516_2007,P6517_2007,P6519_2007,P6520_2007,P6601,P6602,P6603,P6604,P6605,P6606,P6607,P6601_2007,P6602_2007,P6603_2007,P6604_2007,P6605_2007,P6606_2007,P6607_2007,P6608_2007,P6609_2007,P6610_2007,P6611_2007,P6612_2007,P6613_2007,P6614_2007,P6615_2007,P6701,P6702,P6703,P6704,P6705,P6706,P6707,P6708,P6709,P6710,P6711,P6712,P6713,P6714,P6715,P6716,P68,P69$dolorEspalda,P69$nervioso,P69$agotado,P69$dolorMuscular,P69$dolorCabeza,P69$problemSueño,P6907S1,P69A_OS1_2007,P70A01_2007,P70A02_2007,P70A03_2007,P70A04_2007,P70A05_2007,P70A_2023,P70B_2023,P70C1_2023,P70C2_2023,P70C3_2023,P70D_2023,Q70,P70B_2007,P71,P72,P72_2016,P73,P74,P74_2016,P74A,Q74A2,P74B,P74B2S1,P74B2S2,P74B2S3,P74B2S1_2016,P74C,P74C_2007,P74D,P74D_2007,P74E,P75,P75_P_2012,P75_M_2012,P76_P_2012,P76_M_2012,P77_2023,P78_2023,P78A_2023,P78B_2023,P78C_2023,P79A1_2023,P79A2_2023,P79A3_2023,P79A4_2023,P79A5_2023,P79A6_2023,P79A7_2023,P79A8_2023,P79A9_2023,P79A10_2023,P80_2023,P6506_2007,PF02,PF04,PCS12_SP,P57B_R,Predimed,P57GLOBAL_R,P57_AC_R,P57_AF_R,P33_1_R,P33_R,P33_1_R2,ProblemasDormirP33b,P1_R,P2A_enfcro_R,P2A_ner_R,P2A_fisi_R,P2A_senso_R,P2A_psíq_R,P2A_R,P2B_R,P2C_R,P3A_R,ProbViv_temp,ProbViv_estruc,P05A_R,P05B_R,P07_R,P07B_R_2023,P08_1_R,P08_2_R,P11_R,P12_1_R,P12_2_R,P12_3_R,P13_R,P13A_R,P13A_1_R,P14_n_R,P14B_n_R,POLIPATOLOGIA_2,POLIPATOLOGIA_Lim_2,POLIPATOLOGIA_5,POLIPATOLOGIA_Lim_5,P15B_3_R,P15E_R,P16A_n_R,P16A_R,P16A_n_R2,P16A_2_R3,P17G_R,P19E_R,P20D2_R_2023,P21_R,P21B_R,P21D_1_R,P21D_2_R,P21D_3_R,P21D_4_R,P21D_5_R,P21D_6_R,P25D_R_2023,P32D_R,P33B_R1,P33B_R2,P33B_R3,P33B_R4,P33B_R5,P41C_R,P57_R,P57B3_R,P64D1_R,P70B_R_2023,P70D_R_2023,P71_R,P79_n_R,P79_n_R2,P79A_R,P80_R,PCS12_SP_R,Q25_A_R3,P23_R,P23_R2,P23_1_2016_2023_R,P23_2_2016_R,P2A_lim_R,P2C_R1,P2C_R2,P3A_R1,P3A_R2,P04D_R,P15D_R,P22_R,P25C_R_2023,P55S_R,P56S_R,P64S_2023_R,P02E$contratada,P02E$ssociales,P02E$otras,P02E$nadie,P3A$yo,P3A$pareja,P3A$yo_otrapersona,P3A$personadelacasa,P3A$contratada,P3A$otra,P3A$otraNOcobra,P3A$otraSIcobra,P3A$otraSIcobraNOhogar,P04D$colectiva,P04D$individual,P04D$aparatos,P04D$notiene,P15D$ingresado,P15D$urgencias,P15D$consultar,P15D$nada,P19F$mañana,P19F$tarde,P19F$noche,P22$ss,P22$mutaSS,P22$mutuaSPriv,P22$concerIndv,P22$concerEmp,P22$notiene,P22$otro,P25A$medico,P25A$molestias,P25A$preocupacion,P25A$rendimiento,P25A$voluntad,P25A$otro,P25C$parches_2023,P25C$cursos_2023,P25C$smedicoempresa_2023,P25C$otrosprofesionales_2023,P25C$pormicuenta_2023,P25C$productsfarma_2023,P25C$otraforma_2023,P28$madre_2012,P28$padre_2012,P28$yo_2012,P28$otro_2012,P28$nadie_2012,P32E$bar_2023,P32E$casa_2023,P32E$amigos_2023,P32E$calle_2023,P32E$eventos_2023,P36$cafe,P36$pan,P36$fruta,P36$huevo,P36$otros,P36$nada,P44A$analisis,P44A$sangre,P44A$endoscopia,P44A$otras,P56$nadie,P56$pareja,P56$familiarvive,P56$familiar,P56$amigo,P56$privada,P56$auxiliar,P56$enfermera,P56$voluntariado,P56$otro,P55$nadie,P55$pareja,P55$familiarvive,P55$familiar,P55$amigo,P55$privada,P55$auxiliar,P55$enfermera,P55$voluntario,P55$otro,P62A$jubilacion,P62A$viudedad,P62A$invalidez,P62A$otras,P62A$jubilacion_2015_2023,P62A$viudedad_2015_2023,P62A$invalidez_2015_2023,P62A$compensatoria_2015_2023,P62A$orfandad_2015_2023,P62A$nocontributiva_2015_2023,P62A$familiar_2015_2023,P62A$otros_2015_2023,P64D$andando_2023,P64D$bicicleta_2023,P64D$particular_2023,P64D$publico_2023,P64D$otros_2023,P64D$noloshace_2023,P79$hipoteca_2023,P79$alquiler_2023,P79$compras_2023,P79$seguros_2023,P79$impuestos_2023,P79$recibos_2023,P79$autonomos_2023,P79$colegios_2023,P79$extraescolares_2023,P79$otros_2023,P79$ninguna_2023,Predimed_R,Predimed_R2,Predimed_R3,P36BPD04_R1_2023,PCS12_SP_R2,PCS12_SP_R3,P16A_n_R3,Q17F_D_R,Q17F_D_R2,Q17F_D_R3,Q02D_R,Q02G_R,Q03B_R,Q19B_R,Q64A_R,Q64D_R,P41A_R,Q25_A_R,P71_R2,P36BPD04_R2_2023,P33_MIN_2023_R,P41C1_AOS_2023_R,P3A,P34B01_R,P34B02_R,P34B03_R,P34B04_R,P23_1_2016_2023_R2,P25C_R2_2023,Q23_tabaco,Q23_tabaco_R,Q23_tabaco_R2,P15B_tráfico,P36BPD04_R_2023,P36BPD03_R_2023,Q4501_R,Q4502_R,Q4503_R,Q4504_R,Q4505_R,Q4506_R,Q45A_R,P79_n_R3,P6502_2007,P6503_2007,P6505_2007,P6508_2007,P6509_2007,P6518_2007,P70A_R_2023,P37A$medicoedad,P37A$medicoenfermedad,P37A$vacunaempresa,P37A$vacunapreferencia,P37A$medicootras,P37A$otros,P07_R2,P07B_R2_2023,P40_R,P40_R2,Q02D_R2,P23_1_R_2016_2023,P29_R,P34_R,P11_R2,P14_n_R2,P22_R2,CUI_M1,CUI_M2,CUI_M3,CUI_M4,CUI_M5,CUI_M6,CUI_M7,CUI_M8,CUI_M9,CUI_M10,CUI_GLOB,P42C_R2,P43B_R,P43E_R,P17_R,P17_R2,P58_R,P70C1_R_2023,P70C2_R_2023,P70C3_R_2023,Q17H_R,P20D1_R_2023,P70B_R2_2023,P29_R2_2023,P22_R3,P25D_R2_2023,P22_R4,P41A_R2,P05A05_2023,sexo_ent,edad_ent,PROV,hab,peso
./fixtures/cage-eas-granada.csv:1:CAGE_R,CAGE
./fixtures/README.md:17:Fuente: `EAS_microdatos_adulto_READY.csv` — todas las columnas PREDIMED
./fixtures/README.md:18:necesarias están presentes en el fichero READY (a diferencia de SF-12).
./fixtures/README.md:32:| Registros sin Predimed | 2.352 (76,8 %) — oleadas sin módulo PREDIMED |
./fixtures/README.md:44:| `Predimed` | **Campo canónico.** Índice PREDIMED-14 calculado con la recodificación oficial de la EAS. Es la única fuente que COMPÁS NG usa para puntuar. |
./fixtures/README.md:46:| `P36BPD01_2023` … `P36BPD14_2023` | Los 14 ítems brutos del cuestionario PREDIMED (edición EAS 2023). Se conservan **únicamente para auditoría metodológica**, no para cálculo. |
./fixtures/README.md:56:**La suma directa de los 14 ítems no reproduce el índice oficial PREDIMED.**
./fixtures/README.md:58:El parser (`PREDIMEDCSVParser.ts`) prioriza el campo `Predimed` cuando existe y
./fixtures/README.md:145:directamente, igual que consume `Predimed` para PREDIMED-EAS.
./fixtures/README.md:227:  Sociedad Española del Sueño (7–9 h en adultos). Campo derivado por la EAS.
./fixtures/README.md:258:| `P33_R` | **Campo canónico primario** | ~98 % | Sueño insuficiente en horas (0=No / 1=Sí). Derivado EAS según criterios SES. |
./fixtures/README.md:297:referencia contextual provincial, igual que los fixtures de DUKE, PREDIMED y SF-12.
./fixtures/README.md:320:| CAGE_R válidos | 2.513 (82,0 %) |
./fixtures/README.md:322:| CAGE_R=0 (sin riesgo) | 2.499 (99,4 % de válidos) |
./fixtures/README.md:323:| CAGE_R=1 (con riesgo) | 14 (0,6 % de válidos) |
./fixtures/README.md:324:| CAGE=1 Bebedor social | 2.499 |
./fixtures/README.md:325:| CAGE=2 Consumo de riesgo | 7 |
./fixtures/README.md:326:| CAGE=3 Consumo perjudicial | 3 |
./fixtures/README.md:327:| CAGE=4 Dependencia alcohólica | 4 |
./fixtures/README.md:333:| `CAGE_R` | **Campo canónico primario** | Riesgo de alcoholismo (0=No / 1=Sí). Derivado binario EAS. |
./fixtures/README.md:334:| `CAGE` | Campo secundario | Clasificación ordinal de nivel de consumo (1=Bebedor social … 4=Dependencia). |
./fixtures/README.md:338:- El 18 % de missing en `CAGE_R` es **estructural**: personas abstemias a las que
./fixtures/README.md:341:- `CAGE_R` y `CAGE` son indicadores propios de la EAS. COMPÁS NG los consume
./fixtures/README.md:342:  directamente sin recalcular el CAGE desde ítems individuales.
./fixtures/README.md:352:Fixture **específico de Atarfe** generado a partir de la exportación REDCap del
./fixtures/README.md:353:proyecto Monitor IBSE Atarfe 2026. **No es reproducible desde microdatos EAS**:
./fixtures/README.md:356:Fuente: `Atarfe/MonitorIBSEATARFE202_DATA_2026-06-22_1943.csv`
./fixtures/README.md:358:Script de regeneración: no aplica (datos primarios REDCap municipales). Para
./fixtures/README.md:359:actualizar, reexportar desde REDCap y ejecutar la extracción de columnas mínimas.
./fixtures/README.md:367:| Media IBSE total | 63,2 |
./fixtures/README.md:373:| `ibse_factor_vinculo` | Media del factor Vínculo (calculada por REDCap) |
./fixtures/README.md:377:| `ibse_total` | Media del índice IBSE total (0–100) |
./fixtures/README.md:378:| `monitor_ibse_complete` | Estado del formulario REDCap (2 = completado) |
./fixtures/README.md:383:contiene datos **específicos de Atarfe** recogidos mediante REDCap. Se usa como
./fixtures/README.md:385:reemplaza con la exportación REDCap correspondiente.
./FOUNDATIONS.md:36:oficiales de un municipio: informes de salud, estudios complementarios, activos
./FOUNDATIONS.md:37:comunitarios, datos REDCap, etc.
./FOUNDATIONS.md:96:Para documentos de tipo `redcap-export` cuya identidad se discrimina por tag —por ejemplo IBSE o Priorización Temática—, la canonicidad opera por `tag` mediante `removeDocumentsByTag`, no por `kind`. Véase `CONTRACT-REPOSITORY.md §4.2`.
./FOUNDATIONS.md:138:- Aprobaciones del Plan de Acción o del Plan Local de Salud.
./FOUNDATIONS.md:142:`requiresHumanValidation: true`, a partir del Perfil de Salud Local (PSL):
./FOUNDATIONS.md:144:- Sugerencias de encaje con líneas estratégicas EPVSA.
./FOUNDATIONS.md:145:- Objetivos, actuaciones e indicadores preliminares del Plan de Acción.
./FOUNDATIONS.md:180:| `docs/contracts/CONTRACT-MIT-PSL.md` | Motor de Interpretación Territorial y Perfil de Salud Local |
./FOUNDATIONS.md:181:| `docs/contracts/CONTRACT-ACTION-PLAN.md` | Plan de Acción, Agenda y Seguimiento (Nivel 3) |
./FOUNDATIONS.md:182:| `docs/contracts/CONTRACT-COMPILER.md` | Compilador del Plan Local de Salud (reserva arquitectónica) |
./functional-audit/audit.mjs:22:await page.locator('button').filter({ hasText: /Perfil de Salud Local/i }).click();
./functional-audit/audit.mjs:69:await page.locator('button').filter({ hasText: /Perfil de Salud Local/i }).click();
./functional-audit/audit.mjs:120:await page.locator('button').filter({ hasText: /Perfil de Salud Local/i }).click();
./functional-audit/audit.mjs:170:await page.locator('button').filter({ hasText: /Perfil de Salud Local/i }).click();
./Padul/determinantes_padul.csv:19:2;P32_CAGE;CAGE positivo (≥2 respuestas);%;2.1;2.4;2.6
./Padul/determinantes_padul.csv:36:2;PREDIMED;Alta adherencia dieta mediterránea;%;45.2;43.8;42.5
./Padul/health_plan_eu_CONTENIDO/bg/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/bg/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/ca/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/ca/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/cs/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/cs/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/da/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/da/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/de/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/de/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/el/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/el/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/es/index.html:99:        <p>Elaboramos tu Plan Local de Salud con metodología de la OMS. 100% online, entrega en 4-6 semanas. Compatible con redes de Ciudades Saludables.</p>
./Padul/health_plan_eu_CONTENIDO/es/index.html:115:            <h2><a href="about.html">¿Por qué un Plan Local de Salud?</a></h2>
./Padul/health_plan_eu_CONTENIDO/es/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/es/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/et/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/et/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/eu/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/eu/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/fi/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/fi/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/fr/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/fr/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/ga/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/ga/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/gl/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/gl/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/hr/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/hr/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/hu/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/hu/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/it/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/it/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/lt/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/lt/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/lv/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/lv/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/mt/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/mt/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/nl/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/nl/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/pl/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/pl/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/pt/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/pt/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/ro/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/ro/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/sk/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/sk/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/sl/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/sl/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/health_plan_eu_CONTENIDO/sv/networks.html:91:                <h4>RELAS - Andalusian Local Health Network</h4>
./Padul/health_plan_eu_CONTENIDO/sv/networks.html:138:            <p>Beyond creating a network-compatible plan, we can guide you through the application process for network membership. Many municipalities have successfully joined RECS, RELAS, and other networks using our plans as their foundation.</p>
./Padul/priorizacion_padul.csv:9:Sueño Saludable;1;El descanso y el sueño saludable son componentes esenciales del bienestar emocional y la calidad de vida.
./Padul/recomendaciones_padul.csv:3:02;Acompasar el diseño y la evaluación del II Plan Local de Salud de Padul 2025-2030 a la Estrategia, articulando sectores, actores, medidas, programas y actuaciones en los distintos entornos potencialmente salutogénicos del espacio local: el centro de salud; los centros educativos; el lugar de trabajo y el espacio social y comunitario.
./R ZAGRA/PriorizacinCiudadanaZagra_DataDictionary_2026-06-20.csv:5:temas,papeleta_pri_tematica,"Elija exactamente 5 temáticas que considere más importantes para la salud de su municipio",checkbox,"Temáticas prioritarias","1, Alimentación | 2, Actividad física | 3, Bienestar emocional y salud mental | 4, Uso de pantallas y redes sociales | 5, Sueño y descanso | 6, Tabaco vapeadores alcohol y otras drogas | 7, Sexualidad y salud | 8, Violencia de género | 9, Medioambiente y municipio | 10, Accidentes en el hogar y la vía pública","Seleccione exactamente 5 opciones",,0,120,,,y,,,,," @MAXCHECKED=5"
./README.md:10:## React Compiler
./README.md:12:The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
./Reconecta_DataDictionary_v17.csv:2:record_id,cuestionario_pantallas,,text,Record ID,,,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:3:encuesta_activa,cuestionario_pantallas,,calc,,0,,,,,,,,,,,, @HIDDEN
./Reconecta_DataDictionary_v17.csv:4:presentacion,cuestionario_pantallas,,descriptive,"<div class=""cn-presentacion"">
./Reconecta_DataDictionary_v17.csv:7:<div class=""cn-presentacion-kicker"">Distrito Granada-Metropolitano &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div>
./Reconecta_DataDictionary_v17.csv:12:<p>Este cuestionario se dirige a chicos y chicas de 12 a 17 a&ntilde;os residentes en Hu&eacute;tor T&aacute;jar. Es an&oacute;nimo: ninguna persona, ni en tu familia ni en tu centro educativo, podr&aacute; ver tus respuestas individuales.</p>
./Reconecta_DataDictionary_v17.csv:15:<div class=""cn-accent cn-accent-cautela""><div class=""cn-accent-kicker"">Qu&eacute; no es este cuestionario</div><p>No constituye una prueba m&eacute;dica ni psicol&oacute;gica, ni ofrece un diagn&oacute;stico. No sustituye la valoraci&oacute;n de un profesional sanitario o de orientaci&oacute;n educativa. Es un instrumento de cribado orientativo, no de evaluaci&oacute;n cl&iacute;nica individual.</p></div>
./Reconecta_DataDictionary_v17.csv:16:<div class=""cn-accent""><div class=""cn-accent-kicker"">Finalidad</div><p>Los datos, tratados de forma agregada y an&oacute;nima, contribuyen a que el Plan Local de Salud de Hu&eacute;tor T&aacute;jar conozca mejor los h&aacute;bitos de uso de pantallas entre la poblaci&oacute;n adolescente del municipio.</p></div>
./Reconecta_DataDictionary_v17.csv:21:ficha_metodologica,cuestionario_pantallas,,descriptive,"<div class=""cn-nota"">Nota metodol&oacute;gica: ver documento interno Reconecta_Ficha_Metodologica.md para la trazabilidad completa de fuentes por campo.</div>",,,,,,,,,,,,, @HIDDEN
./Reconecta_DataDictionary_v17.csv:22:edad,cuestionario_pantallas,"<div class=""cn-banner""><div class=""cn-banner-num"">Bloque 1</div><div class=""cn-banner-title"">DATOS SOCIODEMOGR&Aacute;FICOS</div></div>",text,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuántos años tienes?</div></div>",,,integer,12,17,y,,y,,,,,
./Reconecta_DataDictionary_v17.csv:23:sexo,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Con qué sexo te identificas?</div></div>","1, Chico | 2, Chica | 3, Otro",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:24:juega_videojuegos,cuestionario_pantallas,,yesno,"<div class=""cn-question""><div class=""cn-q-title"">¿Juegas a videojuegos de forma habitual (al menos ocasionalmente), en consola, ordenador, móvil o tablet?</div></div>",,"Ítem de cribado: determina si se muestra el bloque de videojuegos (IGDS9-SF, al final del cuestionario).",,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:25:pantalla_tv_semana,cuestionario_pantallas,"<div class=""cn-banner""><div class=""cn-banner-num"">Bloque 2</div><div class=""cn-banner-title"">SOCIOEPIDEMIOL&Oacute;GICO &middot; TIEMPO DE PANTALLA</div><div class=""cn-banner-sub"">Entre semana — Adaptado de ""Tardes con Plan"" (Min. de Sanidad) y Estudio HBSC (OMS)</div></div>",radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuánto tiempo sueles dedicar a ver la televisión, un día entre semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas",,,,,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:26:pantalla_ordenador_semana,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuánto tiempo sueles dedicar a usar el ordenador o la tablet (sin contar videojuegos), un día entre semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas",,,,,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:27:pantalla_videojuegos_semana,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuánto tiempo sueles dedicar a jugar a videojuegos (consola, PC o móvil), un día entre semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas",,,,,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:28:pantalla_movil_semana,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuánto tiempo sueles dedicar a usar el teléfono móvil (redes sociales, mensajería, vídeos), un día entre semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas",,,,,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:29:pantalla_tv_finde,cuestionario_pantallas,"<div class=""cn-banner""><div class=""cn-banner-num"">Bloque 2</div><div class=""cn-banner-title"">SOCIOEPIDEMIOL&Oacute;GICO &middot; TIEMPO DE PANTALLA</div><div class=""cn-banner-sub"">Fin de semana — Adaptado de ""Tardes con Plan"" (Min. de Sanidad) y Estudio HBSC (OMS)</div></div>",radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuánto tiempo sueles dedicar a ver la televisión, un día de fin de semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas",,,,,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:30:pantalla_ordenador_finde,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuánto tiempo sueles dedicar a usar el ordenador o la tablet (sin contar videojuegos), un día de fin de semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas",,,,,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:31:pantalla_videojuegos_finde,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuánto tiempo sueles dedicar a jugar a videojuegos (consola, PC o móvil), un día de fin de semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas",,,,,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:32:pantalla_movil_finde,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Cuánto tiempo sueles dedicar a usar el teléfono móvil (redes sociales, mensajería, vídeos), un día de fin de semana?</div></div>","0, Nada en absoluto | 15, 0-30 minutos | 45, 30-60 minutos | 90, 1-2 horas | 150, 2-3 horas | 210, Más de 3 horas",,,,,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:33:actividad_principal,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">De todo lo que haces con las pantallas, ¿cuál dirías que es tu actividad principal?</div></div>","1, Redes sociales | 2, Vídeos o series (streaming) | 3, Videojuegos | 4, Mensajería o chats | 5, Estudiar o hacer tareas",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:34:uso_antes_dormir,cuestionario_pantallas,"<div class=""cn-banner""><div class=""cn-banner-num"">Bloque 2</div><div class=""cn-banner-title"">SOCIOEPIDEMIOL&Oacute;GICO &middot; USO NOCTURNO</div><div class=""cn-banner-sub"">Últimas 2 semanas</div></div>",radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Usas el móvil u otra pantalla en la cama justo antes de dormir?</div></div>","0, Nunca | 1, A veces | 2, Frecuentemente | 3, Siempre",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:35:movil_en_habitacion_noche,cuestionario_pantallas,,yesno,"<div class=""cn-question""><div class=""cn-q-title"">¿Duermes con el móvil en tu habitación por la noche?</div></div>",,,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:36:intro_ids9sf,cuestionario_pantallas,"<div class=""cn-banner""><div class=""cn-banner-num"">Bloque 3</div><div class=""cn-banner-title"">PSICOL&Oacute;GICO &middot; PANTALLAS EN GENERAL</div><div class=""cn-banner-sub"">Traducción razonada (no oficial) de la IDS9-SF — Pontes y Griffiths, 2016</div></div>",descriptive,"<div class=""cn-question""><div class=""cn-q-title"">Los siguientes 9 ítems hacen referencia a tu uso de pantallas e internet EN GENERAL durante el último año.</div></div>",,,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:37:crit_preocupacion,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Te sientes preocupado/a por tu comportamiento online (piensas en sesiones anteriores, anticipas la próxima vez que vas a conectarte, o sientes que estar conectado/a se ha convertido en la actividad dominante de tu día)?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:38:crit_abstinencia,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Sientes más irritabilidad, ansiedad o tristeza cuando intentas reducir o dejar de usar pantallas/internet?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:39:crit_tolerancia,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Sientes la necesidad de pasar cada vez más tiempo conectado/a para conseguir satisfacción o placer?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:40:crit_perdida_control,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Tienes dificultades para intentar controlar, reducir o dejar tu uso de pantallas/internet?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:41:crit_perdida_interes,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Has perdido interés por aficiones anteriores u otras actividades de ocio por estar conectado/a?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:42:crit_uso_pese_problemas,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Has seguido conectándote a pesar de saber que te estaba causando problemas con otras personas?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:43:crit_engano,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Has engañado a algún familiar u otra persona sobre el tiempo que pasas conectado/a?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:44:crit_evasion_animo,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Te conectas para escapar o sentirte mejor cuando tienes un estado de ánimo negativo (por ejemplo, desesperanza, culpa o ansiedad)?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:45:crit_relaciones_perjudicadas,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Has comprometido o perdido una relación importante, una oportunidad educativa o algo similar por tu uso de pantallas/internet?</div></div>","0, Nunca | 1, Rara vez | 2, A veces | 3, Frecuentemente | 4, Muy frecuentemente",,,,,,,,,,,,
./Reconecta_DataDictionary_v17.csv:46:intro_igds9sf,cuestionario_pantallas,"<div class=""cn-banner""><div class=""cn-banner-num"">Bloque 4</div><div class=""cn-banner-title"">VIDEOJUEGOS &middot; ESCALA VALIDADA</div><div class=""cn-banner-sub"">IGDS9-SF — Beranuy et al., 2020 — Versión española literal (CC BY 4.0)</div></div>",descriptive,"<div class=""cn-question""><div class=""cn-q-title"">Los siguientes 9 ítems hacen referencia a tu actividad con los videojuegos durante el último año.</div></div>",,,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:47:igds_1,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Te sientes preocupado por tu comportamiento con el juego? (Algunos ejemplos: ¿Piensas en exceso cuando no estás jugando o anticipas en exceso a la próxima sesión de juego?, ¿Crees que el juego se ha convertido en la actividad dominante en tu vida diaria?)</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:48:igds_2,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Sientes irritabilidad, ansiedad o incluso tristeza cuando intentas reducir o detener tu actividad de juego?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:49:igds_3,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Sientes la necesidad de pasar cada vez más tiempo jugando para lograr satisfacción o placer?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:50:igds_4,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Fallas sistemáticamente al intentar controlar o terminar tu actividad de juego?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:51:igds_5,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Has perdido intereses en aficiones anteriores y otras actividades de entretenimiento como resultado de tu compromiso con el juego?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:52:igds_6,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Has continuado jugando a pesar de saber que te estaba causando problemas con otras personas? (pareja, amistad o familia)</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:53:igds_7,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Has engañado a alguno de tus familiares, terapeutas o amigos sobre el tiempo que pasas jugando?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:54:igds_8,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Juegas para escapar temporalmente o aliviar un estado de ánimo negativo (por ejemplo, desesperanza, tristeza, culpa o ansiedad)?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:55:igds_9,cuestionario_pantallas,,radio,"<div class=""cn-question""><div class=""cn-q-title"">¿Has comprometido o perdido una relación importante, un trabajo o una oportunidad educativa debido a tu actividad de juego?</div></div>","1, Nunca | 2, Raramente | 3, Ocasionalmente | 4, A menudo | 5, Muy a menudo",,,,,,[juega_videojuegos] = 1,,,,,,
./Reconecta_DataDictionary_v17.csv:56:tiempo_aire_libre,cuestionario_pantallas,,text,"<div class=""cn-question""><div class=""cn-q-title"">¿En cuántos días de la última semana has jugado, hecho deporte o quedado al aire libre sin pantallas?</div></div>",,,integer,0,7,,,y,,,,,
./Reconecta_DataDictionary_v17.csv:63:tiempo_excelente,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-excelente""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Tiempo de pantallas: excelente</div><div class=""cn-card-desc"">Tu tiempo de pantallas está dentro de lo recomendado.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>La AAP recomienda no superar las 2h diarias de pantalla recreativa.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Mantén este equilibrio y combina pantallas con actividades al aire libre.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_tiempo]=""1""",,,,,,
./Reconecta_DataDictionary_v17.csv:64:tiempo_buena,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-buena""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Tiempo de pantallas: bueno</div><div class=""cn-card-desc"">Algo superior a la referencia de 2h diarias, pero manejable.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Reducir el uso recreativo mejora el descanso y la concentración.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Pon límites de tiempo en redes sociales o vídeos.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_tiempo]=""2""",,,,,,
./Reconecta_DataDictionary_v17.csv:65:tiempo_mejorable,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-mejorable""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Tiempo de pantallas: mejorable</div><div class=""cn-card-desc"">Claramente por encima de la referencia de 2h.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Un uso elevado y sostenido se relaciona con peor sueño y menor actividad física.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Establece franjas sin pantallas (comidas, antes de dormir).</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_tiempo]=""3""",,,,,,
./Reconecta_DataDictionary_v17.csv:66:tiempo_atencion,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-atencion""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Tiempo de pantallas: requiere atención</div><div class=""cn-card-desc"">Muy elevado; puede estar afectando a tu día a día.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Un uso muy prolongado se asocia a peor sueño, rendimiento académico y relaciones.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Reduce el uso de forma progresiva y busca apoyo si te resulta difícil controlarlo.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_tiempo]=""4""",,,,,,
./Reconecta_DataDictionary_v17.csv:79:usoprob_excelente,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-excelente""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Pantallas en general: excelente</div><div class=""cn-card-desc"">No cumples ninguno o solo uno de los 9 criterios adaptados.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Mantener el control del uso protege tu bienestar diario.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Sigue dejando las pantallas de lado en momentos clave del día.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_usoprob]=""1""",,,,,,
./Reconecta_DataDictionary_v17.csv:80:usoprob_buena,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-buena""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Pantallas en general: bueno</div><div class=""cn-card-desc"">Cumples 2-3 de los 9 criterios adaptados.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Algunas señales aisladas son habituales en la adolescencia.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Prueba a dejar el móvil fuera de la habitación en algunos momentos del día.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_usoprob]=""2""",,,,,,
./Reconecta_DataDictionary_v17.csv:81:usoprob_mejorable,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-mejorable""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Pantallas en general: mejorable</div><div class=""cn-card-desc"">Cumples 4 de los 9 criterios adaptados.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Acercarse al umbral de referencia es una señal de alerta temprana.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Marca momentos del día libres de pantallas.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_usoprob]=""3""",,,,,,
./Reconecta_DataDictionary_v17.csv:82:usoprob_atencion,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-atencion""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Pantallas en general: requiere atención</div><div class=""cn-card-desc"">Cumples 5 o más de los 9 criterios adaptados.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Combinar varios patrones de uso problemático puede afectar gravemente a tu bienestar.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Habla con tu familia o con orientación del centro educativo.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_usoprob]=""4""",,,,,,
./Reconecta_DataDictionary_v17.csv:96:igds_excelente,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-excelente""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Videojuegos: excelente</div><div class=""cn-card-desc"">No cumples ninguno o solo uno de los 9 criterios IGDS9-SF.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>No cumplir criterios DSM-5 de IGD es el resultado más favorable en esta escala validada.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Sigue manteniendo el control sobre cuándo y cuánto juegas.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_igds]=""1""",,,,,,
./Reconecta_DataDictionary_v17.csv:97:igds_buena,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-buena""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Videojuegos: bueno</div><div class=""cn-card-desc"">Cumples 2-3 de los 9 criterios IGDS9-SF, bajo el umbral clínico.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Señales aisladas, manejables con hábitos conscientes.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Presta atención a esas señales antes de que se conviertan en patrón.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_igds]=""2""",,,,,,
./Reconecta_DataDictionary_v17.csv:98:igds_mejorable,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-mejorable""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Videojuegos: mejorable</div><div class=""cn-card-desc"">Cumples 4 de los 9 criterios: clasificación ""en riesgo"".</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Estar ""en riesgo"" es una señal de alerta temprana documentada.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Marca momentos del día libres de videojuegos.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_igds]=""3""",,,,,,
./Reconecta_DataDictionary_v17.csv:99:igds_atencion,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-atencion""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Videojuegos: requiere atención</div><div class=""cn-card-desc"">Cumples 5 o más de los 9 criterios: umbral clínico de Trastorno por Juego en Internet.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Punto de corte usado en investigación clínica para IGD.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Habla con tu familia, con orientación del centro o con un profesional de salud.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_igds]=""4""",,,,,,
./Reconecta_DataDictionary_v17.csv:103:nocturno_excelente,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-excelente""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Uso nocturno: excelente</div><div class=""cn-card-desc"">No usas pantallas antes de dormir ni duermes con el móvil cerca.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Evitar pantallas antes de dormir mejora la calidad del sueño.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Mantén el móvil fuera de la habitación por la noche.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_nocturno]=""1""",,,,,,
./Reconecta_DataDictionary_v17.csv:104:nocturno_bueno,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-buena""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Uso nocturno: bueno</div><div class=""cn-card-desc"">Uso ocasional antes de dormir.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Impacto limitado en el descanso.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Reduce aún más el uso del móvil en la última hora antes de dormir.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_nocturno]=""2""",,,,,,
./Reconecta_DataDictionary_v17.csv:105:nocturno_mejorable,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-mejorable""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Uso nocturno: mejorable</div><div class=""cn-card-desc"">Uso frecuente antes de dormir y/o móvil en la habitación.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Retrasa el sueño y reduce su calidad.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Carga el móvil fuera de tu habitación; crea una rutina nocturna sin pantallas.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_nocturno]=""3""",,,,,,
./Reconecta_DataDictionary_v17.csv:106:nocturno_atencion,informe_pantallas,,descriptive,"<div class=""cn-card cn-nivel-atencion""><div class=""cn-card-brand"">Reconecta &middot; Plan Local de Salud de Hu&eacute;tor T&aacute;jar</div><div class=""cn-card-resultado""><div class=""cn-card-titulo"">Uso nocturno: requiere atención</div><div class=""cn-card-desc"">Uso constante antes de dormir y móvil en la habitación.</div></div><div class=""cn-card-evidencia""><span class=""cn-label"">Evidencia</span>Muy asociado a insomnio y cansancio diurno.</div><div class=""cn-card-consejo""><span class=""cn-label"">Orientaci&oacute;n</span>Establece una hora fija para apagar pantallas y deja el móvil en otra habitación.</div><div class=""cn-card-meta"">Edad: [edad] &middot; Proyecto Reconecta</div></div>",,,,,,,"[mostrar_tarjetas]=1 and [resultado_nocturno]=""4""",,,,,,
./Reconecta_DataDictionary_v17.csv:114:recursos_pantallas,informe_pantallas,,descriptive,"<div class=""cn-recursos""><div class=""cn-recursos-header""><h2>Recursos de apoyo</h2><p>Reconecta — Plan Local de Salud de Hu&eacute;tor T&aacute;jar</p></div>
./ROADMAP.md:21:- **Seis Estudios Complementarios implementados**: IBSE (REDCap), DUKE-EAS, PREDIMED-EAS,
./ROADMAP.md:22:  SF-12 EAS, Sueño EAS y CAGE-EAS (los cinco últimos sobre microdatos EAS Granada).
./ROADMAP.md:24:- Priorización Temática con importación REDCap y explotación estadística.
./ROADMAP.md:32:- **Perfil de Salud Local (PSL)**: objeto canónico del Nivel 2. Ciclo de vida:
./ROADMAP.md:34:- **Plan de Acción** (borrador técnico): generado exclusivamente a partir del PSL.
./ROADMAP.md:37:  que representa el estado del expediente municipal en las 7 fases del ciclo RELAS.
./ROADMAP.md:38:- **Bloqueo de Nivel 3**: EPVSA, Plan de Acción, Agenda y Seguimiento requieren PSL
./ROADMAP.md:69:  (estudios complementarios y priorización temática).
./ROADMAP.md:120:| IBSE | REDCap CSV | `IBSECSVParser` | ✓ Implementado |
./ROADMAP.md:122:| PREDIMED-EAS | EAS CSV | `PREDIMEDCSVParser` | ✓ Implementado |
./ROADMAP.md:123:| SF-12 EAS | EAS CSV | `SF12CSVParser` | ✓ Implementado |
./ROADMAP.md:124:| Sueño EAS | EAS CSV | `SuenoCSVParser` | ✓ Implementado |
./ROADMAP.md:125:| CAGE-EAS | EAS CSV | `CAGECSVParser` | ✓ Implementado |
./ROADMAP.md:128:DUKE, PREDIMED, SF-12, Sueño y CAGE carecen de `MethodologicalModule` en la Biblioteca
./ROADMAP.md:133:el Plan de Acción.
./ROADMAP.md:137:## Hito 5 — Integración controlada de Priorización Temática REDCap
./ROADMAP.md:139:**Objetivo:** Conectar los datos de priorización ciudadana (ya importables desde REDCap)
./ROADMAP.md:144:- La importación CSV REDCap de priorización funciona.
./ROADMAP.md:146:- No hay conexión automática entre priorización y Plan de Acción.
./ROADMAP.md:184:- **Compilador del Plan Local de Salud**: producto documental compilado a partir del
./ROADMAP.md:185:  Plan de Acción validado. El Plan de Acción actual es un borrador técnico, no el Plan Local de Salud definitivo.
./ROADMAP.md:199:| `QuestionnaireBuilderPanel` | Pendiente de integración | Constructor metodológico de cuestionarios municipales REDCap | VISUAL-CONTRACT §12.1 |
./ROADMAP.md:201:| `StrategicFrameworkPanel` | Pendiente de integración | Traductor estratégico PSL → EPVSA / ESCA / RELAS | VISUAL-CONTRACT §12.3 |
./scripts/export-cage-granada.mjs:4: * Extrae las columnas de consumo de alcohol (CAGE) de la Encuesta Andaluza
./scripts/export-cage-granada.mjs:9: *     - CAGE_R  (riesgo de alcoholismo, campo derivado binario EAS)
./scripts/export-cage-granada.mjs:10: *     - CAGE    (sospecha de alcoholismo, campo ordinal EAS 1–4)
./scripts/export-cage-granada.mjs:11: *   Ninguno de estos campos es el CAGE clásico recalculado desde ítems crudos.
./scripts/export-cage-granada.mjs:15: * CAGE_R es el indicador canónico primario:
./scripts/export-cage-granada.mjs:18: * CAGE es el campo ordinal secundario (clasificación de nivel):
./scripts/export-cage-granada.mjs:24: *   consumo episódico masivo), instrumento distinto del CAGE. Mezclarlos
./scripts/export-cage-granada.mjs:48:  'CAGE_R',
./scripts/export-cage-granada.mjs:49:  'CAGE',
./scripts/export-cage-granada.mjs:100:// Contadores CAGE_R (binario)
./scripts/export-cage-granada.mjs:102:// Contadores CAGE (ordinal 1–4)
./scripts/export-cage-granada.mjs:109:  const idxCageR = hdr2.indexOf('CAGE_R')
./scripts/export-cage-granada.mjs:110:  const idxCage  = hdr2.indexOf('CAGE')
./scripts/export-cage-granada.mjs:112:  // CAGE_R
./scripts/export-cage-granada.mjs:119:  // CAGE (ordinal)
./scripts/export-cage-granada.mjs:133:=== Exportación CAGE-EAS Granada ===
./scripts/export-cage-granada.mjs:142:CAGE_R — Riesgo de alcoholismo (campo derivado binario EAS):
./scripts/export-cage-granada.mjs:145:  CAGE_R=0 (sin riesgo):   ${cageR0} (${(cageR0/cageRValid*100).toFixed(1)} %)
./scripts/export-cage-granada.mjs:146:  CAGE_R=1 (con riesgo):   ${cageR1} (${(cageR1/cageRValid*100).toFixed(1)} %)
./scripts/export-cage-granada.mjs:148:CAGE — Clasificación ordinal (campo derivado EAS):
./scripts/export-predimed-granada.mjs:4: * Extrae las columnas PREDIMED de los microdatos oficiales de la Encuesta
./scripts/export-predimed-granada.mjs:7: * Fuente: EAS_microdatos_adulto_READY.csv — todas las columnas PREDIMED
./scripts/export-predimed-granada.mjs:8: * necesarias están presentes en el fichero READY, a diferencia de SF-12
./scripts/export-predimed-granada.mjs:12: *   Predimed              Campo canónico: índice PREDIMED-14 ya calculado por la EAS.
./scripts/export-predimed-granada.mjs:22: * Solo los registros de oleadas que incluyen el módulo PREDIMED tienen
./scripts/export-predimed-granada.mjs:119:=== Exportación PREDIMED-EAS Granada ===
./scripts/export-sf12-granada.mjs:4: * Extrae las columnas SF-12 de los microdatos oficiales de la Encuesta
./scripts/export-sf12-granada.mjs:40: *   canónico del SF-12). Son preguntas distintas con 19.447 discrepancias
./scripts/export-sf12-granada.mjs:96:      throw new Error(`Columnas SF-12 no encontradas en EAS_COMPLETO: ${missing.join(', ')}`)
./scripts/export-sf12-granada.mjs:169:=== Exportación SF-12 Granada ===
./scripts/export-sueno-granada.mjs:18: *     P33_R          Sueño insuficiente en horas (0=No / 1=Sí). Derivado por EAS
./scripts/export-sueno-granada.mjs:19: *                    según criterios de la Sociedad Española del Sueño. Missing ~2 %.
./scripts/export-sueno-granada.mjs:175:=== Exportación Sueño EAS Granada ===
./scripts/export-sueno-granada.mjs:184:P33_R — Sueño insuficiente en horas (campo derivado EAS, cobertura ~98 %):
./src/App.css:319:/* ── Procedencia PSL en el Plan de Acción ────────────────────────── */
./src/App.css:348:/* ── Objetivos del Plan de Acción (lista enriquecida) ───────── */
./src/App.css:1162:/* ── Perfil de Salud Local ──────────────────────────────── */
./src/App.css:1600:/* ── IBSE Panel ─────────────────────────────────────────── */
./src/App.css:2306:/* ── ThematicPrioritisationModal — sección de importación REDCap ── */
./src/App.css:3613:/* ── Marco Estratégico grid ──────────────────────────────────────── */
./src/App.css:4255:/* ── Lista fija de estudios complementarios ───────────────────────────────── */
./src/App.css:5100:   Reemplaza los antiguos ibse-* en paneles no-IBSE.
./src/App.css:5277:/* Umbrales IBSE posicionados sobre 100 */
./src/App.css:5304:/* Clasificación de nivel (solo IBSE) */
./src/App.tsx:22:import { parseIBSECSV, ibseStudyToEvidenceAtoms } from "./application/ibse";
./src/App.tsx:23:import { createIBSEStudy } from "./domain/ibse";
./src/App.tsx:26:import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from "./application/predimed";
./src/App.tsx:27:import { createPREDIMEDStudy } from "./domain/predimed";
./src/App.tsx:32:import { parseCAGECSV, cageStudyToEvidenceAtoms } from "./application/cage";
./src/App.tsx:33:import { createCAGEStudy } from "./domain/cage";
./src/App.tsx:68:  EPVSAPanel,
./src/App.tsx:122:  { id: "psl",           label: "Perfil de Salud Local" },
./src/App.tsx:134:  { value: "redcap-export",             label: "REDCap" },
./src/App.tsx:141:const IBSE_DOCUMENT_TAG = "ibse";
./src/App.tsx:143:const PREDIMED_DOCUMENT_TAG = "predimed-eas";
./src/App.tsx:146:const CAGE_DOCUMENT_TAG = "cage-eas";
./src/App.tsx:153:function isIBSEDocument(document: MunicipalDocument | undefined): boolean {
./src/App.tsx:154:  return hasDocumentTag(document, IBSE_DOCUMENT_TAG);
./src/App.tsx:161:function isPREDIMEDDocument(document: MunicipalDocument | undefined): boolean {
./src/App.tsx:162:  return hasDocumentTag(document, PREDIMED_DOCUMENT_TAG);
./src/App.tsx:173:function isCAGEDocument(document: MunicipalDocument | undefined): boolean {
./src/App.tsx:174:  return hasDocumentTag(document, CAGE_DOCUMENT_TAG);
./src/App.tsx:276:  const [isLoadingIBSE, setIsLoadingIBSE] = useState(false);
./src/App.tsx:280:  const [isLoadingPREDIMED, setIsLoadingPREDIMED] = useState(false);
./src/App.tsx:286:  const [isLoadingCAGE, setIsLoadingCAGE] = useState(false);
./src/App.tsx:376:        "El Perfil de Salud Local contiene contenido redactado por el equipo técnico " +
./src/App.tsx:590:  async function handleLoadIBSECSV(file: File): Promise<void> {
./src/App.tsx:591:    setIsLoadingIBSE(true);
./src/App.tsx:594:      const { aggregates, methodologicalCautions, warnings } = parseIBSECSV(text);
./src/App.tsx:596:      const study = createIBSEStudy({
./src/App.tsx:610:          IBSE_DOCUMENT_TAG
./src/App.tsx:615:          title: `IBSE - ${file.name}`,
./src/App.tsx:617:            system: "Importación REDCap IBSE",
./src/App.tsx:621:          tags: ["redcap-export", IBSE_DOCUMENT_TAG],
./src/App.tsx:647:          ? `IBSE cargado: ${aggregates.nValid} registros válidos · Media total: ${aggregates.meanTotal} · ${ibseAtoms.length} indicadores incorporados al análisis territorial.${warn}`
./src/App.tsx:651:      setIbseMessage("Error al procesar el CSV. Verifica que sea una exportación REDCap válida.");
./src/App.tsx:653:      setIsLoadingIBSE(false);
./src/App.tsx:728:  async function handleLoadPREDIMEDCSV(file: File): Promise<void> {
./src/App.tsx:729:    setIsLoadingPREDIMED(true);
./src/App.tsx:732:      const { aggregates, methodologicalCautions, warnings } = parsePREDIMEDCSV(text);
./src/App.tsx:734:      const study = createPREDIMEDStudy({
./src/App.tsx:749:          PREDIMED_DOCUMENT_TAG
./src/App.tsx:754:          title: `PREDIMED-EAS - ${file.name}`,
./src/App.tsx:756:            system: "EAS microdatos — Adherencia dieta mediterránea (PREDIMED-14)",
./src/App.tsx:760:          tags: ["complementary-study", PREDIMED_DOCUMENT_TAG, "eas"],
./src/App.tsx:769:                atom.tags.includes(PREDIMED_DOCUMENT_TAG)
./src/App.tsx:789:          ? `PREDIMED-EAS cargado: ${aggregates.nValid} registros validos de ${aggregates.n}. Alta adherencia: ${aggregates.highPercentage.toFixed(1)} %. ${predimedAtoms.length} evidencias incorporadas.${warn}`
./src/App.tsx:790:          : `CSV PREDIMED-EAS procesado sin registros completos.${warn}`
./src/App.tsx:795:      setIsLoadingPREDIMED(false);
./src/App.tsx:825:          title: `SF-12 EAS - ${file.name}`,
./src/App.tsx:827:            system: "EAS microdatos — Salud percibida SF-12 (Vilagut et al. 2008)",
./src/App.tsx:860:          ? `SF-12 EAS cargado: ${aggregates.nValidPCS} registros válidos de ${aggregates.n}. PCS media: ${aggregates.meanPCS.toFixed(1)} / MCS media: ${aggregates.meanMCS.toFixed(1)}. ${sf12Atoms.length} evidencias incorporadas.${warn}`
./src/App.tsx:861:          : `CSV SF-12 EAS procesado sin registros válidos.${warn}`
./src/App.tsx:896:          title: `Sueño EAS - ${file.name}`,
./src/App.tsx:898:            system: "EAS microdatos — Sueño (P33_R / P33A)",
./src/App.tsx:931:          ? `Sueño EAS cargado: ${aggregates.nValidP33R} registros P33_R válidos de ${aggregates.n}. Sueño insuficiente: ${aggregates.pctInsufficientSleep.toFixed(1)} %. ${suenoAtoms.length} evidencias incorporadas.${warn}`
./src/App.tsx:932:          : `CSV Sueño EAS procesado sin registros P33_R válidos.${warn}`
./src/App.tsx:941:  async function handleLoadCAGECSV(file: File): Promise<void> {
./src/App.tsx:942:    setIsLoadingCAGE(true);
./src/App.tsx:945:      const { aggregates, methodologicalCautions, warnings } = parseCAGECSV(text);
./src/App.tsx:947:      const study = createCAGEStudy({
./src/App.tsx:962:          CAGE_DOCUMENT_TAG
./src/App.tsx:967:          title: `CAGE-EAS - ${file.name}`,
./src/App.tsx:969:            system: "EAS microdatos — Consumo de alcohol (CAGE_R / CAGE)",
./src/App.tsx:973:          tags: ["complementary-study", CAGE_DOCUMENT_TAG, "eas"],
./src/App.tsx:982:                atom.tags.includes(CAGE_DOCUMENT_TAG)
./src/App.tsx:1001:        aggregates.nValidCAGER > 0
./src/App.tsx:1002:          ? `CAGE-EAS cargado: ${aggregates.nValidCAGER} registros CAGE_R válidos de ${aggregates.n}. Riesgo de alcoholismo: ${aggregates.pctRisk.toFixed(1)} % (n=${aggregates.nRisk}). ${cageAtoms.length} evidencias incorporadas.${warn}`
./src/App.tsx:1003:          : `CSV CAGE-EAS procesado sin registros CAGE_R válidos.${warn}`
./src/App.tsx:1006:      setCageMessage("Error al procesar el CSV. Verifica que incluya la columna CAGE_R.");
./src/App.tsx:1008:      setIsLoadingCAGE(false);
./src/App.tsx:1128:                    system: "Importación REDCap Priorización temática",
./src/App.tsx:1171:      setTpImportMessage("Error al procesar el CSV. Verifica que sea una exportación REDCap válida.");
./src/App.tsx:1192:    if (isIBSEDocument(deletedDocument)) {
./src/App.tsx:1194:      setIsLoadingIBSE(false);
./src/App.tsx:1200:    if (isPREDIMEDDocument(deletedDocument)) {
./src/App.tsx:1202:      setIsLoadingPREDIMED(false);
./src/App.tsx:1212:    if (isCAGEDocument(deletedDocument)) {
./src/App.tsx:1214:      setIsLoadingCAGE(false);
./src/App.tsx:1226:      const deletesIBSE = isIBSEDocument(doc);
./src/App.tsx:1228:      const deletesPREDIMED = isPREDIMEDDocument(doc);
./src/App.tsx:1231:      const deletesCAGE = isCAGEDocument(doc);
./src/App.tsx:1245:              if (deletesIBSE && atom.provenance.origin === "ibse") return false;
./src/App.tsx:1254:                deletesPREDIMED &&
./src/App.tsx:1256:                atom.tags.includes(PREDIMED_DOCUMENT_TAG)
./src/App.tsx:1275:                deletesCAGE &&
./src/App.tsx:1277:                atom.tags.includes(CAGE_DOCUMENT_TAG)
./src/App.tsx:1293:        ibseStudy: deletesIBSE ? undefined : prev.ibseStudy,
./src/App.tsx:1295:        predimedStudy: deletesPREDIMED ? undefined : prev.predimedStudy,
./src/App.tsx:1298:        cageStudy: deletesCAGE ? undefined : prev.cageStudy,
./src/App.tsx:1330:    setIsLoadingIBSE(false);
./src/App.tsx:1334:    setIsLoadingPREDIMED(false);
./src/App.tsx:1340:    setIsLoadingCAGE(false);
./src/App.tsx:1425:            <span>Plan Local de Salud 2027–2030</span>
./src/App.tsx:1607:                text:  "El Perfil de Salud Local está en borrador. Requiere revisión y validación técnica.",
./src/App.tsx:1608:                label: "Revisar el Perfil de Salud Local",
./src/App.tsx:1620:              text:  "PSL validado y priorización realizada. Puede avanzar al Plan de Acción.",
./src/App.tsx:1644:                <p className="eyebrow">Plan Local de Salud 2027–2030 · Junta de Andalucía</p>
./src/App.tsx:1668:                    <h2>Perfil de Salud Local</h2>
./src/App.tsx:1675:                    Ir al Perfil de Salud Local
./src/App.tsx:1784:              isLoadingIBSE={isLoadingIBSE}
./src/App.tsx:1786:              onLoadIBSECSV={handleLoadIBSECSV}
./src/App.tsx:1792:              isLoadingPREDIMED={isLoadingPREDIMED}
./src/App.tsx:1794:              onLoadPREDIMEDCSV={handleLoadPREDIMEDCSV}
./src/App.tsx:1804:              isLoadingCAGE={isLoadingCAGE}
./src/App.tsx:1806:              onLoadCAGECSV={handleLoadCAGECSV}
./src/App.tsx:1824:        {/* ── ④ Perfil de Salud Local ──────────────────────── */}
./src/App.tsx:1842:              <p className="eyebrow">Plan Local de Salud 2027–2030</p>
./src/App.tsx:1846:                candidatas derivadas del Perfil de Salud Local y las temáticas
./src/App.tsx:1872:        {/* ── ⑥ Plan Local de Salud — encaje EPVSA + plan + agenda + seguimiento */}
./src/App.tsx:1875:            <EPVSAPanel
./src/application/action-plan/ActionPlanEngine.ts:2:  EPVSATranslationResult,
./src/application/action-plan/ActionPlanEngine.ts:3:  EPVSAStrategicLine,
./src/application/action-plan/ActionPlanEngine.ts:82:// Each EPVSA strategic line has a set of Spanish stem-like keywords used to
./src/application/action-plan/ActionPlanEngine.ts:83:// find relevant elements in non-EPVSA frameworks.  Only "line" and
./src/application/action-plan/ActionPlanEngine.ts:86:const EPVSA_LINE_KEYWORDS: Readonly<Record<EPVSAStrategicLine, readonly string[]>> = {
./src/application/action-plan/ActionPlanEngine.ts:101:// PSL-C1: el Plan de Acción recibe el PSL que lo origina y conserva una
./src/application/action-plan/ActionPlanEngine.ts:107:  epvsa: EPVSATranslationResult,
./src/application/action-plan/ActionPlanEngine.ts:147:      ? "Los encajes estratégicos con múltiples marcos (EPVSA, ESCA, MAYORES, BUENA_EDAD, RELAS) son orientativos y requieren revisión técnica e institucional antes de formalizar el Plan."
./src/application/action-plan/ActionPlanEngine.ts:151:    title: "Borrador inicial de Plan de Acción Local en Salud",
./src/application/action-plan/ActionPlanEngine.ts:178:  // 1. Direct EPVSA registry element lookup
./src/application/action-plan/ActionPlanEngine.ts:179:  //    Maps "LE2" → "EPVSA-LE2" — the canonical ID format used in the registry.
./src/application/action-plan/ActionPlanEngine.ts:181:    const epvsaRegistryId = `EPVSA-${suggestion.suggestedLine}`;
./src/application/action-plan/ActionPlanEngine.ts:191:          "Encaje directo: línea EPVSA asignada por el motor de traducción estratégica (EPVSATranslator).",
./src/application/action-plan/ActionPlanEngine.ts:200:  const lineKeywords = EPVSA_LINE_KEYWORDS[suggestion.suggestedLine];
./src/application/action-plan/ActionPlanEngine.ts:203:      if (el.framework === "EPVSA") continue; // already covered above
./src/application/action-plan/ActionPlanEngine.ts:240:      "Objetivo preliminar derivado de una candidata priorizada y traducida de forma prudente a EPVSA.",
./src/application/cage/CAGECSVParser.ts:1:import type { CAGEAggregates } from "../../domain/cage";
./src/application/cage/CAGECSVParser.ts:5:// COMPÁS NG los consume directamente — no recalcula el CAGE desde ítems individuales.
./src/application/cage/CAGECSVParser.ts:6:// CAGE_R es el indicador de riesgo binario (0=No / 1=Sí).
./src/application/cage/CAGECSVParser.ts:7:// CAGE clasifica el nivel de consumo en cuatro categorías ordinales (1–4).
./src/application/cage/CAGECSVParser.ts:9:const CAGE_R_FIELD = "CAGE_R";
./src/application/cage/CAGECSVParser.ts:10:const CAGE_FIELD = "CAGE";
./src/application/cage/CAGECSVParser.ts:15:const EMPTY_AGGREGATES: CAGEAggregates = {
./src/application/cage/CAGECSVParser.ts:17:  nValidCAGER: 0, missingCAGER: 0, nRisk: 0, pctRisk: 0,
./src/application/cage/CAGECSVParser.ts:18:  nValidCAGE: 0, nCAGE1: 0, nCAGE2: 0, nCAGE3: 0, nCAGE4: 0,
./src/application/cage/CAGECSVParser.ts:21:export interface CAGECSVParseResult {
./src/application/cage/CAGECSVParser.ts:22:  aggregates: CAGEAggregates;
./src/application/cage/CAGECSVParser.ts:49:function buildCautions(aggregates: CAGEAggregates): string[] {
./src/application/cage/CAGECSVParser.ts:51:    "CAGE_R y CAGE son campos derivados oficiales de la Encuesta Andaluza de Salud (EAS). " +
./src/application/cage/CAGECSVParser.ts:52:      "COMPÁS NG los consume directamente sin recalcular el CAGE desde ítems individuales.",
./src/application/cage/CAGECSVParser.ts:53:    "El missing en CAGE_R (~18 % en la EAS Granada) es estructural: corresponde a personas abstemias " +
./src/application/cage/CAGECSVParser.ts:63:      `CSV vacío o sin registros de datos. Verifica que incluya la columna ${CAGE_R_FIELD}.`,
./src/application/cage/CAGECSVParser.ts:68:  if (aggregates.nValidCAGER === 0) {
./src/application/cage/CAGECSVParser.ts:70:      `CSV sin registros válidos en ${CAGE_R_FIELD}. Verifica que la columna contenga valores 0 o 1.`
./src/application/cage/CAGECSVParser.ts:72:  } else if (aggregates.nValidCAGER < 30) {
./src/application/cage/CAGECSVParser.ts:73:    cautions.push(`Muestra pequeña (${aggregates.nValidCAGER} registros CAGE_R válidos). Interpretar con precaución.`);
./src/application/cage/CAGECSVParser.ts:76:  if (aggregates.nValidCAGER > 0 && aggregates.nRisk < 10) {
./src/application/cage/CAGECSVParser.ts:78:      `Prevalencia de riesgo muy baja (n=${aggregates.nRisk} personas con CAGE_R=1). ` +
./src/application/cage/CAGECSVParser.ts:86:export function parseCAGECSV(csvText: string): CAGECSVParseResult {
./src/application/cage/CAGECSVParser.ts:98:  const cageRIdx = header.indexOf(CAGE_R_FIELD);
./src/application/cage/CAGECSVParser.ts:99:  const cageIdx  = header.indexOf(CAGE_FIELD);
./src/application/cage/CAGECSVParser.ts:105:      `Columnas "${CAGE_R_FIELD}" y "${CAGE_FIELD}" no encontradas. El CSV no contiene datos CAGE-EAS procesables.`
./src/application/cage/CAGECSVParser.ts:109:  if (cageRIdx === -1) warnings.push(`Columna "${CAGE_R_FIELD}" no encontrada.`);
./src/application/cage/CAGECSVParser.ts:110:  if (cageIdx === -1)  warnings.push(`Columna "${CAGE_FIELD}" no encontrada.`);
./src/application/cage/CAGECSVParser.ts:113:  let nValidCAGER = 0, nRisk = 0;
./src/application/cage/CAGECSVParser.ts:114:  let nValidCAGE = 0, nCAGE1 = 0, nCAGE2 = 0, nCAGE3 = 0, nCAGE4 = 0;
./src/application/cage/CAGECSVParser.ts:122:      if (v !== null) { nValidCAGER++; if (v === 1) nRisk++; }
./src/application/cage/CAGECSVParser.ts:128:        nValidCAGE++;
./src/application/cage/CAGECSVParser.ts:129:        if (v === 1) nCAGE1++;
./src/application/cage/CAGECSVParser.ts:130:        else if (v === 2) nCAGE2++;
./src/application/cage/CAGECSVParser.ts:131:        else if (v === 3) nCAGE3++;
./src/application/cage/CAGECSVParser.ts:132:        else if (v === 4) nCAGE4++;
./src/application/cage/CAGECSVParser.ts:137:  const aggregates: CAGEAggregates = {
./src/application/cage/CAGECSVParser.ts:139:    nValidCAGER, missingCAGER: n - nValidCAGER,
./src/application/cage/CAGECSVParser.ts:140:    nRisk, pctRisk: pct(nRisk, nValidCAGER),
./src/application/cage/CAGECSVParser.ts:141:    nValidCAGE, nCAGE1, nCAGE2, nCAGE3, nCAGE4,
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:2:import type { CAGEStudy } from "../../domain/cage";
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:4:export function cageStudyToEvidenceAtoms(study: CAGEStudy): EvidenceAtom[] {
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:5:  if (study.aggregates.nValidCAGER === 0) return [];
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:8:  const confidence = aggregates.nValidCAGER >= 30 ? "medium" : "low";
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:14:    title: "CAGE-EAS - Riesgo de alcoholismo (CAGE_R)",
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:16:      `${aggregates.pctRisk.toFixed(1)} % de la muestra con CAGE_R presenta riesgo de alcoholismo ` +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:18:      `n con riesgo: ${aggregates.nRisk} de ${aggregates.nValidCAGER} válidos. ` +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:19:      `Missing / no procede (abstinentes): ${aggregates.missingCAGER} de ${aggregates.n}. ` +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:30:        "CAGE_R es un campo derivado pre-calculado por la EAS que clasifica el riesgo de alcoholismo. " +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:40:  if (aggregates.nValidCAGE >= 30) {
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:41:    const nRiesgoOPerjudicial = aggregates.nCAGE2 + aggregates.nCAGE3 + aggregates.nCAGE4;
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:46:      title: "CAGE-EAS - Clasificación ordinal de consumo (CAGE)",
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:48:        `Entre los ${aggregates.nValidCAGE} registros con CAGE válido: ` +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:49:        `${aggregates.nCAGE1} bebedores sociales (${((aggregates.nCAGE1 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:50:        `${aggregates.nCAGE2} consumo de riesgo (${((aggregates.nCAGE2 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:51:        `${aggregates.nCAGE3} consumo perjudicial (${((aggregates.nCAGE3 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:52:        `${aggregates.nCAGE4} dependencia alcohólica (${((aggregates.nCAGE4 / aggregates.nValidCAGE) * 100).toFixed(1)} %). ` +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:63:          "CAGE es el campo ordinal pre-calculado por la EAS que clasifica el nivel de consumo en 4 categorías. " +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:77:    title: "CAGE-EAS - Cautela metodológica",
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:79:      "CAGE_R y CAGE son indicadores propios de la EAS para monitorización del consumo de alcohol en la población andaluza. " +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:80:      "COMPÁS NG los consume directamente sin recalcular el CAGE desde ítems individuales. " +
./src/application/cage/CAGEStudyToEvidenceAtoms.ts:92:      description: "Cautela metodológica asociada al procesamiento de CAGE-EAS como estudio complementario.",
./src/application/cage/index.ts:1:export * from "./CAGECSVParser";
./src/application/cage/index.ts:2:export * from "./CAGEStudyToEvidenceAtoms";
./src/application/epvsa/EPVSATranslator.ts:6:export type EPVSAStrategicLine =
./src/application/epvsa/EPVSATranslator.ts:17:  suggestedLine: EPVSAStrategicLine;
./src/application/epvsa/EPVSATranslator.ts:25:export interface EPVSATranslationResult {
./src/application/epvsa/EPVSATranslator.ts:31:export function translatePrioritizationToEPVSA(
./src/application/epvsa/EPVSATranslator.ts:33:): EPVSATranslationResult {
./src/application/epvsa/EPVSATranslator.ts:39:      "La traducción EPVSA es orientativa y no sustituye deliberación técnica, institucional ni comunitaria.",
./src/application/epvsa/EPVSATranslator.ts:41:      "No debe usarse esta traducción como selección automática de líneas EPVSA.",
./src/application/epvsa/EPVSATranslator.ts:64:      "Revisar correspondencia con la estrategia autonómica antes de incorporarla al Plan Local de Salud.",
./src/application/epvsa/EPVSATranslator.ts:71:function inferStrategicLine(text: string): EPVSAStrategicLine {
./src/application/epvsa/EPVSATranslator.ts:121:function labelForStrategicLine(line: EPVSAStrategicLine): string {
./src/application/epvsa/EPVSATranslator.ts:122:  const labels: Record<EPVSAStrategicLine, string> = {
./src/application/epvsa/EPVSATranslator.ts:133:function buildRationale(line: EPVSAStrategicLine): string {
./src/application/epvsa/EPVSATranslator.ts:144:      return "No hay evidencia textual suficiente para sugerir una línea EPVSA con prudencia.";
./src/application/epvsa/index.ts:1:export * from "./EPVSATranslator";
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:61:  //   IBSE_FACTORES → kind "indicator"   (5 atoms: meanTotal + 4 factors)
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:62:  //   IBSE_RESUMEN  → kind "qualitative-observation" (1 atom: structural interpretation)
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:74:// ── Rule D: IBSE completeness ─────────────────────────────────────────────
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:75:// Counts IBSE_FACTORES only (kind: "indicator") — the primary quantitative layer.
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:76:// IBSE_RESUMEN (kind: "qualitative-observation") is excluded by design:
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:80:const IBSE_EXPECTED_INDICATOR_COUNT = 5;
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:139:  // Rule D — IBSE completeness (post-filter check over accepted atoms)
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:143:  if (ibseIndicators.length > 0 && ibseIndicators.length !== IBSE_EXPECTED_INDICATOR_COUNT) {
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:145:      `IBSE incompleto: se esperan ${IBSE_EXPECTED_INDICATOR_COUNT} indicadores ` +
./src/application/evidence/EvidenceStoreIntegrityGuard.ts:147:        `Los resultados del análisis IBSE pueden ser parciales.`
./src/application/health-profile/buildLocalHealthProfile.ts:28:import type { IBSEStudy } from "../../domain/ibse";
./src/application/health-profile/buildLocalHealthProfile.ts:39:// ── Secciones del Marco Estratégico (Capítulo I) ──────────────────────────────
./src/application/health-profile/buildLocalHealthProfile.ts:129:    // ── I: Marco Estratégico ───────────────────────────────────────────────
./src/application/health-profile/buildLocalHealthProfile.ts:252:  ibseStudy: IBSEStudy | undefined,
./src/application/health-profile/buildLocalHealthProfile.ts:306:  // ── Bloque 5: IBSE ────────────────────────────────────────────────────────
./src/application/health-profile/buildLocalHealthProfile.ts:310:      `El estudio IBSE registra un índice total de bienestar socioemocional ` +
./src/application/health-profile/buildLocalHealthProfile.ts:391:    "deliberan y aprueban las recomendaciones definitivas del Plan Local de Salud."
./src/application/health-report/HealthReportSectionParser.ts:15:// Formato B — "N. TÍTULO"     (Zagra RELAS — secciones arábigo all-caps)
./src/application/health-report/HealthReportSectionParser.ts:20:// Formato C — "X. TÍTULO"     (Zagra RELAS — secciones romano all-caps)
./src/application/health-report/HealthReportSectionParser.ts:240:  // Detección de autoría solo en formato nDash (Atarfe); en RELAS no se usa
./src/application/ibse/IBSECSVParser.ts:1:import type { IBSEAggregates } from "../../domain/ibse";
./src/application/ibse/IBSECSVParser.ts:5:const IBSE_MODULE_ID = "ibse";
./src/application/ibse/IBSECSVParser.ts:7:const ibseModule = getMethodologicalModule(IBSE_MODULE_ID);
./src/application/ibse/IBSECSVParser.ts:9:  throw new Error("Módulo metodológico IBSE sin adaptador REDCap configurado.");
./src/application/ibse/IBSECSVParser.ts:25:const EMPTY_AGGREGATES: IBSEAggregates = {
./src/application/ibse/IBSECSVParser.ts:35:export interface IBSECSVParseResult {
./src/application/ibse/IBSECSVParser.ts:36:  aggregates: IBSEAggregates;
./src/application/ibse/IBSECSVParser.ts:41:export function parseIBSECSV(csvText: string): IBSECSVParseResult {
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:2: * Conversión de IBSEStudy → EvidenceAtom (dos niveles diferenciados)
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:4: * IBSE_FACTORES — 5 átomos, kind: "indicator"
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:5: *   Evidencia cuantitativa primaria. Fuente directa del instrumento IBSE.
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:7: *   Son la base de cualquier análisis territorial que use datos IBSE.
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:10: * IBSE_RESUMEN — 1 átomo, kind: "qualitative-observation"
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:11: *   Síntesis automática derivada del procesamiento de IBSE_FACTORES.
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:16: *   es una regla del sistema, no una conclusión metodológica del instrumento IBSE.
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:19: *   IBSE_RESUMEN constituye una síntesis automática derivada del procesamiento
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:25:import type { IBSEStudy } from "../../domain/ibse";
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:27:interface IBSEFactorDef {
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:30:    IBSEStudy["aggregates"],
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:36:const IBSE_FACTOR_DEFS: IBSEFactorDef[] = [
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:38:    title: "IBSE – Índice total de bienestar socioemocional",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:40:    description: "Índice total (media de los 8 ítems IBSE). Escala 0–100, mayor = mejor bienestar.",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:43:    title: "IBSE – Factor Vínculo",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:48:    title: "IBSE – Factor Situación",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:53:    title: "IBSE – Factor Control",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:58:    title: "IBSE – Factor Persona",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:64:export function ibseStudyToEvidenceAtoms(study: IBSEStudy): EvidenceAtom[] {
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:70:  // IBSE_FACTORES — 5 atoms, one per factor + total index (kind: "indicator")
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:71:  const factorAtoms = IBSE_FACTOR_DEFS.map((def) => {
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:87:          "Agregado municipal calculado desde exportación REDCap. Instrumento IBSE (Bericat, 2014) adaptado para planificación local de salud.",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:95:  // IBSE_RESUMEN — 1 atom, interpretación estructural de los factores (kind: "qualitative-observation")
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:96:  const resumenAtom = buildIBSEResumen(study, confidence);
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:101:// ── IBSE_RESUMEN — Síntesis automática derivada ───────────────────────────
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:103:// El MIT usa IBSE_FACTORES como evidencia principal; IBSE_RESUMEN es apoyo contextual.
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:106:function clasificarNivelIBSE(valor: number): string {
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:113:function buildIBSEResumen(study: IBSEStudy, confidence: "low" | "medium"): EvidenceAtom {
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:134:    "Síntesis automática derivada de IBSE_FACTORES. No es fuente primaria de evidencia cuantitativa.",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:136:    `Índice IBSE total: ${agg.meanTotal}/100 — ${clasificarNivelIBSE(agg.meanTotal)}.`,
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:142:  // [Regla del sistema] Heuristic alert — not a methodological conclusion of IBSE
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:154:    "[Contrato arquitectónico] IBSE_RESUMEN constituye una síntesis automática derivada del " +
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:163:    title: "IBSE – Resumen interpretativo estructural (derivado)",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:173:        "Síntesis automática derivada del procesamiento de los resultados de IBSE_FACTORES. " +
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:175:        "IBSE_RESUMEN no es una fuente primaria de conocimiento ni una interpretación experta. " +
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:176:        "No debe prevalecer sobre los datos cuantitativos (IBSE_FACTORES) cuando exista discrepancia. " +
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:177:        "IBSE_RESUMEN constituye una síntesis automática derivada del procesamiento de los resultados " +
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:181:        "[Regla del sistema] Los umbrales de clasificación (alto/medio/bajo) son heurísticos definidos por el sistema, no por el instrumento IBSE ni por criterios normativos o clínicos.",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:182:        "[Regla del sistema] La alerta por dispersión interfactorial alta (>20 puntos) es una regla automática del sistema, no una conclusión metodológica del instrumento IBSE (Bericat, 2014).",
./src/application/ibse/IBSEStudyToEvidenceAtoms.ts:184:        "IBSE_RESUMEN debe emplearse solo como observación contextual de apoyo; IBSE_FACTORES constituye la fuente primaria de evidencia cuantitativa.",
./src/application/ibse/index.ts:1:export * from "./IBSECSVParser";
./src/application/ibse/index.ts:2:export * from "./IBSEStudyToEvidenceAtoms";
./src/application/municipal-inventory/createMunicipalInventory.ts:9:  hasIBSE: boolean;
./src/application/municipal-inventory/createMunicipalInventory.ts:11:  hasPREDIMED: boolean;
./src/application/municipal-inventory/createMunicipalInventory.ts:14:  hasCAGE: boolean;
./src/application/municipal-inventory/createMunicipalInventory.ts:37:  const hasIBSE        = snapshot.ibseStudy !== undefined;
./src/application/municipal-inventory/createMunicipalInventory.ts:39:  const hasPREDIMED    = snapshot.predimedStudy !== undefined;
./src/application/municipal-inventory/createMunicipalInventory.ts:42:  const hasCAGE        = snapshot.cageStudy !== undefined;
./src/application/municipal-inventory/createMunicipalInventory.ts:54:  const cageRecordCount         = snapshot.cageStudy?.aggregates.nValidCAGER ?? 0;
./src/application/municipal-inventory/createMunicipalInventory.ts:62:  if (hasIBSE && ibseValidRecordCount === 0) {
./src/application/municipal-inventory/createMunicipalInventory.ts:63:    warnings.push("IBSE cargado sin registros completos.");
./src/application/municipal-inventory/createMunicipalInventory.ts:72:    hasIBSE,
./src/application/municipal-inventory/createMunicipalInventory.ts:74:    hasPREDIMED,
./src/application/municipal-inventory/createMunicipalInventory.ts:77:    hasCAGE,
./src/application/oit/OITEngine.ts:79:        "Registrar fuentes mínimas antes de traducir a EPVSA o Plan de Acción.",
./src/application/predimed/index.ts:1:export * from "./PREDIMEDCSVParser";
./src/application/predimed/index.ts:2:export * from "./PREDIMEDStudyToEvidenceAtoms";
./src/application/predimed/PREDIMEDCSVParser.ts:1:import type { PREDIMEDAggregates } from "../../domain/predimed";
./src/application/predimed/PREDIMEDCSVParser.ts:5:// ── Configuración derivada de PREDIMED_EAS_MODULE ─────────────────────────────
./src/application/predimed/PREDIMEDCSVParser.ts:12:    "[PREDIMEDCSVParser] Módulo 'predimed-eas' no encontrado en el registro metodológico. " +
./src/application/predimed/PREDIMEDCSVParser.ts:13:    "Verifica que PREDIMED_EAS_MODULE esté registrado en domain/methodology/registry.ts."
./src/application/predimed/PREDIMEDCSVParser.ts:19:    "[PREDIMEDCSVParser] PREDIMED_EAS_MODULE sin adaptador SAV configurado. " +
./src/application/predimed/PREDIMEDCSVParser.ts:31:    "[PREDIMEDCSVParser] Variable canónica 'predimedScore' no encontrada en PREDIMED_EAS_MODULE.adapters.sav. " +
./src/application/predimed/PREDIMEDCSVParser.ts:38:// Ver: PREDIMED_EAS_MODULE.algorithm.notes y fixtures/README.md.
./src/application/predimed/PREDIMEDCSVParser.ts:48:const EMPTY_AGGREGATES: PREDIMEDAggregates = {
./src/application/predimed/PREDIMEDCSVParser.ts:61:export interface PREDIMEDCSVParseResult {
./src/application/predimed/PREDIMEDCSVParser.ts:62:  aggregates: PREDIMEDAggregates;
./src/application/predimed/PREDIMEDCSVParser.ts:86:function buildCautions(aggregates: PREDIMEDAggregates): string[] {
./src/application/predimed/PREDIMEDCSVParser.ts:89:    "PREDIMED-14: adherencia baja <= 6, media 7-8, alta >= 9. Corte segun Martinez-Gonzalez (2012), adaptacion EAS Andalucia.",
./src/application/predimed/PREDIMEDCSVParser.ts:102:      "CSV sin registros PREDIMED completos. Verifica el formato y los valores validos (0..14) de la columna Predimed."
./src/application/predimed/PREDIMEDCSVParser.ts:115:      `En los microdatos EAS READY, Predimed solo se calcula para registros de oleadas que incluyen el modulo PREDIMED-14.`
./src/application/predimed/PREDIMEDCSVParser.ts:122:export function parsePREDIMEDCSV(csvText: string): PREDIMEDCSVParseResult {
./src/application/predimed/PREDIMEDCSVParser.ts:155:        `El CSV no contiene datos PREDIMED procesables.`
./src/application/predimed/PREDIMEDCSVParser.ts:192:  const aggregates: PREDIMEDAggregates = {
./src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:2:import type { PREDIMEDStudy } from "../../domain/predimed";
./src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:8:export function predimedStudyToEvidenceAtoms(study: PREDIMEDStudy): EvidenceAtom[] {
./src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:20:    title: "PREDIMED-EAS - Adherencia a dieta mediterranea",
./src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:22:      `Puntuacion media PREDIMED-14: ${aggregates.meanScore}/14. ` +
./src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:36:        "Agregado municipal calculado desde CSV PREDIMED-EAS. " +
./src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:49:    title: "PREDIMED-EAS - Cautela metodologica",
./src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:51:      "El indice PREDIMED-14 mide adherencia a la dieta mediterranea mediante 14 items dicotomicos. " +
./src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:63:        "Cautela metodologica asociada al procesamiento PREDIMED-EAS como estudio complementario concreto.",
./src/application/prioritization/PrioritizationEngine.ts:41:      "No traduce todavía a líneas EPVSA.",
./src/application/prioritization/PrioritizationEngine.ts:56:      "Candidata derivada de un área de intervención territorial del Perfil de Salud Local. " +
./src/application/questionnaire/redcap/RedcapDictionaryBuilder.ts:52:          `El ítem ${item.id} del módulo ${moduleId} no tiene definición REDCap de formulario.`,
./src/application/questionnaire/redcap/RedcapDictionaryDefinition.ts:12:  // Contenido REDCap
./src/application/questionnaire/redcap/RedcapDictionaryDefinition.ts:31:  // Anotaciones REDCap
./src/application/reconciliation/ReconciliacionEngine.ts:290:        "Coexistencia de IBSE (bienestar individual escolar) e Informe de Salud " +
./src/application/reconciliation/ReconciliacionEngine.ts:330:        `IBSE (escala individual) + ${lt1.indicators.length} indicador(es) poblacional(es). ` +
./src/application/runtime/MunicipalityRuntime.ts:9:import type { EPVSATranslationResult } from "../epvsa";
./src/application/runtime/MunicipalityRuntime.ts:10:import { translatePrioritizationToEPVSA } from "../epvsa";
./src/application/runtime/MunicipalityRuntime.ts:51:  // PSL — Perfil de Salud Local
./src/application/runtime/MunicipalityRuntime.ts:60:  epvsa: EPVSATranslationResult;
./src/application/runtime/MunicipalityRuntime.ts:84:  // EPVSA/ESCA son marcos interpretativos, no módulos ejecutables.
./src/application/runtime/MunicipalityRuntime.ts:119:  // ── PSL — Perfil de Salud Local (puente obligatorio Nivel 2 → Nivel 3)
./src/application/runtime/MunicipalityRuntime.ts:145:  const epvsa = translatePrioritizationToEPVSA(prioritization);
./src/application/runtime/MunicipalityRuntime.ts:187:    epvsa: EPVSATranslationResult;
./src/application/runtime/MunicipalityRuntime.ts:277:        : "Sin evidencia real. Sugerencia EPVSA pendiente de revisión por ausencia de base documental.",
./src/application/sf12/SF12CSVParser.ts:56:      "CSV sin registros SF-12 válidos. Verifica que las columnas PCS12_SP y MCS12_SP contengan valores numéricos."
./src/application/sf12/SF12CSVParser.ts:94:        "El CSV no contiene datos SF-12 procesables."
./src/application/sf12/SF12StudyToEvidenceAtoms.ts:18:    title: "SF-12 EAS - Componente Físico de Salud (PCS12_SP)",
./src/application/sf12/SF12StudyToEvidenceAtoms.ts:45:    title: "SF-12 EAS - Componente Mental de Salud (MCS12_SP)",
./src/application/sf12/SF12StudyToEvidenceAtoms.ts:72:    title: "SF-12 EAS - Cautela metodológica",
./src/application/sf12/SF12StudyToEvidenceAtoms.ts:87:        "Cautela metodológica asociada al procesamiento SF-12 EAS como estudio complementario.",
./src/application/sueno/SuenoCSVParser.ts:38:      "P33_R clasifica si la persona duerme las horas recomendadas por la Sociedad Española del Sueño. " +
./src/application/sueno/SuenoCSVParser.ts:99:      `Columnas "${P33R_FIELD}" y "${P33A_FIELD}" no encontradas. El CSV no contiene datos de Sueño EAS procesables.`
./src/application/sueno/SuenoStudyToEvidenceAtoms.ts:14:    title: "Sueño EAS - Duración insuficiente (P33_R)",
./src/application/sueno/SuenoStudyToEvidenceAtoms.ts:17:      `por la Sociedad Española del Sueño (P33_R=1). ` +
./src/application/sueno/SuenoStudyToEvidenceAtoms.ts:45:      title: "Sueño EAS - Calidad subjetiva: no descansa suficiente (P33A)",
./src/application/sueno/SuenoStudyToEvidenceAtoms.ts:74:    title: "Sueño EAS - Cautela metodológica",
./src/application/sueno/SuenoStudyToEvidenceAtoms.ts:88:      description: "Cautela metodológica asociada al procesamiento de Sueño EAS como estudio complementario.",
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:10: *  - Marcos interpretativos (EPVSA, ESCA, RELAS…): guías de lectura, no módulos
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:18: * EPVSA/ESCA son marcos interpretativos, no motores ejecutables.
./src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:61:  // Marcos interpretativos aplicados (EPVSA, ESCA, RELAS…)
./src/application/thematic-prioritisation/ThematicPrioritisationCSVParser.ts:7:// Mapeo canónico columna REDCap → ID del dominio COMPÁS NG.
./src/application/thematic-prioritisation/ThematicPrioritisationCSVParser.ts:14:  { column: "temas___5",  topicId: "sueno-descanso",        label: "Sueño y descanso" },
./src/application/thematic-prioritisation/ThematicPrioritisationCSVParser.ts:71:          "papeleta_pri_tematica y no otro instrumento REDCap.",
./src/application/thematic-prioritisation/ThematicPrioritisationToEvidenceAtoms.ts:31:          "Requiere contraste con la lectura territorial antes de incorporarse al Plan de Acción.",
./src/domain/cage/CAGEAggregates.ts:1:export interface CAGEAggregates {
./src/domain/cage/CAGEAggregates.ts:3:  // CAGE_R — riesgo de alcoholismo (campo canónico primario, ~82 % cobertura en EAS)
./src/domain/cage/CAGEAggregates.ts:4:  nValidCAGER: number;
./src/domain/cage/CAGEAggregates.ts:5:  missingCAGER: number;
./src/domain/cage/CAGEAggregates.ts:8:  // CAGE — clasificación ordinal de nivel de consumo (1–4, mismo n que CAGE_R)
./src/domain/cage/CAGEAggregates.ts:9:  nValidCAGE: number;
./src/domain/cage/CAGEAggregates.ts:10:  nCAGE1: number; // Bebedor social
./src/domain/cage/CAGEAggregates.ts:11:  nCAGE2: number; // Consumo de riesgo
./src/domain/cage/CAGEAggregates.ts:12:  nCAGE3: number; // Consumo perjudicial
./src/domain/cage/CAGEAggregates.ts:13:  nCAGE4: number; // Dependencia alcohólica
./src/domain/cage/CAGEStudy.ts:2:import type { CAGEAggregates } from "./CAGEAggregates";
./src/domain/cage/CAGEStudy.ts:4:export interface CAGEStudy {
./src/domain/cage/CAGEStudy.ts:8:  aggregates: CAGEAggregates;
./src/domain/cage/CAGEStudy.ts:15:export interface CreateCAGEStudyInput {
./src/domain/cage/CAGEStudy.ts:18:  aggregates: CAGEAggregates;
./src/domain/cage/CAGEStudy.ts:23:export function createCAGEStudy(input: CreateCAGEStudyInput): CAGEStudy {
./src/domain/cage/index.ts:1:export * from "./CAGEAggregates";
./src/domain/cage/index.ts:2:export * from "./CAGEStudy";
./src/domain/health-profile/LocalHealthProfile.ts:81:  // Priorización participativa (proceso ciudadano vía REDCap / deliberación)
./src/domain/health-profile/LocalHealthProfile.ts:103:  // ── Capítulo I: Marco Estratégico ─────────────────────────────────────────
./src/domain/ibse/IBSEAggregates.ts:1:export interface IBSEAggregates {
./src/domain/ibse/IBSEStudy.ts:2:import type { IBSEAggregates } from "./IBSEAggregates";
./src/domain/ibse/IBSEStudy.ts:4:export interface IBSEStudy {
./src/domain/ibse/IBSEStudy.ts:8:  aggregates: IBSEAggregates;
./src/domain/ibse/IBSEStudy.ts:15:export interface CreateIBSEStudyInput {
./src/domain/ibse/IBSEStudy.ts:18:  aggregates: IBSEAggregates;
./src/domain/ibse/IBSEStudy.ts:23:export function createIBSEStudy(input: CreateIBSEStudyInput): IBSEStudy {
./src/domain/ibse/index.ts:1:export * from "./IBSEAggregates";
./src/domain/ibse/index.ts:2:export * from "./IBSEStudy";
./src/domain/methodology/definitions/duke-eas.ts:11:// - Adaptador REDCap: no aplica en el flujo actual (datos vienen de microdatos EAS).
./src/domain/methodology/definitions/duke-eas.ts:300:        "Validez y fiabilidad del cuestionario de apoyo social funcional Duke-UNC-11",
./src/domain/methodology/definitions/ibse.ts:3:// Definición canónica del Índice de Bienestar Socioemocional (IBSE).
./src/domain/methodology/definitions/ibse.ts:7:// y el adaptador REDCap sí están verificados contra la implementación en uso.
./src/domain/methodology/definitions/ibse.ts:12:// La implementación actual recibe puntuaciones ya calculadas por REDCap por participante
./src/domain/methodology/definitions/ibse.ts:15:export const IBSE_MODULE: MethodologicalModule = {
./src/domain/methodology/definitions/ibse.ts:22:    shortName: "IBSE",
./src/domain/methodology/definitions/ibse.ts:41:  // Ítems verificados contra el diccionario REDCap interno:
./src/domain/methodology/definitions/ibse.ts:42:  // MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv
./src/domain/methodology/definitions/ibse.ts:291:      "La implementación actual recibe de REDCap puntuaciones de factor e índice ya calculadas " +
./src/domain/methodology/definitions/ibse.ts:292:      "a nivel individual (pasos 2-3 ejecutados por REDCap). El parser realiza el filtrado " +
./src/domain/methodology/definitions/ibse.ts:336:          notes: "Puntuación total calculada por REDCap a nivel individual.",
./src/domain/methodology/definitions/ibse.ts:360:        "REDCap calcula las puntuaciones de factor e índice a nivel individual antes de la exportación. " +
./src/domain/methodology/definitions/predimed-eas.ts:3:// Definición canónica del PREDIMED-14 en su adaptación EAS (PREDIMED-EAS).
./src/domain/methodology/definitions/predimed-eas.ts:15:// - Adaptador REDCap: no aplica en el flujo actual (datos de microdatos EAS).
./src/domain/methodology/definitions/predimed-eas.ts:17:// Esta definición es declarativa. PREDIMEDCSVParser.ts no la consume todavía.
./src/domain/methodology/definitions/predimed-eas.ts:20:export const PREDIMED_EAS_MODULE: MethodologicalModule = {
./src/domain/methodology/definitions/predimed-eas.ts:26:    name: "Adherencia a la Dieta Mediterránea PREDIMED-EAS",
./src/domain/methodology/definitions/predimed-eas.ts:27:    shortName: "PREDIMED-EAS",
./src/domain/methodology/definitions/predimed-eas.ts:29:      "Cuestionario PREDIMED-14 de adherencia a la dieta mediterránea en su " +
./src/domain/methodology/definitions/predimed-eas.ts:44:      "Adaptación del cuestionario PREDIMED-14 para la Encuesta Andaluza de Salud. " +
./src/domain/methodology/definitions/predimed-eas.ts:49:      "del parser PREDIMEDCSVParser.ts. La publicación primaria específica del " +
./src/domain/methodology/definitions/predimed-eas.ts:50:      "instrumento PREDIMED-14 y sus umbrales está pendiente de contraste. " +
./src/domain/methodology/definitions/predimed-eas.ts:51:      "El estudio PREDIMED original: Estruch R et al., N Engl J Med 2013;368:1279-1290.",
./src/domain/methodology/definitions/predimed-eas.ts:249:          "Administrar los 14 ítems dietéticos del cuestionario PREDIMED. " +
./src/domain/methodology/definitions/predimed-eas.ts:282:      "Solo algunos oleadas EAS incluyen el módulo PREDIMED; la tasa de incompletos " +
./src/domain/methodology/definitions/predimed-eas.ts:334:      "(712 de 3064 en el fixture Granada = 23,2 %). Las oleadas sin módulo PREDIMED " +
./src/domain/methodology/definitions/predimed-eas.ts:339:      "Difieren de otras clasificaciones PREDIMED publicadas.",
./src/domain/methodology/definitions/predimed-eas.ts:348:    "Solo las oleadas EAS que incluyen el módulo PREDIMED tienen `Predimed` válido. " +
./src/domain/methodology/definitions/predimed-eas.ts:369:      authors: "Estruch, R. et al. (PREDIMED Study Investigators)",
./src/domain/methodology/definitions/predimed-eas.ts:377:        "como factor cardioprotector. El cuestionario PREDIMED-14 fue desarrollado " +
./src/domain/methodology/index.ts:32:export { IBSE_MODULE } from "./definitions/ibse";
./src/domain/methodology/MethodologicalModule.ts:3:// Los adaptadores (REDCap, SAV, parsers, motores, IA) derivan de esta definición.
./src/domain/methodology/MethodologicalModule.ts:115:  | "pre-aggregated"         // valores calculados por fuente externa (ej. REDCap) por participante
./src/domain/methodology/MethodologicalModule.ts:179:  redcapColumn: string;      // columna en la exportación REDCap
./src/domain/methodology/MethodologicalModule.ts:180:  isComputed: boolean;       // true si REDCap calcula este valor (no es respuesta directa)
./src/domain/methodology/MethodologicalModule.ts:185:  instrument?: string;       // nombre del instrumento dentro del proyecto REDCap
./src/domain/methodology/registry.ts:2:import { IBSE_MODULE } from "./definitions/ibse";
./src/domain/methodology/registry.ts:4:import { PREDIMED_EAS_MODULE } from "./definitions/predimed-eas";
./src/domain/methodology/registry.ts:11:  [IBSE_MODULE.identity.id, IBSE_MODULE],
./src/domain/methodology/registry.ts:13:  [PREDIMED_EAS_MODULE.identity.id, PREDIMED_EAS_MODULE],
./src/domain/municipality-context/createMunicipalityContext.ts:12: *                 ├─▶ Perfil de Salud Local (futuro)
./src/domain/municipality-context/createMunicipalityContext.ts:16: *                 ├─▶ Plan de Acción (futuro)
./src/domain/municipality-context/MunicipalityContext.ts:12: * futuros motores (Perfil de Salud Local, LT1, OIT, priorización, IA).
./src/domain/municipality-context/MunicipalityContext.ts:18:import type { IBSEStudy } from "../ibse";
./src/domain/municipality-context/MunicipalityContext.ts:20:import type { PREDIMEDStudy } from "../predimed";
./src/domain/municipality-context/MunicipalityContext.ts:23:import type { CAGEStudy } from "../cage";
./src/domain/municipality-context/MunicipalityContext.ts:34:  ibseStudy?: IBSEStudy;
./src/domain/municipality-context/MunicipalityContext.ts:38:  predimedStudy?: PREDIMEDStudy;
./src/domain/municipality-context/MunicipalityContext.ts:44:  cageStudy?: CAGEStudy;
./src/domain/municipality-context/MunicipalityContext.ts:52:  // Reservado: priorización estratégica (EPVSA / Plan de Acción)
./src/domain/predimed/index.ts:1:export * from "./PREDIMEDAggregates";
./src/domain/predimed/index.ts:2:export * from "./PREDIMEDStudy";
./src/domain/predimed/PREDIMEDAggregates.ts:1:export interface PREDIMEDAggregates {
./src/domain/predimed/PREDIMEDStudy.ts:2:import type { PREDIMEDAggregates } from "./PREDIMEDAggregates";
./src/domain/predimed/PREDIMEDStudy.ts:4:export interface PREDIMEDStudy {
./src/domain/predimed/PREDIMEDStudy.ts:8:  aggregates: PREDIMEDAggregates;
./src/domain/predimed/PREDIMEDStudy.ts:15:export interface CreatePREDIMEDStudyInput {
./src/domain/predimed/PREDIMEDStudy.ts:18:  aggregates: PREDIMEDAggregates;
./src/domain/predimed/PREDIMEDStudy.ts:23:export function createPREDIMEDStudy(input: CreatePREDIMEDStudyInput): PREDIMEDStudy {
./src/domain/questionnaire/QuestionnaireDefinition.ts:21:  // Módulos metodológicos seleccionados (IBSE, DUKE, CAGE, ...)
./src/domain/strategic-framework/createStrategicFramework.ts:28:        title: "Marco estratégico: EPVSA 2024–2030",
./src/domain/strategic-framework/createStrategicFramework.ts:30:          "La Estrategia de Promoción de la Vida Saludable en Andalucía 2024–2030 (EPVSA) constituye el eje estratégico de referencia para la planificación local de salud en la comunidad autónoma. Define líneas de acción prioritarias en torno a la alimentación saludable, la actividad física, el bienestar emocional, la prevención de consumos perjudiciales y los entornos favorecedores de salud.",
./src/domain/strategic-framework/createStrategicFramework.ts:31:          "En " + municipalityName + ", el Plan Local de Salud 2027–2030 adopta la EPVSA como marco orientador, traduciendo sus objetivos estratégicos en intervenciones adaptadas al contexto territorial, epidemiológico y socioeconómico del municipio.",
./src/domain/strategic-framework/createStrategicFramework.ts:32:          "La alineación con la EPVSA permite articular la acción local con los recursos autonómicos disponibles, facilitar la comparabilidad de indicadores entre municipios RELAS y dotar al Plan Local de coherencia con las políticas de salud pública de la Junta de Andalucía.",
./src/domain/strategic-framework/createStrategicFramework.ts:37:        title: "Marco metodológico: RELAS",
./src/domain/strategic-framework/createStrategicFramework.ts:39:          "La Red Local de Acción en Salud (RELAS) de Granada proporciona el marco metodológico en el que se inscribe el proceso de elaboración del Plan Local de Salud de " + municipalityName + ". RELAS integra a municipios, distritos sanitarios y equipos de salud pública en un proceso compartido de diagnóstico, planificación y evaluación.",
./src/domain/strategic-framework/createStrategicFramework.ts:40:          "La metodología RELAS articula cuatro fases: diagnóstico de situación, priorización participativa, planificación de la acción e implementación y seguimiento. Cada fase combina análisis epidemiológico, participación ciudadana y trabajo intersectorial.",
./src/domain/strategic-framework/createStrategicFramework.ts:41:          "El presente bloque marco constituye la sección introductoria del Perfil de Salud Local de " + municipalityName + ", que integrará el Informe de Salud, los estudios complementarios, la priorización temática, el mapa de activos comunitarios y la futura capa de mejoramiento municipal.",
./src/domain/strategic-framework/createStrategicFramework.ts:48:          "El Plan Local de Salud de " + municipalityName + " adopta un enfoque salutogénico, orientado a identificar y movilizar los activos en salud presentes en el territorio: recursos personales, comunitarios e institucionales que contribuyen a la generación y el mantenimiento de la salud.",
./src/domain/strategic-framework/createStrategicFramework.ts:57:          "El diagnóstico de salud de " + municipalityName + " se sustenta en fuentes de información diversas y complementarias: el Informe de Salud Municipal elaborado por el Distrito Sanitario" + (sanitaryDistrict !== undefined ? " " + sanitaryDistrict : "") + ", los registros del Sistema de Información Sanitaria de Andalucía (SISA), los datos del Instituto de Estadística y Cartografía de Andalucía (IECA), los indicadores del IBSE (Inventario de Bienestar Subjetivo Escolar) cuando están disponibles, y las aportaciones de la ciudadanía a través de los procesos participativos.",
./src/domain/strategic-framework/createStrategicFramework.ts:58:          "La legitimidad del diagnóstico descansa en la pluralidad de fuentes, la transparencia metodológica y la participación de los actores locales en la validación de resultados. Ninguna fuente aislada determina las conclusiones del Perfil de Salud Local; la triangulación de evidencias es el criterio rector.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:20:  | "EPVSA"
./src/domain/strategy/StrategicFrameworkRegistry.ts:21:  | "ESCA"
./src/domain/strategy/StrategicFrameworkRegistry.ts:24:  | "RELAS"
./src/domain/strategy/StrategicFrameworkRegistry.ts:44:// ── EPVSA 2024–2030 ────────────────────────────────────────────────────────
./src/domain/strategy/StrategicFrameworkRegistry.ts:47:// IDs aligned with EPVSATranslator.ts (LE1–LE4)
./src/domain/strategy/StrategicFrameworkRegistry.ts:49:const EPVSA: readonly StrategicElement[] = Object.freeze([
./src/domain/strategy/StrategicFrameworkRegistry.ts:51:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:53:    id: "EPVSA-LE1",
./src/domain/strategy/StrategicFrameworkRegistry.ts:58:      "Número de municipios con Plan Local de Salud activo",
./src/domain/strategy/StrategicFrameworkRegistry.ts:60:      "Porcentaje de municipios RELAS con diagnóstico participativo actualizado",
./src/domain/strategy/StrategicFrameworkRegistry.ts:63:      "EPVSA 2024–2030, Línea Estratégica 1. Consejería de Salud y Consumo, Junta de Andalucía.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:66:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:68:    id: "EPVSA-LE2",
./src/domain/strategy/StrategicFrameworkRegistry.ts:76:      "Puntuación IBSE (Bienestar Socioemocional Escolar)",
./src/domain/strategy/StrategicFrameworkRegistry.ts:79:      "EPVSA 2024–2030, Línea Estratégica 2. Consejería de Salud y Consumo, Junta de Andalucía.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:82:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:84:    id: "EPVSA-LE3",
./src/domain/strategy/StrategicFrameworkRegistry.ts:94:      "EPVSA 2024–2030, Línea Estratégica 3. Consejería de Salud y Consumo, Junta de Andalucía.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:97:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:99:    id: "EPVSA-LE4",
./src/domain/strategy/StrategicFrameworkRegistry.ts:109:      "EPVSA 2024–2030, Línea Estratégica 4. Consejería de Salud y Consumo, Junta de Andalucía.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:112:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:114:    id: "EPVSA-LE1-OBJ1",
./src/domain/strategy/StrategicFrameworkRegistry.ts:116:    sourceTrace: "EPVSA 2024–2030, LE1, Objetivo 1.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:119:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:121:    id: "EPVSA-LE2-OBJ1",
./src/domain/strategy/StrategicFrameworkRegistry.ts:123:    sourceTrace: "EPVSA 2024–2030, LE2, Objetivo 1.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:126:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:128:    id: "EPVSA-LE2-OBJ2",
./src/domain/strategy/StrategicFrameworkRegistry.ts:130:    sourceTrace: "EPVSA 2024–2030, LE2, Objetivo 2.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:133:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:135:    id: "EPVSA-LE2-OBJ3",
./src/domain/strategy/StrategicFrameworkRegistry.ts:137:    sourceTrace: "EPVSA 2024–2030, LE2, Objetivo 3.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:140:    framework: "EPVSA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:142:    id: "EPVSA-LE3-OBJ1",
./src/domain/strategy/StrategicFrameworkRegistry.ts:144:    sourceTrace: "EPVSA 2024–2030, LE3, Objetivo 1.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:148:// ── ESCA ───────────────────────────────────────────────────────────────────
./src/domain/strategy/StrategicFrameworkRegistry.ts:151:// Referencia: ESCA.pdf (repositorio documental COMPÁS)
./src/domain/strategy/StrategicFrameworkRegistry.ts:153:const ESCA: readonly StrategicElement[] = Object.freeze([
./src/domain/strategy/StrategicFrameworkRegistry.ts:155:    framework: "ESCA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:157:    id: "ESCA-L1",
./src/domain/strategy/StrategicFrameworkRegistry.ts:167:      "ESCA — Estrategia de Salud Comunitaria de Andalucía. Línea 1. Consejería de Salud y Consumo. Véase ESCA.pdf en repositorio documental.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:170:    framework: "ESCA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:172:    id: "ESCA-L2",
./src/domain/strategy/StrategicFrameworkRegistry.ts:182:      "ESCA — Línea 2. Coordinación sociosanitaria. Véase ESCA.pdf.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:185:    framework: "ESCA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:187:    id: "ESCA-L3",
./src/domain/strategy/StrategicFrameworkRegistry.ts:197:      "ESCA — Línea 3. Participación ciudadana. Véase ESCA.pdf.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:200:    framework: "ESCA" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:202:    id: "ESCA-L4",
./src/domain/strategy/StrategicFrameworkRegistry.ts:212:      "ESCA — Línea 4. Calidad y equidad. Véase ESCA.pdf.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:349:// ── RELAS — Red Local de Acción en Salud de Granada ───────────────────────
./src/domain/strategy/StrategicFrameworkRegistry.ts:353:const RELAS: readonly StrategicElement[] = Object.freeze([
./src/domain/strategy/StrategicFrameworkRegistry.ts:355:    framework: "RELAS" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:357:    id: "RELAS-F1",
./src/domain/strategy/StrategicFrameworkRegistry.ts:364:      "Perfil de Salud Local (PSL) completado y aprobado",
./src/domain/strategy/StrategicFrameworkRegistry.ts:367:      "Metodología RELAS Granada — Fase 1: Diagnóstico de situación de salud.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:370:    framework: "RELAS" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:372:    id: "RELAS-F2",
./src/domain/strategy/StrategicFrameworkRegistry.ts:375:      "Identificación de prioridades de salud con participación de la ciudadanía y los actores locales. Instrumentos: IBSE, papeleta temática, diagnóstico comunitario.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:382:      "Metodología RELAS Granada — Fase 2: Priorización participativa.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:385:    framework: "RELAS" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:387:    id: "RELAS-F3",
./src/domain/strategy/StrategicFrameworkRegistry.ts:390:      "Elaboración del Plan Local de Salud con objetivos, actuaciones, responsables, calendario e indicadores. Alineación con EPVSA y otros marcos estratégicos.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:392:      "Plan Local de Salud aprobado por el Consejo Local de Salud",
./src/domain/strategy/StrategicFrameworkRegistry.ts:394:      "Alineación con EPVSA y otros marcos estratégicos documentada",
./src/domain/strategy/StrategicFrameworkRegistry.ts:397:      "Metodología RELAS Granada — Fase 3: Planificación de la acción.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:400:    framework: "RELAS" as const,
./src/domain/strategy/StrategicFrameworkRegistry.ts:402:    id: "RELAS-F4",
./src/domain/strategy/StrategicFrameworkRegistry.ts:412:      "Metodología RELAS Granada — Fase 4: Implementación y seguimiento.",
./src/domain/strategy/StrategicFrameworkRegistry.ts:419:  ...EPVSA,
./src/domain/strategy/StrategicFrameworkRegistry.ts:420:  ...ESCA,
./src/domain/strategy/StrategicFrameworkRegistry.ts:423:  ...RELAS,
./src/domain/strategy/StrategicFrameworkRegistry.ts:457:    "EPVSA",
./src/domain/strategy/StrategicFrameworkRegistry.ts:458:    "ESCA",
./src/domain/strategy/StrategicFrameworkRegistry.ts:461:    "RELAS",
./src/domain/thematic-prioritisation/ThematicPrioritisationStudy.ts:1:// Resultado estadístico de un proceso de participación ciudadana (REDCap).
./src/domain/thematic-prioritisation/ThematicPrioritisationStudy.ts:7:  redcapColumn: string;   // Columna REDCap (ej. "temas___3")
./src/domain/thematic-prioritisation/ThematicTopic.ts:8:// Catálogo canónico del formulario REDCap "papeleta_pri_tematica"
./src/domain/thematic-prioritisation/ThematicTopic.ts:16:  { id: "sueno-descanso",        label: "Sueño y descanso" },
./src/domain/workspace/MunicipalityWorkspace.ts:5:import type { IBSEStudy } from "../ibse";
./src/domain/workspace/MunicipalityWorkspace.ts:7:import type { PREDIMEDStudy } from "../predimed";
./src/domain/workspace/MunicipalityWorkspace.ts:10:import type { CAGEStudy } from "../cage";
./src/domain/workspace/MunicipalityWorkspace.ts:47:  ibseStudy?: IBSEStudy;
./src/domain/workspace/MunicipalityWorkspace.ts:49:  predimedStudy?: PREDIMEDStudy;
./src/domain/workspace/MunicipalityWorkspace.ts:52:  cageStudy?: CAGEStudy;
./src/infrastructure/persistence/local-storage/LocalStorageWorkspacePersistence.ts:138:    // Normalizar IBSEStudy: campo añadido en b66193a — rellenar en workspaces anteriores
./src/ui/components/ActionPlanPanel.tsx:83:      return "Basado en un Perfil de Salud Local validado que ha quedado desactualizado por cambios posteriores en la evidencia.";
./src/ui/components/ActionPlanPanel.tsx:87:      return `Basado en un Perfil de Salud Local validado técnicamente el ${formatDate(pslReference.validatedAt)}${who}.`;
./src/ui/components/ActionPlanPanel.tsx:89:    return "Basado en un Perfil de Salud Local en estado de borrador. Se recomienda validar el perfil antes de formalizar el plan.";
./src/ui/components/ActionPlanPanel.tsx:102:          <p className="eyebrow">Plan de Acción</p>
./src/ui/components/ActionPlanPanel.tsx:118:          <strong>Plan de Acción no disponible</strong>
./src/ui/components/ActionPlanPanel.tsx:121:            <li>Perfil de Salud Local validado técnicamente.</li>
./src/ui/components/ActionPlanPanel.tsx:126:            El Plan de Acción es una propuesta técnica que requiere el Perfil de Salud Local
./src/ui/components/ActionPlanPanel.tsx:133:          Este borrador de Plan de Acción ha sido generado sobre un repositorio sin evidencia.
./src/ui/components/AgendaPanel.tsx:25:          Borrador operativo derivado del Plan de Acción. No activa seguimiento
./src/ui/components/AgendaPanel.tsx:35:            <li>Perfil de Salud Local validado técnicamente.</li>
./src/ui/components/AgendaPanel.tsx:36:            <li>Plan de Acción elaborado y revisado.</li>
./src/ui/components/AgendaPanel.tsx:39:            La agenda anual se deriva del Plan de Acción validado.
./src/ui/components/AgendaPanel.tsx:48:          Incorpora documentos al repositorio para obtener una agenda basada en el Plan de Acción.
./src/ui/components/CAGEPanel.tsx:1:import type { CAGEStudy } from "../../domain/cage";
./src/ui/components/CAGEPanel.tsx:3:interface CAGEPanelProps {
./src/ui/components/CAGEPanel.tsx:4:  cageStudy?: CAGEStudy;
./src/ui/components/CAGEPanel.tsx:10:// CAGE-EAS: cribado de riesgo de alcoholismo (variable dicotómica CAGE_R).
./src/ui/components/CAGEPanel.tsx:11:// CAGE ordinal 1–4: 1 = bebedor social, 2 = consumo de riesgo, 3 = perjudicial, 4 = dependencia.
./src/ui/components/CAGEPanel.tsx:12:// Cautela: el CAGE es un cribado, no un diagnóstico clínico.
./src/ui/components/CAGEPanel.tsx:14:export function CAGEPanel({
./src/ui/components/CAGEPanel.tsx:19:}: CAGEPanelProps) {
./src/ui/components/CAGEPanel.tsx:25:            Cargar CSV CAGE-EAS (.csv)
./src/ui/components/CAGEPanel.tsx:41:          <p className="study-hint">Procesando CSV CAGE-EAS…</p>
./src/ui/components/CAGEPanel.tsx:56:            n válido CAGE_R = {cageStudy.aggregates.nValidCAGER}
./src/ui/components/CAGEPanel.tsx:57:            {cageStudy.aggregates.missingCAGER > 0 && (
./src/ui/components/CAGEPanel.tsx:58:              <> · Abstinentes / no administrado: {cageStudy.aggregates.missingCAGER}</>
./src/ui/components/CAGEPanel.tsx:66:                  <td className="study-bar-row__label">Riesgo de alcoholismo (CAGE_R)</td>
./src/ui/components/CAGEPanel.tsx:80:                    n={cageStudy.aggregates.nRisk} de {cageStudy.aggregates.nValidCAGER}
./src/ui/components/CAGEPanel.tsx:84:                {/* Distribución ordinal CAGE si disponible */}
./src/ui/components/CAGEPanel.tsx:85:                {cageStudy.aggregates.nValidCAGE > 0 && (
./src/ui/components/CAGEPanel.tsx:94:                              width: `${(cageStudy.aggregates.nCAGE1 / cageStudy.aggregates.nValidCAGE) * 100}%`
./src/ui/components/CAGEPanel.tsx:100:                        {((cageStudy.aggregates.nCAGE1 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
./src/ui/components/CAGEPanel.tsx:102:                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE1}</td>
./src/ui/components/CAGEPanel.tsx:111:                              width: `${(cageStudy.aggregates.nCAGE2 / cageStudy.aggregates.nValidCAGE) * 100}%`
./src/ui/components/CAGEPanel.tsx:117:                        {((cageStudy.aggregates.nCAGE2 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
./src/ui/components/CAGEPanel.tsx:119:                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE2}</td>
./src/ui/components/CAGEPanel.tsx:128:                              width: `${(cageStudy.aggregates.nCAGE3 / cageStudy.aggregates.nValidCAGE) * 100}%`
./src/ui/components/CAGEPanel.tsx:134:                        {((cageStudy.aggregates.nCAGE3 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
./src/ui/components/CAGEPanel.tsx:136:                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE3}</td>
./src/ui/components/CAGEPanel.tsx:145:                              width: `${(cageStudy.aggregates.nCAGE4 / cageStudy.aggregates.nValidCAGE) * 100}%`
./src/ui/components/CAGEPanel.tsx:151:                        {((cageStudy.aggregates.nCAGE4 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
./src/ui/components/CAGEPanel.tsx:153:                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE4}</td>
./src/ui/components/CAGEPanel.tsx:184:          Ningún estudio CAGE-EAS cargado para este municipio. Importa un CSV con
./src/ui/components/CAGEPanel.tsx:185:          la columna <code>CAGE_R</code> y opcionalmente <code>CAGE</code>.
./src/ui/components/DocumentIngestionPanel.tsx:130:            Los instrumentos tipificados (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12) se cargan
./src/ui/components/DocumentRepositoryPanel.tsx:14:  "redcap-export": "Exportación REDCap",
./src/ui/components/DocumentRepositoryPanel.tsx:29:  ibse: "IBSE",
./src/ui/components/DocumentRepositoryPanel.tsx:31:  "predimed-eas": "PREDIMED-EAS",
./src/ui/components/DocumentRepositoryPanel.tsx:32:  "sf12-eas": "SF-12 EAS",
./src/ui/components/DocumentRepositoryPanel.tsx:33:  "sueno-eas": "Sueño EAS",
./src/ui/components/DocumentRepositoryPanel.tsx:34:  "cage-eas": "CAGE-EAS",
./src/ui/components/DocumentRepositoryPanel.tsx:48:// 2. Estudios complementarios (IBSE, EAS)
./src/ui/components/EPVSAPanel.tsx:1:import type { EPVSATranslationResult } from "../../application/epvsa";
./src/ui/components/EPVSAPanel.tsx:3:interface EPVSAPanelProps {
./src/ui/components/EPVSAPanel.tsx:4:  epvsa: EPVSATranslationResult;
./src/ui/components/EPVSAPanel.tsx:8:export function EPVSAPanel({ epvsa, isBlocked = false }: EPVSAPanelProps) {
./src/ui/components/EPVSAPanel.tsx:17:          Sugerencias prudentes de encaje con el marco EPVSA. No sustituyen
./src/ui/components/EPVSAPanel.tsx:27:            <li>Perfil de Salud Local validado técnicamente.</li>
./src/ui/components/EPVSAPanel.tsx:32:            Completa y valida el Perfil de Salud Local antes de avanzar al encaje estratégico.
./src/ui/components/EstudiosComplementariosPanel.tsx:2:import type { IBSEStudy } from "../../domain/ibse";
./src/ui/components/EstudiosComplementariosPanel.tsx:4:import type { PREDIMEDStudy } from "../../domain/predimed";
./src/ui/components/EstudiosComplementariosPanel.tsx:7:import type { CAGEStudy } from "../../domain/cage";
./src/ui/components/EstudiosComplementariosPanel.tsx:9:import { IBSEPanel } from "./IBSEPanel";
./src/ui/components/EstudiosComplementariosPanel.tsx:11:import { PREDIMEDPanel } from "./PREDIMEDPanel";
./src/ui/components/EstudiosComplementariosPanel.tsx:14:import { CAGEPanel } from "./CAGEPanel";
./src/ui/components/EstudiosComplementariosPanel.tsx:138:  ibseStudy?: IBSEStudy;
./src/ui/components/EstudiosComplementariosPanel.tsx:139:  isLoadingIBSE?: boolean;
./src/ui/components/EstudiosComplementariosPanel.tsx:141:  onLoadIBSECSV?: (file: File) => void;
./src/ui/components/EstudiosComplementariosPanel.tsx:148:  predimedStudy?: PREDIMEDStudy;
./src/ui/components/EstudiosComplementariosPanel.tsx:149:  isLoadingPREDIMED?: boolean;
./src/ui/components/EstudiosComplementariosPanel.tsx:151:  onLoadPREDIMEDCSV?: (file: File) => void;
./src/ui/components/EstudiosComplementariosPanel.tsx:163:  cageStudy?: CAGEStudy;
./src/ui/components/EstudiosComplementariosPanel.tsx:164:  isLoadingCAGE?: boolean;
./src/ui/components/EstudiosComplementariosPanel.tsx:166:  onLoadCAGECSV?: (file: File) => void;
./src/ui/components/EstudiosComplementariosPanel.tsx:177:  isLoadingIBSE,
./src/ui/components/EstudiosComplementariosPanel.tsx:179:  onLoadIBSECSV,
./src/ui/components/EstudiosComplementariosPanel.tsx:185:  isLoadingPREDIMED,
./src/ui/components/EstudiosComplementariosPanel.tsx:187:  onLoadPREDIMEDCSV,
./src/ui/components/EstudiosComplementariosPanel.tsx:197:  isLoadingCAGE,
./src/ui/components/EstudiosComplementariosPanel.tsx:199:  onLoadCAGECSV,
./src/ui/components/EstudiosComplementariosPanel.tsx:234:          name="IBSE"
./src/ui/components/EstudiosComplementariosPanel.tsx:238:          isLoading={isLoadingIBSE}
./src/ui/components/EstudiosComplementariosPanel.tsx:242:          onLoadCSV={onLoadIBSECSV}
./src/ui/components/EstudiosComplementariosPanel.tsx:245:          <IBSEPanel ibseStudy={ibseStudy} isLoading={isLoadingIBSE} message={ibseMessage} onLoadCSV={onLoadIBSECSV} />
./src/ui/components/EstudiosComplementariosPanel.tsx:264:          name="PREDIMED-EAS"
./src/ui/components/EstudiosComplementariosPanel.tsx:268:          isLoading={isLoadingPREDIMED}
./src/ui/components/EstudiosComplementariosPanel.tsx:272:          onLoadCSV={onLoadPREDIMEDCSV}
./src/ui/components/EstudiosComplementariosPanel.tsx:275:          <PREDIMEDPanel predimedStudy={predimedStudy} isLoading={isLoadingPREDIMED} message={predimedMessage} onLoadCSV={onLoadPREDIMEDCSV} />
./src/ui/components/EstudiosComplementariosPanel.tsx:279:          name="SF-12 EAS"
./src/ui/components/EstudiosComplementariosPanel.tsx:294:          name="Sueño EAS"
./src/ui/components/EstudiosComplementariosPanel.tsx:309:          name="CAGE-EAS"
./src/ui/components/EstudiosComplementariosPanel.tsx:313:          isLoading={isLoadingCAGE}
./src/ui/components/EstudiosComplementariosPanel.tsx:314:          recordSummary={cageStudy ? `${cageStudy.aggregates.nValidCAGER} válidos CAGE_R · riesgo ${cageStudy.aggregates.pctRisk.toFixed(1)} %` : undefined}
./src/ui/components/EstudiosComplementariosPanel.tsx:317:          onLoadCSV={onLoadCAGECSV}
./src/ui/components/EstudiosComplementariosPanel.tsx:320:          <CAGEPanel cageStudy={cageStudy} isLoading={isLoadingCAGE} message={cageMessage} onLoadCSV={onLoadCAGECSV} />
./src/ui/components/EvidenceStorePanel.tsx:25:  "ibse":                  "IBSE",
./src/ui/components/EvidenceStorePanel.tsx:32:  "redcap":                "REDCap",
./src/ui/components/IBSEPanel.tsx:1:import type { IBSEStudy } from "../../domain/ibse";
./src/ui/components/IBSEPanel.tsx:3:interface IBSEPanelProps {
./src/ui/components/IBSEPanel.tsx:4:  ibseStudy?: IBSEStudy;
./src/ui/components/IBSEPanel.tsx:18:interface IBSEBarRowProps {
./src/ui/components/IBSEPanel.tsx:24:function IBSEBarRow({ label, value, isTotal = false }: IBSEBarRowProps) {
./src/ui/components/IBSEPanel.tsx:47:export function IBSEPanel({
./src/ui/components/IBSEPanel.tsx:52:}: IBSEPanelProps) {
./src/ui/components/IBSEPanel.tsx:59:            Cargar exportación REDCap (.csv)
./src/ui/components/IBSEPanel.tsx:75:          <p className="study-hint">Procesando CSV IBSE…</p>
./src/ui/components/IBSEPanel.tsx:112:                <IBSEBarRow
./src/ui/components/IBSEPanel.tsx:113:                  label="IBSE Total"
./src/ui/components/IBSEPanel.tsx:117:                <IBSEBarRow
./src/ui/components/IBSEPanel.tsx:121:                <IBSEBarRow
./src/ui/components/IBSEPanel.tsx:125:                <IBSEBarRow
./src/ui/components/IBSEPanel.tsx:129:                <IBSEBarRow
./src/ui/components/IBSEPanel.tsx:197:          Ningún estudio IBSE cargado para este municipio. Importa la
./src/ui/components/IBSEPanel.tsx:198:          exportación CSV desde REDCap.
./src/ui/components/index.ts:6:export * from "./IBSEPanel";
./src/ui/components/index.ts:8:export * from "./PREDIMEDPanel";
./src/ui/components/index.ts:11:export * from "./CAGEPanel";
./src/ui/components/index.ts:22:export * from "./EPVSAPanel";
./src/ui/components/LocalHealthPlanningCycle.tsx:58:  // 3 — Perfil de Salud Local
./src/ui/components/LocalHealthPlanningCycle.tsx:87:  // 5 — Plan de Acción
./src/ui/components/LocalHealthPlanningCycle.tsx:101:      label:       "Adhesión a RELAS",
./src/ui/components/LocalHealthPlanningCycle.tsx:115:      label:       "Perfil de Salud Local",
./src/ui/components/LocalHealthPlanningCycle.tsx:131:      label:       "Plan de Acción",
./src/ui/components/LocalHealthPlanningCycle.tsx:145:      label:       "Plan Local de Salud",
./src/ui/components/LocalHealthProfilePanel.tsx:7:          <h2>Perfil de Salud Local</h2>
./src/ui/components/LocalHealthProfilePanel.tsx:10:          El Perfil de Salud Local (PSL) es el activo canónico, persistente y
./src/ui/components/LocalHealthProfilePanel.tsx:12:          del municipio. Fundamenta la priorización y el Plan Local de Salud sin
./src/ui/components/LocalHealthProfilePanel.tsx:25:      <p className="inv-section-label">Características del Perfil de Salud Local</p>
./src/ui/components/LocalHealthProfilePanel.tsx:70:            La priorización canónica del Plan Local de Salud opera sobre un PSL
./src/ui/components/LocalHealthProfileView.tsx:42:  "ibse":                  "IBSE",
./src/ui/components/LocalHealthProfileView.tsx:49:  "redcap":                "REDCap",
./src/ui/components/LocalHealthProfileView.tsx:352:          <p className="psl-doc-header__subtitle">Perfil de Salud Local 2027–2030</p>
./src/ui/components/LocalHealthProfileView.tsx:371:          Este Perfil de Salud Local ha sido generado automáticamente por{" "}
./src/ui/components/LocalHealthProfileView.tsx:426:              Este Perfil de Salud Local inicia la caracterización territorial de{" "}
./src/ui/components/LocalHealthProfileView.tsx:432:              estudio IBSE, la priorización ciudadana y los estudios complementarios.
./src/ui/components/LocalHealthProfileView.tsx:493:      {/* ── I: Marco Estratégico ──────────────────────────────────────────── */}
./src/ui/components/LocalHealthProfileView.tsx:495:        <SectionHeader num="I" title="Marco Estratégico" />
./src/ui/components/LocalHealthProfileView.tsx:497:          Este Perfil de Salud Local se elabora dentro del marco de la planificación
./src/ui/components/LocalHealthProfileView.tsx:499:          Estrategia de Promoción de la Vida Saludable 2024–2030 (EPVSA),
./src/ui/components/LocalHealthProfileView.tsx:500:          la metodología de la Red Local de Acción en Salud (RELAS) y el
./src/ui/components/LocalHealthProfileView.tsx:506:              id: "EPVSA",
./src/ui/components/LocalHealthProfileView.tsx:511:              id: "RELAS",
./src/ui/components/LocalHealthProfileView.tsx:650:                <span className="psl-doc-source-flag__name">IBSE</span>
./src/ui/components/LocalHealthProfileView.tsx:658:                <span className="psl-doc-source-flag__name">PREDIMED-EAS</span>
./src/ui/components/LocalHealthProfileView.tsx:766:                  antes de traducirse en objetivos del Plan de Acción.
./src/ui/components/LT1Panel.tsx:9:  "ibse":                  "IBSE",
./src/ui/components/LT1Panel.tsx:16:  "redcap":                "REDCap",
./src/ui/components/MonitoringPanel.tsx:35:            <li>Plan de Acción elaborado y revisado.</li>
./src/ui/components/MonitoringPanel.tsx:49:          Incorpora documentos al repositorio para activar el seguimiento basado en el Plan de Acción.
./src/ui/components/MunicipalInventoryPanel.tsx:54:          label="IBSE"
./src/ui/components/MunicipalInventoryPanel.tsx:55:          present={inventory.hasIBSE}
./src/ui/components/MunicipalInventoryPanel.tsx:57:            inventory.hasIBSE
./src/ui/components/MunicipalInventoryPanel.tsx:72:          label="Adherencia dieta mediterránea (PREDIMED-EAS)"
./src/ui/components/MunicipalInventoryPanel.tsx:73:          present={inventory.hasPREDIMED}
./src/ui/components/MunicipalInventoryPanel.tsx:75:            inventory.hasPREDIMED
./src/ui/components/MunicipalInventoryPanel.tsx:81:          label="Salud percibida — PCS/MCS (SF-12 EAS)"
./src/ui/components/MunicipalInventoryPanel.tsx:90:          label="Sueño — duración y calidad (Sueño EAS)"
./src/ui/components/MunicipalInventoryPanel.tsx:99:          label="Consumo de alcohol — riesgo (CAGE-EAS)"
./src/ui/components/MunicipalInventoryPanel.tsx:100:          present={inventory.hasCAGE}
./src/ui/components/MunicipalInventoryPanel.tsx:102:            inventory.hasCAGE
./src/ui/components/MunicipalInventoryPanel.tsx:103:              ? `${inventory.cageRecordCount} registros válidos CAGE_R`
./src/ui/components/OITPanel.tsx:17:          No prioriza, no asigna líneas EPVSA y requiere validación humana.
./src/ui/components/PipelineTracePanel.tsx:27:  "action-plan":     "Plan de Acción",
./src/ui/components/PREDIMEDPanel.tsx:1:import type { PREDIMEDStudy } from "../../domain/predimed";
./src/ui/components/PREDIMEDPanel.tsx:3:interface PREDIMEDPanelProps {
./src/ui/components/PREDIMEDPanel.tsx:4:  predimedStudy?: PREDIMEDStudy;
./src/ui/components/PREDIMEDPanel.tsx:10:// PREDIMED-14: 14 ítems binarios. Cortes: alta ≥9, media 7–8, baja ≤6.
./src/ui/components/PREDIMEDPanel.tsx:12:export function PREDIMEDPanel({
./src/ui/components/PREDIMEDPanel.tsx:17:}: PREDIMEDPanelProps) {
./src/ui/components/PREDIMEDPanel.tsx:23:            Cargar CSV PREDIMED-EAS (.csv)
./src/ui/components/PREDIMEDPanel.tsx:39:          <p className="study-hint">Procesando CSV PREDIMED-EAS…</p>
./src/ui/components/PREDIMEDPanel.tsx:64:                  <td className="study-bar-row__label">Media PREDIMED</td>
./src/ui/components/PREDIMEDPanel.tsx:154:          Ningún estudio PREDIMED-EAS cargado para este municipio. Importa un
./src/ui/components/PrioritizationPanel.tsx:33:          Propuesta derivada del Perfil de Salud Local. No decide prioridades ni ordena
./src/ui/components/PrioritizationPanel.tsx:43:            Incorpora el Informe de Salud y los estudios complementarios al repositorio
./src/ui/components/PrioritizationPanel.tsx:54:                  ? "La evidencia del municipio ha cambiado desde que se validó el Perfil de Salud Local. Estas áreas candidatas se basan en un perfil que puede no reflejar el diagnóstico actual."
./src/ui/components/PrioritizationPanel.tsx:55:                  : "El Perfil de Salud Local que alimenta estas áreas candidatas está en borrador y no ha sido validado técnicamente. Los resultados deben considerarse orientativos. Valida el perfil en la pestaña «Perfil de Salud Local» antes de avanzar hacia la priorización formal."}
./src/ui/components/QuestionnaireBuilderPanel.tsx:12:      name: "Estudio complementario IBSE",
./src/ui/components/QuestionnaireBuilderPanel.tsx:16:        name: "Monitor IBSE",
./src/ui/components/QuestionnaireBuilderPanel.tsx:56:        Descargar CSV REDCap (IBSE)
./src/ui/components/QuestionnaireBuilderPanel.tsx:67:          Estos bloques forman parte de la definición del cuestionario, pero aún no
./src/ui/components/QuestionnaireBuilderPanel.tsx:68:          generan campos REDCap hasta que exista una definición metodológica completa.
./src/ui/components/SF12Panel.tsx:10:// SF-12: escala 0–100 (componentes normalizados, norma española Vilagut 2008).
./src/ui/components/SF12Panel.tsx:24:            Cargar CSV SF-12 EAS (.csv)
./src/ui/components/SF12Panel.tsx:40:          <p className="study-hint">Procesando CSV SF-12 EAS…</p>
./src/ui/components/SF12Panel.tsx:125:          Ningún estudio SF-12 cargado para este municipio. Importa un CSV con
./src/ui/components/StrategicFrameworkPanel.tsx:13:          <p className="eyebrow">Perfil de Salud Local · {framework.municipalityName}</p>
./src/ui/components/SuenoPanel.tsx:10:// Sueño EAS: variables autorreferidas de duración y calidad del sueño.
./src/ui/components/SuenoPanel.tsx:24:            Cargar CSV Sueño EAS (.csv)
./src/ui/components/SuenoPanel.tsx:40:          <p className="study-hint">Procesando CSV Sueño EAS…</p>
./src/ui/components/SuenoPanel.tsx:65:                  <td className="study-bar-row__label">Sueño insuficiente (P33_R)</td>
./src/ui/components/SuenoPanel.tsx:135:          Ningún estudio Sueño EAS cargado para este municipio. Importa un CSV con
./src/ui/components/ThematicPrioritisationModal.tsx:91:              Esta selección reflejará las prioridades ciudadanas para el Plan Local de Salud 2027–2030.
./src/ui/components/ThematicPrioritisationModal.tsx:152:        {/* ── Importar REDCap ───────────────────────────────── */}
./src/ui/components/ThematicPrioritisationModal.tsx:155:            Importar resultados de participación ciudadana (REDCap)
./src/ui/components/ThematicPrioritisationModal.tsx:165:              Seleccionar fichero REDCap (.csv)
./tests/atarfe-complementary-studies.test.ts:7:import { parseIBSECSV, ibseStudyToEvidenceAtoms } from "../src/application/ibse";
./tests/atarfe-complementary-studies.test.ts:9:import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from "../src/application/predimed";
./tests/atarfe-complementary-studies.test.ts:12:import { parseCAGECSV, cageStudyToEvidenceAtoms } from "../src/application/cage";
./tests/atarfe-complementary-studies.test.ts:13:import { createIBSEStudy } from "../src/domain/ibse";
./tests/atarfe-complementary-studies.test.ts:15:import { createPREDIMEDStudy } from "../src/domain/predimed";
./tests/atarfe-complementary-studies.test.ts:18:import { createCAGEStudy } from "../src/domain/cage";
./tests/atarfe-complementary-studies.test.ts:77:const ibseParsed = parseIBSECSV(fixture("ibse-atarfe.csv"));
./tests/atarfe-complementary-studies.test.ts:78:const ibseStudy = createIBSEStudy({
./tests/atarfe-complementary-studies.test.ts:91:    title: "IBSE - ibse-atarfe.csv",
./tests/atarfe-complementary-studies.test.ts:93:    source: { system: "Importacion REDCap IBSE" },
./tests/atarfe-complementary-studies.test.ts:122:const predimedParsed = parsePREDIMEDCSV(fixture("predimed-eas-granada.csv"));
./tests/atarfe-complementary-studies.test.ts:123:const predimedStudy = createPREDIMEDStudy({
./tests/atarfe-complementary-studies.test.ts:137:    title: "PREDIMED-EAS - predimed-eas-granada.csv",
./tests/atarfe-complementary-studies.test.ts:160:    title: "SF-12 EAS - sf12-eas-granada.csv",
./tests/atarfe-complementary-studies.test.ts:162:    source: { system: "EAS microdatos - Salud percibida SF-12" },
./tests/atarfe-complementary-studies.test.ts:191:const cageParsed = parseCAGECSV(fixture("cage-eas-granada.csv"));
./tests/atarfe-complementary-studies.test.ts:192:const cageStudy = createCAGEStudy({
./tests/atarfe-complementary-studies.test.ts:206:    title: "CAGE-EAS - cage-eas-granada.csv",
./tests/atarfe-complementary-studies.test.ts:216:describe("Atarfe - workspace con estudios complementarios", () => {
./tests/atarfe-complementary-studies.test.ts:233:    expect(workspace.cageStudy?.aggregates.nValidCAGER).toBe(2513);
./tests/atarfe-complementary-studies.test.ts:261:    expect(inventory.hasIBSE).toBe(true);
./tests/atarfe-complementary-studies.test.ts:263:    expect(inventory.hasPREDIMED).toBe(true);
./tests/atarfe-complementary-studies.test.ts:266:    expect(inventory.hasCAGE).toBe(true);
./tests/atarfe-workspace.test.ts:7: *   parseDUKECSV / parsePREDIMEDCSV → createStudy → toEvidenceAtoms → workspace
./tests/atarfe-workspace.test.ts:11: *   - PREDIMED-EAS → fixtures/predimed-eas-granada.csv (n=3064, oleadas con módulo)
./tests/atarfe-workspace.test.ts:12: *   - SF-12 EAS    → fixtures/sf12-eas-granada.csv (n=3064; PCS media=49.552, MCS media=51.139)
./tests/atarfe-workspace.test.ts:13: *   - Priorización Temática → derivada del Plan Local de Salud de Atarfe
./tests/atarfe-workspace.test.ts:15: *     AVISO: solo para integración y desarrollo de motores, no procede de proceso REDCap.
./tests/atarfe-workspace.test.ts:18: *   - IBSE: fixture no versionado (datos municipales, no EAS provincial).
./tests/atarfe-workspace.test.ts:19: *     El IBSE ya existe en el workspace de producción de Atarfe vía REDCap.
./tests/atarfe-workspace.test.ts:30:import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from '../src/application/predimed'
./tests/atarfe-workspace.test.ts:31:import { createPREDIMEDStudy } from '../src/domain/predimed'
./tests/atarfe-workspace.test.ts:45:const PREDIMED_CSV = readFileSync(resolve(_dir, '../fixtures/predimed-eas-granada.csv'), 'utf-8')
./tests/atarfe-workspace.test.ts:49:// Replica el flujo de App.tsx (handleLoadDUKECSV / handleLoadPREDIMEDCSV /
./tests/atarfe-workspace.test.ts:54:const PREDIMED_DOC_ID  = 'predimed-eas-granada-fixture'
./tests/atarfe-workspace.test.ts:102:// 3. PREDIMED-EAS
./tests/atarfe-workspace.test.ts:103:const predimedParseResult = parsePREDIMEDCSV(PREDIMED_CSV)
./tests/atarfe-workspace.test.ts:104:const predimedStudy = createPREDIMEDStudy({
./tests/atarfe-workspace.test.ts:113:  provenance: { ...a.provenance, documentId: PREDIMED_DOC_ID },
./tests/atarfe-workspace.test.ts:125:      id:           PREDIMED_DOC_ID,
./tests/atarfe-workspace.test.ts:127:      title:        'PREDIMED-EAS - predimed-eas-granada.csv',
./tests/atarfe-workspace.test.ts:129:      source:       { system: 'EAS microdatos — Adherencia dieta mediterránea (PREDIMED-14)' },
./tests/atarfe-workspace.test.ts:138:// 4. SF-12 EAS
./tests/atarfe-workspace.test.ts:163:      title:        'SF-12 EAS - sf12-eas-granada.csv',
./tests/atarfe-workspace.test.ts:165:      source:       { system: 'EAS microdatos — Salud percibida SF-12 (Vilagut et al. 2008)' },
./tests/atarfe-workspace.test.ts:174:// 5. Priorización Temática — derivada del Plan Local de Salud de Atarfe
./tests/atarfe-workspace.test.ts:175:// Fuente: priorizacion_atarfe.csv (formato propio, no REDCap) → mapeo a THEMATIC_TOPICS.
./tests/atarfe-workspace.test.ts:176:// Solo para integración y desarrollo de motores; no procede de proceso participativo REDCap.
./tests/atarfe-workspace.test.ts:181://   Sueño Saludable         → sueno-descanso        (prioridad 8)
./tests/atarfe-workspace.test.ts:230:  it('3 documentos en el repositorio (DUKE + PREDIMED + SF-12)', () => {
./tests/atarfe-workspace.test.ts:268:// ── PREDIMED-EAS ─────────────────────────────────────────────────────────
./tests/atarfe-workspace.test.ts:270:describe('Atarfe — PREDIMED-EAS (fixtures/predimed-eas-granada.csv)', () => {
./tests/atarfe-workspace.test.ts:283:  it('nValid = 712 (oleadas con módulo PREDIMED activo)', () => {
./tests/atarfe-workspace.test.ts:294:    const doc = workspace.repository.documents.find(d => d.id === PREDIMED_DOC_ID)
./tests/atarfe-workspace.test.ts:301:// ── SF-12 EAS ────────────────────────────────────────────────────────────
./tests/atarfe-workspace.test.ts:303:describe('Atarfe — SF-12 EAS (fixtures/sf12-eas-granada.csv)', () => {
./tests/atarfe-workspace.test.ts:375:  it('14 átomos totales (4 DUKE + 2 PREDIMED + 3 SF-12 + 5 TP)', () => {
./tests/atarfe-workspace.test.ts:418:  it('inventory.hasPREDIMED = true', () => {
./tests/atarfe-workspace.test.ts:419:    expect(inventory.hasPREDIMED).toBe(true)
./tests/atarfe-workspace.test.ts:462:  it('Perfil de Salud Local: DUKE, PREDIMED y SF-12 presentes en snapshot', () => {
./tests/atarfe-workspace.test.ts:468:  it('Motor de Traducción Estratégica: thematicPrioritisation con temas', () => {
./tests/atarfe-workspace.test.ts:473:  it('Plan de Acción / Agenda / Compiler: evidencia + priorización disponibles', () => {
./tests/atarfe-workspace.test.ts:478:  it('Plan Local de Salud: snapshot cumple condiciones de entrada completas', () => {
./tests/atarfe-workspace.test.ts:486:  it('IBSE: no en este test (fixture municipal no versionado — ya cargado en prod)', () => {
./tests/atarfe-workspace.test.ts:487:    // El IBSE de Atarfe existe en el workspace de producción (localStorage del navegador).
./tests/atarfe-workspace.test.ts:488:    // No hay fixture versionado para IBSE municipal; se carga vía REDCap en la UI.
./tests/atarfe-workspace.test.ts:492:  it('SF-12: instrumento implementado y cargado correctamente', () => {
./tests/cage.test.ts:5:import { parseCAGECSV } from '../src/application/cage/CAGECSVParser'
./tests/cage.test.ts:6:import { createCAGEStudy } from '../src/domain/cage'
./tests/cage.test.ts:7:import { cageStudyToEvidenceAtoms } from '../src/application/cage/CAGEStudyToEvidenceAtoms'
./tests/cage.test.ts:12:// ── Fixture: parseCAGECSV ────────────────────────────────────────────────────
./tests/cage.test.ts:14:describe('parseCAGECSV — fixture granada (3064 registros)', () => {
./tests/cage.test.ts:15:  const result = parseCAGECSV(FIXTURE_CSV)
./tests/cage.test.ts:21:  it('CAGE_R — 2513 válidos, 551 missing estructural (~18 %)', () => {
./tests/cage.test.ts:22:    expect(result.aggregates.nValidCAGER).toBe(2513)
./tests/cage.test.ts:23:    expect(result.aggregates.missingCAGER).toBe(551)
./tests/cage.test.ts:26:  it('CAGE_R — 14 con riesgo (0.6 % sobre válidos)', () => {
./tests/cage.test.ts:31:  it('CAGE ordinal — 2513 válidos, concordantes con CAGE_R', () => {
./tests/cage.test.ts:32:    expect(result.aggregates.nValidCAGE).toBe(2513)
./tests/cage.test.ts:35:  it('CAGE ordinal — distribución coherente: nCAGE1 = nNoRisk', () => {
./tests/cage.test.ts:36:    expect(result.aggregates.nCAGE1).toBe(2499)
./tests/cage.test.ts:37:    expect(result.aggregates.nCAGE2).toBe(7)
./tests/cage.test.ts:38:    expect(result.aggregates.nCAGE3).toBe(3)
./tests/cage.test.ts:39:    expect(result.aggregates.nCAGE4).toBe(4)
./tests/cage.test.ts:42:  it('suma CAGE ordinal 2-4 coincide con nRisk', () => {
./tests/cage.test.ts:43:    const { nCAGE2, nCAGE3, nCAGE4, nRisk } = result.aggregates
./tests/cage.test.ts:44:    expect(nCAGE2 + nCAGE3 + nCAGE4).toBe(nRisk)
./tests/cage.test.ts:71:    // AUDIT-C es un instrumento diferente; no debe aparecer como parte del análisis CAGE
./tests/cage.test.ts:72:    const hasAuditCAsCAGE = result.methodologicalCautions.some(c =>
./tests/cage.test.ts:73:      c.toUpperCase().includes('AUDIT-C') && c.toUpperCase().includes('CAGE')
./tests/cage.test.ts:75:    expect(hasAuditCAsCAGE).toBe(false)
./tests/cage.test.ts:79:// ── Unidad: parseCAGECSV — casos de borde ───────────────────────────────────
./tests/cage.test.ts:81:describe('parseCAGECSV — casos de borde', () => {
./tests/cage.test.ts:83:    const result = parseCAGECSV('')
./tests/cage.test.ts:85:    expect(result.aggregates.nValidCAGER).toBe(0)
./tests/cage.test.ts:90:    const result = parseCAGECSV('CAGE_R,CAGE\n')
./tests/cage.test.ts:94:  it('sin columna CAGE_R genera warning', () => {
./tests/cage.test.ts:95:    const result = parseCAGECSV('CAGE\n1\n2\n')
./tests/cage.test.ts:97:    expect(result.aggregates.nValidCAGER).toBe(0)
./tests/cage.test.ts:101:    const csv = 'CAGE_R,CAGE\n1.0,2.0\n0.0,1.0\n'
./tests/cage.test.ts:102:    const result = parseCAGECSV(csv)
./tests/cage.test.ts:104:    expect(result.aggregates.nValidCAGER).toBe(2)
./tests/cage.test.ts:106:    expect(result.aggregates.nCAGE2).toBe(1)
./tests/cage.test.ts:107:    expect(result.aggregates.nCAGE1).toBe(1)
./tests/cage.test.ts:111:    const csv = 'CAGE_R,CAGE\n994.0,994.0\n0,1\n'
./tests/cage.test.ts:112:    const result = parseCAGECSV(csv)
./tests/cage.test.ts:114:    expect(result.aggregates.nValidCAGER).toBe(1)
./tests/cage.test.ts:115:    expect(result.aggregates.missingCAGER).toBe(1)
./tests/cage.test.ts:120:    const csv = `CAGE_R,CAGE\n${rows}\n`
./tests/cage.test.ts:121:    const result = parseCAGECSV(csv)
./tests/cage.test.ts:133:    const csv = `CAGE_R,CAGE\n${rows}\n`
./tests/cage.test.ts:134:    const result = parseCAGECSV(csv)
./tests/cage.test.ts:146:  const parsed = parseCAGECSV(FIXTURE_CSV)
./tests/cage.test.ts:147:  const study = createCAGEStudy({
./tests/cage.test.ts:156:  it('genera exactamente 3 átomos (CAGE_R + ordinal + cautela)', () => {
./tests/cage.test.ts:192:  it('confidence es "medium" (nValidCAGER >= 30)', () => {
./tests/cage.test.ts:205:  it('ningún átomo presenta AUDIT-C como sinónimo de CAGE', () => {
./tests/cage.test.ts:207:      expect(atom.content.toUpperCase()).not.toMatch(/AUDIT-C.*CAGE|CAGE.*=.*AUDIT/i)
./tests/cage.test.ts:211:  it('devuelve array vacío cuando nValidCAGER=0', () => {
./tests/cage.test.ts:212:    const emptyParsed = parseCAGECSV('')
./tests/cage.test.ts:213:    const emptyStudy = createCAGEStudy({
./tests/cage.test.ts:222:  it('omite átomo ordinal cuando nValidCAGE < 30', () => {
./tests/cage.test.ts:224:    const smallParsed = parseCAGECSV(`CAGE_R,CAGE\n${smallCsv}`)
./tests/cage.test.ts:225:    const smallStudy = createCAGEStudy({
./tests/home-complementary-studies.smoke.mjs:115:  for (const label of ["IBSE", "DUKE-EAS", "PREDIMED-EAS", "SF-12 EAS", "Sueño EAS", "CAGE-EAS"]) {
./tests/home-complementary-studies.smoke.mjs:119:  await checkStudyRow(page, "IBSE", "#ibse-csv-input");
./tests/home-complementary-studies.smoke.mjs:121:  await checkStudyRow(page, "PREDIMED-EAS", "#predimed-csv-input");
./tests/home-complementary-studies.smoke.mjs:122:  await checkStudyRow(page, "SF-12 EAS", "#sf12-csv-input");
./tests/home-complementary-studies.smoke.mjs:123:  await checkStudyRow(page, "Sueño EAS", "#sueno-csv-input");
./tests/home-complementary-studies.smoke.mjs:124:  await checkStudyRow(page, "CAGE-EAS", "#cage-csv-input");
./tests/ibse.test.ts:3:import { createIBSEStudy } from "../src/domain/ibse";
./tests/ibse.test.ts:7:function makeStudy(overrides: Partial<Parameters<typeof createIBSEStudy>[0]> = {}) {
./tests/ibse.test.ts:8:  return createIBSEStudy({
./tests/ibse.test.ts:25:describe("IBSEStudyToEvidenceAtoms — escala 0–100", () => {
./tests/load-atarfe-complete.mjs:14:  { name: "IBSE", input: "ibse-csv-input", file: "ibse-atarfe.csv", field: "ibseStudy", tag: "ibse", atoms: 6 },
./tests/load-atarfe-complete.mjs:16:  { name: "PREDIMED-EAS", input: "predimed-csv-input", file: "predimed-eas-granada.csv", field: "predimedStudy", tag: "predimed-eas", atoms: 2 },
./tests/load-atarfe-complete.mjs:17:  { name: "SF-12 EAS", input: "sf12-csv-input", file: "sf12-eas-granada.csv", field: "sf12Study", tag: "sf12-eas", atoms: 3 },
./tests/load-atarfe-complete.mjs:19:  { name: "CAGE-EAS", input: "cage-csv-input", file: "cage-eas-granada.csv", field: "cageStudy", tag: "cage-eas", atoms: 3 },
./tests/load-atarfe-complete.mjs:178:  if (ibse)  console.log(`  IBSE           n=${ibse.aggregates.nValid} válidos · media IBSE total=${ibse.aggregates.meanTotal}`);
./tests/load-atarfe-complete.mjs:180:  if (pred)  console.log(`  PREDIMED-EAS   n=${pred.aggregates.nValid} · media Predimed=${pred.aggregates.meanScore} · alta adherencia=${pred.aggregates.highPercentage}%`);
./tests/load-atarfe-complete.mjs:181:  if (sf12)  console.log(`  SF-12 EAS      n=${sf12.aggregates.nValidPCS} · PCS=${sf12.aggregates.meanPCS} · MCS=${sf12.aggregates.meanMCS}`);
./tests/load-atarfe-complete.mjs:183:  if (cage)  console.log(`  CAGE-EAS       n=${cage.aggregates.nValidCAGER} válidos CAGE_R · riesgo=${cage.aggregates.pctRisk}% (n=${cage.aggregates.nRisk}) · abstinentes=${cage.aggregates.missingCAGER}`);
./tests/methodology-registry.test.ts:10: *   - Permite estructuras parciales: los adaptadores (SAV, REDCap) son opcionales.
./tests/methodology-registry.test.ts:223:            // ascendente (PREDIMED) como descendente (DUKE-EAS).
./tests/methodology-registry.test.ts:306:      // ── Adaptador REDCap (opcional) ───────────────────────────────────────
./tests/methodology-registry.test.ts:310:        describe('adaptador REDCap', () => {
./tests/methodology-registry.test.ts:325:              expect(col.outputField.trim(), `columna REDCap con outputField vacío`).toBeTruthy()
./tests/methodology-registry.test.ts:326:              expect(col.redcapColumn.trim(), `columna REDCap con redcapColumn vacía`).toBeTruthy()
./tests/methodology-registry.test.ts:330:          it('no hay outputField duplicados en el adaptador REDCap', () => {
./tests/methodology-registry.test.ts:335:          it('no hay redcapColumn duplicadas en el adaptador REDCap', () => {
./tests/predimed.test.ts:5:import { parsePREDIMEDCSV } from '../src/application/predimed/PREDIMEDCSVParser'
./tests/predimed.test.ts:6:import { createPREDIMEDStudy } from '../src/domain/predimed'
./tests/predimed.test.ts:7:import { predimedStudyToEvidenceAtoms } from '../src/application/predimed/PREDIMEDStudyToEvidenceAtoms'
./tests/predimed.test.ts:12:// ── Fixture: parsePREDIMEDCSV ────────────────────────────────────────────────
./tests/predimed.test.ts:14:describe('parsePREDIMEDCSV — fixture granada (3064 registros)', () => {
./tests/predimed.test.ts:15:  const result = parsePREDIMEDCSV(FIXTURE_CSV)
./tests/predimed.test.ts:25:  it('puntuación media PREDIMED correcta', () => {
./tests/predimed.test.ts:38:  it('registros incompletos correctos (oleadas sin módulo PREDIMED)', () => {
./tests/predimed.test.ts:54:  const parsed = parsePREDIMEDCSV(FIXTURE_CSV)
./tests/predimed.test.ts:55:  const study = createPREDIMEDStudy({
./tests/predimed.test.ts:98:    const emptyParsed = parsePREDIMEDCSV('')
./tests/predimed.test.ts:99:    const emptyStudy = createPREDIMEDStudy({
./tests/predimed.test.ts:109:// ── Casos de borde: parsePREDIMEDCSV ─────────────────────────────────────────
./tests/predimed.test.ts:111:describe('parsePREDIMEDCSV — casos de borde', () => {
./tests/predimed.test.ts:113:    const result = parsePREDIMEDCSV('')
./tests/predimed.test.ts:125:    const result = parsePREDIMEDCSV(csv)
./tests/predimed.test.ts:132:    const result = parsePREDIMEDCSV(csv)
./tests/predimed.test.ts:139:    const result = parsePREDIMEDCSV(csv)
./tests/predimed.test.ts:145:    const result = parsePREDIMEDCSV('Predimed\n0')
./tests/predimed.test.ts:154:    const result = parsePREDIMEDCSV('Predimed\n14')
./tests/predimed.test.ts:162:    const result = parsePREDIMEDCSV('Predimed\n15')
./tests/predimed.test.ts:168:    const result = parsePREDIMEDCSV('Predimed\n-1')
./tests/predimed.test.ts:174:    const result = parsePREDIMEDCSV('Predimed\n6\n7')
./tests/predimed.test.ts:181:    const result = parsePREDIMEDCSV('Predimed\n8\n9')
./tests/predimed.test.ts:190:    const result = parsePREDIMEDCSV('Predimed\n\n8')
./tests/predimed.test.ts:198:    const result = parsePREDIMEDCSV('Predimed\n8.6')
./tests/thematic-prioritisation-traceability.test.ts:79:        system: 'Importación REDCap Priorización temática',
./VISUAL-CONTRACT.md:42:### Formularios REDCap
./VISUAL-CONTRACT.md:44:REDCap es el sistema de captura de datos habitual en los Estudios Complementarios.
./VISUAL-CONTRACT.md:181:  ("Informe de Salud", "IBSE", "Participación ciudadana"), nunca de
./VISUAL-CONTRACT.md:220:- Los paneles del Nivel 3 (EPVSA, Plan de Acción, Agenda, Seguimiento) están
./VISUAL-CONTRACT.md:231:- un borrador técnico con un Plan de Acción aprobado.
./VISUAL-CONTRACT.md:321:1. Adhesión a RELAS
./VISUAL-CONTRACT.md:323:3. Perfil de Salud Local
./VISUAL-CONTRACT.md:325:5. Plan de Acción
./VISUAL-CONTRACT.md:327:7. Plan Local de Salud
./VISUAL-CONTRACT.md:376:- **Referencias**: comparable al indicador de progreso de un expediente REDCap o al
./VISUAL-CONTRACT.md:407:**Propósito futuro**: Constructor metodológico de cuestionarios municipales.
./VISUAL-CONTRACT.md:409:Permitirá combinar, dentro de un cuestionario único:
./VISUAL-CONTRACT.md:412:- escalas psicométricas validadas (IBSE, SF-12, DUKE, PREDIMED y futuras)
./VISUAL-CONTRACT.md:418:canónicos. El cuestionario resultante puede exportarse como diccionario REDCap.
./VISUAL-CONTRACT.md:420:**Aspecto institucional previsto**: formulario REDCap — estructurado, denso, con
./VISUAL-CONTRACT.md:425:**Propósito futuro**: Generador del Perfil de Salud Local sintético.
./VISUAL-CONTRACT.md:440:EPVSA, ESCA, RELAS, Plan Estratégico de Mayores de Andalucía, En Buena Edad y otros
./VISUAL-CONTRACT.md:466:(NHS Health Profiles, REDCap); §11 Evolución LocalHealthPlanningCycle; §12 Componentes

## Scripts package.json
