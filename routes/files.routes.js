const router = require("express").Router();
const controller = require("../controllers/files.controllers");
router.post("/addFile", controller.addFiles);
module.exports = router;
