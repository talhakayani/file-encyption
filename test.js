// const crypto = require("crypto");

// const CryptoJS = require("ccrypto-js");

// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
//   modulusLength: 2048, // key size
//   publicKeyEncoding: {
//     type: "pkcs1",
//     format: "pem",
//   },
//   privateKeyEncoding: {
//     type: "pkcs1",
//     format: "pem",
//   },
// });
// console.log("🚀 ~ file: test.js:13 ~ publicKey:", publicKey);
// console.log("🚀 ~ file: test.js:3 ~ privateKey:", privateKey);
// const data = "Hello, world!";
// const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data));
// const encryptedHex = encrypted.toString("hex");
// console.log("🚀 ~ file: test.js:16 ~ encryptedHex:", encryptedHex);
// const encryptedData = Buffer.from(encryptedHex, "hex");
// const decrypted = crypto.privateDecrypt(privateKey, encryptedData);
// console.log(decrypted.toString());

// var keyPair = CryptoJS.lib.CipherParams.create({
//   format: "jwk",
//   key: CryptoJS.lib.WordArray.random(256 / 8),
// });
// console.log(
//   "🚀 ~ file: fileViewer.js:36 ~ fetchFileDetails ~ keyPair:",
//   keyPair
// );

// var keySize = 2048; // key size
// var crypt = new JSEncrypt({ default_key_size: keySize }); // create a new instance
// var publicKey = crypt.getPublicKey(); // get the public key
// var privateKey = crypt.getPrivateKey(); // get the private key

// const { RSAKey } = require("jsrsasign");
// const keyPair = new RSAKey();

// keyPair.generate(2048);
// console.log("🚀 ~ file: test.js:42 ~ keyPair:", keyPair);
// const publicKey = keyPair.getPublicKey();
// console.log("🚀 ~ file: test.js:45 ~ publicKey:", publicKey);
// const privateKey = keyPair.getPrivateKey();
// console.log("🚀 ~ file: test.js:47 ~ privateKey:", privateKey);

// const publicKeyString = publicKey.replace(/[\r\n]/g, "");
// const publicKeyData = CryptoJS.enc.Base64.parse(publicKeyString);
// const publicKeyParams = { key: publicKeyData, format: "DER" };
// const publicKeyObject =
//   CryptoJS.lib.CryptoJS.KJUR.asn1.x509.X509Util.getPublicKeyFromCertHex(
//     CryptoJS.enc.Hex.stringify(publicKeyData)
//   );

// // Encrypt data using the public key
// const data = "Hello, world!";
// const encryptedData = CryptoJS.AES.encrypt(data, publicKeyObject, {
//   mode: CryptoJS.mode.ECB,
//   padding: CryptoJS.pad.Pkcs7,
// });
// const encryptedDataString = encryptedData.toString();

// const privateKeyString = privateKey.replace(/[\r\n]/g, "");
// const privateKeyData = CryptoJS.enc.Base64.parse(privateKeyString);
// const privateKeyObject =
//   CryptoJS.lib.CryptoJS.KJUR.asn1.pkcs8.PrivateKeyInfo.decode(
//     CryptoJS.enc.Hex.parse(privateKeyData.toString(CryptoJS.enc.Hex))
//   ).getKey(CryptoJS.algo.RSA);

// // Decrypt the encrypted data using the private key
// const decryptedData = CryptoJS.AES.decrypt(
//   encryptedDataString,
//   privateKeyObject,
//   { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
// );
// const decryptedDataString = decryptedData.toString(CryptoJS.enc.Utf8);
// console.log(decryptedDataString); // Output: "Hello, world!"

const CryptoJS = require("crypto-js");

// Define the parameters for PBKDF2
const passphrase = "my passphrase";
const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex); // 16-byte salt
console.log("🚀 ~ file: test.js:87 ~ salt:", salt);
const iterations = 10000;
const keySize = 256;

// Generate the master key using PBKDF2
const masterKey = CryptoJS.PBKDF2(passphrase, salt, {
  keySize: keySize / 32,
  iterations: iterations,
});

// Generate a random string to use as the secret key
const secretKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

// Generate a random string to use as the access key
const accessKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

// Hash the secret key using the SHA-256 hash function
// const hashedSecretKey = CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex);

console.log("Secret Key: ", secretKey);
console.log("Access Key: ", accessKey);
// console.log('Hashed Secret Key: ', hashedSecretKey);

// Print out the master key and salt
console.log("Master key:", masterKey.toString(CryptoJS.enc.Hex));

console.log("Salt:", salt.toString(CryptoJS.enc.Hex));

const encrypted = CryptoJS.AES.encrypt(masterKey, secretKey, {
  iv: salt,
}).toString();

const signature = CryptoJS.HmacSHA256(encrypted, accessKey).toString(
  CryptoJS.enc.Hex
);

// ===================== Second Part ================================

// Create a signature of the encrypted text using the access key

// Verify the signature using the access key
const verified = CryptoJS.HmacSHA256(encrypted, accessKey).toString(
  CryptoJS.enc.Hex
);

if (signature === verified) {
  console.log("Signature is valid");
} else {
  console.log("Signature is not valid");
}

// Decrypt the text using the same secret key and IV
const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey, {
  iv: salt,
}).toString();

console.log(
  "Decrypted Text: ",
  decrypted === masterKey.toString(CryptoJS.enc.Hex)
);
