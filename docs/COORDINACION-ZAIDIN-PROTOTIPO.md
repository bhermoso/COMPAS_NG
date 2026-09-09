# Primer acceso de coordinación territorial

Ruta de ejemplo: `/COMPAS_NG/?vista=coordinacion-zaidin`.

Perfil propuesto: coordinación del Plan de Salud de El Zaidín 2027–2030,
sin administración de plataforma. Aplicable posteriormente a planes locales,
comarcales y distritales mediante asignación explícita de ámbito.

Esta entrega es un recorrido de interfaz, no una cuenta creada. No solicita
contraseñas, no monta el espacio municipal, no lee ni escribe registros del expediente municipal y
no implementa control de acceso. No introducir información personal en demos.

Incluye entrada, navegación por cinco áreas y salida. Las áreas describen
funciones futuras: plan, aportaciones, instrumentos, equipo y seguimiento.
No atribuye resultados, agentes ni aprobaciones inexistentes al distrito.

Para producción se requieren identidad personal autenticada, autorización en
servidor por ámbito y operación, almacenamiento privado, historial de cambios
y pruebas de denegación de acceso entre territorios y entre roles. La
coordinación no debe heredar acceso irrestricto a registros individuales ni
facultades de aprobación institucional o administración de plataforma.

Catálogo de instrumentos compartido; datos y decisiones territoriales separados.
Los instrumentos se reutilizarán en encuestas y registros de incorporación,
seguimiento y evaluación. La respuesta de la persona y la valoración del agente
deben distinguirse. El acceso supramunicipal requiere asignación expresa.

## Identidad visual

Se aplica `docs/visual/VISUAL-CONTRACT.md`: azul #0074c8, azul claro
#00acd9, verde #94d40b, ámbar #ffb61b, naranja #ff6600 y rojo #dc143c.
Degradado continuo de 90 grados con paradas 0/20/40/60/80/100 %, solo en
la franja de cabecera. Botones azules, neutros canónicos y listas con
separadores. Los seis colores no se asignan a los cuatro ejes del plan.

## Recorrido editable

El Plan de Acción reutiliza PlanPreparationPanel con 41 controles. La copia de
propuesta de coordinación traslada OE8.1/OE8.2 a Participación y ofrece la
redacción ampliada de autonomía para revisión. No cambia el catálogo original.
Las decisiones se guardan en una clave exclusiva de demostración del navegador
(`compas-ng:demo:coordinacion-zaidin:v1`), y se recuperan al recargar.
Se pueden descargar y recuperar en JSON, con validación de ámbito, versión e
identificadores y confirmación antes de sustituir el borrador. Si falla el
almacenamiento se informa y se ofrece la descarga. No existe guardado remoto ni transferencia al expediente municipal.
Las fichas de recogida aún no están conectadas. Los indicadores originales
se muestran explícitamente pendientes de revisión metodológica.
