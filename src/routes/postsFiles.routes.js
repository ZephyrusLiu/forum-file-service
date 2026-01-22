const router = require("express").Router();
const c = require("../controllers/postsFiles.controller");

// POST /files/posts/presign
router.post("/presign", c.presignUpload);

// GET /files/posts/url?key=...
router.get("/url", c.presignDownload);

module.exports = router;
