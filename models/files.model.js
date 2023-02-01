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
  },

  { timestamps: true }
);

const File = model("Admin", fileSchema);
module.exports = File;
