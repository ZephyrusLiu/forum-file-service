const svc = require("../services/files.service");

exports.upload = async (req, res) => {
  try {
    const userId = req.user.id;

    const { scope, kind, postId } = req.body || {};
    const file = req.file;

    if (!file) return res.status(400).json({ error: "BAD_REQUEST", message: "file is required" });

    const result = await svc.uploadToS3({
      userId,
      scope,
      kind,
      postId,
      filename: file.originalname,
      contentType: file.mimetype,
      buffer: file.buffer,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.code || "ERROR", message: err.message });
  }
};

exports.url = async (req, res) => {
  try {
    const userId = req.user.id;
    const key = req.query.key;

    const result = await svc.presignDownload({ userId, key });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.code || "ERROR", message: err.message });
  }
};
