/**
 * LeetCode can copy a blank method scaffold with no suite body. It is not
 * parseable Python until a user writes code, so add `pass` only to an empty
 * `def` suite. Other syntax errors remain errors and are never repaired.
 */
export function normalizeStarterSource(source: string): string {
  const lines = source.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = /^(\s*)(?:async\s+)?def\s+[A-Za-z_]\w*\(.*\)\s*(?:->\s*[^:]+)?\s*:\s*(?:#.*)?$/.exec(line);
    if (!match) continue;

    const indentation = match[1].length;
    let next = index + 1;
    while (next < lines.length && (lines[next].trim() === "" || lines[next].trim().startsWith("#"))) next += 1;
    const nextIndentation = next < lines.length ? lines[next].match(/^\s*/)?.[0].length ?? 0 : 0;
    if (next === lines.length || nextIndentation <= indentation) {
      lines.splice(index + 1, 0, `${match[1]}    pass`);
      index += 1;
    }
  }
  return lines.join("\n");
}
