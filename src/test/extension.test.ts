import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { window } from "vscode";
import * as fs from "fs";

import * as child_process from "child_process";
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  child_process.execSync("bash set_up_test_env.sh");

  test("Sample test", async () => {
    let target_file_path =
      process.env.FILE_PATH ||
      "/Users/eason/codes/Bucket-Protocol/GPTutor_Example_Codes/Move/fungible_tokens/sources/managed.move";
    let output_file_path = process.env.OUTPUT_FILE_PATH || "";
    let document = await vscode.workspace.openTextDocument(target_file_path);
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      window.showErrorMessage("No active editor");
      throw new Error("No active editor");
    }
    document = editor.document;

    const languageId = document.languageId;
    console.log(languageId);
    // Check if the languageId is "move"
    if (languageId == "move" || true) {
      // Import the move_analyzer_context module
      const move_analyzer_context_1 = await import(
        "../move_analyzer_context.js"
      );
      // Define the configuration object for move_analyzer_context
      const whereisOutput = child_process.execSync("whereis move-analyzer", {
        encoding: "utf8",
      });
      const pathMatches = whereisOutput.match(/move-analyzer:\s*(\S+)/);
      const moveAnalyzerPath = pathMatches ? pathMatches[1] : "";

      const configuration = {
        server: { path: moveAnalyzerPath },
        serverPath: moveAnalyzerPath,
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
      const move_analyzer_context: any = move_analyzer_context_1.Context.create(
        { subscriptions: [] },
        configuration
      );
      // Start the client for move_analyzer_context
      console.log(move_analyzer_context);
      console.log("move_analyzer_context.startClient");
      await move_analyzer_context.startClient();
      const client = move_analyzer_context.getClient();
      console.log(client);

      // If the client is undefined, return undefined
      if (client === undefined) {
        return undefined;
      }
      console.log("Before Hint");
      // Send a request for inlay hints using the client
      const hints = await client.sendRequest("textDocument/inlayHint", {
        range: [
          { line: 0, character: 0 },
          { line: document.lineCount, character: 0 },
        ],
        textDocument: { uri: document.uri.toString() },
      });
      console.log("hints", hints);

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
      // console.log(lines.join("\n"));
      // await sleep(20000);
      if (output_file_path) {
        await fs.writeFile(
          output_file_path,
          lines.join("\n"),
          (err: NodeJS.ErrnoException | null) => {
            if (err) {
              console.error("Error writing file:", err);
            } else {
              console.log("The file was saved!");
            }
          }
        );
      }
    }
  });
});
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
