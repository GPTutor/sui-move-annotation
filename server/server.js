const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.sqlite");

db.run(`CREATE TABLE IF NOT EXISTS moves (
  id TEXT PRIMARY KEY,
  move TEXT,
  annotatedMove TEXT,
  annotated BOOLEAN DEFAULT FALSE
)`);

// Import necessary modules
const cors = require("cors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const path = require("path");

require("dotenv").config();

// Create an Express application
const app = express();
// app.use(express.json());
app.use(cors());

var bodyParser = require("body-parser");
app.use(express.json({ limit: "50mb" })); // for parsing application/json
app.use(express.urlencoded({ limit: "50mb", extended: true })); // for parsing application/x-www-form-urlencoded

// Serve Swagger documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define a simple route
const fs = require("fs");
const { exec, execSync } = require("child_process");
const { generateRandomString } = require("./generateRandomString");

app.post("/api/v1/move-annotate", (req, res) => {
  const { move } = req.body;
  const randomString = generateRandomString();

  // 插入數據到數據庫
  db.run(
    "INSERT INTO moves (id, move) VALUES (?, ?)",
    [randomString, move],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      let session_name = "move_annotate";
      exec(
        `tmux has-session -t ${session_name} 2>/dev/null || tmux new-session -d -s ${session_name} "cd ${process.cwd()} && xvfb-run -a npm run test"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
        }
      );

      // 告知客戶端操作成功
      res.status(200).send({
        message: "Move code received and stored successfully",
        id: randomString,
      });
    }
  );
});

// Modularized function to retrieve an annotated move
function getAnnotatedMove(id, callback) {
  db.get("SELECT * FROM moves WHERE id = ?", [id], (err, row) => {
    if (err) {
      return callback({ status: 500, message: "Error querying the database" });
    }
    if (row) {
      if (row.annotated) {
        callback(null, {
          status: 200,
          message: "Annotated Move found",
          annotatedMove: row.annotatedMove,
        });
      } else {
        callback({ status: 200, message: "Move has not been annotated yet" });
      }
    } else {
      callback({ status: 404, message: "Move not found" });
    }
  });
}

// New endpoint for getting an annotated move without deleting
app.get("/api/v1/get-annotated-move", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send({ message: "ID is required" });
  }

  getAnnotatedMove(id, (err, result) => {
    if (err) {
      return res.status(err.status).send({ message: err.message });
    }
    res.status(result.status).send(result);
  });
});

// Updated existing endpoint to use the modularized function
app.get("/api/v1/get-and-delete-annotated-move", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send({ message: "ID is required" });
  }

  getAnnotatedMove(id, (err, result) => {
    if (err) {
      return res.status(err.status).send({ message: err.message });
    }
    res.status(result.status).send(result);

    // Delete the move after sending the response
    if (result.annotatedMove) {
      db.run("DELETE FROM moves WHERE id = ?", [id], (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting the move:", deleteErr);
        }
      });
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
