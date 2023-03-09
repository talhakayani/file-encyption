const fs = require("fs");
const { HTTP_STATUS_CODE } = require("../configs/constants");
const database = require("../services/database");
const {
  uploadFileToS3,
  uploadFileToIpfs,
  encrypt,
} = require("../helpers/helper");
const { generateHash } = require("../helpers/hash-passphrase");
const { cryptPassword } = require("../helpers/bcrypt-passphrase");
const slugify = require("slugify");
const CryptoJS = require("crypto-js");

const uploadFile = async (request, response) => {
  try {
    const { filename: fileName, fileType, cid } = request.body;
    const dataToSend = {
      name: fileName,
      type: fileType,
      hash: cid,
      url: `http://46.101.133.110:8080/api/v0/cat/${cid}`,
      bucketId: request?.body?.bucketId,
      // passphrase,
    };
    const data = await database.files.addFile(dataToSend);
    return response.status(HTTP_STATUS_CODE.OK).json(data);
  } catch (error) {
    console.log("🚀 ~ file: nft.js ~ line 475 ~ uploadFile ~ error", error);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(error);
  }
};
const shareFile = async (request, response) => {
  try {
    const fileId = request?.query?.id;
    const { accessKey, secretKey, grant } = request?.body;
    console.log(
      "🚀 ~ file: fileUpload.js:72 ~ shareFile ~ passPhrase:",
      accessKey,
      request?.body
    );
    const fileDetails = await database.files.getFile(fileId);
    console.log(
      "🚀 ~ file: fileUpload.js:65 ~ shareFile ~ fileDetails",
      fileDetails,
      fileDetails?.bucketId?.salt
    );
    const signature = CryptoJS.HmacSHA256(grant, accessKey).toString(
      CryptoJS.enc.Hex
    );

    const dataToSend = {
      fileId: fileDetails?._id,
      sharedHash: accessKey,
      status: "active",
      secretKey,
      grant,
      signature,
    };
    const shareFileResponse = await database.files.shareFile(dataToSend);

    if (!shareFileResponse) {
      return response
        .status(HTTP_STATUS_CODE.CONFLICT)
        .send({ message: "Unable to share file.", success: false });
    }

    return response
      .status(HTTP_STATUS_CODE.OK)
      .send({ message: "File shared link generated.", success: true });
  } catch (error) {
    console.log("🚀 ~ file: nft.js ~ line 475 ~ uploadFile ~ error", error);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(error);
  }
};
module.exports = { uploadFile, shareFile };
