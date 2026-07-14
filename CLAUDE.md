# COMPÁS NG — Reglas permanentes de trabajo

## Verdad del proyecto
La única verdad es: el código, el historial Git, los contratos en docs/contracts/ y las validaciones ejecutables. Nunca uses conversaciones anteriores como verdad. Antes de cualquier tarea, reconstruye el estado: git status --short, git log --oneline -10, git rev-parse HEAD.

## Objetivo del producto
Producto prioritario: el Perfil de Salud Local — documento científico, editorial e institucional de referencia. Toda decisión se justifica contra una pregunta: ¿acerca esto al Perfil a su forma definitiva? Si la respuesta no es claramente afirmativa, detente y explica por qué antes de tocar código.

## Doctrina vigente (commit 298f195, no reabrir)
- Contrato rector: docs/contracts/CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY.md v1.1
- Regla N+1 (Art. 7 bis A / I-LHPM-7): Informe solo no es Perfil. Perfil = Informe + al menos una de: estudios complementarios, activos, priorización ciudadana.
- Modelo canónico único (Art. 17 bis / I-LHPM-8): pantalla, visor, DOCX, PDF e impresión son el mismo documento. Ninguna representación puede divergir.
- Cadena (Art. 16 bis / I-LHPM-9): evidencia, lectura integrada, conclusiones, frontera, recomendaciones (Plan de Acción). El Perfil concluye, no recomienda.
- Autoría acotada (Art. 16): el cuerpo diagnóstico es compilado y trazable, no editable a mano. La autoría humana vive en el cierre interpretativo y el enriquecimiento.
- El NHS es representación derivada del conocimiento del Perfil, con estatuto de producto propio por audiencia. No puede ser segunda fuente de verdad.

## Disciplina de ejecución
- NO hacer push jamás. Commit solo cuando se pida explícitamente.
- Cambios quirúrgicos: solo lo pedido. Si algo exige tocar lo no autorizado, parar y preguntar.
- Suite: npm.cmd run test (2217+ tests). Si falla con EPERM en node_modules/.vite-temp, hay un Vite vivo en el puerto 5173: matarlo y reintentar.
- npm run lint tiene 13 errores preexistentes: no tocarlos.
- Que compile y pase tests NO demuestra que mejore el producto. Verificar también coherencia editorial, narrativa y experiencia de lectura.
- En cada informe, separar: hechos observados / inferencias / decisiones institucionales / hipótesis. "No verificado" es respuesta válida.

## Municipios de prueba
- Zagra: Informe + priorización ciudadana (evidencia participativa, 0 átomos)
- Atarfe: Informe + IBSE con datos reales
- Granada-Zaidín: Informe + 13 estudios sintéticos + 56 activos. Caso de referencia de la lectura canónica: no debe cambiar sin justificación.

## Referencias externas (solo consulta, nunca copiar)
- Desktop/COMPAS_REPO_DEPURADO_20260409: repo histórico, la mina.
- Desktop/COMPAS_NG_DEV: línea paralela con rama feature/PSL-02-export-docx-pdf.
