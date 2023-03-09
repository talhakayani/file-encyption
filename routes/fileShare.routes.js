const router = require("express").Router();
const controller = require("../controllers/filesShare.controller");

router.get("/getFileShares", controller.getAllFileShares);
router.post("/getFileShareByHash", controller.getFileSharesByHash);
router.get("/getFileShareByFileId", controller.getSharesByFileId);

module.exports = router;
