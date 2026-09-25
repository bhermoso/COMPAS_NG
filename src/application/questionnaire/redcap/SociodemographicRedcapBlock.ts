import type { RedcapFieldDefinition } from "./RedcapDictionaryDefinition";

// ── Formulario REDCap del bloque de identificación ────────────────────────────
export const SOCIODEMOGRAPHIC_FORM_NAME = "datos_basicos";

// ── Variables del Bloque de Identificación y Clasificación (v1.0) ─────────────
//
// Compatibilidad EAS VI (CONTRACT-GES-EAS-COMPATIBILITY):
//
//   sexo             → SEX_01 EAS VI  (códigos 1-2 compatibles; 3-4 extensión COMPÁS NG)
//   anio_nacimiento  → ED_01 EAS VI   (EAS usa edad directa; transformación §5.2)
//   nivel_educativo  → P60_2016 EAS VI (ver tabla de equivalencia §5.3)
//   situacion_laboral → P61 EAS VI    (ver tabla de equivalencia §5.4)
//   fecha_encuesta   → sin equivalente EAS
//   municipio_cod    → sin equivalente EAS como variable de cuestionario
//
// ── Tabla de equivalencia: nivel_educativo GES → P60_2016 EAS VI ─────────────
//
//  GES  Etiqueta GES                                    P60_2016(s)   Estudios_MAX
//  ───  ───────────────────────────────────────────────  ────────────  ────────────
//   1   Sin estudios o estudios primarios incompletos    1, 2          1
//   2   Estudios primarios completos                     3             1
//   3   Educación secundaria 1ª etapa (ESO / EGB 8ª)    4, 5          2
//   4   Educación secundaria 2ª etapa (Bach / FP medio) 6, 8          2
//   5   Formación Profesional de grado superior          7             2
//   6   Educación postsecundaria no superior,            9, 10, 11,    3
//       universitaria o de postgrado                     12, 13
//
// Notas de equivalencia:
//  - P60=9 (Educación postsecundaria no superior, n=453 en EAS Granada) se incluye
//    en GES-6 siguiendo la armonización oficial EAS (Estudios_MAX=3). Su etiqueta
//    en P60_2016 es distinta a la universitaria, pero la EAS la agrupa en el nivel
//    superior. Se documenta explícitamente para preservar la trazabilidad.
//  - P60=1 (no sabe leer) y P60=2 (alfabetizado sin estudiar) se fusionan en GES-1.
//    Esta fusión sigue la agrupación estándar en encuestas de salud comunitaria y
//    es coherente con Estudios_MAX=1.
//  - La codificación numérica GES (1-6) NO es directamente comparable con P60_2016
//    (1-13). La comparación con EAS debe realizarse a través de Estudios_MAX (3 niveles)
//    usando la tabla anterior. Estado: pending-verification.
//
// ── Tabla de equivalencia: situacion_laboral GES → P61 EAS VI ────────────────
//
//  GES  Etiqueta GES                              P61(s) EAS VI         Nota
//  ───  ────────────────────────────────────────  ────────────────────  ─────────
//   1   Trabaja (por cuenta propia o ajena)        1                     1:1
//   2   Jubilado/a o pensionista                   4 + P62               fusión
//   3   Parado/a o en busca de empleo              2, 3                  fusión
//   4   Labores del hogar (exclusivamente)         5                     1:1
//   5   Estudiante                                 6                     1:1
//   6   Incapacidad/invalidez permanente           7                     1:1
//   7   Otra situación                             8                     1:1
//
// Notas de equivalencia:
//  - GES-2 fusiona el jubilado de actividad laboral (P61=4) con los pensionistas no
//    jubilados (captados en P62 EAS). La EAS VI los distingue en dos campos. Esta fusión
//    limita la comparabilidad para ese subgrupo.
//  - GES-3 fusiona parados con experiencia (P61=2) y buscadores de primer empleo (P61=3).
//    La EAS VI los distingue. Esta fusión es habitual en encuestas de salud comunitaria.
//  - GES-6 (Incapacidad/invalidez permanente) se añade explícitamente (P61=7, n=659
//    en EAS Granada) para no perder un colectivo de alta relevancia diagnóstica en salud
//    pública. En la versión anterior del bloque, este grupo habría caído en "Otra situación".
//  - Estado: pending-verification. La correspondencia P61↔GES no ha sido contrastada
//    formalmente con el codebook oficial EAS VI.

export const EAS_SOCIODEMOGRAPHIC_FIELDS: ReadonlyArray<RedcapFieldDefinition> = [
  {
    fieldName: "fecha_encuesta",
    formName: SOCIODEMOGRAPHIC_FORM_NAME,
    sectionHeader: "Identificación",
    fieldType: "text",
    fieldLabel: "Fecha de cumplimentación",
    fieldNote: "Fecha en que se cumplimenta el cuestionario.",
    validationType: "date_dmy",
    required: true,
    questionNumber: "1",
  },
  {
    fieldName: "municipio_cod",
    formName: SOCIODEMOGRAPHIC_FORM_NAME,
    fieldType: "text",
    fieldLabel: "Código de municipio (INE)",
    fieldNote:
      "Código de municipio a 5 dígitos del INE (ej: 18017 = Atarfe). " +
      "Puede pre-rellenarse en la configuración del proyecto REDCap.",
    required: false,
    questionNumber: "2",
  },
  {
    fieldName: "sexo",
    formName: SOCIODEMOGRAPHIC_FORM_NAME,
    sectionHeader: "Clasificación sociodemográfica",
    fieldType: "radio",
    fieldLabel: "Sexo",
    // Códigos 1-2 compatibles con SEX_01 EAS VI.
    // Códigos 3-4: extensión COMPÁS NG para cumplimiento ético.
    // SAM utiliza únicamente los códigos 1 y 2.
    choicesOrCalculations:
      "1, Hombre | 2, Mujer | 3, Otro género | 4, Prefiero no indicar",
    required: true,
    questionNumber: "3",
  },
  {
    fieldName: "anio_nacimiento",
    formName: SOCIODEMOGRAPHIC_FORM_NAME,
    fieldType: "text",
    fieldLabel: "Año de nacimiento",
    fieldNote:
      "Año de nacimiento (YYYY). " +
      "La edad se calculará como: año(fecha_encuesta) − año_nacimiento.",
    // Adaptación de ED_01 EAS VI (CONTRACT-GES-EAS-COMPATIBILITY §5.2).
    // Rango: personas nacidas entre 1920 y 2012 (≥14 años en 2026).
    validationType: "integer",
    validationMin: "1920",
    validationMax: "2012",
    required: true,
    questionNumber: "4",
  },
  {
    fieldName: "nivel_educativo",
    formName: SOCIODEMOGRAPHIC_FORM_NAME,
    fieldType: "radio",
    fieldLabel: "Nivel de estudios más alto terminado",
    // Equivalente EAS VI: P60_2016 (variable canónica de nivel educativo individual).
    // Pregunta EAS VI: «¿Cuál es el nivel más alto de estudios que usted ha finalizado?»
    // Agrupación en 6 categorías GES a partir de 13 categorías P60_2016.
    // Ver tabla de equivalencia en el encabezado de este fichero.
    // Estado de verificación: pending-verification (CONTRACT-GES-EAS-COMPATIBILITY I-EAS-3).
    // Para comparación con EAS, usar la tabla de equivalencia → Estudios_MAX (3 niveles).
    choicesOrCalculations:
      "1, Sin estudios o estudios primarios incompletos | " +
      "2, Estudios primarios completos (Certificado Escolaridad / EGB 1ª etapa) | " +
      "3, Educación secundaria 1ª etapa (ESO / Graduado Escolar / EGB 8ª) | " +
      "4, Educación secundaria 2ª etapa (Bachillerato / BUP-COU / FP grado medio) | " +
      "5, Formación Profesional de grado superior | " +
      "6, Educación postsecundaria no superior, universitaria o de postgrado",
    required: true,
    questionNumber: "5",
  },
  {
    fieldName: "situacion_laboral",
    formName: SOCIODEMOGRAPHIC_FORM_NAME,
    fieldType: "radio",
    fieldLabel: "Situación laboral actual",
    // Equivalente EAS VI: P61 (variable canónica de situación laboral).
    // Pregunta EAS VI: «¿Cuál es su situación laboral actual?»
    // Agrupación en 7 categorías GES a partir de 8 categorías P61.
    // Ver tabla de equivalencia en el encabezado de este fichero.
    // Estado de verificación: pending-verification (CONTRACT-GES-EAS-COMPATIBILITY I-EAS-3).
    choicesOrCalculations:
      "1, Trabaja (por cuenta propia o ajena) | " +
      "2, Jubilado/a o pensionista | " +
      "3, Parado/a o en busca de empleo | " +
      "4, Labores del hogar (exclusivamente) | " +
      "5, Estudiante | " +
      "6, Incapacidad o invalidez permanente | " +
      "7, Otra situación",
    required: true,
    questionNumber: "6",
  },
];
