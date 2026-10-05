import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("instrucciones canónicas del repositorio", () => {
  it("conserva la rúbrica de proyecto, el estilo de Blas y el puntero AGENTS", () => {
    const projectInstructions = join(root, "docs", "COMPAS_PROJECT_INSTRUCTIONS.md");
    const writingStyle = join(root, "docs", "BLAS_WRITING_STYLE.md");
    const agents = join(root, "AGENTS.md");
    const claude = join(root, "CLAUDE.md");

    expect(existsSync(projectInstructions)).toBe(true);
    expect(existsSync(writingStyle)).toBe(true);
    expect(existsSync(agents)).toBe(true);
    expect(existsSync(claude)).toBe(true);

    const agentsText = readFileSync(agents, "utf8");
    expect(agentsText).toContain("docs/COMPAS_PROJECT_INSTRUCTIONS.md");
    expect(agentsText).toContain("docs/BLAS_WRITING_STYLE.md");
    expect(agentsText).toContain("Spanish prose in COMPAS_NG");
    expect(agentsText).toContain("product constraint");
    expect(agentsText).not.toContain("substantial Spanish prose intended for Blas");

    const claudeText = readFileSync(claude, "utf8");
    expect(claudeText).toContain("AGENTS.md");
    expect(claudeText).toContain("docs/COMPAS_PROJECT_INSTRUCTIONS.md");
    expect(claudeText).toContain("docs/BLAS_WRITING_STYLE.md");

    const projectInstructionsText = readFileSync(projectInstructions, "utf8");
    expect(projectInstructionsText).toContain("interface copy");
    expect(projectInstructionsText).toContain("generated-text templates");
    expect(projectInstructionsText).toContain("Discursive style as a product constraint");
  });
});
