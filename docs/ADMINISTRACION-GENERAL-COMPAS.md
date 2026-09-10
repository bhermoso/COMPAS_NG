# Administración general y accesos territoriales

## Condición del titular

COMPAS debe utilizar exclusivamente capacidades gratuitas. No incorporar integraciones que requieran ampliar el plan, introducir medios de cobro o aceptar cargos. Si una función no puede prestarse bajo esta condición, explicarlo antes de implementarla.

Blas es el administrador general. Los permisos territoriales de otras cuentas no pueden limitarle.

## Implementación preparada

- Entrada personal y panel de administración general.
- Acceso del titular al COMPAS completo y a los borradores compartidos de cualquier ámbito.
- Cuentas parciales limitadas a sus ámbitos y al rol de coordinación o consulta.
- Enlaces explícitos a la consola propietaria de Firebase para crear cuentas, cambiar contraseñas y asignar permisos.

La creación automática de cuentas y la generación de claves dentro del panel no están implementadas. No se muestran botones que simulen esas funciones.

## Autorización general

El documento `compas_admins/UID_DEL_TITULAR` con `active` booleano `true` concede administración general. Es independiente de las membresías territoriales y solo se modifica desde la consola propietaria. Ninguna cuenta web, incluida la general, puede eliminar o modificar ese documento mediante las reglas de la aplicación.

No se incluyen excepciones por UID o correo en JavaScript. Las reglas del servidor deciden el acceso. La cuenta propietaria de Google/Firebase proporciona una vía de recuperación independiente del inicio de sesión en COMPAS.

## Gestión de accesos

1. Crear la cuenta en Authentication de Firebase y copiar su UID.
2. En Firestore, crear `relas_memberships/UID/scopes/ID_DEL_AMBITO`.
3. Campos: `active` booleano `true`, `role` texto `coordinator` o `reader`.
4. Para revocar ese ámbito, cambiar `active` a `false`. Para retirar el acceso a todos los ámbitos, desactivar todas sus asignaciones y suspender la cuenta en Authentication.
5. Gestionar la contraseña desde Authentication. No guardar contraseñas en el repositorio ni en documentos Firestore.

El rol territorial histórico `administrator` no equivale a administración general.

## Activación pendiente

Antes de sustituir la portada publicada, crear el documento global del titular, publicar las reglas actualizadas de Firestore y superar las pruebas de permisos. Después comprobar su entrada al panel y al COMPAS completo. La interfaz preparada no debe desplegarse antes de asegurar esa entrada.

## Datos y conservación

Los datos locales de los navegadores no se trasladan automáticamente a Firebase. Los archivos ya publicados en GitHub siguen siendo públicos. El panel no convierte esos archivos en privados ni sustituye sus copias de seguridad.

## Verificación

- `npm run build`.
- `node tests/relas-login.smoke.mjs`.
- `node tests/admin-panel.smoke.mjs`.
- `npm run test:relas`: aislamiento territorial, historial y protección de administración general.
