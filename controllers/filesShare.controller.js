const { HTTP_STATUS_CODE } = require("../configs/constants");
const { encryptInformation } = require("../helpers/hash-passphrase");
const database = require("../services/database");
const { decrypt } = require("../helpers/helper");
const axios = require("axios");
const CryptoJS = require("crypto-js");

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

    console.log(
      "🚀 ~ file: filesShare.controller.js:12 ~ getFileSharesByHash ~ fileShares:",
      fileShares
    );

    //File Details: fileShares?.fileId
    // Bucket Details: fileShares?.fileId?.bucketId

    const fileEncryptedContent = await axios.get(fileShares?.fileId?.url);
    console.log(
      "🚀 ~ file: filesShare.controller.js:31 ~ getFileSharesByHash ~ fileEncryptedContent:",
      fileEncryptedContent?.data
    );

    const originalEncryptionKey = decrypt(fileShares?.secretKey);

    const fileContent = CryptoJS.AES.decrypt(
      fileEncryptedContent?.data,
      originalEncryptionKey
    ).toString(CryptoJS.enc.Latin1);
    console.log(
      "🚀 ~ file: filesShare.controller.js:38 ~ getFileSharesByHash ~ fileContent:",
      fileContent
    );

    // const imageString =
    //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAgAElEQVR4Xu3dCZPdVZXH8f/+gtnAwgKRElW..."; // replace this with your image string

    const matches = fileContent.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const type = matches[1];
    const buffer = Buffer.from(matches[2], "base64");

    response.writeHead(200, {
      "Content-Type": type,
      "Content-Length": buffer.length,
    });

    console.log("testing...");
    response.end(buffer);

    // const encryptedSharesDetails = encryptInformation(
    //   JSON.stringify(fileShares)

    // );

    // console.log("File Content", fileContent?.length);

    // response.setHeader("Content-Type", fileShares?.fileId?.type);
    // response.setHeader("Content-Length", fileContent.length);

    // // // Send image content as binary stream
    // // response.write(fileContent);
    // // response.end();
    // response.send(fileContent);

    // return response
    //   .status(HTTP_STATUS_CODE.OK)
    //   .send({ success: true, fileInformation: encryptedSharesDetails });
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
