## Resumen

- Añade `LocalHealthPlanCompiler` (H-06): compilador del PLS con gates G-PLS-1..G-PLS-7.
- Persiste `PLS` compilados en `workspace.compiledPlans`.
- Añade validaciones y advertencias en `CompilationManifest`.
- Tests automáticos para `LocalHealthPlanCompiler`.

## Checklist

- [ ] Revisión de código
- [ ] Ejecutar `npm test`
- [ ] Ejecutar `npm run build`
- [ ] Aprobar gates contractuales (CONTRACT-LOCAL-HEALTH-PLAN-COMPILER)

## Notas para revisión

- Cambios principales en `src/application/local-health-plan-compiler/LocalHealthPlanCompiler.ts`.
- Integración en runtime en `src/application/runtime/MunicipalityRuntime.ts`.
- Tests en `tests/local-health-plan-compiler.test.ts`.
