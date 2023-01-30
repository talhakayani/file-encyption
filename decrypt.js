const crypto = require("crypto");
const fs = require("fs");
const algorithm = "aes-256-ctr";
// const password = "secure my files hfh hhj $#@%^ hh";
const password = "somethingwentwrongwhiletestingth";

function decrypt(chunk) {
  var decipher, result, iv;

  // Get the iv: the first 16 bytes
  iv = chunk.slice(0, 16);

  // Get the rest
  chunk = chunk.slice(16);

  // Create a decipher
  decipher = crypto.createDecipheriv(algorithm, password, iv);

  // Actually decrypt it
  result = Buffer.concat([decipher.update(chunk), decipher.final()]);

  return result;
}

const fileContentDecrypt = fs.readFileSync("data.enc");
const revertedData = decrypt(fileContentDecrypt);

fs.writeFileSync("data.png", revertedData);
