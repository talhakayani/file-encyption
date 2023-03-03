const router = require("express").Router();

router.use("/upload", require("./upload"));
router.use("/file", require("./files.routes"));
router.use("/fileShare", require("./fileShare.routes"));
router.use("/buckets", require("./bucket.routes"));

module.exports = router;
