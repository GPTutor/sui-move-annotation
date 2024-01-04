function processCodeToRemoveTypeAnnotation(code) {
  let inFunctionDefinition = false;
  let inFunction = false;
  let processedLines = [];

  code.split("\n").forEach((line) => {
    // Check if entering function definition
    if (line.includes("fun")) {
      inFunctionDefinition = true;
    }
    if (line.includes("(")) {
      inFunction = true;
    }

    // If not in function definition, process the line
    if (!inFunctionDefinition & inFunction) {
      // Only remove the colon followed by spaces (for type annotations)
      line = line.replace(/\w+\s*:\s/g, "");
    }
    if (line.includes(")")) {
      inFunction = false;
    }

    // Check if leaving function definition
    if (inFunctionDefinition && line.includes(")")) {
      inFunctionDefinition = false;
    }

    processedLines.push(line);
  });

  return processedLines.join("\n");
}

module.exports = processCodeToRemoveTypeAnnotation;
