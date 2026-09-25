# BADEA/IECA — Correspondencia de ámbitos territoriales COMPÁS ↔ BADEA

> Documento preliminar de auditoría, no funcional.
> Fecha de elaboración: 2026-07-07
> Contexto: preparación del siguiente paso del piloto BADEA/IECA (hueco H-16,
> `ARCHITECTURAL-GAP-REGISTER.md`), posterior al piloto controlado
> `BADEA-IECA-PILOT-ATARFE-19824.md`.
> Este documento no implementa integración alguna, no modifica el selector
> territorial de COMPÁS NG y no expone nuevos ámbitos en la interfaz.
> Marcas de evidencia: [D] verificado directamente (código, ficheros o API);
> [I] inferido, pendiente de confirmación.

---

## 1. Ficheros históricos auditados

| Fichero / ubicación | Qué aporta |
|---|---|
| `src/App.tsx` (líneas 104–125) [D] | Selector vigente: `TERRITORIAL_TYPE_OPTIONS` (municipio, mancomunidad, distrito, otro) y `DEMO_MUNICIPALITIES` (4 entradas) |
| `src/domain/municipality/MunicipalityContext.ts` [D] | Modelo de identidad territorial: `ineCode?` y `territorialType?` opcionales; sin campo de municipio padre ni de miembros |
| `_archive/App.tsx.backup_*_20260701_*` (6 copias) [D] | Todas contienen la misma lista de 4 municipios de demostración; el selector no ha tenido nunca más ámbitos precargados |
| Historial git: `be472c6` [D] | Introdujo el selector de municipio de demostración |
| Historial git: `5cf96d0` (2026-06-25) [D] | Adaptó la UI de «municipio» a «ámbito territorial»: añadió `territorialType` a los ámbitos personalizados creados por el usuario (persistidos en localStorage bajo `compas-ng:custom-municipalities`) |
| `municipalities/{alfacar,atarfe,churriana,padul,zagra}/manifest.json` [D] | Expedientes municipales normalizados; ninguno registra código INE |
| `_archive/repository-cleanup-20260630/municipal-legacy/{Alfacar,Atarfe,Churriana,Padul,R ZAGRA}` [D] | Legado documental por municipio; sin Granada capital, sin distritos, sin mancomunidades |
| `docs/methodology/TERRITORIAL-KNOWLEDGE-CATALOG.md` (2026-07-03) [D] | Ámbitos de contraste metodológico: **Granada-Zaidín, Atarfe, Churriana de la Vega, Padul, Zagra**; trata Granada-Zaidín como subdivisión urbana («municipio grande con subdivisiones internas»), no como municipio |
| `municipalities/zagra/sources/IECA_export (2).xls` [D] | Prueba de consumo manual previo de datos IECA/SIMA por el equipo |

**No existe en el repositorio** (histórico ni vigente) [D]: catálogo de distritos,
catálogo de mancomunidades, relación distrito → municipio, relación
mancomunidad → municipios, ni tabla de códigos INE.

---

## 2. Estructura territorial recuperada

### 2.1 Ámbitos precargados (selector de demostración)

| id | Nombre | Provincia | INE en selector | Estado del código |
|---|---|---|---|---|
| `atarfe` | Atarfe | Granada | 18022 | **Correcto** [D] |
| `alfacar` | Alfacar | Granada | 18009 | **Erróneo** [D]: 18009 = Alcudia de Guadix; el INE real de Alfacar es **18011** |
| `churriana` | Churriana de la Vega | Granada | 18052 | **Erróneo** [D]: 18052 = Cónchar; el INE real es **18062** |
| `zagra` | Zagra | Granada | — (ausente) | INE real: **18913** [D] |

### 2.2 Ámbitos con expediente documental pero fuera del selector

| Expediente | Nombre | INE real | Observación |
|---|---|---|---|
| `municipalities/padul/` | Padul | **18150** [D] | Con dossier normalizado y legado; no figura en `DEMO_MUNICIPALITIES` |

### 2.3 Ámbitos no municipales

- **Distritos**: el selector admite `territorialType: "distrito"` solo para ámbitos
  personalizados creados a mano (texto libre, sin municipio padre estructurado,
  sin INE). Granada-Zaidín aparece únicamente como ámbito de contraste
  metodológico en `TERRITORIAL-KNOWLEDGE-CATALOG.md`; no existe como expediente
  ni como entrada del selector. [D]
- **Mancomunidades**: el tipo existe en el selector desde `5cf96d0`, pero no hay
  ninguna instancia, catálogo ni relación de miembros en todo el repositorio. [D]
- **Granada capital**: no está en el selector, ni en los expedientes, ni en el
  legado. [D]

### 2.4 Modelo de datos disponible

`MunicipalityIdentity` ofrece `ineCode?: string` y `territorialType?: string`,
ambos opcionales y sin validación. **No existe** campo de municipio padre
(necesario para distritos) ni de municipios miembros (necesario para
mancomunidades). [D]

---

## 3. Verificación empírica del lado BADEA (2026-07-07)

Fuente: API REST pública de BADEA, jerarquía de Territorio
(`…/rest/v1.0/jerarquia/425?consultaId=19824&alias=D_TERRITORIO_0`) y consulta
19824 filtrada por municipio (`?D_TERRITORIO_0={id interno}`).

### 3.1 Niveles territoriales de BADEA [D]

La jerarquía de Territorio tiene exactamente tres niveles:
`CCAA / Continentes` (578) → `Provincias / Agreg. países` (579) →
`Municipios / Países` (580). **No existen niveles inframunicipales (distritos,
barrios) ni supramunicipales intermedios (mancomunidades, comarcas)** en esta
jerarquía. La búsqueda de nodos «Zaid*» devuelve cero resultados.

### 3.2 Identificadores verificados [D]

| Ámbito | Código INE (BADEA) | Id interno BADEA | Prueba empírica |
|---|---|---|---|
| Granada (capital) | **18087** | 2574 | Consulta 19824 filtrada responde: «Ciudades», 96,6 % centros urbanos (2024) |
| Atarfe | 18022 | 2505 | Verificado en piloto previo: «Zona de densidad intermedia», 94,3 % agrupaciones urbanas |
| Alfacar | 18011 | 2494 | Nodo localizado en jerarquía; consulta no ejecutada |
| Churriana de la Vega | 18062 | 2547 | Consulta 19824 filtrada responde: «Ciudades», 100 % centros urbanos (2024) |
| Padul | 18150 | 2639 | Nodo localizado en jerarquía; consulta no ejecutada |
| Zagra | 18913 | 2708 | Nodo localizado en jerarquía; consulta no ejecutada |

Notas operativas [D]: el filtrado se hace por **id interno BADEA**, no por código
INE; el código INE aparece en los datos devueltos (`dim_Territorio`). Existe un
nodo residual `18NC — Municipio de Granada sin especificar`. La granularidad
municipal **no es universal**: la consulta 6661 (población por edad y sexo)
expone la jerarquía municipal pero solo contiene datos provinciales (filtrada
por municipio devuelve cero filas); cada consulta debe verificarse antes de
asumir disponibilidad municipal.

---

## 4. Tabla de correspondencia canónica propuesta

| compasScopeId | scopeType | displayName | province | parentMunicipalityName | ineCode | historicalSourceFile | badeaEligible | badeaMode | badeaNotes |
|---|---|---|---|---|---|---|---|---|---|
| `atarfe` | municipality | Atarfe | Granada | — | 18022 [D] | `src/App.tsx`; `municipalities/atarfe/manifest.json` | true | **direct** | Verificado empíricamente (piloto 19824). Id interno BADEA 2505 |
| `alfacar` | municipality | Alfacar | Granada | — | **18011** [D] (selector: 18009 erróneo) | `src/App.tsx`; `municipalities/alfacar/manifest.json` | true | **direct** | Condicionado a corrección del INE en el selector; id interno 2494 |
| `churriana` | municipality | Churriana de la Vega | Granada | — | **18062** [D] (selector: 18052 erróneo) | `src/App.tsx`; `municipalities/churriana/manifest.json` | true | **direct** | Verificado empíricamente con el código correcto; id interno 2547 |
| `zagra` | municipality | Zagra | Granada | — | **18913** [D] (ausente en selector) | `src/App.tsx`; `municipalities/zagra/manifest.json` | true | **direct** | Completar INE antes de consultar; id interno 2708. Municipio <600 hab.: cobertura de datos municipal esperablemente escasa [I] |
| `padul` | municipality | Padul | Granada | — | **18150** [D] (sin entrada en selector) | `municipalities/padul/manifest.json`; catálogo territorial | true | **direct** | Con expediente pero fuera del selector; no exponer en UI sin decisión del responsable; id interno 2639 |
| `granada-capital` | capital | Granada (capital) | Granada | — | **18087** [D] | Ninguno (no dado de alta en COMPÁS) | true | **direct** | **BADEA directo confirmado empíricamente.** Su alta en COMPÁS requiere decisión del responsable; id interno 2574 |
| `granada-zaidin` | district | Granada-Zaidín | Granada | Granada (capital) | — (sin INE propio; el padre es 18087) | `docs/methodology/TERRITORIAL-KNOWLEDGE-CATALOG.md` | false | **parent-municipality** | BADEA no tiene ámbito de distrito [D]. Todo dato BADEA asociado a este ámbito es **contexto municipal de referencia (Granada capital), nunca dato específico del distrito**, y debe etiquetarse así |
| *(sin instancias)* | mancomunidad | — | — | — (miembros sin definir) | — | Tipo en `src/App.tsx` (commit `5cf96d0`); sin catálogo | false | **aggregate** (propuesto, no implementar) | BADEA no tiene ámbito de mancomunidad [D]. Solo sería viable agregando municipios miembros, y únicamente para medidas aditivas (recuentos), no para porcentajes ni categorías [I]. Requiere catálogo previo de miembros con INE |
| *(genérico)* | other | «Otro ámbito» del selector | — | — | — | `src/App.tsx` | false | **unknown** | Sin semántica territorial definida; evaluar caso a caso |

Regla de decisión aplicada (conforme a la regla metodológica del encargo):
`direct` solo con nodo municipal BADEA verificado; `parent-municipality` para
subdivisiones de un municipio existente; `aggregate` solo como propuesta
condicionada a catálogo de miembros y a naturaleza aditiva de la medida;
`unavailable`/`unknown` en el resto. **Ningún ámbito se marca `direct` sin
prueba empírica o nodo localizado en la jerarquía.**

---

## 5. Dictámenes específicos

### 5.1 Granada capital

No está incluida en el selector histórico ni vigente como municipio, ni tiene
expediente. En BADEA existe como municipio ordinario (`18087 — Granada
(capital)`, id interno 2574) y **responde a consultas filtradas: BADEA
directo** [D]. Si el responsable decide darla de alta en COMPÁS, debe
registrarse como municipio (o como `capital`, si se desea distinguirla) con INE
18087; ninguna adaptación de BADEA es necesaria.

### 5.2 Distritos de Granada (caso Granada-Zaidín)

El repositorio histórico nunca los representó como municipios: Granada-Zaidín
solo existe como ámbito de contraste metodológico del catálogo territorial, que
lo describe expresamente como subdivisión interna de un municipio grande. El
selector solo permitiría crearlo como ámbito personalizado
(`territorialType: "distrito"`), sin municipio padre estructurado. En BADEA no
existe ningún nodo inframunicipal [D]. Dictamen: **no tratar los distritos como
municipios BADEA**; su único uso legítimo de BADEA es el **contexto municipal
de referencia del municipio padre (Granada capital, 18087)**, etiquetado como
tal y nunca presentado como dato específico del distrito. El modelo de datos
carece hoy del campo «municipio padre»; añadirlo sería una revisión de
`MunicipalityContext` que **no se propone implementar ahora**.

### 5.3 Mancomunidades

No existe ninguna mancomunidad instanciada en el repositorio: solo el tipo en el
selector. En BADEA no hay ámbito equivalente [D]. Dictamen: **no consultar BADEA
como mancomunidad en ningún caso**. Si en el futuro se da de alta una
mancomunidad, la única vía sería el modo `aggregate` a partir de sus municipios
miembros (requiere: catálogo de miembros con INE verificado; restricción a
medidas aditivas; cautela metodológica explícita en cada agregado). Se propone
como modo, **no se implementa**.

---

## 6. Datos que faltan para completar el mapeo

1. **Tabla manual de códigos INE: necesaria.** Dos de los tres códigos del
   selector vigente son erróneos (18009 y 18052 corresponden a Alcudia de
   Guadix y Cónchar) y Zagra carece de código. El selector no puede usarse como
   fuente de códigos para BADEA en su estado actual.
2. Correspondencia INE ↔ id interno BADEA por consulta (el id interno es el
   parámetro de filtrado; este documento la aporta para los seis ámbitos
   municipales de interés).
3. Decisión sobre el alta de Granada capital y de Padul en el selector
   (corresponde al responsable; no se ha tocado).
4. Campo «municipio padre» en el modelo territorial, si se decide operar con
   distritos (revisión futura de `MunicipalityContext`; no propuesta ahora).
5. Catálogo de mancomunidades con miembros, solo si el modo `aggregate` llega a
   autorizarse.
6. Verificación consulta a consulta de la granularidad municipal (precedente:
   consulta 6661, provincial pese a exponer jerarquía municipal).

---

## 7. Confirmaciones de alcance

- No se ha tocado código funcional: solo lectura de `src/` y creación de este
  documento.
- No se ha modificado el selector territorial ni `DEMO_MUNICIPALITIES`.
- No se ha implementado integración masiva de BADEA ni modo `aggregate`.
- No se han expuesto nuevos municipios en la interfaz.
- Perfil, Informe de Salud, D-HR-01, MIT/OIT/Reconciliación y pipeline de
  evidencia: solo lectura.
- Sin commit.
