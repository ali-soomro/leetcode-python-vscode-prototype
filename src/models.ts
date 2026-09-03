export interface Parameter {
  name: string;
  annotation?: string;
}

export interface TypingImport {
  line: number;
  endLine: number;
  names: string[];
}

export interface ParsedStarter {
  methodName: string;
  parameters: Parameter[];
  returnAnnotation?: string;
  requiredTypingNames: string[];
  typingImports: TypingImport[];
  insertionLine: number;
}

export interface ProblemPackage {
  formatVersion: 1;
  source: { kind: "clipboard"; importedAt: string };
  problem: { id: null; slug: string; title: string };
  method: {
    name: string;
    params: Parameter[];
    return: { annotation?: string };
  };
  localSupport: { status: "pending"; reason: string };
}
