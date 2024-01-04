const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.sqlite");
exports.db = db;

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
exports.app = app;
// app.use(express.json());
app.use(cors());

var bodyParser = require("body-parser");
app.use(express.json({ limit: "50mb" })); // for parsing application/json
app.use(express.urlencoded({ limit: "50mb", extended: true })); // for parsing application/x-www-form-urlencoded

// Serve Swagger documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const annotateMove = require("./api/v1/annotate-move");
app.use(annotateMove);

const moveRemoveAnnotate = require("./api/v1/move-remove-annotate");
app.use(moveRemoveAnnotate);

const startMoveAnnotate = require("./api/v1/create-move-annotation-task");
app.use(startMoveAnnotate);

const getAndDeleteAnnotatedMove = require("./api/v1/get-and-delete-annotated-move");
app.use(getAndDeleteAnnotatedMove);

const getAnnotatedMove = require("./api/v1/get-annotated-move");
app.use(getAnnotatedMove);

// Define a simple route
const fs = require("fs");
const { exec, execSync } = require("child_process");

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
