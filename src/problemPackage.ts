import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ParsedStarter, ProblemPackage } from "./models";

export function slugify(value: string): string {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "clipboard-problem";
}

export async function createProblemPackage(
  workspaceRoot: string,
  title: string,
  source: string,
  parsed: ParsedStarter
): Promise<string> {
  const slug = slugify(title);
  const directory = join(workspaceRoot, ".leetcode-python", "problems", `local-${slug}`);
  await mkdir(directory, { recursive: true });

  const metadata: ProblemPackage = {
    formatVersion: 1,
    source: { kind: "clipboard", importedAt: new Date().toISOString() },
    problem: { id: null, slug: `local-${slug}`, title },
    method: {
      name: parsed.methodName,
      params: parsed.parameters,
      return: { annotation: parsed.returnAnnotation },
    },
    localSupport: { status: "pending", reason: "Runner support has not yet been evaluated." },
  };
  await Promise.all([
    writeFile(join(directory, "solution.py"), source, "utf8"),
    writeFile(join(directory, "problem.json"), `${JSON.stringify(metadata, null, 2)}\n`, "utf8"),
    writeFile(join(directory, "cases.json"), '{\n  "formatVersion": 1,\n  "cases": []\n}\n', "utf8"),
  ]);
  return directory;
}
