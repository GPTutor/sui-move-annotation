const db = require("../db/dbConfig");
const { generateRandomString } = require("./generateRandomString");
const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);
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
  await execAsync(
    `tmux has-session -t ${session_name} 2>/dev/null || tmux new-session -d -s ${session_name} "cd ${process.cwd()} && xvfb-run -a npm run test"`
  );

  return randomString;
}
exports.startMoveAnnotation = startMoveAnnotation;
