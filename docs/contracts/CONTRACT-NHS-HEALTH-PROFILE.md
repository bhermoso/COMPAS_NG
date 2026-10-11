# CONTRACT-NHS-HEALTH-PROFILE

> Contrato de la representación pública tipo OHID/Fingertips del Perfil de Salud Local.
> Versión 2.0 — 2026-10-11
> Estado: VIGENTE

---

## 0. Estatuto

La salida tipo Local Health Profiles no es una ficha, no es un producto autónomo y no es
una segunda fuente de verdad. Es una **representación pública de alta densidad** del
Perfil de Salud Local canónico.

Su función es permitir que una persona no especializada vea, en pocos minutos, qué
se sabe del territorio, qué se puede comparar, qué desigualdades o determinantes
son visibles y qué falta para interpretar mejor. No sustituye el Perfil completo:
lo hace legible para alcaldía, corporación municipal, Grupo Motor y ciudadanía.

Quedan derogados los restos normativos que hablaban de:

- `Producto 4`;
- `NHSHealthProfileCompiler`;
- `NHSHealthProfileArtifact`;
- `workspace.nhsArtifact`;
- "ficha" como denominación canónica;
- generación de un perfil paralelo al PSL-C.

La única ruta vigente es:

```text
Perfil canónico sellado
  -> proyección pública tipo OHID/Fingertips
  -> render en pantalla / impresión / exportación derivada
```

---

## 1. Referente oficial consultado

El referente no debe citarse de memoria. La lectura vigente se basa en fuentes
oficiales de GOV.UK, UKHSA/OHID y Fingertips:

- Los Local Authority Health Profiles se definen como una instantánea de salud y
  bienestar de cada autoridad local, con gráficos y texto, pensada como punto de
  conversación para detectar problemas y prioridades locales.
- La guía UKHSA sobre interpretación de los perfiles 2018 describe una secuencia
  clara: resumen narrativo, población, privación, desigualdades en esperanza de
  vida, tendencias de mortalidad prematura y spine chart de indicadores.
- El Local Health tool de OHID/Fingertips presenta indicadores de población,
  determinantes amplios y resultados de salud para áreas pequeñas, con el fin de
  hacer visibles desigualdades ocultas.
- La actualización OHID de septiembre de 2026 confirma que Local health incorpora
  población y demografía, edad, sexo, privación, resultados de salud, vivienda y
  entorno.
- La documentación de 2019 muestra que los perfiles se simplificaron hacia resumen
  textual e indicadores tipo "at a glance", actualizables conforme se actualizan
  las fuentes.

Fuentes consultadas:

- GOV.UK, `Local Authority Health Profiles: 2019`.
- UKHSA, `Local Authority Health Profiles 2018 update: How to interpret the report for your area`.
- GOV.UK/OHID, `Local health: public health data for small areas`.
- GOV.UK/OHID, `Local health: September 2026 update`.
- Fingertips, `Local Authority Health Profiles`.
- `Summary of changes to the Local Authority Health Profiles 2019`.

---

## 2. Principio transferible a COMPAS

El modelo transferible no es el diseño gráfico literal del NHS ni una tabla plana.
Es una forma de lectura pública:

1. **Resumen narrativo inicial.** El perfil abre con una lectura breve del territorio,
   no con un tablero ni con un índice.
2. **Contexto demográfico.** Edad, envejecimiento, infancia, dependencia y estructura
   territorial condicionan la interpretación sanitaria.
3. **Privación y desigualdad.** El perfil debe mostrar cómo se distribuye la
   vulnerabilidad dentro del territorio cuando haya fuente disponible; si no la hay,
   declara esa ausencia.
4. **Determinantes amplios.** Vivienda, empleo, educación, entorno, aislamiento,
   movilidad, estructura social y condiciones materiales no son notas laterales:
   son parte del núcleo interpretativo.
5. **Resultados de salud.** Mortalidad, morbilidad, salud percibida y conductas se
   leen como señales, no como lista de patologías.
6. **Comparación visual.** Cuando haya comparadores válidos, el perfil sitúa el valor
   territorial frente a referentes; cuando no los haya, no fabrica inferencia.
7. **Cautela visible.** La escala, el periodo, la fuente y el carácter proxy deben
   aparecer junto al dato que condicionan.
8. **Conversación pública.** El documento no decide prioridades ni prescribe
   actuaciones. Sirve para que la deliberación empiece mejor informada.

---

## 3. Estructura mínima

La representación pública tipo OHID/Fingertips de COMPAS debe organizarse en siete
bloques. Puede haber bloques sin datos completos, pero no deben desaparecer si su
ausencia es interpretativamente relevante.

### 3.1 Cabecera ejecutiva

Debe contener:

- municipio o ámbito;
- provincia;
- ciclo del Plan Local de Salud;
- fecha o versión del Perfil canónico;
- fuentes principales;
- estado de lectura: local, proxy o mixto.

La cabecera no debe decir que el perfil "no sabe nada" salvo que literalmente no
exista fuente. Si hay documentación, el perfil debe extraer de ella lectura
territorial prudente.

### 3.2 Lectura inicial

Debe ofrecer 3 a 5 frases de síntesis, con esta lógica:

- qué rasgo territorial organiza la lectura;
- qué determinantes o desigualdades aparecen o son plausibles;
- qué activos o capacidades existen;
- qué no se puede afirmar con los datos disponibles.

Esta lectura no es un resumen automático de huecos. Es el equivalente COMPAS del
resumen narrativo de los Local Authority Health Profiles.

### 3.3 Población y estructura territorial

Debe cubrir, cuando exista información:

- tamaño poblacional;
- envejecimiento;
- infancia/adolescencia;
- dispersión, barriadas, entidad inframunicipal o zona de transformación;
- tipo de ámbito: municipio, distrito, barrio, zona básica o proxy.

### 3.4 Determinantes y desigualdades

Debe cubrir, cuando exista información:

- privación territorial;
- barrios vulnerables, ERACIS, PLIZD u otros reconocimientos oficiales;
- vivienda y entorno;
- empleo, renta, educación u otros determinantes disponibles;
- acceso a recursos y movilidad;
- indicios de desigualdad por edad, sexo, territorio o posición social.

Si no hay dato directo, el perfil puede formular hipótesis epidemiológico-sociales
plausibles, pero debe decir que son hipótesis y no resultados medidos.

### 3.5 Indicadores de salud y bienestar

Debe agrupar indicadores por dominios comprensibles:

- salud general y esperanza de vida;
- enfermedad, mortalidad o morbilidad relevante;
- bienestar emocional y salud mental;
- estilos de vida y conductas;
- infancia, adolescencia y envejecimiento;
- salud percibida y apoyo social.

No se presenta una patología como prioridad solo por ser frecuente. Debe conectarse,
si es posible, con edad, determinantes sociales, estilos de vida, herencia, acceso
a servicios, entorno o desigualdades. Si el dato no permite jerarquizar factores,
no se jerarquizan.

### 3.6 Activos y capacidades

Debe mostrar:

- activos Localiza Salud;
- tejido comunitario;
- servicios y equipamientos;
- programas activos;
- documentos estratégicos supralocales aplicables;
- límites de cobertura o accesibilidad de los activos.

Los activos concretos de otro municipio no pueden aparecer como documentación
adicional reutilizable. Solo son reutilizables los marcos supralocales que no
pertenecen a un expediente municipal concreto.

### 3.7 Alcance de lectura

Debe cerrar con:

- qué fuentes sostienen la lectura;
- qué fuentes faltan;
- qué valores son proxy;
- qué comparaciones no son posibles;
- qué información convendría producir antes de planificar.

---

## 4. Reglas visuales

La salida no debe parecer una tabla administrativa. Debe ser sintética, pública y
visualmente elocuente.

Componentes mínimos:

- cabecera con identidad territorial;
- tarjetas métricas solo para cifras clave;
- banda comparativa tipo spine cuando haya valores numéricos comparables;
- mapa o sustituto territorial cuando exista fuente espacial;
- bloque de desigualdad visible;
- bloque de activos con el mismo rango visual que los déficits;
- notas de cautela integradas en la fila o tarjeta afectada.

Prohibido:

- tablas planas como salida principal;
- mensajes genéricos de "pendiente" cuando existe documentación analizable;
- ranking automático sin dirección epidemiológica explícita;
- colores de semáforo que sugieran "bueno/malo" sin significación o comparador
  validado;
- esconder los determinantes bajo una sección secundaria;
- llamar "ficha" a esta salida en interfaz o documentación vigente.

---

## 5. Reglas de lenguaje

El lenguaje debe ser natural, preciso y público. No debe sonar a plantilla ni a
relleno técnico.

Reglas:

- No usar "insumo" en textos visibles.
- No usar "no hay evidencia" cuando sí hay documentación territorial no atomizada.
- No confundir ausencia de medición con ausencia de problema.
- No describir qué hace un cierre interpretativo: cerrar interpretativamente.
- No convertir la prudencia metodológica en pobreza narrativa.
- No usar lugares comunes, muletillas ni fórmulas de consultoría.

La forma correcta es:

```text
La documentación disponible no permite atribuir el peso principal a un factor, pero
sí sitúa la diabetes en una constelación de edad, estilos de vida, condiciones
materiales y acceso a prácticas preventivas que debe leerse con el Grupo Motor.
```

La forma incorrecta es:

```text
No hay datos suficientes para sacar conclusiones. Se recomienda ampliar la evidencia.
```

---

## 6. Criterios de aceptación

Una salida tipo OHID/Fingertips de COMPAS es aceptable si cumple todo lo siguiente:

| Criterio | Verificación |
|---|---|
| Singularidad | Un lector reconoce el territorio; no podría cambiarse el municipio sin notar incoherencias. |
| Densidad pública | En una lectura breve se captan población, determinantes, desigualdad, salud y activos. |
| Comparación honesta | Los comparadores aparecen solo cuando existen y con escala/fuente visible. |
| Determinantes visibles | La lectura no se reduce a patología o mortalidad. |
| Activos visibles | Los activos tienen rango equivalente a déficits y riesgos. |
| Incertidumbre situada | La cautela aparece donde condiciona el dato. |
| No decisión | No prioriza, no vota, no prescribe acciones. |
| No segunda verdad | Todo deriva del Perfil canónico y sus fuentes acumuladas. |
| Estilo COMPAS | Preciso, natural, interpretativo, sin tópicos ni automatismos. |

---

## 7. Implementación vigente

La implementación actual se mantiene como proyección desde el documento canónico:

- `src/application/health-profile/nhsDerivedProjection.ts`
- `src/ui/components/NHSHealthProfileView.tsx`

La siguiente evolución debe reforzar esa proyección con:

1. lectura inicial territorial;
2. bloque explícito de población y estructura;
3. bloque explícito de determinantes/desigualdades;
4. bloque de activos/capacidades;
5. mejores notas de fuente y escala;
6. exportación PDF coherente con la misma representación.

No se autoriza restaurar compiladores ni artefactos NHS autónomos.

---

## 8. Relaciones contractuales

| Contrato | Relación |
|---|---|
| `CONTRACT-LOCAL-HEALTH-PROFILE-METHODOLOGY` | Define el Perfil canónico del que deriva esta salida. |
| `CONTRACT-SOURCE-CAPABILITY-MATRIX` | Define qué fuentes pueden alimentar indicadores, determinantes, activos y cautelas. |
| `CONTRACT-NAVIGATION` | Impide restaurar una navegación separada como Producto 4. |
| `VISUAL-CONTRACT` | Condiciona densidad, estilo, jerarquía visual y consistencia gráfica. |

---

## Registro de revisiones

| Fecha | Versión | Cambio | Responsable |
|---|---|---|---|
| 2026-06-30 | 1.0 | Contrato histórico del PSL-NHS como Producto 4 | COMPAS NG |
| 2026-10-11 | 2.0 | Reescritura tras benchmark oficial OHID/Fingertips: deja de ser ficha/producto, pasa a representación pública de alta densidad dentro del Perfil canónico | COMPAS NG |
