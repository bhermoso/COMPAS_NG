# COMPÁS NG

COMPÁS NG es un prototipo metodológico y técnico para apoyar la elaboración de
Planes Locales de Salud municipales o inframunicipales. Integra repositorio
documental, expediente territorial en navegador, Perfil de Salud Local, lectura
estratégica y preparación del Plan de Acción.

## Estado actual

Referencia de esta rama: 13 de septiembre de 2026.

- La aplicación principal es React + TypeScript + Vite y funciona como
  expediente local en navegador.
- El ámbito Granada-Zaidín dispone de un seed público observado con Informe de
  Salud, marcos estratégicos, documentación territorial y activos Localiza Salud.
- El Perfil de Salud Local se genera de forma trazable y prudente: interpreta
  señales documentales, determinantes plausibles y activos, pero mantiene
  validación humana obligatoria.
- El Motor de Traducción Estratégica (MTE) v1 está implementado y documentado.
- El Plan de Acción permite edición directa: al elegir `Modificar`, la nueva
  redacción queda guardada inmediatamente en el expediente del ámbito.
- La compilación completa del Plan Local de Salud y el sistema de evaluación
  siguen siendo líneas pendientes.
- El acceso autenticado para responsables territoriales queda fuera del flujo
  visible principal hasta una decisión posterior.

La foto de producto viva está en
[`docs/ESTADO-ACTUAL-COMPAS-NG.md`](docs/ESTADO-ACTUAL-COMPAS-NG.md).

## Cómo ejecutar

```bash
npm install
npm run dev
```

El servidor local de Vite sirve la aplicación en el puerto configurado por el
proyecto.

## Comprobaciones útiles

```bash
npm run build
npm run lint
npm test
npx vitest run tests/plan-preparation.test.tsx tests/pa-relas-02-ui.test.ts tests/definitive-action-plan-preview.test.tsx tests/active-municipality.test.ts
```

El `npm test` ordinario excluye suites que requieren condiciones especiales:

- `npm run test:relas`: Firebase Auth/Firestore con emuladores.
- `npm run test:reconstruction`: reconstrucción con DOCX privados no incluidos
  en el repositorio público.
- `npm run test:profile-fixture`: suite metodológica histórica sobre el fixture
  sintético Granada-Zaidín 56/92, pendiente de realinear con Perfil 2.0.

## Estructura

- `src/domain`: tipos canónicos del expediente, evidencias, perfil, plan y
  planificación.
- `src/application`: motores, compiladores y servicios puros.
- `src/ui/components`: paneles de la aplicación.
- `public/seeds`: expedientes iniciales distribuidos con la app.
- `municipalities`: exports municipales y artefactos reproducibles.
- `docs/contracts`: contratos metodológicos y técnicos vigentes o legacy.
- `docs/architecture`: arquitectura, huecos y decisiones abiertas.
- `tests`: pruebas unitarias, de integración y smokes.

## Principio de uso

COMPÁS NG propone, estructura y hace trazable el trabajo técnico. No sustituye la
validación profesional ni acredita por sí solo una decisión institucional.
