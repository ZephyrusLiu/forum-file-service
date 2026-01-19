const router = require("express").Router();
const multer = require("multer");

// memory storage (no DB, no disk)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/files/upload", upload.single("file"), (req, res) => {
  // STUB implementation (Day 1)
  if (!req.file) {
    return res.status(400).json({ error: "File is required" });
  }

  res.status(200).json({
    message: "File received (stub)",
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

module.exports = router;
