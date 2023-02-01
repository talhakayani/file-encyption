const bcrypt = require("bcrypt");
const fs = require("fs");

const cryptPassword = async (password) => {
  bcrypt.genSalt(10, function (err, Salt) {
    // The bcrypt is used for encrypting password.
    bcrypt.hash(password, Salt, function (err, hash) {
      if (err) {
        return console.log("Cannot encrypt");
      }

      hashedPassword = hash;
      const data = { originalPassword: password, hashedPassword };
      fs.writeFileSync("hashedPassword.json", JSON.stringify(data));

      return hashedPassword;
    });
  });
};
const comparePassword = async (password, hashedPassword) => {
  let matched = 0;
  bcrypt.compare(password, hashedPassword, async function (err, isMatch) {
    // Comparing the original password to
    // encrypted password
    if (isMatch) {
      console.log("Encrypted password is: ", password);
      console.log("Decrypted password is: ", hashedPassword);
      matched = 1;
    }

    if (!isMatch) {
      // If password doesn't match the following
      // message will be sent
      console.log(hashedPassword + " is not encryption of " + password);
    }
  });

  return matched;
};

module.exports = {
  cryptPassword,
  comparePassword,
};
