const { model, Schema } = require("mongoose");
const { generateRandomSalt } = require("../helpers/hash-passphrase");

const bucketSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      unique: true,
    },
  },

  { timestamps: true }
);

bucketSchema.pre("save", (next) => {
  console.log("bucket Created", this);
  const generatedSalt = generateRandomSalt(this?._id);
  console.log(
    "🚀 ~ file: bucket.model.js:24 ~ bucketSchema.post ~ generatedSalt:",
    generatedSalt
  );
  // await findOneAndUpdate({ _id: doc?._id }, { $set: { salt: generatedSalt } });
  this["salt"] = generatedSalt;
  return next();
});

const Bucket = model("Bucket", bucketSchema);

module.exports = Bucket;
