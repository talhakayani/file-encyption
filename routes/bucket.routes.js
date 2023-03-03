const router = require("express").Router();
const controller = require("../controllers/bucket.controllers");
router.post("/addBucket", controller.addBucket);
router.get("/getBucket", controller.getBucket);
router.get("/salt/:bucketId", controller.getSalt);
module.exports = router;
