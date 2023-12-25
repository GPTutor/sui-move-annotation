const db = require("../db/dbConfig");

async function deleteAnnotatedMove(id) {
  try {
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM moves WHERE id = ?", [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (deleteErr) {
    console.error("Error deleting the move:", deleteErr);
  }
}

exports.deleteAnnotatedMove = deleteAnnotatedMove;
