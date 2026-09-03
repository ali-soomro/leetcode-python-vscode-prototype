import { spawn } from "node:child_process";
import { ParsedStarter } from "./models";

const parserProgram = String.raw`
import ast, json, sys

source = sys.stdin.read()
try:
    module = ast.parse(source)
except SyntaxError as error:
    print(json.dumps({"ok": False, "error": f"Syntax error on line {error.lineno}: {error.msg}"}))
    raise SystemExit(0)

solution = next((node for node in module.body if isinstance(node, ast.ClassDef) and node.name == "Solution"), None)
if solution is None:
    print(json.dumps({"ok": False, "error": "Clipboard source has no class Solution"}))
    raise SystemExit(0)

methods = [node for node in solution.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and not node.name.startswith("_")]
if len(methods) != 1:
    print(json.dumps({"ok": False, "error": "Solution must contain exactly one public method for v0.1 import"}))
    raise SystemExit(0)

method = methods[0]
args = method.args.posonlyargs + method.args.args
if args and args[0].arg == "self":
    args = args[1:]

def render(node):
    return ast.unparse(node) if node is not None else None

annotations = [argument.annotation for argument in args] + [method.returns]
typing_names = sorted({name.id for annotation in annotations if annotation is not None for name in ast.walk(annotation) if isinstance(name, ast.Name) and name.id in {"List", "Optional", "Dict"}})

typing_imports = []
for node in module.body:
    if isinstance(node, ast.ImportFrom) and node.module == "typing":
        names = [alias.name for alias in node.names]
        if any(alias.asname is not None or alias.name == "*" for alias in node.names):
            print(json.dumps({"ok": False, "error": "Typing imports with aliases or star imports are not supported by v0.1"}))
            raise SystemExit(0)
        typing_imports.append({"line": node.lineno, "endLine": node.end_lineno, "names": names})

insertion_line = 0
body = module.body
index = 0
if body and isinstance(body[0], ast.Expr) and isinstance(getattr(body[0], "value", None), ast.Constant) and isinstance(body[0].value.value, str):
    insertion_line = body[0].end_lineno
    index = 1
while index < len(body) and isinstance(body[index], ast.ImportFrom) and body[index].module == "__future__":
    insertion_line = body[index].end_lineno
    index += 1

print(json.dumps({
    "ok": True,
    "value": {
        "methodName": method.name,
        "parameters": [{"name": argument.arg, "annotation": render(argument.annotation)} for argument in args],
        "returnAnnotation": render(method.returns),
        "requiredTypingNames": typing_names,
        "typingImports": typing_imports,
        "insertionLine": insertion_line,
    },
}))
`;

export async function parseStarter(pythonPath: string, source: string): Promise<ParsedStarter> {
  const result = await new Promise<string>((resolve, reject) => {
    const child = spawn(pythonPath, ["-I", "-c", parserProgram], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(stderr || `Python parser exited with ${code}`));
      else resolve(stdout);
    });
    child.stdin.end(source);
  });

  const payload = JSON.parse(result) as { ok: boolean; error?: string; value?: ParsedStarter };
  if (!payload.ok || !payload.value) throw new Error(payload.error ?? "Unable to parse clipboard source");
  return payload.value;
}
