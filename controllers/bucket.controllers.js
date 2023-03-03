const { HTTP_STATUS_CODE } = require("../configs/constants");
const { generateRandomSalt } = require("../helpers/hash-passphrase");
const database = require("../services/database");

const addBucket = async (request, response) => {
  try {
    const bucketSaveResponse = await database.buckets.addBucket({
      ...request.body,
      salt: generateRandomSalt(),
    });

    if (!bucketSaveResponse) {
      return response.status(HTTP_STATUS_CODE.CONFLICT).send({
        success: false,
        message: "Unable to save file records into database",
      });
    }
    return response.status(HTTP_STATUS_CODE.OK).send({
      success: true,
      message: "File Saved",
      bucket: bucketSaveResponse,
    });
  } catch (err) {
    console.log("🚀 ~ file: files.controllers.js:8 ~ addFiles ~ err", err);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(err);
  }
};

const getBucket = async (request, response) => {
  try {
    const buckets = await database.buckets.getAllBuckets();

    return response.status(HTTP_STATUS_CODE.OK).send({
      success: true,
      message: "All Buckets",
      buckets,
    });
  } catch (err) {
    console.log("🚀 ~ file: files.controllers.js:27 ~ getFiles ~ err", err);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(err);
  }
};

const getSalt = async (request, response) => {
  try {
    console.log("request?.params?.bucketId", request?.params?.bucketId);
    const saltResponse = await database.buckets.getSalt(
      request?.params?.bucketId
    );

    return response.status(HTTP_STATUS_CODE.OK).send({
      success: true,
      message: "salt",
      salt: saltResponse?.salt,
    });
    // return saltResponse?.salt;
  } catch (err) {
    console.log("🚀 ~ file: files.controllers.js:27 ~ getFiles ~ err", err);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(err);
  }
};
module.exports = { addBucket, getBucket, getSalt };
