import { describe, expect, it } from "vitest";
import {
  buildThematicPrioritisationRedcapDictionary,
  generateThematicPrioritisationRedcapDictionaryArtifact,
  THEMATIC_PRIORITISATION_REDCAP_FIELD_NAME,
  THEMATIC_PRIORITISATION_REDCAP_FORM_NAME,
} from "../src/application/thematic-prioritisation";
import {
  MAX_SELECTED_TOPICS,
  THEMATIC_TOPICS,
} from "../src/domain/thematic-prioritisation";

describe("diccionario REDCap de priorizacion tematica", () => {
  it("define una papeleta REDCap con 10 tematicas y limite de elecciones", () => {
    const dictionary = buildThematicPrioritisationRedcapDictionary();
    const field = dictionary.fields.find(
      (candidate) =>
        candidate.fieldName === THEMATIC_PRIORITISATION_REDCAP_FIELD_NAME
    );

    expect(dictionary.instrumentName).toBe(
      THEMATIC_PRIORITISATION_REDCAP_FORM_NAME
    );
    expect(field).toBeDefined();
    expect(field?.fieldType).toBe("checkbox");
    expect(field?.formName).toBe(THEMATIC_PRIORITISATION_REDCAP_FORM_NAME);
    expect(field?.fieldAnnotation).toBe(
      `@MAXCHECKED=${MAX_SELECTED_TOPICS}`
    );
    expect(field?.choicesOrCalculations?.split(" | ")).toHaveLength(
      THEMATIC_TOPICS.length
    );
    expect(field?.choicesOrCalculations).toContain(
      "1, Alimentación"
    );
    expect(field?.choicesOrCalculations).toContain(
      "10, Accidentes en el hogar y la vía pública"
    );
  });

  it("exporta un CSV compatible con el Data Dictionary de REDCap", () => {
    const artifact = generateThematicPrioritisationRedcapDictionaryArtifact();

    expect(artifact.kind).toBe("redcap-data-dictionary-csv");
    expect(artifact.name).toBe(
      `${THEMATIC_PRIORITISATION_REDCAP_FORM_NAME}_data_dictionary.csv`
    );
    expect(artifact.content).toContain("Variable / Field Name,Form Name");
    expect(artifact.content).toContain(
      `${THEMATIC_PRIORITISATION_REDCAP_FIELD_NAME},${THEMATIC_PRIORITISATION_REDCAP_FORM_NAME}`
    );
    expect(artifact.content).toContain(`@MAXCHECKED=${MAX_SELECTED_TOPICS}`);
  });
});
