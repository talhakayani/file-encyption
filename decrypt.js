const crypto = require("crypto");
const fs = require("fs");
const algorithm = "aes-256-ctr";
const { comparePassword } = require("./secure-password");

const fileContent = fs.readFileSync("hashedPassword.json");
const fileContentDetails = JSON.parse(fileContent.toString());
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const getPasswordAuthentication = async () => {
  const checkPasswordAuthentication = await comparePassword(
    fileContentDetails?.originalPassword,
    fileContentDetails?.hashedPassword
  );
  // await sleep(2000);
  console.log(
    "🚀 ~ file: decrypt.js:16 ~ getPasswordAuthentication ~ checkPasswordAuthentication",
    checkPasswordAuthentication
  );
  // if (checkPasswordAuthentication) {
  function decrypt(chunk) {
    var decipher, result, iv;

    // Get the iv: the first 16 bytes
    iv = chunk.slice(0, 16);

    // Get the rest
    chunk = chunk.slice(16);

    // Create a decipher
    decipher = crypto.createDecipheriv(
      algorithm,
      fileContentDetails?.originalPassword,
      iv
    );

    // Actually decrypt it
    result = Buffer.concat([decipher.update(chunk), decipher.final()]);

    return result;
  }

  const fileContentDecrypt = fs.readFileSync("data.enc");
  const revertedData = decrypt(fileContentDecrypt);

  fs.writeFileSync("data.png", revertedData);
  // } else {
  //   console.log("XXXXXXXXX Entered phrase is incorrect XXXXXXXXXX");
  // }
};
getPasswordAuthentication();
