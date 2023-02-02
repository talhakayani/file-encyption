const router = require("express").Router();
const controller = require("../controllers/fileUpload");

router.post("/uploadFile", controller.uploadFile);
router.post("/shareFile", controller.shareFile);

module.exports = router;
