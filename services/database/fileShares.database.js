const FileShares = require("../../models/fileShare.model");

const getFileSharesByQuery = async (query) => {
  const fileShares = await FileShares.find(query)
    .select("sharedHash status")
    .lean();

  return fileShares;
};
const getFileShareByHash = async (hash) => {
  const fileShares = await FileShares.findOne(hash)
    .populate([
      {
        path: "fileId",
        model: "File",
        populate: [{ path: "bucketId", model: "Bucket" }],
      },
    ])
    .lean();
  return fileShares;
};

module.exports = { getFileSharesByQuery, getFileShareByHash };
