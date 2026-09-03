import { ParsedStarter } from "./models";

export function reconcileTypingImports(source: string, parsed: ParsedStarter): string {
  if (parsed.requiredTypingNames.length === 0) return source;

  const lines = source.split(/\r?\n/);
  const existing = parsed.typingImports[0];
  if (existing) {
    const names = [...new Set([...existing.names, ...parsed.requiredTypingNames])].sort();
    lines.splice(existing.line - 1, existing.endLine - existing.line + 1, `from typing import ${names.join(", ")}`);
    return lines.join("\n");
  }

  lines.splice(parsed.insertionLine, 0, `from typing import ${parsed.requiredTypingNames.join(", ")}`);
  return lines.join("\n");
}
