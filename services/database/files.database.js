const Files = require("../../models/files.model");

const addFile = async (payload) => {
  const file = new Files(payload);
  return await file.save();
};

module.exports = { addFile };
