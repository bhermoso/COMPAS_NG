# Administración general y accesos por plan

Blas es el administrador general de todo COMPAS. Las asignaciones de responsables nunca deben limitar sus permisos ni permitir la eliminación de su administración general.

## Entrada y alcance

COMPAS sigue abriendo directamente en la URL principal. El enlace **Administración** abre el panel en otra pestaña, sin desmontar el trabajo abierto. La gestión de cuentas requiere identificar la cuenta administradora mediante correo/contraseña de Firebase o Google. Esta comprobación de identidad no es una restricción territorial.

El administrador se reconoce mediante `compas_admins/UID` con `active: true`. Ese registro solo se modifica desde la consola propietaria; ninguna cuenta web puede modificarlo, ni siquiera el propio administrador. No hay excepciones de permisos por UID o correo incluidas en JavaScript.

## Alta de responsables desde el panel

1. Elegir el plan, inicialmente Granada · Zaidín.
2. Indicar el correo de la persona responsable, que será su usuario.
3. Elegir coordinación o consulta.
4. Crear usuario, contraseña y acceso.
5. Guardar las credenciales generadas y entregarlas al responsable por el canal elegido por el administrador. COMPAS no envía mensajes automáticamente.

La cuenta nueva se crea mediante una instancia separada de Firebase Authentication, exclusivamente en memoria, que no sustituye la sesión del administrador. La contraseña aleatoria solo se mantiene en pantalla durante la sesión; no se guarda en Firestore, archivos, registros ni almacenamiento local.

La asignación y el registro de acceso se guardan juntos en una operación atómica de Firestore. Si el alta de Authentication termina pero falla la asignación, se muestra **Cuenta creada: permiso pendiente** y se permite reintentar sin duplicar la cuenta. No se anuncia acceso concedido hasta confirmar la escritura. Si se abandona la pantalla en ese estado, la cuenta puede revisarse o recuperarse desde la consola.

Cada cuenta creada desde el panel tiene un plan asignado. La lista permite retirar y reactivar ese acceso, conservando borradores e historial. Las cuentas o asignaciones anteriores no aparecen automáticamente en este registro. Si un correo ya existe, no se sobrescribe su contraseña ni se reasignan sus permisos.

## Capacidades y límites de datos

El responsable accede al espacio compartido de su plan; coordinación puede editar borradores y consulta solo puede leerlos. Estos permisos no constituyen aprobación del administrador ni del Grupo Motor.

El espacio territorial actual incluye el borrador compartido y su historial. No se han migrado automáticamente a Firebase todos los perfiles, indicadores ni documentos locales. Los archivos incluidos en el repositorio público y en la web continúan siendo públicos: las reglas territoriales protegen los datos compartidos de Firestore y no convierten esos archivos en privados.

La creación, revocación y reactivación utilizan los servicios existentes de Authentication y Firestore. No se incorporan Cloud Functions, planes de suscripción ni servicios que requieran ampliar el plan o aceptar cargos.

## Activación de reglas

El usuario confirmó la creación del registro general y la publicación de las reglas anteriores. Aquellas reglas permitían trabajar con borradores pero prohibían crear asignaciones desde la web. La nueva gestión requiere publicar la versión de `firebase/firestore.rules` incluida con este panel. El código no puede publicar reglas ni elevar permisos por sí mismo.

La entrada directa al COMPAS completo se mantiene con independencia de esa actualización. Solo el alta y la gestión de accesos dependen de las nuevas reglas.

## Verificación

- Compilación de la aplicación.
- Prueba de pantalla: navegación visible, entrada directa, alta con error parcial y reintento, retirada y ocultación de credenciales.
- Reglas: aislamiento territorial, solo administración general puede asignar accesos, protección del titular y consistencia del registro con la asignación.
- Integración con emuladores de Authentication y Firestore: cuenta real de prueba, sesión del titular intacta, permisos del responsable y revocación con sesión abierta.
