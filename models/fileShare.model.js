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
  },

  { timestamps: true }
);

const FileShare = model("FileShare", fileSchema);
module.exports = FileShare;
