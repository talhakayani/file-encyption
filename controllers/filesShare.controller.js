const { HTTP_STATUS_CODE } = require("../configs/constants");
const { encryptInformation } = require("../helpers/hash-passphrase");
const database = require("../services/database");
const { decrypt, readFileFromIPFS } = require("../helpers/helper");
const axios = require("axios");
const CryptoJS = require("crypto-js");

const getFileSharesByHash = async (request, response) => {
  try {
    const { sharedHash } = request.params;

    const fileShares = await database.fileShares.getFileShareByHash({
      sharedHash,
    });
    console.log(
      "🚀 ~ file: filesShare.controller.js:18 ~ getFileSharesByHash ~ fileShares:",
      fileShares
    );

    if (!fileShares || fileShares?.length <= 0) {
      return response
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ success: false, message: "share link not found." });
    }

    const verifySignature = CryptoJS.HmacSHA256(
      fileShares?.grant,
      fileShares?.sharedHash
    ).toString(CryptoJS.enc.Hex);
    console.log(
      "🚀 ~ file: filesShare.controller.js:33 ~ getFileSharesByHash ~ verifySignature:",
      verifySignature
    );

    if (verifySignature !== fileShares?.signature) {
      return response
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .send({ success: false, message: "Signature not verified." });
    }

    // const fileEncryptedContent = await axios.get(fileShares?.fileId?.url);
    const fileEncryptedContent = await readFileFromIPFS(
      ipfsClient,
      fileShares?.fileId?.hash
    );
    console.log(
      "🚀 ~ file: filesShare.controller.js:51 ~ getFileSharesByHash ~ fileEncryptedContent:",
      fileEncryptedContent
    );

    const originalEncryptionKey = CryptoJS.AES.decrypt(
      fileShares?.grant,
      fileShares?.secretKey,
      {
        iv: fileShares?.fileId?.bucketId?.salt,
      }
    ).toString();

    const fileContent = CryptoJS.AES.decrypt(
      fileEncryptedContent,
      originalEncryptionKey
    ).toString(CryptoJS.enc.Latin1);

    const matches = fileContent.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const type = matches[1];
    const buffer = Buffer.from(matches[2], "base64");

    response.writeHead(200, {
      "Content-Type": type,
      "Content-Length": buffer.length,
    });

    response.end(buffer);
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
