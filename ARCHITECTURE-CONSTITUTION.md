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

*Primera versión aprobada: 2026-06-21*
*Revisada: 2026-06-22 — Art. 13 añadido.*
*Revisada: 2026-06-22 — Art. 14 añadido — primacía de la EAS como referencia metodológica.*
*Basada en el Borrador V0 y en las auditorías arquitectónicas de junio 2026.*
