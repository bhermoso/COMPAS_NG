# COMPÁS NG — Plantilla Canónica de Contratos de Productos Institucionales

> Plantilla raíz para todos los contratos de productos institucionales del Sprint 2.
> Todos los contratos derivados deben seguir esta estructura sin excepción.
>
> Esta plantilla NO describe implementaciones, interfaces ni clases.
> Describe la naturaleza metodológica e institucional de cada producto.
>
> Sistema de fuentes:
> [D] = Demostrado en fuentes auditadas · [I] = Inferido razonablemente
> Ninguna afirmación sin marca de evidencia es válida en un contrato derivado.
>
> Documentos de referencia obligatorios para usar esta plantilla:
> - `docs/methodology/INSTRUMENT-TAXONOMY.md` (§3 naturaleza)
> - `docs/methodology/DOMAIN-METAMODEL.md` (§9 relaciones)
> - `docs/methodology/MODEL-OF-INSTITUTIONAL-ARTICULATION.md` (§4 papel institucional)
> - `docs/methodology/METHODOLOGICAL-FOUNDATIONS-LOCAL-HEALTH-PLANNING.md` (§11 invariantes)
>
> Versión: 1.0 — Sprint 2 — 2026-06-28

---

## Instrucciones de uso

Para crear un nuevo contrato derivado de esta plantilla:

1. Copiar este archivo con el nombre `CONTRACT-[NOMBRE-DEL-PRODUCTO].md`.
2. Eliminar este bloque de instrucciones.
3. Completar cada sección siguiendo las guías incluidas en `[GUÍA: ...]`.
4. Eliminar las guías una vez completada la sección.
5. Verificar que el contrato supera los 15 criterios de aceptación (§15).
6. Marcar como `Estado: Borrador` hasta pasar por auditoría.

**Regla de evidencia:** ninguna afirmación en un contrato derivado es válida sin marca
`[D]` o `[I]` y referencia a la fuente. Las hipótesis van al §13, nunca al cuerpo del contrato.

---

## 1. Identificación

```
Nombre:          [NOMBRE COMPLETO DEL PRODUCTO]
Identificador:   [ID-CANÓNICO]
Versión:         1.0
Estado:          Borrador | Auditoría | Aprobado
Sprint:          [Sprint 2 | Sprint 3 | ...]
Fecha:           [YYYY-MM-DD]
```

**Documentos de referencia:**

| Documento | Sección relevante | Relación con este contrato |
|---|---|---|
| INSTRUMENT-TAXONOMY.md | §[X] | [Describe la naturaleza de este producto] |
| DOMAIN-METAMODEL.md | §IV.[X] | [Define las relaciones metodológicas que utiliza] |
| [Otros contratos existentes] | [§] | [Dependencia] |

> **[GUÍA]** El identificador canónico es único y estable. Una vez aprobado no cambia.
> Los documentos de referencia son los que realmente se leyeron para escribir este contrato,
> no los que teóricamente podrían ser relevantes.

---

## 2. Propósito

[Responder en no más de tres frases: ¿para qué existe este producto?]

El [NOMBRE] existe para [FUNCIÓN PRINCIPAL].

No existe para [FUNCIÓN EXCLUIDA 1].
No existe para [FUNCIÓN EXCLUIDA 2].

> **[GUÍA]** La sección de propósito establece el "para qué", nunca el "cómo".
> Si la descripción menciona algoritmos, formatos, campos o componentes de software,
> pertenece a un documento técnico posterior, no a este contrato.
> Las frases de exclusión son obligatorias cuando el producto puede confundirse
> con otro de naturaleza similar.

---

## 3. Naturaleza metodológica

**Tipo según taxonomía:** [categoría de INSTRUMENT-TAXONOMY.md]

> Opciones (de INSTRUMENT-TAXONOMY.md §I):
> - Producto de conocimiento (evidencia, interpretación, diagnóstico)
> - Instrumento de planificación (plan, propuesta, decisión)
> - Producto de compilación (documento institucional exportable)
> - Instrumento metodológico (cuestionario, protocolo, diccionario)
> - Instrumento de gobernanza (marco de seguimiento, evaluación)
> - Contribución institucional garantizada (cuando el SSPA lo produce por mandato)

**Posición en el flujo metodológico:**

Este producto se sitúa en la Fase [N] del flujo canónico definido en DOMAIN-METAMODEL.md §VI:

```
[Reproducir el fragmento relevante del flujo, indicando dónde encaja este producto]
```

**Nivel epistémico:**

El producto pertenece a la capa [N] del conocimiento según DOMAIN-METAMODEL.md §VI:

- Capa 1 — Documento
- Capa 2 — Evidencia
- Capa 3 — Interpretación
- Capa 4 — Deliberación y propuesta
- Capa 5 — Decisión institucional
- Capa 6 — Producto compilado

> **[GUÍA]** Un producto solo puede pertenecer a UNA capa epistémica.
> Si el producto parece abarcar varias capas, es señal de que está mal definido o
> que debe dividirse en dos productos distintos.

---

## 4. Papel institucional

### Quién produce este producto

| Actor | Rol | Tipo de intervención |
|---|---|---|
| [Sistema / COMPÁS NG] | [Genera borrador / compila / transforma] | Automatizada |
| [Equipo técnico] | [Valida / redacta / revisa] | Humana obligatoria |
| [Grupo Motor] | [Delibera / aprueba / rechaza / modifica] | Humana deliberativa |
| [Corporación municipal] | [Aprueba formalmente] | Institucional formal |

> Solo incluir actores con un papel real y verificable en la producción de este producto.

### Quién utiliza este producto

| Actor | Para qué lo utiliza |
|---|---|
| [Actor 1] | [Uso concreto] |
| [Actor 2] | [Uso concreto] |

### Quién toma decisiones a partir de él

[Indicar quién tiene autoridad para actuar basándose en este producto.
Si el producto no habilita decisiones formales por sí mismo, indicarlo explícitamente.]

> **[GUÍA]** La distinción entre "quien produce" y "quien toma decisiones" es metodológicamente
> crítica. Un borrador técnico lo produce el sistema; la decisión pertenece siempre a personas
> con autoridad institucional. [D] ARCHITECTURE-CONSTITUTION Art. 5, 6.

---

## 5. Entradas

[Enumerar únicamente entradas metodológicas. No mencionar formatos técnicos ni campos.]

| Entrada | Tipo metodológico | Estado requerido | Obligatoria |
|---|---|---|---|
| [Nombre] | [Evidencia / PSL / Estrategia / Decisión del Grupo Motor / ...] | [Validado / Aprobado / Disponible] | Sí / No |

> **[GUÍA]** "Estado requerido" describe el estado institucional de la entrada
> (validado por el equipo técnico, aprobado por la corporación, disponible en el repositorio),
> nunca el estado técnico (campo populado, array no vacío, objeto no null).
>
> Si una entrada es opcional, indicar qué ocurre cuando no está disponible.

---

## 6. Salidas

[Definir exactamente qué produce. No hablar de formatos ni de implementación.]

**Producto principal:**

[Nombre y descripción del producto principal en una frase.]

**Propiedades del producto:**

- [Propiedad metodológica 1: ej. "es trazable hasta la evidencia que lo fundamenta"]
- [Propiedad metodológica 2: ej. "requiere validación humana antes de usarse como base de decisión"]
- [Propiedad metodológica 3]

**Lo que el producto NO es:**

- No es [producto similar con el que podría confundirse]
- No es [producto de nivel superior que podría confundirse]

> **[GUÍA]** Las propiedades describen qué garantías metodológicas ofrece el producto,
> no sus atributos técnicos. "Tiene fecha de validación" es un atributo técnico.
> "Es trazable hasta la evidencia que lo fundamenta" es una garantía metodológica.

---

## 7. Transformación metodológica

**¿Qué entra?**

[Describir el conocimiento que entra en términos metodológicos.]

**¿Qué cambia?**

[Describir qué transformación se produce. Usar el vocabulario del DOMAIN-METAMODEL:
derivación, articulación, compilación, validación, deliberación.]

**¿Qué permanece inalterado?**

[Describir explícitamente lo que este proceso NO modifica. Esto es igualmente importante
que describir lo que sí modifica.]

> **[GUÍA]** La pregunta "¿qué permanece inalterado?" es la más frecuentemente omitida
> y la más importante para verificar que el producto respeta los principios metodológicos.
> Un producto que modifica la evidencia viola P-M4. Un producto que decide viola P-M3.
> Un producto que homogeneiza contribuciones viola P-M6.

---

## 8. Límites

[Este apartado es obligatorio. Describir expresamente qué NO hace este producto.]

Este producto **no**:

- [LÍMITE 1: ej. "decide prioridades de salud del municipio"]
- [LÍMITE 2: ej. "modifica la evidencia del EvidenceStore"]
- [LÍMITE 3: ej. "sustituye la deliberación del Grupo Motor"]
- [LÍMITE 4: ej. "genera compromisos institucionales automáticamente"]
- [LÍMITE 5: ej. "establece causalidad entre determinantes y resultados de salud"]

> **[GUÍA]** Los límites no son defectos del producto: son garantías metodológicas.
> Un producto cuyos límites no están explicitados puede ser mal utilizado.
> Si un usuario espera que el producto haga algo que no hace, el límite debe declararse.
>
> Mínimo tres límites obligatorios. Si no se identifican al menos tres, el producto
> está insuficientemente caracterizado.

---

## 9. Relaciones

[Referenciar exclusivamente el DOMAIN-METAMODEL. No redefinir relaciones.
Solo indicar cuáles utiliza este producto.]

Este producto utiliza las siguientes relaciones del DOMAIN-METAMODEL (§IV):

| Relación (tipo) | Entre | Sección DOMAIN-METAMODEL |
|---|---|---|
| [DERIVA_DE] | Este producto ← [Entrada] | §IV.2 |
| [CONTIENE] | Este producto → [Componente] | §IV.1 |
| [ORIENTA] | [Origen] → Este producto | §IV.3 |
| [...] | [...] | [...] |

> **[GUÍA]** No inventar nuevas relaciones. Si el producto requiere una relación que no
> existe en DOMAIN-METAMODEL §IV, la relación debe añadirse primero al metamodelo
> (con evidencia documental) antes de usarla en el contrato.
>
> Si una relación existe en el metamodelo pero no aplica a este producto, no incluirla.

---

## 10. Dependencias

### Este producto depende de:

| Producto | Tipo de dependencia | Contrato de referencia |
|---|---|---|
| [Producto A] | [Prerequisito / Entrada / Orientación] | [CONTRACT-X] |
| [Producto B] | [...] | [...] |

### Dependen de este producto:

| Producto | Cómo lo consume | Contrato de referencia |
|---|---|---|
| [Producto C] | [Lo usa como entrada / Lo referencia / Lo articula] | [CONTRACT-Y] |
| [Producto D] | [...] | [...] |

> **[GUÍA]** Las dependencias son metodológicas, no técnicas. "Requiere PSL validado"
> es una dependencia metodológica. "Requiere el campo psl.status === 'validated'" es
> una dependencia técnica que pertenece al contrato de implementación.

---

## 11. Invariantes

[Reglas que nunca pueden romperse para este producto. Numeradas.]

**I-[CÓDIGO]-1 — [NOMBRE DEL INVARIANTE]**

[Descripción del invariante.]

*Consecuencia si se viola:* [qué ocurre metodológica o institucionalmente si esta regla se incumple]

*Fuente:* [Referencia documental: CONTRACT-X §Y, METHODOLOGICAL-FOUNDATIONS PM-N, etc.]

---

**I-[CÓDIGO]-2 — [NOMBRE DEL INVARIANTE]**

[...]

---

> **[GUÍA]** Un invariante es una regla que NUNCA puede romperse, independientemente
> del contexto o las circunstancias. Si la regla admite excepciones, no es un invariante.
>
> Los invariantes de este producto deben ser compatibles con los invariantes de todos
> los demás productos. Una incompatibilidad entre invariantes indica una contradicción
> metodológica que debe resolverse antes de aprobar el contrato.
>
> Mínimo dos invariantes. Los invariantes transversales más comunes (que todo producto
> debe heredar a menos que tenga razón explícita para no hacerlo):
>
> - Trazabilidad: toda afirmación es rastreable hasta su evidencia de origen [D] OPERATING-CONSTITUTION §9
> - Gobernanza humana: ninguna decisión institucional es automatizada [D] ARCHITECTURE-CONSTITUTION Art. 5, 6
> - Separación evidencia/planificación: la evidencia no genera actuaciones [D] CONTRACT-INTERPRETATION §1.1
> - Preservación de naturaleza: el producto no modifica sus entradas [D] ARCHITECTURE-CONSTITUTION Art. 4

---

## 12. Evidencia documental

[Para cada afirmación importante de este contrato, indicar la fuente que la respalda.]

| Afirmación | Fuente | Tipo de evidencia |
|---|---|---|
| [Afirmación del §X] | [Documento, sección, página o línea] | [D] / [I] |
| [...] | [...] | [...] |

> **[GUÍA]** No introducir ninguna afirmación sin evidencia documentada.
> Si la afirmación es razonablemente inferible de la evidencia disponible, marcarla [I].
> Si requiere evidencia adicional, colocarla en §13 como hipótesis.
>
> Las fuentes válidas son:
> - Contratos existentes del repositorio (CONTRACT-*.md)
> - Documentos metodológicos auditados (docs/methodology/)
> - Documentos institucionales presentes en el repositorio (ESCA, EPVSA, etc.)
> - Datos verificados del COMPÁS histórico (auditoria_ng/cuadernos/)
>
> Las fuentes no válidas para este contrato:
> - El conocimiento general no verificado en el repositorio
> - Inferencias sobre cómo debería funcionar el sistema
> - Analogías con otros sistemas sin fuente documentada

---

## 13. Hipótesis abiertas

[Registrar únicamente cuestiones metodológicas todavía pendientes de resolver.
Las hipótesis NUNCA se convierten en requisitos hasta demostración documental.]

**H-[CÓDIGO]-1 — [DESCRIPCIÓN BREVE]**

[Descripción de la cuestión abierta.]

*Por qué es relevante para este contrato:* [impacto si se resuelve de una forma u otra]

*Qué evidencia adicional resolvería esta hipótesis:* [qué auditoría o documento aclararía la cuestión]

---

> **[GUÍA]** Una hipótesis NO es una laguna del contrato: es honestidad metodológica.
> Un contrato sin hipótesis puede estar ocultando incertidumbres que deberían ser visibles.
>
> Si la resolución de una hipótesis afectaría sustancialmente a alguna sección del contrato,
> la sección afectada debe indicarlo explícitamente: "Pendiente de H-[CÓDIGO]-N".

---

## 14. Consecuencias arquitectónicas

[Indicar qué implicaciones tendrá este contrato para decisiones posteriores.
No describir implementación. Solo señalar qué contratos, modelos o componentes
deberán tener en cuenta este contrato al diseñarse.]

### Para contratos derivados

[Qué contratos deberán derivarse de este para poder implementarlo.]

### Para el modelo de dominio

[Qué entidades o relaciones del DOMAIN-METAMODEL se activan o requieren especificación
adicional al implementar este producto.]

### Para el StrategicRepository

[Si este producto consume o alimenta el StrategicRepository, indicar qué implica.]

### Para los compiladores

[Si este producto es el input o el output de un compilador, indicar la dependencia.]

### Para la persistencia

[Indicar únicamente si el producto requiere persistencia humana obligatoria
(es decir, si no puede regenerarse automáticamente) o si puede regenerarse
desde sus entradas. No describir cómo persistirlo.]

> **[GUÍA]** Las consecuencias arquitectónicas son declaraciones de la forma:
> "Quien implemente X deberá respetar este contrato en la decisión Y."
> No son decisiones de implementación. Son restricciones para futuros contratos.
>
> Esta sección se completa DESPUÉS de haber completado todas las anteriores.
> Si se completa antes, indica que el contrato se diseñó desde la implementación
> en lugar de desde la metodología.

---

## 15. Criterios de aceptación

El contrato está completo y puede pasar a estado "Auditoría" cuando puede responder
sin ambigüedad a las siguientes preguntas sin necesidad de consultar otro documento:

| # | Pregunta | ¿Respondida? | §§ donde se responde |
|---|---|---|---|
| 1 | ¿Qué es este producto? | ☐ | §2, §3 |
| 2 | ¿Para qué existe? | ☐ | §2 |
| 3 | ¿Quién lo utiliza? | ☐ | §4 |
| 4 | ¿Quién decide? | ☐ | §4 |
| 5 | ¿Qué transforma? | ☐ | §7 |
| 6 | ¿Qué no transforma? | ☐ | §7, §8 |
| 7 | ¿Qué recibe? | ☐ | §5 |
| 8 | ¿Qué entrega? | ☐ | §6 |
| 9 | ¿Con qué otros productos se relaciona? | ☐ | §9, §10 |
| 10 | ¿Qué principios nunca puede vulnerar? | ☐ | §11 |

**Criterios adicionales de calidad:**

| # | Criterio | ¿Cumplido? |
|---|---|---|
| 11 | Toda afirmación tiene marca [D] o [I] con fuente en §12 | ☐ |
| 12 | Los límites (§8) incluyen al menos tres exclusiones explícitas | ☐ |
| 13 | Los invariantes (§11) incluyen al menos dos reglas no rompibles | ☐ |
| 14 | Las relaciones (§9) referencian DOMAIN-METAMODEL sin redefinirlas | ☐ |
| 15 | Las consecuencias arquitectónicas (§14) no describen implementación | ☐ |

Si alguna casilla está sin marcar, el contrato no puede pasar a estado "Auditoría".

---

## Registro de revisiones

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| [YYYY-MM-DD] | Borrador | Creación inicial | [Nombre] |

---

*Plantilla canónica ROOT-CONTRACT-TEMPLATE v1.0 — COMPÁS NG Sprint 2 — 2026-06-28*
*Derivada de: INSTRUMENT-TAXONOMY, DOMAIN-METAMODEL, MODEL-OF-INSTITUTIONAL-ARTICULATION,*
*METHODOLOGICAL-FOUNDATIONS-LOCAL-HEALTH-PLANNING, ARCHITECTURE-CONSTITUTION.*
