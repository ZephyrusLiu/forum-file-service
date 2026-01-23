const router = require("express").Router();
const c = require("../controllers/files.controller");

// POST /files/presign
router.post("/presign", c.presign);

// GET /files/url?key=...
router.get("/url", c.url);

module.exports = router;
