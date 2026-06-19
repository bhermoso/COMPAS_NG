export type MunicipalityId = string;

export type MunicipalityStatus = "draft" | "active" | "archived";

export type AutonomousCommunity = "Andalucía";

export interface MunicipalityIdentity {
  id: MunicipalityId;
  name: string;
  province: string;
  autonomousCommunity: AutonomousCommunity;
  ineCode?: string;
}

export interface MunicipalityMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  version: string;
}

export interface MunicipalityContext {
  identity: MunicipalityIdentity;
  status: MunicipalityStatus;
  metadata: MunicipalityMetadata;
}

export interface CreateMunicipalityContextInput {
  id: MunicipalityId;
  name: string;
  province: string;
  ineCode?: string;
  createdBy?: string;
}

export function createMunicipalityContext(
  input: CreateMunicipalityContextInput
): MunicipalityContext {
  const now = new Date().toISOString();

  return {
    identity: {
      id: input.id,
      name: input.name,
      province: input.province,
      autonomousCommunity: "Andalucía",
      ineCode: input.ineCode,
    },
    status: "draft",
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
      version: "1.0.0",
    },
  };
}

export function activateMunicipalityContext(
  context: MunicipalityContext
): MunicipalityContext {
  return {
    ...context,
    status: "active",
    metadata: {
      ...context.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function archiveMunicipalityContext(
  context: MunicipalityContext
): MunicipalityContext {
  return {
    ...context,
    status: "archived",
    metadata: {
      ...context.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function isActiveMunicipalityContext(
  context: MunicipalityContext
): boolean {
  return context.status === "active";
}
