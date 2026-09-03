import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext): void {
  const showStatus = vscode.commands.registerCommand(
    "leetcodePythonLocal.showStatus",
    () => {
      void vscode.window.showInformationMessage(
        "LeetCode Python Local is gated on its E4 source-template experiment."
      );
    }
  );

  context.subscriptions.push(showStatus);
}

export function deactivate(): void {
  // No background resources are created by the initial extension shell.
}
