import * as vscode from "vscode";
import { createProblemPackage } from "./problemPackage";
import { parseStarter } from "./pythonAst";
import { reconcileTypingImports } from "./typingImports";

export function activate(context: vscode.ExtensionContext): void {
  const showStatus = vscode.commands.registerCommand(
    "leetcodePythonLocal.showStatus",
    () => {
      void vscode.window.showInformationMessage(
        "LeetCode Python Local is gated on its E4 source-template experiment."
      );
    }
  );

  const importStarter = vscode.commands.registerCommand(
    "leetcodePythonLocal.importStarter",
    async () => {
      let workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
      if (!workspaceRoot) {
        const selected = await vscode.window.showOpenDialog({
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          openLabel: "Use folder for LeetCode Python problems",
          title: "Choose a folder for local LeetCode Python problems",
        });
        workspaceRoot = selected?.[0];
        if (!workspaceRoot) return;
      }
      const pythonPath = vscode.workspace.getConfiguration("leetcodePythonLocal").get<string>("pythonPath", "python3");
      const clipboard = await vscode.env.clipboard.readText();
      try {
        const parsed = await parseStarter(pythonPath, clipboard);
        const title = await vscode.window.showInputBox({ prompt: "Problem title", value: parsed.methodName });
        if (!title) return;
        const directory = await createProblemPackage(
          workspaceRoot.fsPath,
          title,
          reconcileTypingImports(clipboard, parsed),
          parsed
        );
        await vscode.window.showTextDocument(vscode.Uri.file(`${directory}/solution.py`));
        await vscode.window.showInformationMessage(`Created local problem package: ${directory}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await vscode.window.showErrorMessage(`Could not import starter: ${message}`);
      }
    }
  );

  context.subscriptions.push(showStatus, importStarter);
}

export function deactivate(): void {
  // No background resources are created by the initial extension shell.
}
