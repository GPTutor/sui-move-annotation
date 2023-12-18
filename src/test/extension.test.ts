const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.sqlite");

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

  test("Annotate Moves from Database", async () => {
    let finished = false;

    // Import the move_analyzer_context module
    const move_analyzer_context_1 = await import("../move_analyzer_context.js");
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
    await move_analyzer_context.startClient();
    const client = move_analyzer_context.getClient();
    // console.log(client);

    // If the client is undefined, return undefined
    if (client === undefined) {
      return undefined;
    }

    // 檢索所有未注釋的 Move
    while (!finished) {
      const rows: any = await getUnannotatedMoves();
      if (!rows || rows.length === 0) {
        finished = true;
      } else {
        for (const row of rows) {
          await process_move(row, client);
        }
      }
    }
  });
});
async function process_move(row: any, client: any) {
  // 寫入 Move 到臨時文件
  const tempFilePath = `${process.cwd()}/move_env_for_api/sources/temp_${
    row.id
  }.move`;
  // console.log("Handeling row.id", row.id);
  fs.writeFileSync(tempFilePath, row.move);
  let document = await vscode.workspace.openTextDocument(tempFilePath);
  await vscode.window.showTextDocument(document);
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    window.showErrorMessage("No active editor");
    throw new Error("No active editor");
  }
  document = editor.document;

  // console.log("Before Hint");
  // Send a request for inlay hints using the client
  try {
    const hints = await client.sendRequest("textDocument/inlayHint", {
      range: [
        { line: 0, character: 0 },
        { line: document.lineCount, character: 0 },
      ],
      textDocument: { uri: document.uri.toString() },
    });

    // console.log("hints", hints);

    // Log the line count and the first hint
    // console.log(document.lineCount, hints[0]);

    const text = document.getText();
    let lines = text.split("\n");
    // console.log(hints);
    let linesPrePadding = Object();

    // Iterate through the hints
    for (let i = 0; i < hints.length; i++) {
      const hint = hints[i];
      if (hint.kind === 2) {
        // console.log(lines[hint.position.line]);
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
          linesPrePadding[hint.position.line] += hint.label[0].value.length + 1;
        } else {
          console.error("Invalid character position");
        }
      }
    }

    // 讀取處理後的 Move
    const annotatedMove = lines.join("\n");

    // 更新數據庫中的 Move 記錄
    db.run(
      "UPDATE moves SET annotatedMove = ?, annotated = TRUE WHERE id = ?",
      [annotatedMove, row.id]
    );
  } catch (e) {
    // update db to annotated = true and nnotated move = row.move
    db.run(
      "UPDATE moves SET annotatedMove = ?, annotated = TRUE WHERE id = ?",
      [row.move, row.id]
    );
  }

  // 刪除臨時文件
  fs.unlinkSync(tempFilePath);
}

// Function to query the database
const getUnannotatedMoves = () => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM moves WHERE annotated = FALSE",
      (err: any, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
