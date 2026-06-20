export interface StrategicFrameworkInput {
  municipalityName: string;
  sanitaryDistrict?: string;
}

export interface StrategicFrameworkSection {
  id: string;
  title: string;
  body: string[];
}

export interface StrategicFramework {
  municipalityName: string;
  sanitaryDistrict?: string;
  sections: StrategicFrameworkSection[];
}
