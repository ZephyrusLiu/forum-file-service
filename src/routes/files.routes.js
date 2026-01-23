const router = require("express").Router();
const multer = require("multer");
const c = require("../controllers/files.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB (adjust)
});

router.post("/upload", upload.single("file"), c.upload);
router.get("/url", c.url);

module.exports = router;
