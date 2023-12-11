// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { window } from "vscode";

import * as fs from "fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "sui-move-annotation.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from sui-move-annotation!"
      );
    }
  );
  let annotate = vscode.commands.registerCommand(
    "sui-move-annotation.annotate",
    async (path: string = "") => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        window.showErrorMessage("No active editor");
        throw new Error("No active editor");
      }
      const document = editor.document;
      if (path.startsWith("/")) {
        path = "file://" + path;
      }
      if (!path) {
        path = document.uri.toString();
      }
      const languageId = document.languageId;
      // Check if the languageId is "move"
      if (languageId == "move") {
        // Import the move_analyzer_context module
        const move_analyzer_context_1 = await import(
          "./move_analyzer_context.js"
        );
        // Define the configuration object for move_analyzer_context
        const configuration = {
          server: { path: "/Users/eason/.cargo/bin/move-analyzer" },
          serverPath: "/Users/eason/.cargo/bin/move-analyzer",
          inlay: {
            hints: {
              parameter: true,
              field: { type: true },
              declare: { var: true },
            },
          },
          trace: { server: "off" },
        };
        // Create an instance of move_analyzer_context with the provided extensionContext and configuration
        const move_analyzer_context: any =
          move_analyzer_context_1.Context.create(context, configuration);
        // Start the client for move_analyzer_context
        await move_analyzer_context.startClient();
        const client = move_analyzer_context.getClient();

        // If the client is undefined, return undefined
        if (client === undefined) {
          return undefined;
        }

        // Send a request for inlay hints using the client
        const hints = await client.sendRequest("textDocument/inlayHint", {
          range: [
            { line: 0, character: 0 },
            { line: document.lineCount, character: 0 },
          ],
          textDocument: { uri: document.uri.toString() },
        });

        // Log the line count and the first hint
        console.log(document.lineCount, hints[0]);

        const text = document.getText();
        let lines = text.split("\n");
        console.log(hints);
        let linesPrePadding = Object();

        // Iterate through the hints
        for (let i = 0; i < hints.length; i++) {
          const hint = hints[i];
          if (hint.kind === 2) {
            console.log(lines[hint.position.line]);
            let line = lines[hint.position.line];
            if (hint.position.character <= line.length) {
              // Insert the hint value at the specified position in the line
              if (!linesPrePadding[hint.position.line]) {
                linesPrePadding[hint.position.line] = 0;
              }

              const newLine =
                line.substring(
                  0,
                  hint.position.character + linesPrePadding[hint.position.line]
                ) +
                hint.label[0].value +
                " " +
                line.substring(
                  hint.position.character + linesPrePadding[hint.position.line]
                );
              lines[hint.position.line] = newLine;
              linesPrePadding[hint.position.line] +=
                hint.label[0].value.length + 1;
            } else {
              console.error("Invalid character position");
            }
          }
        }
        console.log(lines.join("\n"));
      }
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(annotate);
}

// This method is called when your extension is deactivated
export function deactivate() {}
