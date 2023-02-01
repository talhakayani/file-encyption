const crypto = require("crypto");
const fs = require("fs");
const { generateRandomString, getConvertedKey } = require("./hash-passphrase");
const algorithm = "aes-256-ctr";

// Get Random Password
const password = generateRandomString(32);

// Encrypt PassPhrase using random insert location
const encryptedPassword = getConvertedKey(password);

fs.writeFileSync("key.json", JSON.stringify(encryptedPassword));

function encrypt(chunk) {
  var cipher, result, iv;

  // Create an iv
  iv = crypto.randomBytes(16);
  console.log("🚀 ~ file: encrypt.js:19 ~ encrypt ~ iv", iv);

  // Create a new cipher
  cipher = crypto.createCipheriv(algorithm, password, iv);

  // Create the new chunk
  result = Buffer.concat([iv, cipher.update(chunk), cipher.final()]);

  return result;
}

const fileContent = fs.readFileSync("image.png");
console.log("🚀 ~ file: index.js:41 ~ fileContent", fileContent);
var hw = encrypt(fileContent);
fs.writeFileSync("data.enc", hw);
