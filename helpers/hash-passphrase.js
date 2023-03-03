// const password = "somePeopleHaveCurlyBrownHairComb";
const CryptoJs = require("crypto-js");

const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// const password = generateRandomString(32);

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getConvertedKey = (originalKey) => {
  const randomSalt = generateRandomString(32);

  const inputLocation = getRandomNumber(0, 31);

  return {
    location: inputLocation,
    randomSalt,
    key: [
      ...originalKey.slice(0, inputLocation),
      ...randomSalt,
      ...originalKey.slice(inputLocation, originalKey.length),
    ].join(""),
  };
};

const getOriginalKey = (pasePhraseDetails) => {
  return pasePhraseDetails.key.replace(pasePhraseDetails.randomSalt, "");
};

const encryptInformation = (information) => {
  const cipherText = CryptoJs.AES.encrypt(
    information,
    process.env.PASS_PHRASE_ENCRYPTION_PRIVATE_KEY
  );

  return cipherText.toString();
};

const generateHash = (data) => {
  const hash = CryptoJs.HmacSHA256(
    data,
    process.env.PASS_PHRASE_ENCRYPTION_PRIVATE_KEY
  );

  return hash;
};

const generateRandomSalt = (bucketId) => {
  const randomStringTempSalt = generateRandomString(32);
  const hash = CryptoJs.HmacSHA256(
    { randomStringTempSalt, bucketId },
    process.env.PASS_PHRASE_ENCRYPTION_PRIVATE_KEY
  );

  return hash.toString();
};

module.exports = {
  getOriginalKey,
  getConvertedKey,
  generateRandomString,
  encryptInformation,
  generateHash,
  generateRandomSalt,
};
