const { db } = require("../server");

// Function to execute a query and return a promise
function queryDatabase(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Refactored function using async/await
async function getAnnotatedMove(id) {
  try {
    const row = await queryDatabase("SELECT * FROM moves WHERE id = ?", [id]);
    if (!row) {
      return { status: 404, body: { message: "Move not found" } };
    }
    if (row.annotated) {
      return {
        status: 200,
        body: {
          message: "Annotated Move found",
          annotatedMove: row.annotatedMove,
        },
      };
    } else {
      return {
        status: 204,
        body: { message: "Move has not been annotated yet" },
      };
    }
  } catch (err) {
    return { status: 500, body: { message: "Error querying the database" } };
  }
}

exports.getAnnotatedMove = getAnnotatedMove;
