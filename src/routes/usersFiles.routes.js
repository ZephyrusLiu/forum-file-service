const router = require("express").Router();
const c = require("../controllers/usersFiles.controller");

// POST /files/users/presign
router.post("/presign", c.presignUpload);

// GET /files/users/url?key=...
router.get("/url", c.presignDownload);

module.exports = router;
