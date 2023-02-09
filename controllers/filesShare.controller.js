const { HTTP_STATUS_CODE } = require("../configs/constants");
const { encryptInformation } = require("../helpers/hash-passphrase");
const database = require("../services/database");

const getFileSharesByHash = async (request, response) => {
  try {
    const { sharedHash } = request.query;

    const fileShares = await database.fileShares.getFileShareByHash({
      sharedHash,
    });

    if (fileShares?.length <= 0) {
      return response
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ success: false, message: "share link not found." });
    }

    const encryptedSharesDetails = encryptInformation(
      JSON.stringify(fileShares)
    );

    return response
      .status(HTTP_STATUS_CODE.OK)
      .send({ success: true, fileInformation: encryptedSharesDetails });
  } catch (err) {
    console.log("🚀 ~ file: files.controllers.js:8 ~ addFiles ~ err", err);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(err);
  }
};

const getAllFileShares = async (request, response) => {
  try {
    const fileShares = database.fileShares.getFileSharesByQuery({});

    return response
      .status(HTTP_STATUS_CODE.OK)
      .send({ success: true, fileShares });
  } catch (err) {
    console.log("🚀 ~ file: files.controllers.js:8 ~ addFiles ~ err", err);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(err);
  }
};

const getSharesByFileId = async (request, response) => {
  try {
    const { fileId } = request.query;

    const shareLinks = await database.fileShares.getFileSharesByQuery({
      fileId,
    });

    return response
      .status(HTTP_STATUS_CODE.OK)
      .send({ success: true, shareLinks });
  } catch (err) {
    console.log("🚀 ~ file: files.controllers.js:8 ~ addFiles ~ err", err);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(err);
  }
};

module.exports = { getFileSharesByHash, getAllFileShares, getSharesByFileId };
