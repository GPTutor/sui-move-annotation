const generateRandomValue = () => {
  const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomVariable = "";
  for (let i = 0; i < 10; i++) {
    randomVariable += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
  }
  return randomVariable;
};
exports.generateRandomValue = generateRandomValue;
