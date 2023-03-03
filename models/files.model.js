const { model, Schema } = require("mongoose");

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: { type: String, required: true },
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    url: { type: String },
    passphrase: { type: String },
    bucketId: { type: Schema.Types.ObjectId, required: true, ref: "Bucket" },
  },

  { timestamps: true }
);

const File = model("File", fileSchema);
module.exports = File;
