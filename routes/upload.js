const router = require("express").Router();
const controller = require("../controllers/fileUpload");

router.post("/uploadFile", controller.uploadFile);

module.exports = router;
