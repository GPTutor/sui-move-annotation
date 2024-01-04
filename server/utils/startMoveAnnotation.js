const db = require("../db/dbConfig");
const { generateRandomString } = require("./generateRandomString");
const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

function getSourceCommand() {
  const shell = process.env.SHELL;

  if (shell.includes("bash")) {
    return "source ~/.bashrc";
  } else if (shell.includes("zsh")) {
    return "source ~/.zshrc";
  }
  // Add more conditions if you want to support other shells

  return ""; // Return empty string if the shell is not recognized
}

async function startMoveAnnotation(move) {
  const randomString = generateRandomString();

  await new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO moves (id, move) VALUES (?, ?)",
      [randomString, move],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });

  let session_name = "move_annotate";
  let sourceCmd = getSourceCommand();
  let output = await execAsync(
    `tmux has-session -t ${session_name} 2>/dev/null || tmux new-session -d -s ${session_name} "${sourceCmd} && cd ${process.cwd()} && xvfb-run -a npm run test"`
  );

  return randomString;
}
exports.startMoveAnnotation = startMoveAnnotation;
