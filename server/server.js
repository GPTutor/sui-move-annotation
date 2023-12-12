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

// Generate a random variable name
const generateRandomVariable = () => {
  const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomVariable = "";
  for (let i = 0; i < 10; i++) {
    randomVariable += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
  }
  return randomVariable;
};

const randomVarName = generateRandomVariable();

// Express route handler

app.post("/api/v1/move-annotate", (req, res) => {
  const { move } = req.body;

  // Step 1: Write the 'move' string to a file
  const filePath = path.resolve(`move_env_for_api/sources/${randomVarName}.move`);
  fs.writeFileSync(filePath, move);

  // Step 2: Execute the bash command
  const outputFilePath = path.resolve(`move_env_for_api/sources/${randomVarName}.movea`);
  const command = `FILE_PATH="${filePath}" OUTPUT_FILE_PATH="${outputFilePath}" xvfb-run -a npm run test`;

  try {
    execSync(command, { stdio: 'inherit' });
    // Step 3: Read the contents of the output file
    const newMove = fs.readFileSync(outputFilePath, "utf8");

    // Step 4: Delete the files
    fs.unlinkSync(filePath);
    fs.unlinkSync(outputFilePath);
    // execSync(`rm ${filePath} ${outputFilePath}`, { stdio: 'inherit' });

    // Send a response back to the client
    res.status(200).send({
      message: "Move code received and processed successfully",
      move: newMove,
    });
  } catch (error) {
    console.error(`execSync error: ${error}`);
    res.status(500).send({ message: "Error executing bash command" });
  }
});

// app.post("/api/v1/move-annotate", (req, res) => {
//   const { move } = req.body;

//   // Step 1: Write the 'move' string to a file
//   const filePath = path.resolve(`move_env_for_api/sources/${randomVarName}.move`);
//   fs.writeFileSync(filePath, move);

//   // Step 2: Execute the bash command
//   const outputFilePath = path.resolve(`move_env_for_api/sources/${randomVarName}.movea`);
//   const command = `FILE_PATH="${filePath}" OUTPUT_FILE_PATH="${outputFilePath}" xvfb-run -a npm run test`;
//   console.log(command);
//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error}. ${stdout}, ${stderr}`);
//       return res.status(500).send({ message: "Error executing bash command" });
//     }

//     // Step 3: Read the contents of the output file
//     const newMove = fs.readFileSync(outputFilePath, "utf8");

//     // Step 4: Delete the files
//     fs.unlinkSync(filePath);
//     fs.unlinkSync(outputFilePath);

//     // Send a response back to the client
//     res.status(200).send({
//       message: "Move code received and processed successfully",
//       move: newMove,
//     });
//   });
// });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
