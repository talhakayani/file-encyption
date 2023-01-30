// function decrypt(chunk) {
//   var decipher, result, iv;

//   // Get the iv: the first 16 bytes
//   iv = chunk.slice(0, 16);

//   // Get the rest
//   chunk = chunk.slice(16);

//   // Create a decipher
//   decipher = crypto.createDecipheriv(algorithm, password, iv);

//   // Actually decrypt it
//   result = Buffer.concat([decipher.update(chunk), decipher.final()]);

//   return result;
// }

// // const fileContent = fs.readFileSync("image.png");
// // console.log("🚀 ~ file: index.js:41 ~ fileContent", fileContent);
// // var hw = encrypt(fileContent);
// // fs.writeFileSync("data.enc", hw);
// // console.log("🚀 ~ file: index.js:26 ~ hw", hw);
// // outputs hello world
// // console.log(decrypt(hw));

// const fileContentDecrypt = fs.readFileSync("data.enc");
// const revertedData = decrypt(fileContentDecrypt);

// fs.writeFileSync("data.png", revertedData);
