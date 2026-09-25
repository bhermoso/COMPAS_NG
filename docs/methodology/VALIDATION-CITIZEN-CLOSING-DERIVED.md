# VALIDACIÓN — Cierre en registro ciudadano como representación derivada del Perfil canónico

> Nota de validación científica y metodológica exigida por los **Fundamentos del
> Perfil único** (`CONTRACT-INDEX` §«Fundamentos del Perfil único», 2026-07-17,
> punto 1) para que una capacidad sobreviva **como representación derivada dentro
> del Perfil de Salud Local**.
>
> Estado: **PROPUESTA** — variante (A), transformación fiel de registro.
> Requiere aprobación institucional antes de cualquier diseño o implementación.
> Fecha: 2026-07-19.

---

## 0. Objeto y encuadre doctrinal

Esta nota define y valida un **cierre en registro ciudadano** como **representación
derivada** de la lectura del Perfil de Salud Local canónico, destinada a la
audiencia política y ciudadana (corporación municipal, ciudadanía, medios).

Encuadre (no reabre doctrina):
- **No** es un producto autónomo ni una segunda fuente de verdad
  (`CONTRACT-NHS-HEALTH-PROFILE` §0).
- **No** reabre los Fundamentos del Perfil único: se acoge al cauce que estos ya
  prevén — capacidades que «solo podrán sobrevivir como representaciones derivadas
  dentro del Perfil canónico, previa validación científica y metodológica»
  (Fundamento #1).
- El origen de esta nota es una propuesta externa («render de humanClosing en el
  NHS») que **contradecía** el contrato NHS (§10.3, §11: prohíbe conclusiones y el
  consumo del Cap. VI) y el §0. Redirigida a la única vía doctrinalmente sostenible.

## 1. Qué es (y qué no es)

**ES:** una reexpresión en **lenguaje llano** del **mismo contenido** del cierre de
la lectura canónica (cierre interpretativo humano + frontera institucional, en su
significado), **subordinada y trazable** a él.

**NO ES:**
- un cierre re-autorado con contenido nuevo (variante B, descartada);
- una interpretación de indicadores;
- recomendaciones o prescripción de cualquier tipo;
- un documento, artefacto, ruta o producto separado;
- una segunda voz que pueda divergir del canon.

## 2. El gate del Fundamento #1 — validación

### 2.1 «Añade comprensión real»
Amplía **quién** puede entender la conclusión del Perfil sin exigir alfabetización
técnica. No añade conocimiento nuevo: añade **accesibilidad** al conocimiento
existente. Hacer legible la conclusión del diagnóstico para su audiencia política
es una función institucional real del Perfil, hoy no cubierta por la lectura
técnica.

### 2.2 Equivalencia semántica (Fundamento #3)
Conserva **significado, estatuto epistemológico, fuentes, escalas, cautelas y la
frontera** (el Perfil concluye, no recomienda). Solo cambia el **registro** (léxico,
longitud, tecnicismos), igual que un renderer distinto para otro medio. No
introduce ninguna afirmación ausente en el cierre canónico.

### 2.3 No segunda fuente de verdad (Fundamento #1 / §0 NHS)
- **Subordinación estricta:** su única fuente es el cierre de la lectura canónica;
  no puede afirmar nada que aquel no afirme.
- **Trazabilidad:** se marca explícitamente como «representación derivada del Perfil
  de Salud Local», con referencia al cierre canónico del que deriva.
- **No divergencia:** si el cierre canónico cambia, el ciudadano se **re-deriva**;
  nunca persiste una versión que lo contradiga.

### 2.4 Coherencia con la cadena (Art. 16 bis) y la autoría acotada (Art. 16)
- **Concluye, no recomienda:** misma frontera con el Plan de Acción, en llano.
- **No es autoría nueva** sobre el diagnóstico: es adaptación de registro de una
  autoría ya existente (el cierre). La autoría humana del diagnóstico sigue
  viviendo, íntegra, en el cierre canónico.

## 3. Condiciones de validez (guardrails que el diseño DEBE garantizar)

| ID | Condición |
|----|-----------|
| V1 | **Fuente única** = cierre de la lectura canónica (`humanClosing` + `institutionalBoundary`). Ninguna otra entrada. |
| V2 | **Sin afirmaciones nuevas:** ninguna proposición ausente en la fuente. (Debe ser verificable, no confiado a la buena fe.) |
| V3 | **Sin recomendaciones** ni prescripción. |
| V4 | **Marcado** como representación derivada, subordinada y trazable al canon. |
| V5 | **Re-derivación** ante cambio del cierre canónico; no persiste versión divergente. |
| V6 | **Un solo Perfil:** no crea artefacto, ruta ni producto propio; vive DENTRO de las salidas del Perfil canónico. |

## 4. Cuestión abierta para el diseño (no se decide aquí)

**Mecanismo de producción** de la transformación de registro:
- (a) **edición de registro humana** (capa de enriquecimiento): fiel por autoría;
  exige control explícito de V2 (no afirmaciones nuevas);
- (b) **derivación automática** (clase «síntesis automática derivada», reconocida en
  Fundamento #4): fiel por construcción si es puramente de registro; debe marcarse
  como síntesis automática.

Esta nota **no** decide el mecanismo; lo deja al incremento de diseño, condicionado
a V1–V6.

## 5. Veredicto

La variante **(A) transformación fiel de registro supera el gate** del Fundamento #1
**si y solo si** el diseño garantiza V1–V6: es una adaptación de registro por
audiencia de contenido ya validado, no conocimiento nuevo ni segunda voz.

La variante (B) —re-autoría libre ciudadana— **no se valida**: rompe la equivalencia
semántica (Fundamento #3) y arriesga constituir segunda fuente de verdad
(Fundamento #1 / §0), reintroduciendo lo que la doctrina cerró.

## 6. Qué autoriza esta nota (y qué no)

- **Autoriza** pasar al **diseño** de la representación derivada bajo V1–V6.
- **No autoriza** implementación por sí sola: el diseño (elemento en el contrato
  canónico + modelo + render + tests) es un incremento posterior, con su propia
  autorización de alcance y su propia validación de que V1–V6 quedan garantizadas de
  forma verificable.

## 7. Trazabilidad doctrinal

- `CONTRACT-INDEX` §«Fundamentos del Perfil único» (2026-07-17), puntos 1, 3, 4.
- `CONTRACT-NHS-HEALTH-PROFILE` §0 (estatuto revisado) y §10.3 / §11 (prohibiciones).
- `CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY` v1.1 (cadena Art. 16 bis; autoría Art. 16;
  modelo canónico único Art. 17 bis).
