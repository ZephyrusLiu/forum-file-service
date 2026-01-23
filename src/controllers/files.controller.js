const svc = require("../services/files.service");

exports.presign = async (req, res) => {
  try {
    const userId = req.user.id;

    const { scope, kind, postId, filename, contentType } = req.body || {};
    const result = await svc.presignUpload({
      userId,
      scope,
      kind,
      postId,
      filename,
      contentType,
    });

    res.json(result);
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
