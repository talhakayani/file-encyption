const { model, Schema } = require("mongoose");
const fileSchema = new Schema(
  {
    fileId: { type: Schema.Types.ObjectId, ref: "File" },
    sharedHash: { type: String },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
    secretKey: {
      type: String,
    },
    grant: {
      type: String,
    },
    signature: {
      type: String,
    },
  },

  { timestamps: true }
);

const FileShare = model("FileShare", fileSchema);

module.exports = FileShare;
