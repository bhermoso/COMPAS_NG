export interface EASHouseholdStructure {
  householdSize: string;
  headOfHousehold: string;

  members: Array<{
    id: number;
    sex: string;
    age: string;
    relationship: string;
    employment: string;
  }>;
}

export function buildHouseholdSkeleton(): EASHouseholdStructure {
  return {
    householdSize: "TAM_HOG",
    headOfHousehold: "CF",
    members: [
      {
        id: 1,
        sex: "SEX_01",
        age: "ED_01",
        relationship: "PAR_01",
        employment: "LAB_01"
      }
    ]
  };
}

export function detectAdultLayerMapping(): string[] {
  return [
    "aSEX_01",
    "aED_01"
  ];
}
