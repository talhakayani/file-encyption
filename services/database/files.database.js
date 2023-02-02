const Files = require("../../models/files.model");
const FileShare = require("../../models/fileShare.model");

const addFile = async (payload) => {
  const file = new Files(payload);
  return await file.save();
};
const getFile = async (_id) => {
  return await Files.findById(_id);
};
const shareFile = async (payload) => {
  const share = new FileShare(payload);
  return await share.save();
};

module.exports = { addFile, getFile, shareFile };
