# Contrato visual del Perfil Local de Salud

> Documento operativo. La visualización del Perfil no decora: responde
> preguntas diagnósticas. Inspiración de formato: NHS Health Profiles;
> fundamento: PROFILE-SCIENTIFIC-FRAMEWORK.md. Implementación testeable:
> `profileVisualContract.ts`.

## 1. Regla madre

**Toda visualización responde una pregunta diagnóstica y declara fuente,
escala y cautela.** Si no puede declarar las tres cosas, no se visualiza.

## 2. Qué puede ser cada cosa

| Elemento | Forma | Pregunta que responde | Datos reales que lo sostienen |
|---|---|---|---|
| Señales sanitarias del Informe | **Tabla** (dimensión · presencia textual · términos · fuente · cautela) | ¿Qué trata el Informe de salud y con qué peso? | `healthReportSanitaryReading` |
| Indicadores trazadores | **Tabla** (bloque · indicador · valor · ref. Granada · ref. Andalucía · escala/cautela) | ¿Qué señales de vida cotidiana miden los estudios y frente a qué referencia? | `complementaryIndicatorReferences` |
| Matriz deliberativa/epistemológica | **Matriz** (señal → fuente → escala → desigualdad → mecanismo → capacidad → estatus causal → pregunta) | ¿Qué debe deliberar el Grupo Motor y con qué base? | `integratedProfileSignals` |
| Activos por ámbito de capacidad | **Tabla o barras simples** (ámbito · nº recursos · ejemplos) | ¿Dónde se concentra la capacidad comunitaria potencial? | `salutogenicReading` |
| Incertidumbres críticas | **Bloque destacado** (lista) | ¿Qué no sabemos y por qué importa? | incertidumbres + lagunas + EKC |
| BADEA/IECA | **Ficha secundaria** (contexto municipal) | ¿En qué contexto urbano se inscribe el municipio matriz? | `badeaMunicipalContext` |

## 3. Qué NO debe visualizarse

- **Menciones del Informe como prevalencia**: son trazabilidad textual; jamás
  gráfico de magnitud sanitaria.
- **Comparación valor demo ↔ referencia provincial**: coinciden por diseño
  (proxy); un gráfico sugeriría hallazgo donde hay construcción.
- **Series temporales**: no existen series en el expediente.
- **Desagregaciones** (sexo, edad, renta): no existen; su ausencia se
  visualiza solo como incertidumbre declarada.
- **Activos como cobertura o resultado**: nada de mapas de "servicios
  garantizados" ni porcentajes de cobertura.
- **BADEA como protagonista**: nunca en la apertura ni como gráfico principal.

## 4. Dónde va cada cosa

- **Pantalla**: matriz deliberativa (interactiva, para el trabajo del equipo),
  tabla de trazadores (ya existe en anexo), fichas de incertidumbre.
- **DOCX/PDF (documento institucional)**: tabla de señales sanitarias del
  Informe + tabla de trazadores + resumen de capacidades; matriz deliberativa
  en versión compacta si cabe con dignidad.
- **Anexo técnico**: trazabilidad completa, referencias comparativas, ficha
  BADEA, detalle de cautelas.

## 5. Declaración obligatoria

Toda tabla/gráfico lleva pie con: **Fuente** (instrumento/documento y fichero)
· **Escala** (muestra, ámbito, proxy) · **Cautela** (qué no permite leer).
El helper `visualCaption()` compone este pie de forma uniforme.
