const crypto = require("crypto");
const fs = require("fs");
const { getOriginalKey } = require("./hash-passphrase");
const algorithm = "aes-256-ctr";

const fileContent = fs.readFileSync("key.json");
const fileContentDetails = JSON.parse(fileContent.toString());

const password = getOriginalKey(fileContentDetails);

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
