const { HTTP_STATUS_CODE } = require("../configs/constants");
const database = require("../services/database");

const addFiles = async (request, response) => {
  try {
    const fileSaveResponse = await database.files.addFile(request.body);

    if (!fileSaveResponse) {
      return response.status(HTTP_STATUS_CODE.CONFLICT).send({
        success: false,
        message: "Unable to save file records into database",
      });
    }
    return response
      .status(HTTP_STATUS_CODE.OK)
      .send({ success: true, message: "File Saved", file: fileSaveResponse });
  } catch (err) {
    console.log("🚀 ~ file: files.controllers.js:8 ~ addFiles ~ err", err);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json(err);
  }
};

module.exports = { addFiles };
