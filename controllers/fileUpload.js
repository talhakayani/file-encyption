const fs = require("fs");
const { HTTP_STATUS_CODE } = require("../configs/constants");
const database = require("../services/database");
const { uploadFileToS3, uploadFileToIpfs } = require("../helpers/helper");
const { generateRandomString } = require("../helpers/hash-passphrase");
const { cryptPassword } = require("../helpers/bcrypt-passphrase");
const slugify = require("slugify");
const uploadFile = async (request, response) => {
  try {
    const file = request?.files?.file;
    const uploadTo = request?.body?.uploadTo;

    const filePath = "public/images/";
    // const randomFileName =
    //   new Date().getTime() + Math.floor(Math.random() * 1000);

    const filename = `encryptedFile.enc`;

    fs.writeFile(`${filePath}${filename}`, file?.data, async (err, res) => {
      if (err) {
        return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(err);
      }
      if (fs.existsSync(`${filePath}${filename}`)) {
        if (uploadTo === "ipfs") {
          const data = await uploadFileToIpfs(`public/images/${filename}`);
          if (!data?.IpfsHash) {
            return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(data);
          }
          console.log(
            "🚀 ~ file: fileUpload.js:28 ~ fs.writeFile ~ data",
            data
          );

          fs.unlinkSync(`public/images/${filename}`);
          const { filename: fileName, fileType, passphrase } = request.body;
          const dataToSend = {
            name: fileName,
            type: fileType,
            hash: data?.IpfsHash,
            url: `https://piqsol.mypinata.cloud/ipfs/${data?.IpfsHash}`,
            passphrase,
          };
          database.files.addFile(dataToSend);
          return response.status(HTTP_STATUS_CODE.OK).json(data);
        }

        const data = await uploadFileToS3(`public/images/${filename}`);

        if (!data?.Location) {
          return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(data);
        }
        fs.unlinkSync(`public/images/${filename}`);
        return response.status(HTTP_STATUS_CODE.OK).json(data);
      }
    });
  } catch (error) {
    console.log("🚀 ~ file: nft.js ~ line 475 ~ uploadFile ~ error", error);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(error);
  }
};
const shareFile = async (request, response) => {
  try {
    const fileId = request?.query?.id;
    const fileDetails = await database.files.getFile(fileId);
    console.log(
      "🚀 ~ file: fileUpload.js:65 ~ shareFile ~ fileDetails",
      fileDetails
    );
    const slug = slugify(fileDetails?.name);
    const randomString = generateRandomString(16);
    // const encryptPassphrase = await cryptPassword(fileDetails?.passphrase);
    const encryptPassphrase =
      "$2b$10$8MnvuX4zn6lycynGklhuO.PV7HEWWQv.131dO3iR6FPu5xIRpFA6e";

    const hostname = request.headers.host;
    const url = `http://${hostname}/${randomString}/${encryptPassphrase}/${fileDetails?.name}`;
    const dataToSend = {
      fileId: fileDetails?._id,
      url,
      status: "active",
    };
    database.files.shareFile(dataToSend);

    return response.status(HTTP_STATUS_CODE.OK).json(dataToSend);
  } catch (error) {
    console.log("🚀 ~ file: nft.js ~ line 475 ~ uploadFile ~ error", error);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(error);
  }
};
module.exports = { uploadFile, shareFile };
