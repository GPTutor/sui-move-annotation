const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.sqlite');

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
app.use(express.json());
app.use(cors());

// Serve Swagger documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define a simple route
const fs = require("fs");
const { exec, execSync } = require("child_process");
const { generateRandomValue } = require('./generateRandomValue');

app.post("/api/v1/move-annotate", (req, res) => {
  const { move } = req.body;
  const randomVarName = generateRandomVariable();

  // 插入數據到數據庫
  db.run('INSERT INTO moves (id, move) VALUES (?, ?)', [randomVarName, move], function(err) {
    if (err) {
      return console.error(err.message);
    }

    // 告知客戶端操作成功
    res.status(200).send({
      message: "Move code received and stored successfully",
      id: randomVarName
    });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
