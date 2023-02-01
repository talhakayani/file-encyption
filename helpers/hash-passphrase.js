// const password = "somePeopleHaveCurlyBrownHairComb";

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

module.exports = {
  getOriginalKey,
  getConvertedKey,
  generateRandomString,
};
